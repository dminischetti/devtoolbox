import { toolPage } from './base.js';
import { highlightMatches } from '../utils/strings.js';

export default function renderRegex(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="regex-pattern">Pattern</label>
        <input id="regex-pattern" value="(\\w+)" spellcheck="false" />
      </div>
      <div class="space-y-4">
        <label for="regex-flags">Flags</label>
        <input id="regex-flags" value="g" placeholder="gimuy" />
      </div>
      <div class="space-y-4">
        <label for="regex-input">Sample text</label>
        <textarea id="regex-input" rows="8">The quick brown fox jumps over the lazy developer.</textarea>
      </div>
    `,
    actions: `
      <button class="button-primary" data-run id="regex-run">Run</button>
      <button class="button-ghost" data-clear id="regex-clear">Clear</button>
    `,
    output: `
      <div>
        <h3 class="text-lg font-semibold">Matches</h3>
        <div id="regex-results" class="mt-4 space-y-3 text-sm leading-relaxed"></div>
      </div>
    `,
    notes: 'Regex Explorer highlights matches inline and offers quick explanations for capture groups.'
  });
}

function init() {
  const patternInput = document.getElementById('regex-pattern');
  const flagsInput = document.getElementById('regex-flags');
  const sampleInput = document.getElementById('regex-input');
  const results = document.getElementById('regex-results');
  const runButton = document.getElementById('regex-run');
  const clearButton = document.getElementById('regex-clear');

  const run = () => {
    const pattern = patternInput.value;
    const flags = flagsInput.value;
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
      const matches = Array.from(sampleInput.value.matchAll(regex));
      if (!matches.length) {
        results.innerHTML = `<p class="text-zinc-200/70">No matches found.</p>`;
        return;
      }
      const highlighted = highlightMatches(sampleInput.value, regex);
      const captures = matches
        .map(
          (match, index) => `<div class="p-4 rounded-lg bg-zinc-500/10 border border-zinc-500/20">
            <p class="font-semibold">Match ${index + 1}: <span class="text-zinc-100/90">${match[0]}</span></p>
            ${match.length > 1 ? `<p class="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-200/60">Groups</p>
              <ul class="mt-1 space-y-1 text-sm">${match
                .slice(1)
                .map((group, i) => `<li><span class="text-zinc-200/80">$${i + 1}</span> → ${group ?? '<em>empty</em>'}</li>`)
                .join('')}</ul>` : ''}
          </div>`
        )
        .join('');
      results.innerHTML = `<div class="prose prose-invert max-w-none">
        <p>Highlighted sample:</p>
        <div class="p-4 rounded bg-black/30">${highlighted}</div>
      </div>
      <div class="mt-4 space-y-3">${captures}</div>`;
    } catch (error) {
      results.innerHTML = `<p class="text-sm text-zinc-100 font-semibold">${error.message}</p>`;
    }
  };

  const clear = () => {
    sampleInput.value = '';
    results.innerHTML = '<p class="text-zinc-200/70">Cleared. Paste text to begin.</p>';
  };

  runButton?.addEventListener('click', run);
  clearButton?.addEventListener('click', clear);
  run();
}
