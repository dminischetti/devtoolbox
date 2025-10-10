import { APP_META, getFavorites, getSearchTerm, getTheme, isFavorite, toggleFavorite } from './state.js';
import { copyToClipboard } from './utils/strings.js';

let toastTimeout;
const historyStore = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;

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
    <div class="offline-banner" id="offline-banner" role="status" aria-live="polite">
      <span aria-hidden="true">⚠️</span>
      <span>Offline mode</span>
    </div>
    <div id="nav-backdrop" aria-hidden="true"></div>
    <header class="site-header">
      <div class="shell site-header__inner">
        <a class="brand" href="#/" data-nav-link>
          <span class="brand__mark">
            <img src="./assets/logo.svg" alt="DevToolbox logo" />
          </span>
          <span class="brand__meta">
            <span class="brand__tagline">${APP_META.tagline}</span>
            <span class="brand__name">${APP_META.name}</span>
          </span>
        </a>
        <nav class="site-nav" id="site-nav" data-open="false">
          <a href="#/" class="nav-link" data-nav-link data-route="#/">Home</a>
          <a href="#/tools" class="nav-link" data-nav-link data-route="#/tools">Tools</a>
          <a href="#/study" class="nav-link" data-nav-link data-route="#/study">Case Study</a>
        </nav>
        <div class="header-actions">
          <button id="nav-toggle" class="icon-button" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle navigation menu">
            <span aria-hidden="true">☰</span>
          </button>
          <button class="button-ghost" id="open-help" aria-label="Keyboard shortcuts">Shortcuts</button>
          <button class="button-ghost" id="theme-toggle" aria-label="Toggle theme">${theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
        </div>
      </div>
    </header>
    <div class="page-content">
      ${content}
    </div>
    <footer>
      <div class="shell footer-grid">
        <div>
          <h2 class="brand__tagline">${APP_META.tagline}</h2>
          <p>${APP_META.mission}</p>
        </div>
        <div>
          <p><strong>Favorites:</strong> ${favorites.length ? favorites.join(', ') : 'None yet — star a tool to save it.'}</p>
          <p><strong>Search memory:</strong> ${search ? search : 'No active search.'}</p>
        </div>
      </div>
      <div class="shell footer-meta" role="contentinfo">
        <p>© 2025 Dominic Minischetti</p>
        <p>
          Dedicated to optimizing performance and building scalable backend systems. I've been crafting fast, reliable solutions
          since 2012.
        </p>
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
  return `<button type="button" class="button-ghost favorite-button" data-slug="${slug}" aria-pressed="${active}">
    <span>${active ? '★ Favorited' : '☆ Favorite'}</span>
  </button>`;
}

export function registerGlobalEvents(onThemeToggle, onHelp) {
  const setNavState = (open) => {
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('nav-toggle');
    const backdrop = document.getElementById('nav-backdrop');
    if (!nav || !toggle) return;
    nav.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    backdrop?.classList.toggle('visible', open);
  };

  document.addEventListener('click', (event) => {
    if (event.target.closest('#theme-toggle')) {
      onThemeToggle();
      const button = document.getElementById('theme-toggle');
      if (button) {
        button.textContent = getTheme() === 'dark' ? 'Light mode' : 'Dark mode';
      }
    }
    if (event.target.closest('#nav-toggle')) {
      const nav = document.getElementById('site-nav');
      const isOpen = nav?.dataset.open === 'true';
      setNavState(!isOpen);
    }
    if (event.target.closest('#nav-backdrop')) {
      setNavState(false);
    }
    if (event.target.closest('[data-nav-link]')) {
      setNavState(false);
    }
    const backButton = event.target.closest('[data-tool-back]');
    if (backButton) {
      event.preventDefault();
      const lastRoute = historyStore?.getItem('dt-last-route');
      const fallback = '#/tools';
      const target = lastRoute && lastRoute !== window.location.hash ? lastRoute : fallback;
      window.location.hash = target;
      return;
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavState(false);
    }
  });
}
