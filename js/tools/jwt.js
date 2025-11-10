import { toolPage } from './base.js';
import { handleCopy, showToast } from '../ui.js';
import { handleError } from '../utils/errors.js';

export default function renderJwt(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="jwt-input">JWT Token</label>
        <textarea id="jwt-input" rows="6"></textarea>
      </div>
      <div class="space-y-2 text-xs text-zinc-200/70">
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
      let signatureMessage = parts[2];
      if (header.alg === 'none') {
        signatureMessage += ' ⚠️ Algorithm "none" is insecure.';
      }
      signatureEl.textContent = signatureMessage;
    } catch (error) {
      headerEl.textContent = '';
      payloadEl.textContent = '';
      const { message } = handleError('jwt:decode', error, {
        userMessage: 'Decode failed. Confirm the token is well-formed and base64url encoded.'
      });
      signatureEl.textContent = message;
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
  try {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Segment is empty.');
    }
    if (!/^[A-Za-z0-9_-]+$/.test(value)) {
      throw new Error('Segment contains invalid characters.');
    }
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(bytes);
  } catch (error) {
    throw new Error(`Invalid base64url encoding: ${error.message}`);
  }
}
