// Mock LaunchDarkly client with the same surface used by app.js.
// Expuesto en window.__ldMock para el atajo de teclado de backup.

export function createMockClient({ flagKey, initialValue }) {
  let value = initialValue;
  const listeners = new Map();

  const emit = (event, payload) => {
    (listeners.get(event) || []).forEach((cb) => cb(payload));
  };

  return {
    async waitForInitialization() { return this; },

    variation(key, fallback) {
      return key === flagKey ? value : fallback;
    },

    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(cb);
    },

    // Métodos de control para el mock (no existen en el SDK real).
    _set(newValue) {
      if (value === newValue) return;
      value = newValue;
      emit(`change:${flagKey}`, newValue);
      emit('change', { [flagKey]: { previous: !newValue, current: newValue } });
    },
    _get() { return value; },
    _toggle() { this._set(!value); },
  };
}
