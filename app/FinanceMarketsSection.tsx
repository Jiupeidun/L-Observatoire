"use client";

import { useState } from "react";
import { SHEETS_CSV_URL, SHEETS_CSV_URL_GROUPE_B } from "./config";
import MarketsTable from "./MarketsTable";

const ANNUAL_REPORTS_URL = "https://jiupeidun.github.io/annualreports/";
const TRADINGVIEW_CHART_URL =
  "https://www.tradingview.com/chart/tUkFEiQd/?symbol=SP%3ASPX";

type Group = "A" | "B";

const CSV_URL_BY_GROUP: Record<Group, string> = {
  A: SHEETS_CSV_URL,
  B: SHEETS_CSV_URL_GROUPE_B,
};

export default function FinanceMarketsSection() {
  const [group, setGroup] = useState<Group>("A");
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
      </div>
      <div className="panelContent panelContentFinance">
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
      </div>
    </>
  );
}
