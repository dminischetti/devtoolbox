import { APP_META, getFavorites, getSearchTerm, getTheme, isFavorite, toggleFavorite } from './state.js';
import { copyToClipboard } from './utils/strings.js';

let toastTimeout;

export function renderPageTransition(root, markup) {
  root.innerHTML = '';
  const page = document.createElement('main');
  page.className = 'page-enter';
  page.innerHTML = layoutFrame(markup);
  root.appendChild(page);
  requestAnimationFrame(() => {
    page.classList.add('page-enter-active');
  });
}

export function layoutFrame(content) {
  const favorites = getFavorites();
  const search = getSearchTerm();
  const theme = getTheme();
  document.documentElement.classList.toggle('theme-light', theme === 'light');
  document.body.classList.toggle('theme-light', theme === 'light');

  return `
    <div class="offline-banner" id="offline-banner" role="status">
      <span aria-hidden="true">⚠️</span>
      <span>Offline mode</span>
    </div>
    <header class="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="./assets/logo.svg" alt="DevToolbox logo" class="h-10 w-10 hero-logo" />
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-indigo-200/70">${APP_META.tagline}</p>
            <h1 class="text-xl font-semibold">${APP_META.name}</h1>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#/" class="nav-link" data-route="#/">Home</a>
          <a href="#/tools" class="nav-link" data-route="#/tools">Tools</a>
          <a href="#/study" class="nav-link" data-route="#/study">Case Study</a>
        </nav>
        <div class="flex items-center gap-3">
          <button class="button-ghost flex items-center gap-2" id="theme-toggle" aria-label="Toggle theme">
            <span class="text-xs font-semibold">${theme === 'dark' ? 'Light' : 'Dark'} mode</span>
          </button>
          <button class="button-ghost hidden sm:flex items-center gap-2" id="open-help" aria-label="Keyboard shortcuts">
            <span class="text-xs font-semibold">Shortcuts</span>
          </button>
        </div>
      </div>
    </header>
    <div class="max-w-6xl mx-auto px-6">
      ${content}
    </div>
    <footer class="max-w-6xl mx-auto px-6 py-16 text-sm opacity-80">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <h2 class="text-lg font-semibold">${APP_META.tagline}</h2>
          <p class="mt-3 text-sm leading-relaxed">${APP_META.mission}</p>
        </div>
        <div class="space-y-2">
          <p><strong>Favorites:</strong> ${favorites.length ? favorites.join(', ') : 'None yet — star a tool to save it.'}</p>
          <p><strong>Search memory:</strong> ${search ? search : 'No active search.'}</p>
        </div>
      </div>
    </footer>
    <div class="copy-toast" id="copy-toast" role="status" aria-live="polite">Copied ✓</div>
  `;
}

export function updateNavState(hash) {
  document.querySelectorAll('nav a').forEach((link) => {
    const active = link.getAttribute('href') === hash;
    link.classList.toggle('active', active);
  });
}

export function showToast(message = 'Copied ✓') {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible', 'toast-pop');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible', 'toast-pop');
  }, 2200);
}

export function handleCopy(text, message) {
  copyToClipboard(text)
    .then(() => showToast(message))
    .catch(() => showToast('Copy failed'));
}

export function offlineBanner(status) {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  banner.classList.toggle('visible', status);
}

export function favoriteButton(slug) {
  const active = isFavorite(slug);
  return `<button class="button-ghost favorite-button" data-slug="${slug}" aria-pressed="${active}">
    <span>${active ? '★ Favorited' : '☆ Favorite'}</span>
  </button>`;
}

export function registerGlobalEvents(onThemeToggle, onHelp) {
  document.addEventListener('click', (event) => {
    if (event.target.closest('#theme-toggle')) {
      onThemeToggle();
    }
    const favButton = event.target.closest('.favorite-button');
    if (favButton) {
      const slug = favButton.dataset.slug;
      const active = toggleFavorite(slug);
      favButton.setAttribute('aria-pressed', active);
      favButton.innerHTML = `<span>${active ? '★ Favorited' : '☆ Favorite'}</span>`;
      showToast(active ? 'Added to favorites' : 'Removed from favorites');
    }
    if (event.target.closest('#open-help')) {
      onHelp();
    }
    const copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      handleCopy(copyBtn.dataset.copy, copyBtn.dataset.message || 'Copied ✓');
    }
  });
}
