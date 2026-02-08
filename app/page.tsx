import { TCF_EPREUVES_TABLE } from "./config";
import Countdown from "./Countdown";
import FinanceMarketsSection from "./FinanceMarketsSection";
import HeaderBar from "./HeaderBar";

const PDF_URL =
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tcf-canada-cheatsheets.pdf`;

const TCF_TOOLS: { label: string; url: string }[] = [
  { label: "ChatGPT", url: "https://chatgpt.com" },
  { label: "Gemini", url: "https://gemini.google.com/app" },
  { label: "Luvvoice", url: "https://luvvoice.com/" },
  { label: "Google Translate", url: "https://translate.google.com/" },
  { label: "WordReference", url: "https://www.wordreference.com/" },
];

export default function Home() {
  return (
    <>
      <HeaderBar />

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
            <div className="tcfToolsSection">
              <h3 className="tcfToolsTitle">Outils de préparation</h3>
              <ul className="tcfToolsList">
                {TCF_TOOLS.map(({ label, url }) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="tcfToolLink">
                      {label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
