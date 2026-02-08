/**
 * Configuration globale : TCF Canada (épreuves, date d’examen), URLs des tableurs (marchés, bilan).
 */

// TCF Canada : table des 4 épreuves — lien Google Doc, durée, détails, score requis, échelle
export const TCF_EPREUVES_TABLE: {
  part: string;
  url: string;
  duree: string;
  details: string;
  scoreRequis: string;
  echelle: string;
}[] = [
  {
    part: "Compréhension orale",
    url: "https://docs.google.com/document/d/19FOUj0_HW_quBumB1Y1j8h16s2rhbOcgbedS2mpHJwg/edit?tab=t.0#heading=h.nfw52tn5b9ux",
    duree: "35 min / 39 q.",
    details: "Compréhension de l'oral",
    scoreRequis: "458 à 502",
    echelle: "0 à 699",
  },
  {
    part: "Compréhension écrite",
    url: "https://docs.google.com/document/d/12rwR7vjeLdlvMqQU5dfEMf5m5peU-vYaUZHEgwQLfHg/edit?tab=t.0",
    duree: "60 min / 39 q.",
    details: "Compréhension écrite : correspondances indicatives.\nBarèmes :\n1–4 → 3 (4 × 3 = 12)\n5–10 → 9 (6 × 9 = 54)\n11–19 → 15 (9 × 15 = 135)\n20–29 → 21 (10 × 21 = 210)\n30–35 → 26 (6 × 26 = 156)\n36–39 → 33 (4 × 33 = 132)",
    scoreRequis: "453 à 498",
    echelle: "0 à 699",
  },
  {
    part: "Expression écrite",
    url: "https://docs.google.com/document/d/1a9cy-yUYnokum8QohcBjo-5drPPAesenohnWQ3c0_pU/edit?tab=t.0#heading=h.ul37ri5xqx2y",
    duree: "60 min / 3 t.",
    details: "Tâche 1 : 60–120 m.\nTâche 2 : 120–150 m.\nTâche 3 : 120–180 m.",
    scoreRequis: "10 à 11",
    echelle: "0 à 20",
  },
  {
    part: "Expression orale",
    url: "https://docs.google.com/document/d/1h6OodKOJ8eL3HnL--lNbkNSQI1bNUX7PNVhBFDiXas4/edit?tab=t.0#heading=h.yijohcwyagxy",
    duree: "12 min / 3 t.",
    details: "Tâche 1 : 2 min.\nTâche 2 : Préparation 2 min + Échange 3 min 30.\nTâche 3 : 4 min 30.",
    scoreRequis: "10 à 11",
    echelle: "0 à 20",
  },
];

// Tableurs Google Sheets (marchés) — publication Web requise pour l’accès CSV
export const SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr0wuiXC5YmOA9WmTS4N1ymmHrhRVhXkiF_kS0MPZ2d3zW_YhHrSfmzUXemf4ycZaE4pF2VK90vfbN/pub?gid=0&single=true&output=csv";

export const SHEETS_CSV_URL_GROUPE_B =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr0wuiXC5YmOA9WmTS4N1ymmHrhRVhXkiF_kS0MPZ2d3zW_YhHrSfmzUXemf4ycZaE4pF2VK90vfbN/pub?gid=262160319&single=true&output=csv";

// Tableur investissement (bilan / détails du système)
export const INVESTMENT_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuMvY2Ub0tHuOWi3-8dm0tqDDnvz-eGkakJeBxSO-fVCwmbLskwyHo2uvOaRh6MDh2pF2js-6HOjJ8/pub?gid=57745632&single=true&output=csv";

// Date de la prochaine épreuve TCF Canada (compte à rebours)
export const TCF_EXAM_DATE = "2026-04-09";
