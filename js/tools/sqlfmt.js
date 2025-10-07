import { toolPage } from './base.js';
import { handleCopy } from '../ui.js';

const KEYWORDS = ['select', 'from', 'where', 'join', 'inner', 'left', 'right', 'on', 'group', 'by', 'order', 'limit', 'insert', 'into', 'values', 'update', 'set', 'delete'];

export default function renderSql(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="sql-input">SQL</label>
        <textarea id="sql-input" rows="10">select id, name from users where active = true order by created_at desc</textarea>
      </div>
    `,
    actions: `
      <button class="button-primary" id="sql-run" data-run>Format</button>
      <button class="button-ghost" id="sql-clear" data-clear>Clear</button>
      <button class="button-ghost" id="sql-copy">Copy</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Formatted SQL</h3>
        <pre id="sql-output" class="p-4 rounded bg-black/30 overflow-x-auto"></pre>
      </div>
    `,
    notes: 'SQL Formatter uppercases keywords, creates gentle indentation, and keeps your queries approachable.'
  });
}

function init() {
  const input = document.getElementById('sql-input');
  const output = document.getElementById('sql-output');

  const format = () => {
    const formatted = formatSql(input.value);
    output.textContent = formatted;
    output.classList.add('animate-[pulseGlow_1.2s_ease]');
    setTimeout(() => output.classList.remove('animate-[pulseGlow_1.2s_ease]'), 1200);
  };

  const clear = () => {
    input.value = '';
    output.textContent = '';
  };

  document.getElementById('sql-run')?.addEventListener('click', format);
  document.getElementById('sql-clear')?.addEventListener('click', clear);
  document.getElementById('sql-copy')?.addEventListener('click', () => handleCopy(output.textContent, 'SQL copied'));

  format();
}

function formatSql(sql) {
  const tokens = sql
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((token) => (KEYWORDS.includes(token.toLowerCase()) ? token.toUpperCase() : token));

  const lines = [];
  let current = [];
  tokens.forEach((token) => {
    if (['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE'].includes(token)) {
      if (current.length) lines.push(current.join(' '));
      current = [token];
    } else if (token === 'BY') {
      current.push(token);
    } else if (token === 'AND' || token === 'OR') {
      current.push(`\n  ${token}`);
    } else {
      current.push(token);
    }
  });
  if (current.length) lines.push(current.join(' '));
  return lines.join('\n  ');
}
