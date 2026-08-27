// Minimal .env loader for a static browser app: fetches `.env` from the
// server root and parses KEY=VALUE lines. If `.env` is missing, returns
// an empty object and warns — the app falls back to mock mode instead
// of failing hard.

export async function loadEnv() {
  try {
    const res = await fetch('.env', { cache: 'no-store' });
    if (!res.ok) {
      console.warn(
        '[env] .env not found (HTTP ' + res.status + '). ' +
        'Copy .env.example to .env for real LaunchDarkly integration.'
      );
      return {};
    }
    return parse(await res.text());
  } catch (err) {
    console.warn('[env] failed to load .env:', err.message);
    return {};
  }
}

function parse(text) {
  const env = {};
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // Strip surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }
  return env;
}
