"use client";

import { useState } from "react";
import { SHEETS_CSV_URL, SHEETS_CSV_URL_GROUPE_B } from "./config";
import BilanView from "./BilanView";
import MarketsTable from "./MarketsTable";
import WorldClocks from "./WorldClocks";

const ANNUAL_REPORTS_URL = "https://jiupeidun.github.io/annualreports/";
const TRADINGVIEW_CHART_URL =
  "https://www.tradingview.com/chart/tUkFEiQd/?symbol=SP%3ASPX";

type Group = "A" | "B";

const CSV_URL_BY_GROUP: Record<Group, string> = {
  A: SHEETS_CSV_URL,
  B: SHEETS_CSV_URL_GROUPE_B,
};

type ViewMode = "markets" | "investment";

export default function FinanceMarketsSection() {
  const [group, setGroup] = useState<Group>("A");
  const [viewMode, setViewMode] = useState<ViewMode>("markets");
  const csvUrl = CSV_URL_BY_GROUP[group];

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
            </div>
          )}
        </div>
      </div>
      <div className="panelContent panelContentFinance">
        {viewMode === "markets" ? (
          <>
            <MarketsTable csvUrl={csvUrl} />
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
        ) : (
          <BilanView />
        )}
      </div>
    </>
  );
}
