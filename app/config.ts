// À personnaliser : liens Google Docs pour chaque épreuve TCF Canada
export const TCF_DOCS_LINKS: { part: string; url: string }[] = [
  { part: "Compréhension orale", url: "https://docs.google.com/document/d/19FOUj0_HW_quBumB1Y1j8h16s2rhbOcgbedS2mpHJwg/edit?tab=t.0#heading=h.nfw52tn5b9ux" },
  { part: "Compréhension écrite", url: "https://docs.google.com/document/d/12rwR7vjeLdlvMqQU5dfEMf5m5peU-vYaUZHEgwQLfHg/edit?tab=t.0" },
  { part: "Expression orale", url: "https://docs.google.com/document/d/1h6OodKOJ8eL3HnL--lNbkNSQI1bNUX7PNVhBFDiXas4/edit?tab=t.0#heading=h.yijohcwyagxy" },
  { part: "Expression écrite", url: "https://docs.google.com/document/d/1a9cy-yUYnokum8QohcBjo-5drPPAesenohnWQ3c0_pU/edit?tab=t.0#heading=h.ul37ri5xqx2y" },
];

// Tableur Google Sheets (marchés) — doit être publié sur le Web pour l’iframe
export const SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr0wuiXC5YmOA9WmTS4N1ymmHrhRVhXkiF_kS0MPZ2d3zW_YhHrSfmzUXemf4ycZaE4pF2VK90vfbN/pub?gid=0&single=true&output=csv";

// Date de la prochaine épreuve TCF Canada (pour le compte à rebours)
export const TCF_EXAM_DATE = "2026-04-09";
