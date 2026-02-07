import { TCF_DOCS_LINKS } from "./config";
import Countdown from "./Countdown";
import MarketsTable from "./MarketsTable";

const ANNUAL_REPORTS_URL = "https://jiupeidun.github.io/annualreports/";
const TRADINGVIEW_CHART_URL =
  "https://www.tradingview.com/chart/tUkFEiQd/?symbol=SP%3ASPX";

export default function Home() {
  return (
    <>
      <header className="header">
        <h1>L&apos;Observatoire</h1>
      </header>

      <main className="main">
        {/* Colonne gauche : Finance - Marchés */}
        <section className="panel">
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
          <div className="panelContent panelContentTwoIframes">
            <MarketsTable />
            <div className="iframeWrap">
              <iframe
                src={ANNUAL_REPORTS_URL}
                title="Rapports Financiers"
              />
            </div>
          </div>
        </section>

        {/* Colonne droite : TCF Canada */}
        <section className="panel">
          <h2 className="panelTitle">TCF Canada</h2>
          <div className="panelContent">
            <div className="countdownWrap">
              <Countdown />
            </div>
            <div className="pdfSection">
              <iframe
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tcf-canada-cheatsheets.pdf`}
                title="Aide-mémoire TCF Canada"
              />
            </div>
            <div className="tableSection">
              <h3>
                Liens vers les Google Docs par épreuve
              </h3>
              <table className="tcfTable">
                <thead>
                  <tr>
                    <th>Épreuve</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {TCF_DOCS_LINKS.map(({ part, url }) => (
                    <tr key={part}>
                      <td>{part}</td>
                      <td>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Ouvrir le doc →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
