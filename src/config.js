// Run locally with any static server, e.g.:
//   python3 -m http.server 8000
//   npx serve .
// Then open http://localhost:8000 — do NOT double-click index.html (ES modules
// require an HTTP origin).

export const CONFIG = {
  // Reemplazá esto con el client-side ID cuando tengas la cuenta de LaunchDarkly.
  CLIENT_SIDE_ID: '',

  // Flag booleano que se toggea en vivo desde el dashboard.
  FLAG_KEY: 'feature-flag-del-caos',

  // true  = usa mock (no requiere LaunchDarkly, ideal hoy y como backup en el venue).
  // false = usa el SDK real. Se auto-activa si CLIENT_SIDE_ID está vacío.
  MOCK_MODE: true,

  // Estado inicial del flag cuando se corre en mock. En vivo será ON.
  MOCK_INITIAL_VALUE: true,

  // Contexto que se pasa al SDK real.
  CONTEXT: {
    kind: 'user',
    key: 'community-day-bolivia',
    name: 'Community Day Bolivia'
  },

  // Cadencia de generación de errores en ms.
  ERROR_INTERVAL_MS: 1000,

  // Máximo de errores visibles en el log (los más viejos se recortan;
  // el contador global sigue subiendo).
  MAX_VISIBLE_ERRORS: 40,
};
