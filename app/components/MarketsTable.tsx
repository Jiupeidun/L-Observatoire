"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SHEETS_CSV_URL } from "../lib/config";

export type MarketsTableProps = { csvUrl?: string };

const REFRESH_INTERVAL_MS = 60 * 1000;

/** Colonnes affichées dans l’ordre : Symbol (col 0), Price, Change %, Market Cap, YTD. */
const COL_ORDER: { key: string; index: number }[] = [
  { key: "Symbol", index: 0 },
  { key: "Price", index: 1 },
  { key: "Change %", index: 2 },
  { key: "Market Cap", index: 3 },
  { key: "YTD", index: 4 },
];

/** Vrai si la cellule est vide ou "—" (tri en dernier). */
function isBlankCell(cell: string): boolean {
  const s = (cell ?? "").trim();
  return !s || s === "—";
}

/** Parse une cellule pour le tri : nombre (%, T/B, etc.) ou NaN si vide. */
function parseSortValue(key: string, cell: string): number {
  const s = (cell ?? "").trim().replace(/,/g, "");
  if (!s || s === "—") return NaN;
  const withUnit = s.replace(/%/g, "");
  const num = parseFloat(withUnit);
  if (Number.isNaN(num)) return NaN;
  if (key === "Market Cap") {
    if (s.endsWith("T")) return num * 1e12;
    if (s.endsWith("B")) return num * 1e9;
    if (s.endsWith("M")) return num * 1e6;
    if (s.endsWith("K")) return num * 1e3;
  }
  return num;
}

const NUMERIC_KEYS_WITH_COLOR = new Set(["Change %", "YTD"]);

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const row: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === "," && !inQuotes) {
        row.push(cell.replace(/^"|"$/g, "").trim());
        cell = "";
      } else {
        cell += c;
      }
    }
    row.push(cell.replace(/^"|"$/g, "").trim());
    return row;
  });
}

function isWeekend(): boolean {
  const d = new Date().getDay();
  return d === 0 || d === 6; // dimanche ou samedi
}

/** Délai avant d’afficher le verre dépoli le week-end (données visibles 5 s d’abord). */
const WEEKEND_OVERLAY_DELAY_MS = 5000;

type SortDir = "asc" | "desc";

/** Tableau des marchés (CSV) : tri par colonne, couleurs positif/négatif, overlay week-end. */
export default function MarketsTable({ csvUrl = SHEETS_CSV_URL }: MarketsTableProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekend, setWeekend] = useState(false);
  const [weekendOverlayVisible, setWeekendOverlayVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const fetchData = useCallback(() => {
    setWeekend(isWeekend());
    fetch(csvUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = parseCSV(text);
        setRows(parsed);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [csvUrl]);

  useEffect(() => {
    setRows([]);
    setLoading(true);
    const w = isWeekend();
    setWeekend(w);
    if (!w) setWeekendOverlayVisible(false);
    fetchData();
    const t = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(t);
  }, [fetchData]);

  // Week-end : afficher les données 5 s puis le verre dépoli + message
  useEffect(() => {
    if (!weekend) return;
    setWeekendOverlayVisible(false);
    const t = setTimeout(() => setWeekendOverlayVisible(true), WEEKEND_OVERLAY_DELAY_MS);
    return () => clearTimeout(t);
  }, [weekend]);

  const weekendMode = weekend;
  const showGlass = weekendMode && weekendOverlayVisible;

  const dataRows = rows.length >= 2 ? rows.slice(1) : [];
  const hasData = rows.length >= 2;

  const sortedRows = useMemo(() => {
    if (!sortBy || !dataRows.length) return dataRows;
    const col = COL_ORDER.find((c) => c.key === sortBy);
    if (!col) return dataRows;
    const isNum = col.key !== "Symbol";
    return [...dataRows].sort((a, b) => {
      const aVal = a[col.index] ?? "";
      const bVal = b[col.index] ?? "";
      const aBlank = isBlankCell(aVal);
      const bBlank = isBlankCell(bVal);
      if (aBlank && bBlank) return 0;
      if (aBlank) return 1;
      if (bBlank) return -1;
      if (isNum) {
        const aNum = parseSortValue(col.key, aVal);
        const bNum = parseSortValue(col.key, bVal);
        const cmp = aNum - bNum;
        return sortDir === "desc" ? -cmp : cmp;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [dataRows, sortBy, sortDir]);

  if (loading && rows.length === 0 && !weekendMode) {
    return (
      <div className="marketsWrap">
        <div className="marketsLoading">Chargement des données…</div>
      </div>
    );
  }

  if (error && rows.length === 0 && !weekendMode) {
    return (
      <div className="marketsWrap">
        <div className="marketsError">Impossible de charger les données : {error}</div>
      </div>
    );
  }

  return (
    <div className="marketsWrap">
      <div className="marketsContent">
        {error && (
          <div className="marketsRefreshError">
            Dernière mise à jour échouée, nouvel essai dans 1 min.
          </div>
        )}
        {!hasData && !weekendMode && (
          <div className="marketsEmpty">Aucune donnée.</div>
        )}
        {hasData && (
          <div className="marketsScroll">
            <table className="marketsTable">
              <thead>
                <tr>
                  {COL_ORDER.map(({ key }) => (
                    <th
                      key={key}
                      className="marketsThSortable"
                      onClick={() => toggleSort(key)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSort(key);
                        }
                      }}
                      aria-sort={
                        sortBy === key
                          ? sortDir === "desc"
                            ? "descending"
                            : "ascending"
                          : undefined
                      }
                    >
                      <span className="marketsThLabel">{key}</span>
                      <span className="marketsThSortIcon" aria-hidden>
                        {sortBy === key ? (sortDir === "desc" ? "↓" : "↑") : "\u00A0"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr key={i}>
                    {COL_ORDER.map(({ key, index: j }) => {
                      const cell = row[j] ?? "";
                      const display = cell || "—";
                      let dataSign: "positive" | "negative" | undefined;
                      if (NUMERIC_KEYS_WITH_COLOR.has(key)) {
                        const n = parseSortValue(key, cell);
                        if (!Number.isNaN(n)) {
                          dataSign = n > 0 ? "positive" : n < 0 ? "negative" : undefined;
                        }
                      }
                      return (
                        <td
                          key={key}
                          data-positive={dataSign === "positive" ? "true" : undefined}
                          data-negative={dataSign === "negative" ? "true" : undefined}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verre dépoli week-end + message : au-dessus des données marchés */}
      <div
        className={`weekendGlass ${showGlass ? "weekendGlassVisible" : ""}`}
        aria-hidden={!showGlass}
      >
        <div className="weekendMessageInner">
          <p className="weekendText">Aujourd&apos;hui c&apos;est le week-end — repose-toi bien !</p>
          <p className="weekendSub">Les marchés peuvent attendre.</p>
        </div>
      </div>
    </div>
  );
}
