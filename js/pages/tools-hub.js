import { favoriteButton } from '../ui.js';
import { getSearchTerm, getTools, setSearchTerm } from '../state.js';
import { debounce } from '../utils/strings.js';

export default function renderToolsHub() {
  const tools = getTools();
  const searchTerm = getSearchTerm();
  const safeSearch = (searchTerm || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  setTimeout(() => attachInteractions(tools), 0);

  return `
    <section class="tool-catalog" id="tools-hub" aria-labelledby="tools-hub-title">
      <div class="shell">
        <div class="glass-panel tool-hub__intro">
          <div class="tool-hub__meta">
            <p class="section-heading__label">Tool console</p>
            <h2 class="section-heading__title" id="tools-hub-title">Command centre for every utility</h2>
            <p class="hero-copy">Search, favourite, and launch fourteen hand-tuned developer instruments. Every card carries the same glassy language for muscle-memory bliss.</p>
            <p class="hero-badge">Shortcuts: <kbd>/</kbd> search · <kbd>⌘/Ctrl + Enter</kbd> run · <kbd>Esc</kbd> clear</p>
          </div>
          <div class="tool-hub__search">
            <label for="tool-search">Search tools</label>
            <div class="tool-hub__search-field">
              <span aria-hidden="true">⌕</span>
              <input id="tool-search" type="search" value="${safeSearch}" placeholder="Search tools by name, category, or description" />
            </div>
          </div>
        </div>
        <div id="tools-grid" class="tool-grid tool-grid--hub" role="list"></div>
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
          <article class="tool-card card-tilt" role="listitem">
            <div class="card-inner">
              <div class="tool-card__header">
                <span class="tool-card__icon" aria-hidden="true">
                  <img src="${tool.icon}" alt="" />
                </span>
                <div class="tool-card__meta">
                  <h3 class="tool-card__title">${tool.name}</h3>
                  <span class="tool-card__tag">${tool.category}</span>
                </div>
              </div>
              <p class="tool-card__copy">${tool.description}</p>
              <div class="tool-card__actions">
                <a class="btn" href="#/tools/${tool.slug}">Launch</a>
                ${favoriteButton(tool.slug)}
              </div>
              <div class="tool-card__footer">${tool.tip}</div>
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
