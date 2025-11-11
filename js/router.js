import { renderPageTransition } from './ui.js';
import { getToolBySlug } from './state.js';

const routes = {
  '#/': async () => import('./pages/home.js'),
  '#/tools': async () => import('./pages/tools-hub.js'),
  '#/study': async () => import('./pages/study.js')
};

const pageCache = new Map();
const NON_CACHEABLE_ROUTES = new Set(['#/tools']);
let currentRoute = '';
const historyStore = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;
const MAX_CACHE_SIZE = 10;

function cacheSet(key, value) {
  if (pageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = pageCache.keys().next().value;
    pageCache.delete(firstKey);
  }
  pageCache.set(key, value);
}

function parseRoute(hash) {
  const normalized = hash && hash.startsWith('#') ? hash : `#${hash ?? '/'}`;
  const segments = normalized
    .slice(1)
    .split('/')
    .filter(Boolean);
  const path = `#/${segments[0] ?? ''}`;
  return { path, segments: segments.slice(1) };
}

export function initRouter(root) {
  const handleRoute = async () => {
    const hash = window.location.hash || '#/';
    const previousRoute = historyStore?.getItem('dt-current-route');
    if (previousRoute && previousRoute !== hash) {
      historyStore?.setItem('dt-last-route', previousRoute);
    }
    historyStore?.setItem('dt-current-route', hash);
    const { path, segments } = parseRoute(hash);
    const slug = segments[0];

    if (slug) {
      const tool = getToolBySlug(slug);
      if (!tool) {
        renderPageTransition(root, `<section class="py-24 text-center">\n          <h1 class="text-3xl font-semibold">Tool not found.</h1>\n          <p class="mt-4 text-zinc-200/80">Double-check the URL or explore the tools hub.</p>\n        </section>`);
        return;
      }
      const module = await import(`./tools/${slug}.js`);
      const view = module.default(tool);
      renderPageTransition(root, view);
      currentRoute = hash;
      return;
    }

    const loader = routes[path] || routes['#/'];
    if (!loader) return;

    if (!NON_CACHEABLE_ROUTES.has(path) && pageCache.has(path)) {
      renderPageTransition(root, pageCache.get(path));
      currentRoute = hash;
      return;
    }

    const module = await loader();
    const view = module.default();
    if (!NON_CACHEABLE_ROUTES.has(path)) {
      cacheSet(path, view);
    }
    renderPageTransition(root, view);
    currentRoute = hash;
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  return {
    navigate: (hash) => {
      if (hash === currentRoute) return;
      currentRoute = hash;
      window.location.hash = hash;
    }
  };
}
