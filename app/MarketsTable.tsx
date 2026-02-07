"use client";

import { useState, useEffect, useCallback } from "react";
import { SHEETS_CSV_URL } from "./config";

const REFRESH_INTERVAL_MS = 60 * 1000; // 60 secondes

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

const WEEKEND_OVERLAY_DELAY_MS = 5000; // Afficher les données au moins 5 s avant le verre dépoli le week-end

export default function MarketsTable() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekend, setWeekend] = useState(false);
  const [weekendOverlayVisible, setWeekendOverlayVisible] = useState(false);

  const fetchData = useCallback(() => {
    setWeekend(isWeekend());
    fetch(SHEETS_CSV_URL)
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
  }, []);

  useEffect(() => {
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

  const headers = rows.length >= 1 ? rows[0] : [];
  const dataRows = rows.length >= 2 ? rows.slice(1) : [];
  const hasData = rows.length >= 2;

  return (
    <div className="marketsWrap">
      {/* Données marchés : toujours rendues, recouvertes par le verre dépoli le week-end */}
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
                  {headers.map((h, i) => (
                    <th key={i}>{h || "—"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, i) => (
                  <tr key={i}>
                    {headers.map((_, j) => {
                      const cell = row[j] ?? "";
                      const isNegative = j >= 1 && cell.startsWith("-");
                      return (
                        <td key={j} data-negative={isNegative ? "true" : undefined}>
                          {cell || "—"}
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
