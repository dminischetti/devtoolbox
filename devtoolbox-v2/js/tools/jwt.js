import { toolPage } from './base.js';
import { handleCopy, showToast } from '../ui.js';

export default function renderJwt(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="jwt-input">JWT Token</label>
        <textarea id="jwt-input" rows="6"></textarea>
      </div>
      <div class="space-y-2 text-xs text-indigo-200/70">
        <p>Paste a JWT to decode header and payload without hitting any server.</p>
      </div>
    `,
    actions: `
      <button class="button-primary" id="jwt-decode" data-run>Decode</button>
      <button class="button-ghost" id="jwt-load-sample">Load sample</button>
      <button class="button-ghost" id="jwt-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">Header</h3>
          <pre id="jwt-header" class="p-4 rounded bg-black/30 overflow-x-auto"></pre>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Payload</h3>
          <pre id="jwt-payload" class="p-4 rounded bg-black/30 overflow-x-auto"></pre>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Signature</h3>
          <p id="jwt-signature" class="font-mono break-all"></p>
        </div>
      </div>
    `,
    notes: 'JWT Lens never transmits tokens. Decoding happens locally and warns about algorithm choices.'
  });
}

async function init() {
  const input = document.getElementById('jwt-input');
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  const signatureEl = document.getElementById('jwt-signature');

  const decodeBtn = document.getElementById('jwt-decode');
  const clearBtn = document.getElementById('jwt-clear');
  const sampleBtn = document.getElementById('jwt-load-sample');

  const decode = () => {
    const token = input.value.trim();
    if (!token) {
      showToast('Paste a token to decode');
      return;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      headerEl.textContent = '';
      payloadEl.textContent = '';
      signatureEl.textContent = 'Invalid token — expected three segments.';
      return;
    }
    try {
      const header = JSON.parse(atobUrlSafe(parts[0]));
      const payload = JSON.parse(atobUrlSafe(parts[1]));
      headerEl.textContent = JSON.stringify(header, null, 2);
      payloadEl.textContent = JSON.stringify(payload, null, 2);
      signatureEl.textContent = parts[2];
      if (header.alg === 'none') {
        signatureEl.innerHTML += ' ⚠️ Algorithm "none" is insecure.';
      }
    } catch (error) {
      signatureEl.textContent = `Decode failed: ${error.message}`;
    }
  };

  const clear = () => {
    input.value = '';
    headerEl.textContent = '';
    payloadEl.textContent = '';
    signatureEl.textContent = '';
  };

  decodeBtn?.addEventListener('click', decode);
  clearBtn?.addEventListener('click', clear);
  sampleBtn?.addEventListener('click', async () => {
    const response = await fetch('./data/examples/sample.jwt.txt');
    const text = await response.text();
    input.value = text.trim();
    decode();
    handleCopy(input.value, 'Sample token copied');
  });
}

function atobUrlSafe(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  return decodeURIComponent(
    Array.from(atob(padded))
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );
}
