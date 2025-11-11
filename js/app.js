import { initRouter } from './router.js';
import { offlineBanner, registerGlobalEvents, updateNavState } from './ui.js';
import { registerShortcuts } from './utils/shortcuts.js';
import { installGlobalErrorHandlers } from './utils/errors.js';
import './sw-register.js';

const root = document.getElementById('app');

const router = initRouter(root);

installGlobalErrorHandlers();

registerGlobalEvents(showShortcuts);

registerShortcuts({
  onSearch: () => document.getElementById('tool-search')?.focus(),
  onGoTools: () => router.navigate('#/tools'),
  onGoStudy: () => router.navigate('#/study'),
  onHelp: () => showShortcuts(),
  onRun: () => document.querySelector('[data-run]')?.click(),
  onClear: () => document.querySelector('[data-clear]')?.click()
});

function showShortcuts() {
  const message = `Keyboard shortcuts\n──────────────\n/ focus search\n⌘/Ctrl + Enter run\nEsc clear\ng t tools\ng s study\n? help`;
  alert(message);
}

window.addEventListener('online', () => offlineBanner(false));
window.addEventListener('offline', () => offlineBanner(true));
offlineBanner(!navigator.onLine);

const syncNavState = () => {
  updateNavState(window.location.hash || '#/');
  document.body.classList.remove('drawer-open');
  if (!String(window.location.hash || '').startsWith('#/tools/')) {
    if (window.devtoolboxPanelResize) {
      window.removeEventListener('resize', window.devtoolboxPanelResize);
      window.devtoolboxPanelResize = null;
    }
  }
};

syncNavState();
window.addEventListener('hashchange', syncNavState);

