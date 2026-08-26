import { CONFIG } from './config.js';
import { initClient } from './ld.js';
import { startChaos, stopChaos } from './chaos.js';

(async () => {
  const client = await initClient();

  const apply = (on) => {
    if (on) startChaos();
    else stopChaos({ fadeOut: true });
  };

  apply(client.variation(CONFIG.FLAG_KEY, false));
  client.on(`change:${CONFIG.FLAG_KEY}`, apply);

  // Backup por si el venue tumba el SDK stream: fuerza el estado local
  // y (si estamos en mock) actualiza el flag del mock para mantener coherencia.
  document.addEventListener('keydown', (e) => {
    if (!e.shiftKey || !e.ctrlKey) return;
    const key = e.key.toLowerCase();

    if (key === 'j') {
      e.preventDefault();
      if (window.__ldMock) window.__ldMock._set(true);
      else startChaos();
    }
    if (key === 'k') {
      e.preventDefault();
      if (window.__ldMock) window.__ldMock._set(false);
      else stopChaos({ fadeOut: true });
    }
  });
})();
