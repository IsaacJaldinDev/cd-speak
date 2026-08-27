// Run locally with any static server, e.g.:
//   python3 -m http.server 8000
//   npx serve .
// Then open http://localhost:8000 — do NOT double-click index.html (ES modules
// require an HTTP origin).

import { loadEnv } from './env-loader.js';

export const CONFIG = {
  // Cargado en runtime desde `.env` por loadConfig() al startup.
  // Si `.env` no existe, queda vacío y ld.js cae automáticamente a mock mode.
  CLIENT_SIDE_ID: '',

  // Flag booleano que se toggea en vivo desde el dashboard.
  FLAG_KEY: 'feature-flag-del-caos',

  // true  = usa mock (no requiere LaunchDarkly, ideal como backup en el venue).
  // false = usa el SDK real. Se auto-activa si CLIENT_SIDE_ID está vacío.
  MOCK_MODE: false,

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

// Puebla CONFIG con los valores de `.env`. Llamar UNA VEZ al startup de la
// app (en app.js) antes de inicializar el SDK.
export async function loadConfig() {
  const env = await loadEnv();
  CONFIG.CLIENT_SIDE_ID = env.LD_CLIENT_SIDE_ID || '';
  return CONFIG;
}
