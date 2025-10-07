import { favoriteButton } from '../ui.js';
import { getSearchTerm, getTools, setSearchTerm } from '../state.js';
import { debounce } from '../utils/strings.js';

export default function renderToolsHub() {
  const tools = getTools();
  const searchTerm = getSearchTerm();

  setTimeout(() => attachInteractions(tools), 0);

  return `
    <section class="py-24">
      <div class="flex flex-col gap-10">
        <div class="glass-panel p-10 parallax-bg">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div class="max-w-2xl space-y-4">
              <h2 class="text-4xl font-semibold">The Lab Console</h2>
              <p class="text-indigo-100/80 text-lg">Search, filter, and launch fourteen hand-tuned developer tools. Every card glows with a purpose, every action leaves a satisfying trail.</p>
              <p class="text-sm opacity-80">Shortcuts: <kbd>/</kbd> to search • <kbd>⌘/Ctrl + Enter</kbd> run • <kbd>Esc</kbd> clear</p>
            </div>
            <img src="./assets/logo.svg" alt="Logo" class="w-24 h-24 rotating-logo" />
          </div>
          <div class="mt-10 relative">
            <label class="sr-only" for="tool-search">Search tools</label>
            <input id="tool-search" type="search" value="${searchTerm}" placeholder="Search tools by name, category, or description" class="pl-12 py-4 text-base" />
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200/70">⌕</span>
          </div>
        </div>
        <div id="tools-grid" class="grid gap-8 md:grid-cols-2 xl:grid-cols-3"></div>
      </div>
    </section>
  `;
}

function attachInteractions(tools) {
  const grid = document.getElementById('tools-grid');
  const searchInput = document.getElementById('tool-search');

  const render = (filtered) => {
    grid.innerHTML = filtered
      .map(
        (tool) => `
          <article class="glass-panel card-tilt">
            <div class="card-inner p-6 flex flex-col h-full">
              <div class="flex items-center gap-4">
                <img src="${tool.icon}" alt="${tool.name} icon" class="h-10 w-10" />
                <div>
                  <h3 class="text-lg font-semibold">${tool.name}</h3>
                  <p class="text-xs uppercase tracking-[0.25em] text-indigo-200/60">${tool.category}</p>
                </div>
              </div>
              <p class="mt-4 text-sm leading-relaxed flex-1">${tool.description}</p>
              <div class="mt-6 flex items-center justify-between gap-4">
                <a class="button-primary text-sm text-center" href="#/tools/${tool.slug}">Launch tool</a>
                ${favoriteButton(tool.slug)}
              </div>
              <p class="tool-help">${tool.tip}</p>
            </div>
          </article>
        `
      )
      .join('');
  };

  const initial = filterTools(tools, searchInput.value);
  render(initial);

  searchInput.addEventListener(
    'input',
    debounce((event) => {
      const value = event.target.value;
      setSearchTerm(value);
      render(filterTools(tools, value));
    }, 120)
  );
}

function filterTools(tools, query = '') {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return tools;
  return tools.filter((tool) => {
    const haystack = `${tool.name} ${tool.category} ${tool.description} ${tool.tip}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}
