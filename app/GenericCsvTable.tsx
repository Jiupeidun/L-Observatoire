"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const REFRESH_INTERVAL_MS = 60 * 1000;

export function parseCSV(text: string): string[][] {
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

function isBlank(s: string): boolean {
  const t = (s ?? "").trim();
  return !t || t === "—";
}

function parseNum(s: string): number {
  const t = (s ?? "").trim().replace(/,/g, "").replace(/%/g, "");
  const n = parseFloat(t);
  return Number.isNaN(n) ? NaN : n;
}

type SortDir = "asc" | "desc";

export type GenericCsvTableProps = {
  csvUrl?: string;
  initialRows?: string[][];
  sortable?: boolean;
  columnColors?: (string | undefined)[];
};

export default function GenericCsvTable({
  csvUrl,
  initialRows,
  sortable = true,
  columnColors,
}: GenericCsvTableProps) {
  const [rows, setRows] = useState<string[][]>(initialRows ?? []);
  const [loading, setLoading] = useState(!initialRows);
  const [error, setError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchData = useCallback(() => {
    if (!csvUrl) return;
    fetch(csvUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setRows(parseCSV(text));
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur");
      })
      .finally(() => setLoading(false));
  }, [csvUrl]);

  useEffect(() => {
    if (initialRows != null) {
      setRows(initialRows);
      setLoading(false);
      return;
    }
    if (!csvUrl) return;
    setRows([]);
    setLoading(true);
    fetchData();
    const t = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(t);
  }, [csvUrl, initialRows, fetchData]);

  const headers = rows.length >= 1 ? rows[0] : [];
  const dataRows = rows.length >= 2 ? rows.slice(1) : [];
  const hasData = dataRows.length > 0;

  const sortedRows = useMemo(() => {
    if (!sortable || sortCol === null || !dataRows.length) return dataRows;
    return [...dataRows].sort((a, b) => {
      const aVal = a[sortCol] ?? "";
      const bVal = b[sortCol] ?? "";
      const aBlank = isBlank(aVal);
      const bBlank = isBlank(bVal);
      if (aBlank && bBlank) return 0;
      if (aBlank) return 1;
      if (bBlank) return -1;
      const aNum = parseNum(aVal);
      const bNum = parseNum(bVal);
      const aNumOk = !Number.isNaN(aNum);
      const bNumOk = !Number.isNaN(bNum);
      if (aNumOk && bNumOk) {
        const cmp = aNum - bNum;
        return sortDir === "desc" ? -cmp : cmp;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [dataRows, sortCol, sortDir, sortable]);

  const toggleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortCol(colIndex);
      setSortDir("desc");
    }
  };

  if (loading && rows.length === 0) {
    return (
      <div className="marketsWrap">
        <div className="marketsLoading">Chargement des données…</div>
      </div>
    );
  }

  if (error && rows.length === 0) {
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
        {!hasData && (
          <div className="marketsEmpty">Aucune donnée.</div>
        )}
        {hasData && (
          <div className="marketsScroll">
            <table className="marketsTable">
              <thead>
                <tr>
                  {headers.map((h, i) =>
                    sortable ? (
                      <th
                        key={i}
                        className="marketsThSortable"
                        onClick={() => toggleSort(i)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSort(i);
                          }
                        }}
                        aria-sort={
                          sortCol === i
                            ? sortDir === "desc"
                              ? "descending"
                              : "ascending"
                            : undefined
                        }
                      >
                        <span className="marketsThLabel">{h || "—"}</span>
                        <span className="marketsThSortIcon" aria-hidden>
                          {sortCol === i ? (sortDir === "desc" ? "↓" : "↑") : "\u00A0"}
                        </span>
                      </th>
                    ) : (
                      <th key={i} className="marketsTh">
                        <span className="marketsThLabel">{h || "—"}</span>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row, i) => (
                  <tr key={i}>
                    {headers.map((_, j) => (
                      <td
                        key={j}
                        style={
                          columnColors?.[j]
                            ? { color: columnColors[j] }
                            : undefined
                        }
                      >
                        {row[j] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
