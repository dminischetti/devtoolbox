import { toolPage } from './base.js';
import { handleCopy } from '../ui.js';

export default function renderBase64(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="b64-input">Plain text</label>
        <textarea id="b64-input" rows="6">Hello DevToolbox</textarea>
      </div>
    `,
    actions: `
      <button class="button-primary" id="b64-encode" data-run>Encode</button>
      <button class="button-ghost" id="b64-decode">Decode</button>
      <button class="button-ghost" id="b64-clear" data-clear>Clear</button>
      <button class="button-ghost" id="b64-copy">Copy encoded</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">Base64</h3>
          <pre id="b64-output" class="p-4 rounded bg-black/30 overflow-x-auto"></pre>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Bytes</h3>
          <p id="b64-bytes" class="font-mono text-xs"></p>
        </div>
      </div>
    `,
    notes: 'Base64 Studio respects UTF-8, showing the encoded bytes and giving instant copy options.'
  });
}

function init() {
  const input = document.getElementById('b64-input');
  const output = document.getElementById('b64-output');
  const bytesEl = document.getElementById('b64-bytes');

  const encode = () => {
    const encoded = btoa(unescape(encodeURIComponent(input.value)));
    output.textContent = encoded;
    bytesEl.textContent = Array.from(new TextEncoder().encode(input.value))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(' ');
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input.value)));
      output.textContent = decoded;
      bytesEl.textContent = `${decoded.length} characters`;
    } catch (error) {
      output.textContent = 'Invalid Base64 input';
      bytesEl.textContent = '';
    }
  };

  const clear = () => {
    input.value = '';
    output.textContent = '';
    bytesEl.textContent = '';
  };

  document.getElementById('b64-encode')?.addEventListener('click', encode);
  document.getElementById('b64-decode')?.addEventListener('click', decode);
  document.getElementById('b64-clear')?.addEventListener('click', clear);
  document.getElementById('b64-copy')?.addEventListener('click', () => handleCopy(output.textContent, 'Encoded string copied'));

  encode();
}
