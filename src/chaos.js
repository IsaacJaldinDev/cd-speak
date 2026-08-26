import { CONFIG } from './config.js';
import { nextError } from './errors.js';

const $ = (id) => document.getElementById(id);

let errorInterval = null;
let clockInterval = null;
let totalErrors = 0;
let pendingFadeTimeouts = [];

const pad = (n, w) => String(n).padStart(w, '0');

function updateClock() {
  const d = new Date();
  $('chaos-time').textContent = `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(), 2)}`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderSnippet(lines) {
  if (!lines || !lines.length) return '';
  const inner = lines
    .map((l) => (l.caret ? `<span class="caret">${escapeHtml(l.text)}</span>` : escapeHtml(l.text)))
    .join('\n');
  return `<pre class="err-snippet">${inner}</pre>`;
}

function renderError(e) {
  const el = document.createElement('div');
  el.className = 'err';
  const codeChip = e.code ? `<span class="err-code">${escapeHtml(e.code)}</span>` : '';
  const msgHtml = e.msg
    ? `<div class="err-msg">${escapeHtml(e.msg).replace(/\n/g, '<br>')}</div>`
    : '';
  el.innerHTML = `
    <div class="err-head">
      <span class="ts">[${e.timestamp}]</span>${codeChip}<span>${escapeHtml(e.head)}</span>
    </div>
    ${msgHtml}
    ${renderSnippet(e.snippet)}
  `;
  return el;
}

function pushError() {
  const log = $('chaos-log');
  log.appendChild(renderError(nextError()));

  totalErrors++;
  $('chaos-count').textContent = pad(totalErrors, 3);

  while (log.children.length > CONFIG.MAX_VISIBLE_ERRORS) {
    log.removeChild(log.firstElementChild);
  }
  log.scrollTop = log.scrollHeight;
}

export function startChaos() {
  // Cancelar cualquier fade en curso para no perder el nuevo ciclo si el
  // presenter toggea rápido entre OFF y ON.
  pendingFadeTimeouts.forEach(clearTimeout);
  pendingFadeTimeouts = [];

  const overlay = $('chaos');
  overlay.classList.remove('hidden', 'fading-out');
  overlay.setAttribute('aria-hidden', 'false');

  // Reset visual state por si veníamos de un fade previo interrumpido.
  [...$('chaos-log').children].forEach((el) => {
    el.classList.remove('fading');
    el.style.transitionDelay = '';
  });

  if (!errorInterval) {
    pushError();  // impacto inmediato
    errorInterval = setInterval(pushError, CONFIG.ERROR_INTERVAL_MS);
  }
  if (!clockInterval) {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }
}

export function stopChaos({ fadeOut = true } = {}) {
  if (errorInterval) { clearInterval(errorInterval); errorInterval = null; }
  if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }

  const overlay = $('chaos');
  const log = $('chaos-log');

  const reset = () => {
    overlay.classList.add('hidden');
    overlay.classList.remove('fading-out');
    overlay.setAttribute('aria-hidden', 'true');
    log.innerHTML = '';
    totalErrors = 0;
    $('chaos-count').textContent = '000';
  };

  if (!fadeOut) { reset(); return; }

  // Fade escalonado de cada error, luego fade del overlay.
  const errs = [...log.children];
  errs.forEach((el, i) => {
    el.style.transitionDelay = `${i * 35}ms`;
    el.classList.add('fading');
  });

  const errsFadeMs = Math.max(600, errs.length * 35 + 900);
  const t1 = setTimeout(() => {
    overlay.classList.add('fading-out');
    const t2 = setTimeout(reset, 950);
    pendingFadeTimeouts.push(t2);
  }, errsFadeMs);
  pendingFadeTimeouts.push(t1);
}
