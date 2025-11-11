import { toolPage } from './base.js';

export default function renderHttp(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="http-search">Search status code</label>
        <input id="http-search" placeholder="e.g. 404 or not found" />
      </div>
      <p class="text-sm text-zinc-200/70">Data sourced from the HTTP specification, stored locally.</p>
    `,
    actions: `
      <button class="button-primary" id="http-run" data-run>Lookup</button>
      <button class="button-ghost" id="http-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Results</h3>
        <div id="http-results" class="space-y-3"></div>
      </div>
    `,
    notes: 'HTTP Whisperer helps decode status codes with recommended fixes and user-facing language.'
  });
}

async function init() {
  const search = document.getElementById('http-search');
  const runBtn = document.getElementById('http-run');
  const clearBtn = document.getElementById('http-clear');
  const results = document.getElementById('http-results');
  const response = await fetch('./data/http-status.json');
  const data = await response.json();

  const lookup = () => {
    const term = search.value.trim().toLowerCase();
    const filtered = data.filter((item) =>
      item.code.toString().includes(term) || item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
    );
    if (!filtered.length) {
      results.innerHTML = '<p class="text-zinc-200/70">No matching status codes.</p>';
      return;
    }
    results.innerHTML = filtered
      .map(
        (item) => `
          <article class="p-4 rounded bg-black/30 border border-zinc-500/20">
            <div class="flex items-baseline justify-between">
              <h4 class="text-xl font-semibold">${item.code}</h4>
              <span class="text-xs uppercase tracking-[0.3em] text-zinc-200/60">${item.category}</span>
            </div>
            <p class="mt-2 font-semibold">${item.title}</p>
            <p class="mt-2 text-zinc-100/80">${item.description}</p>
            <p class="mt-3 text-xs text-zinc-200/60">Remedy: ${item.action}</p>
          </article>
        `
      )
      .join('');
  };

  const clear = () => {
    search.value = '';
    results.innerHTML = '';
  };

  runBtn?.addEventListener('click', lookup);
  clearBtn?.addEventListener('click', clear);
}
