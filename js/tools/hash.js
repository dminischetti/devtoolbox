import { toolPage } from './base.js';
import { handleCopy } from '../ui.js';

const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512'];

export default function renderHash(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="hash-input">Message</label>
        <textarea id="hash-input" rows="6">Hash me softly</textarea>
      </div>
      <div class="space-y-4">
        <label for="hash-algo">Algorithm</label>
        <select id="hash-algo">
          ${ALGORITHMS.map((algo) => `<option value="${algo}">${algo}</option>`).join('')}
        </select>
      </div>
    `,
    actions: `
      <button class="button-primary" id="hash-run" data-run>Digest</button>
      <button class="button-ghost" id="hash-clear" data-clear>Clear</button>
      <button class="button-ghost" id="hash-copy">Copy hex</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">Hex digest</h3>
          <pre id="hash-output" class="p-4 rounded bg-black/30 overflow-x-auto"></pre>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Base64</h3>
          <p id="hash-base64" class="font-mono break-all"></p>
        </div>
        <p id="hash-entropy" class="text-xs text-zinc-200/70"></p>
      </div>
    `,
    notes: 'Hash Forge uses Web Crypto to hash messages, sharing both hex and Base64 results instantly.'
  });
}

function init() {
  const input = document.getElementById('hash-input');
  const algo = document.getElementById('hash-algo');
  const output = document.getElementById('hash-output');
  const base64El = document.getElementById('hash-base64');
  const entropyEl = document.getElementById('hash-entropy');

  const digest = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input.value);
    const buffer = await crypto.subtle.digest(algo.value, data);
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    output.textContent = hex;
    base64El.textContent = btoa(String.fromCharCode(...bytes));
    entropyEl.textContent = `${algo.value} digest length ${bytes.length * 8} bits.`;
    output.classList.add('animate-[pulseGlow_1.6s_ease]');
    setTimeout(() => output.classList.remove('animate-[pulseGlow_1.6s_ease]'), 1600);
  };

  const clear = () => {
    input.value = '';
    output.textContent = '';
    base64El.textContent = '';
    entropyEl.textContent = '';
  };

  document.getElementById('hash-run')?.addEventListener('click', digest);
  document.getElementById('hash-clear')?.addEventListener('click', clear);
  document.getElementById('hash-copy')?.addEventListener('click', () => handleCopy(output.textContent, 'Hash copied'));

  digest();
}
