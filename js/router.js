import { renderPageTransition } from './ui.js';
import { getToolBySlug } from './state.js';

const routes = {
  '#/': async () => import('./pages/home.js'),
  '#/tools': async () => import('./pages/tools-hub.js'),
  '#/study': async () => import('./pages/study.js')
};

const pageCache = new Map();
let currentRoute = '';
const historyStore = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;

export function initRouter(root) {
  const handleRoute = async () => {
    const hash = window.location.hash || '#/';
    const previousRoute = historyStore?.getItem('dt-current-route');
    if (previousRoute && previousRoute !== hash) {
      historyStore?.setItem('dt-last-route', previousRoute);
    }
    historyStore?.setItem('dt-current-route', hash);
    const [path, slug] = hash.split('/').reduce(
      (acc, part, index) => {
        if (index === 0) return acc;
        if (index === 1) acc[0] = `#/${part}`;
        else acc[1] = part;
        return acc;
      },
      ['#/', undefined]
    );

    if (slug) {
      const tool = getToolBySlug(slug);
      if (!tool) {
        renderPageTransition(root, `<section class="py-24 text-center">\n          <h1 class="text-3xl font-semibold">Tool not found.</h1>\n          <p class="mt-4 text-indigo-200/80">Double-check the URL or explore the tools hub.</p>\n        </section>`);
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

    if (pageCache.has(path)) {
      renderPageTransition(root, pageCache.get(path));
      currentRoute = hash;
      return;
    }

    const module = await loader();
    const view = module.default();
    pageCache.set(path, view);
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
