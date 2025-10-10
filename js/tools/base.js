import { favoriteButton } from '../ui.js';

export function toolPage(tool, { workspace, output, actions, notes }) {
  setTimeout(() => {
    const runBtn = document.querySelector('[data-run]');
    const clearBtn = document.querySelector('[data-clear]');
    const pulse = (button) => {
      button.classList.remove('animate-pulse');
      void button.offsetWidth;
      button.classList.add('animate-pulse');
    };
    if (runBtn) runBtn.addEventListener('click', () => pulse(runBtn));
    if (clearBtn) clearBtn.addEventListener('click', () => pulse(clearBtn));
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
      <div class="tool-shell">
        <div class="tool-panel space-y-6" id="tool-workspace">
          ${workspace}
          <div class="flex flex-wrap gap-3">
            ${actions}
          </div>
          <p class="tool-help">${tool.tip}</p>
        </div>
        <aside class="tool-panel space-y-6" id="tool-output">
          ${output}
        </aside>
      </div>
      ${notes ? `<section class="glass-panel p-8 text-sm leading-relaxed">${notes}</section>` : ''}
    </section>
  `;
}
