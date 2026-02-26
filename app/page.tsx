import { TCF_EPREUVES_TABLE, TCF_EXAM_DATE } from "@/app/lib/config";
import Countdown from "@/app/components/Countdown";
import FinanceMarketsSection from "@/app/components/FinanceMarketsSection";
import HeaderBar from "@/app/components/HeaderBar";

const PDF_URL =
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/tcf-canada-cheatsheets.pdf`;

/** Liens « Outils pratiques » (préparation TCF, vocabulaire, etc.). */
const TCF_TOOLS: { label: string; url: string }[] = [
  { label: "ChatGPT", url: "https://chatgpt.com" },
  { label: "Gemini", url: "https://gemini.google.com/app" },
  { label: "Luvvoice", url: "https://luvvoice.com/" },
  { label: "Google Translate", url: "https://translate.google.com/" },
  { label: "WordReference", url: "https://www.wordreference.com/" },
];

/** Page d’accueil : Finance — Marchés (colonne gauche), outils de français + TCF Canada (colonne droite). */
export default function Home() {
  const showTcf = new Date() < new Date(`${TCF_EXAM_DATE}T00:00:00Z`);
  return (
    <>
      <HeaderBar />

      <main className="main">
        {/* Colonne gauche : Finance — Marchés */}
        <section className="panel panelFinance">
          <FinanceMarketsSection />
        </section>

        {/* Colonne droite : outils + TCF Canada empilés */}
        <div className="rightColumn">
          <section className="panel panelLangTools">
            <h2 className="panelTitle">Outils pratiques</h2>
            <div className="panelContent">
              <div className="tcfToolsSection">
                <ul className="tcfToolsList">
                  {TCF_TOOLS.map(({ label, url }) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tcfToolLink"
                      >
                        {label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {showTcf && (
            <section className="panel panelTcf">
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
                      {TCF_EPREUVES_TABLE.map(
                        ({ part, url, duree, details, scoreRequis, echelle }) => (
                          <tr key={part}>
                            <td>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {part} →
                              </a>
                            </td>
                            <td>{duree}</td>
                            <td className="tcfDetailsCell">{details}</td>
                            <td>{scoreRequis}</td>
                            <td>{echelle}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
