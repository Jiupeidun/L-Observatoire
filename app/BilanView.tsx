"use client";

import { useState, useEffect, useCallback } from "react";
import { INVESTMENT_CSV_URL } from "./config";
import { parseCSV } from "./GenericCsvTable";
import GenericCsvTable from "./GenericCsvTable";

const REFRESH_INTERVAL_MS = 60 * 1000;

const BILAN_COLUMN_COLORS: (string | undefined)[] = [
  undefined,
  "#7399C6",
  "#F37021",
  "#006241",
  "#2E3192",
  "#2E3192",
  "#2E3192",
];

export default function BilanView() {
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch(INVESTMENT_CSV_URL)
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
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(t);
  }, [fetchData]);

  if (loading && rows.length === 0) {
    return (
      <div className="marketsWrap">
        <div className="marketsLoading">Chargement du Bilan…</div>
      </div>
    );
  }

  if (error && rows.length === 0) {
    return (
      <div className="marketsWrap">
        <div className="marketsError">Impossible de charger le Bilan : {error}</div>
      </div>
    );
  }

  return (
    <div className="bilanViewWrap">
      <div className="bilanTableWrap">
        <GenericCsvTable
          initialRows={rows}
          sortable={false}
          columnColors={BILAN_COLUMN_COLORS}
        />
      </div>
    </div>
  );
}
