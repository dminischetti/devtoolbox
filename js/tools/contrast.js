import { toolPage } from './base.js';
import { blend, contrastRatio, recommendTextColor } from '../utils/color.js';

export default function renderContrast(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <label for="contrast-foreground">Foreground</label>
          <input id="contrast-foreground" type="color" value="#f8f8f8" />
        </div>
        <div class="space-y-4">
          <label for="contrast-background">Background</label>
          <input id="contrast-background" type="color" value="#0f0f0f" />
        </div>
      </div>
    `,
    actions: `
      <button class="button-primary" id="contrast-run" data-run>Analyze</button>
      <button class="button-ghost" id="contrast-swap">Swap</button>
      <button class="button-ghost" id="contrast-clear" data-clear>Reset</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">Ratio</h3>
          <p id="contrast-ratio" class="text-2xl font-semibold"></p>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Preview</h3>
          <div id="contrast-preview" class="p-6 rounded" role="presentation">Preview text</div>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Recommendations</h3>
          <ul id="contrast-reco" class="space-y-2"></ul>
        </div>
      </div>
    `,
    notes: 'Contrast Lab benchmarks against WCAG and suggests alternative pairings for better legibility.'
  });
}

function init() {
  const foreground = document.getElementById('contrast-foreground');
  const background = document.getElementById('contrast-background');
  const ratioEl = document.getElementById('contrast-ratio');
  const preview = document.getElementById('contrast-preview');
  const reco = document.getElementById('contrast-reco');

  const analyze = () => {
    const fg = foreground.value;
    const bg = background.value;
    const ratio = contrastRatio(fg, bg);
    ratioEl.textContent = `${ratio}:1`;
    preview.style.color = fg;
    preview.style.background = bg;
    preview.textContent = 'Thoughtful Tools. Beautifully Engineered.';
    const passesAA = ratio >= 4.5;
    const passesAAA = ratio >= 7;
    reco.innerHTML = `
      <li>${passesAA ? '✓' : '✗'} Meets WCAG AA for normal text</li>
      <li>${passesAAA ? '✓' : '✗'} Meets WCAG AAA for normal text</li>
      <li>Suggested text color on this background: ${recommendTextColor(bg)}</li>
      <li>Try softened accent: ${blend(fg, bg, 0.3)}</li>
    `;
  };

  const swap = () => {
    const fg = foreground.value;
    foreground.value = background.value;
    background.value = fg;
    analyze();
  };

  const reset = () => {
    foreground.value = '#f8f8f8';
    background.value = '#0f0f0f';
    analyze();
  };

  document.getElementById('contrast-run')?.addEventListener('click', analyze);
  document.getElementById('contrast-swap')?.addEventListener('click', swap);
  document.getElementById('contrast-clear')?.addEventListener('click', reset);

  analyze();
}
