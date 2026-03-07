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

/** Trois actions personnelles — titres français + codes d’opération. */
const OPERATIONS = {
  french: { code: "Operation Enduring Freedom", title: "Apprentissage du français" },
  job: { code: "Operation Silent Resolute", title: "Changement d'emploi 2026" },
  market: { code: "Operation Relentless Strike", title: "Investissement boursier US" },
} as const;

/** Page d’accueil : trois opérations (français, emploi 2026, marchés). */
export default function Home() {
  const now = new Date();
  const showTcf = now < new Date(`${TCF_EXAM_DATE}T00:00:00Z`);
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  return (
    <>
      <HeaderBar />

      <main className="main">
        {/* Colonne gauche : Operation Relentless Strike — Marchés */}
        <section className="panel panelFinance">
          <div className="operationBadge" title={OPERATIONS.market.title}>
            {OPERATIONS.market.code}
          </div>
          <FinanceMarketsSection />
        </section>

        {/* Colonne droite : Silent Resolute + Enduring Freedom */}
        <div className="rightColumn">
          <section className="panel panelJob">
            <div className="operationBadge" title={OPERATIONS.job.title}>
              {OPERATIONS.job.code}
            </div>
            <h2 className="panelTitle">{OPERATIONS.job.title}</h2>
            <div className="panelContent">
              <p className="operationHint">Objectif 2026 — préparation en cours.</p>
            </div>
          </section>

          <section className="panel panelLangTools">
            <div className="operationBadge" title={OPERATIONS.french.title}>
              {OPERATIONS.french.code}
            </div>
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
              <div className="operationBadge" title={OPERATIONS.french.title}>
                {OPERATIONS.french.code}
              </div>
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
                        ({ part, url, duree, details, scoreRequis, echelle }) => {
                          const isExpression = part.startsWith("Expression ");
                          const disabled = isWeekend ? !isExpression : isExpression;
                          const rowClass = disabled ? "tcfRowDisabled" : undefined;
                          const link = disabled ? (
                            <span className="tcfLinkDisabled" aria-disabled="true">
                              {part} →
                            </span>
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {part} →
                            </a>
                          );
                          return (
                            <tr key={part} className={rowClass}>
                              <td>{link}</td>
                              <td>{duree}</td>
                              <td className="tcfDetailsCell">{details}</td>
                              <td>{scoreRequis}</td>
                              <td>{echelle}</td>
                            </tr>
                          );
                        },
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
