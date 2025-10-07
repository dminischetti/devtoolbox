import { toolPage } from './base.js';
import { escapeHtml } from '../utils/strings.js';

export default function renderMarkdown(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="md-input">Markdown</label>
        <textarea id="md-input" rows="12"># Hello Lab\n\n- Crafted utilities\n- Offline by design</textarea>
      </div>
    `,
    actions: `
      <button class="button-primary" id="md-run" data-run>Render</button>
      <button class="button-ghost" id="md-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Preview</h3>
        <article id="md-preview" class="prose prose-invert max-w-none"></article>
      </div>
    `,
    notes: 'Markdown Renderer outputs a refined preview using semantic HTML elements and tasteful typography.'
  });
}

function init() {
  const input = document.getElementById('md-input');
  const preview = document.getElementById('md-preview');

  const render = () => {
    preview.innerHTML = parseMarkdown(input.value);
  };

  const clear = () => {
    input.value = '';
    preview.innerHTML = '';
  };

  document.getElementById('md-run')?.addEventListener('click', render);
  document.getElementById('md-clear')?.addEventListener('click', clear);

  render();
}

function parseMarkdown(text) {
  const lines = text.split('\n');
  const html = [];
  let list = [];
  const flushList = () => {
    if (list.length) {
      html.push('<ul>' + list.join('') + '</ul>');
      list = [];
    }
  };
  lines.forEach((line) => {
    if (line.startsWith('# ')) {
      flushList();
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      flushList();
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith('- ')) {
      list.push(`<li>${escapeHtml(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      flushList();
      html.push('<p class="h-4"></p>');
    } else {
      flushList();
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  });
  flushList();
  return html.join('\n');
}
