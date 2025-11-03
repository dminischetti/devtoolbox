import { favoriteButton } from '../ui.js';

export function toolPage(tool, { workspace, output, actions, notes }) {
  setTimeout(() => {
    const runBtn = document.querySelector('[data-run]');
    const clearBtn = document.querySelector('[data-clear]');
    const container = document.querySelector('[data-panel-container]');
    const toggles = Array.from(document.querySelectorAll('[data-panel-toggle]'));
    const backdrop = document.querySelector('[data-panel-backdrop]');
    const pulse = (button) => {
      button.classList.remove('animate-pulse');
      void button.offsetWidth;
      button.classList.add('animate-pulse');
    };
    if (runBtn) runBtn.addEventListener('click', () => pulse(runBtn));
    if (clearBtn) clearBtn.addEventListener('click', () => pulse(clearBtn));

    const activatePanel = (panel) => {
      if (!container) return;
      const normalized = panel === 'output' ? 'output' : 'workspace';
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const target = desktop ? 'workspace' : normalized;
      container.dataset.drawerPanel = normalized;
      container.dataset.activePanel = target;
      const workspacePanel = container.querySelector('[data-panel="workspace"]');
      const outputPanel = container.querySelector('[data-panel="output"]');
      if (workspacePanel) {
        workspacePanel.setAttribute('aria-hidden', desktop ? 'false' : target === 'workspace' ? 'false' : 'true');
      }
      if (outputPanel) {
        outputPanel.setAttribute('aria-hidden', desktop ? 'false' : target === 'output' ? 'false' : 'true');
      }
      toggles.forEach((toggle) => {
        const isActive = toggle.dataset.panelToggle === target || (desktop && toggle.dataset.panelToggle === 'workspace');
        toggle.classList.toggle('is-active', isActive);
        toggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        toggle.setAttribute('aria-selected', isActive ? 'true' : 'false');
        toggle.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      document.body.classList.toggle('drawer-open', !desktop && target !== 'workspace');
    };

    if (container) {
      if (window.devtoolboxPanelResize) {
        window.removeEventListener('resize', window.devtoolboxPanelResize);
      }
      const handleResize = () => {
        const desired = container.dataset.drawerPanel || container.dataset.activePanel || 'workspace';
        activatePanel(desired);
      };
      window.devtoolboxPanelResize = handleResize;
      window.addEventListener('resize', handleResize, { passive: true });

      toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => activatePanel(toggle.dataset.panelToggle));
      });
      backdrop?.addEventListener('click', () => activatePanel('workspace'));
      activatePanel(container.dataset.activePanel || 'workspace');
    }
  }, 0);

  return `
    <section class="py-20 space-y-10">
      <header class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-3 max-w-3xl">
          <h2 class="text-4xl font-semibold flex items-center gap-4">
            <img src="${tool.icon}" alt="${tool.name} icon" class="h-12 w-12" />
            ${tool.name}
          </h2>
          <p class="text-indigo-100/80 text-lg">${tool.tagline}</p>
        </div>
        <div class="flex gap-3 flex-wrap">
          <button type="button" class="button-ghost" data-tool-back>
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
          ${favoriteButton(tool.slug)}
        </div>
      </header>
      <div class="tool-shell" data-panel-container data-active-panel="workspace">
        <div class="tool-shell__switcher" role="tablist" aria-label="Tool panels">
          <button type="button" role="tab" id="tool-panel-tab-workspace" class="tool-shell__tab is-active" data-panel-toggle="workspace" aria-controls="tool-workspace" aria-pressed="true" aria-expanded="true" aria-selected="true" tabindex="0">Workspace</button>
          <button type="button" role="tab" id="tool-panel-tab-output" class="tool-shell__tab" data-panel-toggle="output" aria-controls="tool-output" aria-pressed="false" aria-expanded="false" aria-selected="false" tabindex="-1">Results</button>
        </div>
        <div class="tool-shell__backdrop" data-panel-backdrop aria-hidden="true"></div>
        <div class="tool-shell__panels">
          <div class="tool-panel space-y-6" id="tool-workspace" data-panel="workspace" role="tabpanel" aria-labelledby="tool-panel-tab-workspace" aria-hidden="false">
            ${workspace}
            <div class="flex flex-wrap gap-3">
              ${actions}
            </div>
            <p class="tool-help">${tool.tip}</p>
          </div>
          <aside class="tool-panel space-y-6" id="tool-output" data-panel="output" role="tabpanel" aria-labelledby="tool-panel-tab-output" aria-label="Results panel" aria-hidden="true">
            ${output}
          </aside>
        </div>
      </div>
      ${notes ? `<section class="glass-panel p-8 text-sm leading-relaxed">${notes}</section>` : ''}
    </section>
  `;
}
