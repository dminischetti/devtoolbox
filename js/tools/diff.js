import { toolPage } from './base.js';

export default function renderDiff(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <label for="diff-a">Original</label>
          <textarea id="diff-a" rows="10">console.log('hello');</textarea>
        </div>
        <div class="space-y-4">
          <label for="diff-b">Modified</label>
          <textarea id="diff-b" rows="10">console.log('hello world');</textarea>
        </div>
      </div>
    `,
    actions: `
      <button class="button-primary" id="diff-run" data-run>Compare</button>
      <button class="button-ghost" id="diff-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Diff</h3>
        <pre id="diff-output" class="p-4 rounded bg-black/30 overflow-x-auto whitespace-pre-wrap"></pre>
        <p id="diff-summary" class="text-xs text-indigo-200/70"></p>
      </div>
    `,
    notes: 'Diff Canvas highlights additions and removals with inline context, perfect for quick reviews.'
  });
}

function init() {
  const original = document.getElementById('diff-a');
  const modified = document.getElementById('diff-b');
  const output = document.getElementById('diff-output');
  const summary = document.getElementById('diff-summary');

  const compare = () => {
    const { text, added, removed } = diffLines(original.value, modified.value);
    output.innerHTML = text;
    summary.textContent = `${added} additions • ${removed} removals`;
  };

  const clear = () => {
    original.value = '';
    modified.value = '';
    output.textContent = '';
    summary.textContent = '';
  };

  document.getElementById('diff-run')?.addEventListener('click', compare);
  document.getElementById('diff-clear')?.addEventListener('click', clear);
  compare();
}

function diffLines(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const text = [];
  let added = 0;
  let removed = 0;
  const max = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < max; i++) {
    const left = aLines[i] ?? '';
    const right = bLines[i] ?? '';
    if (left === right) {
      text.push(`<div class="text-indigo-200/80">  ${escape(left)}</div>`);
    } else {
      if (left) {
        text.push(`<div class="text-rose-300">− ${escape(left)}</div>`);
        removed++;
      }
      if (right) {
        text.push(`<div class="text-emerald-300">+ ${escape(right)}</div>`);
        added++;
      }
    }
  }
  return { text: text.join(''), added, removed };
}

function escape(str) {
  return str.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}
