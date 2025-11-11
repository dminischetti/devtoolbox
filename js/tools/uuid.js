import { toolPage } from './base.js';
import { handleCopy } from '../ui.js';

export default function renderUuid(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label>UUID v4 stream</label>
        <div id="uuid-stream" class="space-y-2 text-sm font-mono"></div>
      </div>
    `,
    actions: `
      <button class="button-primary" id="uuid-generate" data-run>Generate</button>
      <button class="button-ghost" id="uuid-copy">Copy latest</button>
      <button class="button-ghost" id="uuid-clear" data-clear>Clear history</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Collision insight</h3>
        <p id="uuid-insight">Each UUID has 122 bits of randomness. After generating millions, collisions remain astronomically unlikely.</p>
      </div>
    `,
    notes: 'UUID Generator uses secure crypto to stream IDs, highlighting the newest entry with a glow.'
  });
}

function init() {
  const stream = document.getElementById('uuid-stream');
  const insight = document.getElementById('uuid-insight');

  const generate = () => {
    const uuid = crypto.randomUUID();
    const entry = document.createElement('div');
    entry.textContent = uuid;
    entry.className = 'px-3 py-2 rounded bg-black/30 border border-zinc-500/20 animate-[pulseGlow_1.2s_ease]';
    stream.prepend(entry);
    while (stream.children.length > 5) {
      stream.removeChild(stream.lastChild);
    }
    const generated = Number(stream.dataset.count || 0) + 1;
    stream.dataset.count = generated;
    insight.textContent = `Generated ${generated} UUIDs this session. Collision odds remain at ${(generated / Math.pow(2, 122)).toExponential(2)}.`;
    stream.dataset.latest = uuid;
  };

  const copy = () => {
    const latest = stream.dataset.latest;
    if (latest) {
      handleCopy(latest, 'UUID copied');
    }
  };

  const clear = () => {
    stream.innerHTML = '';
    insight.textContent = 'History cleared. Ready for fresh randomness.';
    delete stream.dataset.latest;
    delete stream.dataset.count;
  };

  document.getElementById('uuid-generate')?.addEventListener('click', generate);
  document.getElementById('uuid-copy')?.addEventListener('click', copy);
  document.getElementById('uuid-clear')?.addEventListener('click', clear);

  generate();
}
