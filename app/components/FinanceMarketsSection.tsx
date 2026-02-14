"use client";

import { useState, useMemo } from "react";
import { SHEETS_CSV_URL, SHEETS_CSV_URL_GROUPE_B, SHEETS_CSV_URL_ATH } from "../lib/config";
import BilanView from "./BilanView";
import MarketsTable, { type ColOrderItem } from "./MarketsTable";
import WorldClocks from "./WorldClocks";

const ANNUAL_REPORTS_URL = "https://jiupeidun.github.io/annualreports/";
const TRADINGVIEW_CHART_URL =
  "https://www.tradingview.com/chart/tUkFEiQd/?symbol=SP%3ASPX";

type Group = "A" | "B" | "ATH";

const CSV_URL_BY_GROUP: Record<Group, string> = {
  A: SHEETS_CSV_URL,
  B: SHEETS_CSV_URL_GROUPE_B,
  ATH: SHEETS_CSV_URL_ATH,
};

/** Colonnes ATH : Ticker, Current, ATH, ATH Date, Drawdown from ATH, ATH Date to today, 5Y return */
const ATH_COL_ORDER: ColOrderItem[] = [
  { key: "Ticker", index: 0 },
  { key: "Current", index: 1 },
  { key: "ATH", index: 2 },
  { key: "ATH Date", index: 3 },
  { key: "Drawdown from ATH", index: 4 },
  { key: "ATH Date to today", index: 5 },
  { key: "5Y return", index: 6 },
];

const ATH_NUMERIC_KEYS_WITH_COLOR = ["Drawdown from ATH", "5Y return"];

type ViewMode = "markets" | "investment";

/** Panneau Finance — Marchés : onglets Bilan / Marchés (Groupe A/B), horloges monde, tableau ou Bilan. */
export default function FinanceMarketsSection() {
  const [group, setGroup] = useState<Group>("A");
  const [viewMode, setViewMode] = useState<ViewMode>("markets");
  const csvUrl = CSV_URL_BY_GROUP[group];
  const isAth = group === "ATH";
  const marketsTableProps = useMemo(
    () =>
      isAth
        ? { csvUrl, colOrder: ATH_COL_ORDER, numericKeysWithColor: ATH_NUMERIC_KEYS_WITH_COLOR }
        : { csvUrl },
    [csvUrl, isAth]
  );

  return (
    <>
      <div className="panelTitleRow">
        <h2 className="panelTitle">
          <a
            href={TRADINGVIEW_CHART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="panelTitleLink"
          >
            Finance — Marchés
          </a>
        </h2>
        <div className="panelTitleRowRight">
          <WorldClocks />
          <button
            type="button"
            className="financeFlipBtn"
            onClick={() => setViewMode((v) => (v === "markets" ? "investment" : "markets"))}
            title={viewMode === "markets" ? "Voir Bilan" : "Voir marchés"}
            aria-label={viewMode === "markets" ? "Voir Bilan" : "Voir marchés"}
          >
            {viewMode === "markets" ? "Bilan" : "Marchés"}
          </button>
          {viewMode === "markets" && (
            <div className="marketsTabs" role="tablist" aria-label="Groupe de données">
              <button
                type="button"
                role="tab"
                aria-selected={group === "A"}
                className={group === "A" ? "marketsTabActive" : ""}
                onClick={() => setGroup("A")}
              >
                Groupe A
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={group === "B"}
                className={group === "B" ? "marketsTabActive" : ""}
                onClick={() => setGroup("B")}
              >
                Groupe B
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={group === "ATH"}
                className={group === "ATH" ? "marketsTabActive" : ""}
                onClick={() => setGroup("ATH")}
              >
                ATH
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="panelContent panelContentFinance">
        {viewMode === "markets" ? (
          <MarketsTable {...marketsTableProps} />
        ) : (
          <>
            <BilanView />
            <div className="reportsLinkSection">
              <a
                href={ANNUAL_REPORTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pdfLink"
              >
                Rapports Financiers →
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
