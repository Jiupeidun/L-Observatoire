import { TCF_EPREUVES_TABLE } from "./config";
import Countdown from "./Countdown";
import FinanceMarketsSection from "./FinanceMarketsSection";

const PDF_URL =
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tcf-canada-cheatsheets.pdf`;

export default function Home() {
  return (
    <>
      <header className="header">
        <h1>L&apos;Observatoire</h1>
      </header>

      <main className="main">
        <section className="panel">
          <FinanceMarketsSection />
        </section>

        <section className="panel">
          <h2 className="panelTitle">TCF Canada</h2>
          <div className="panelContent">
            <div className="countdownWrap">
              <Countdown />
            </div>
            <div className="pdfLinkSection">
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pdfLink"
              >
                tcf-canada-cheatsheets.pdf →
              </a>
            </div>
            <div className="tableSection">
              <table className="tcfTable">
                <thead>
                  <tr>
                    <th>Épreuve</th>
                    <th>Durée / volume</th>
                    <th>Détails</th>
                    <th>Score TCF requis</th>
                    <th>Échelle</th>
                  </tr>
                </thead>
                <tbody>
                  {TCF_EPREUVES_TABLE.map(({ part, url, duree, details, scoreRequis, echelle }) => (
                    <tr key={part}>
                      <td>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {part} →
                        </a>
                      </td>
                      <td>{duree}</td>
                      <td className="tcfDetailsCell">{details}</td>
                      <td>{scoreRequis}</td>
                      <td>{echelle}</td>
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
