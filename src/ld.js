import { CONFIG } from './config.js';
import { createMockClient } from './mock-ld.js';

export async function initClient() {
  const useMock = CONFIG.MOCK_MODE || !CONFIG.CLIENT_SIDE_ID;

  if (useMock) {
    const client = createMockClient({
      flagKey: CONFIG.FLAG_KEY,
      initialValue: CONFIG.MOCK_INITIAL_VALUE,
    });
    window.__ldMock = client;
    console.info('[LD] mock mode — Shift+Ctrl+J = ON, Shift+Ctrl+K = OFF');
    return client;
  }

  // Real SDK, cargado via <script> UMD → global LDClient.
  if (typeof LDClient === 'undefined') {
    throw new Error('LaunchDarkly SDK not loaded — check the <script> tag in index.html');
  }
  const client = LDClient.initialize(CONFIG.CLIENT_SIDE_ID, CONFIG.CONTEXT);
  await client.waitForInitialization();
  console.info('[LD] real SDK initialized');
  return client;
}
