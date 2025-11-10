import { toolPage } from './base.js';
import { handleCopy } from '../ui.js';
import { handleError } from '../utils/errors.js';

export default function renderJson(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="json-input">JSON Input</label>
        <textarea id="json-input" rows="10">{"hello":"developer","nested":{"value":42}}</textarea>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label for="json-indent">Indent</label>
          <select id="json-indent">
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="\t">Tab</option>
          </select>
        </div>
        <div>
          <label for="json-sort">Sort keys</label>
          <select id="json-sort">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>
    `,
    actions: `
      <button class="button-primary" id="json-validate" data-run>Validate &amp; Format</button>
      <button class="button-ghost" id="json-clear" data-clear>Clear</button>
      <button class="button-ghost" id="json-copy">Copy output</button>
    `,
    output: `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Result</h3>
        <pre id="json-output" class="p-4 rounded bg-black/30 overflow-x-auto text-sm"></pre>
        <p id="json-status" class="text-sm"></p>
      </div>
    `,
    notes: 'JSON Doctor prettifies objects, sorts keys if desired, and reports parse errors with empathy.'
  });
}

function init() {
  const input = document.getElementById('json-input');
  const indentSelect = document.getElementById('json-indent');
  const sortSelect = document.getElementById('json-sort');
  const output = document.getElementById('json-output');
  const status = document.getElementById('json-status');

  const run = () => {
    try {
      const parsed = JSON.parse(input.value);
      const processed = sortSelect.value === 'yes' ? sortObject(parsed) : parsed;
      const indentValue = indentSelect.value === '\\t' ? '\\t' : Number(indentSelect.value);
      const formatted = JSON.stringify(processed, null, indentValue);
      output.textContent = formatted;
      status.textContent = 'JSON looks healthy ✓';
      status.className = 'text-sm text-zinc-300 font-medium';
      output.classList.add('animate-[pulseGlow_1.6s_ease]');
      setTimeout(() => output.classList.remove('animate-[pulseGlow_1.6s_ease]'), 1600);
    } catch (error) {
      const { message } = handleError('json:format', error, {
        userMessage: 'Invalid JSON. Check for missing commas or quotes and try again.'
      });
      status.textContent = message;
      status.className = 'text-sm text-zinc-100 font-semibold';
    }
  };

  const clear = () => {
    input.value = '';
    output.textContent = '';
    status.textContent = '';
    status.className = 'text-sm';
  };

  document.getElementById('json-validate')?.addEventListener('click', run);
  document.getElementById('json-clear')?.addEventListener('click', clear);
  document.getElementById('json-copy')?.addEventListener('click', () => handleCopy(output.textContent, 'JSON copied'));

  run();
}

function sortObject(value) {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(value[key]);
        return acc;
      }, {});
  }
  return value;
}
