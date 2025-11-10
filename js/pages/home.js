import { APP_META, getTools } from '../state.js';
import { favoriteButton } from '../ui.js';

const PREVIEW_CONTENT = {
  regex: {
    summary: 'Experiment with expressive patterns while the toolbox narrates each capture and flag in plain language.',
    bullets: [
      'Highlight matches inline as you type to see context instantly.',
      'Toggle flags, lookaheads, and lookbehinds with one tap.',
      'Generate shareable snippets without leaking your test data.'
    ],
    input: {
      language: 'language-javascript',
      code: `const pattern = /(?<=ID-\\d{2}-)[A-Z]+/g;\nconst sample = 'Tickets: ID-01-ALPHA, ID-02-BETA';`
    },
    output: {
      language: 'language-javascript',
      code: `sample.match(pattern);\n// → ['ALPHA', 'BETA']`
    },
    note: 'DevToolbox surfaces lookbehinds and capture groups with color-coded badges so debugging stays visual.'
  },
  json: {
    summary: 'Inspect payloads with schema-aware validation, diff views, and copy-ready formatting.',
    bullets: [
      'Pretty-print deeply nested objects with collapsible keys.',
      'Validate locally against JSON Schema and highlight failing paths.',
      'Compare against a previous snapshot to see intent drift.'
    ],
    input: {
      language: 'language-json',
      code: `{"name": "DevToolbox",\n "offline": true,\n "tools": 14}`
    },
    output: {
      language: 'language-javascript',
      code: `JSON.parse(payload);\n// ✓ Valid JSON\n// 3 keys, 1 boolean, 1 number`
    },
    note: 'Trailing commas, stray comments, and UTF-8 quirks are detected before they cause runtime failures.'
  },
  jwt: {
    summary: 'Decode tokens entirely offline with algorithm hints, claim insights, and expiry countdowns.',
    bullets: [
      'Split header, payload, and signature without pinging remote APIs.',
      'Warn on insecure algorithms and visualize clock skew.',
      'Copy individual claims with keyboard shortcuts for quick reuse.'
    ],
    input: {
      language: 'language-javascript',
      code: `const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';`
    },
    output: {
      language: 'language-json',
      code: `{"sub": "devtoolbox",\n "iat": 1700000000,\n "scopes": ["read", "write"]}`
    },
    note: 'The countdown badge keeps expiry visible while sensitive data remains redacted in-place.'
  },
  base64: {
    summary: 'Translate payloads across encodings with byte-level clarity and automatic padding fixes.',
    bullets: [
      'Detect URL-safe alphabets and normalize padding automatically.',
      'Expose UTF-8 breakdowns so emoji and multi-byte characters make sense.',
      'Switch between raw bytes, Base64, and JSON without losing fidelity.'
    ],
    input: {
      language: 'language-javascript',
      code: `base64.decode('eyJ0b29sIjogIkRldlRvb2xib3gifQ==');`
    },
    output: {
      language: 'language-javascript',
      code: `// → { "tool": "DevToolbox" }`
    },
    note: 'Padding indicators light up when input is incomplete, helping you recover truncated payloads quickly.'
  },
  uuid: {
    summary: 'Generate collision-resistant identifiers ready for logs, seeds, and distributed systems.',
    bullets: [
      'Stream v4 UUIDs with clipboard-ready formatting and uppercase toggles.',
      'Surface collision probabilities so stakeholders trust the math.',
      'Seed deterministic v5 identifiers with namespace helpers.'
    ],
    input: {
      language: 'language-javascript',
      code: `crypto.randomUUID();\n// → '8ab1fdb1-6d1a-4a27-9104-e87de88c3dc1'`
    },
    output: {
      language: 'language-javascript',
      code: `entropy ≈ 122 bits\nrisk (1k ids) ≈ 4.2e-18`
    },
    note: 'Format toggles keep parity with platform conventions—uppercase, lowercase, or wrapped in braces.'
  },
  hash: {
    summary: 'Digest payloads with Web Crypto while comparing SHA variants in parallel.',
    bullets: [
      'Stream SHA-256, SHA-384, and SHA-512 without blocking the UI thread.',
      'Copy hex or Base64 results without leaving the keyboard.',
      'Visualize input byte length against digest length for quick audits.'
    ],
    input: {
      language: 'language-javascript',
      code: `await digest('SHA-256', 'glassmorphic lab');`
    },
    output: {
      language: 'language-javascript',
      code: `// → 7d9185a4ac0f90c7e0a0dd…`
    },
    note: 'Everything runs client-side so your secrets never leave the browser session.'
  }
};

function getPreviewDetails(tool) {
  const fallback = {
    summary: tool.tagline,
    bullets: [tool.description],
    input: {
      language: 'language-javascript',
      code: `// ${tool.name} is ready in DevToolbox.\nlaunch('${tool.slug}');`
    },
    output: {
      language: 'language-javascript',
      code: `// Explore ${tool.name} for deeper insight.`
    },
    note: tool.tip
  };
  return { ...fallback, ...PREVIEW_CONTENT[tool.slug] };
}

export default function renderHome() {
  const tools = getTools();
  const featured = tools.slice(0, 6);
  const initialTool = featured[0] || tools[0];
  const initialDetails = initialTool ? getPreviewDetails(initialTool) : null;
  const initialInput = initialDetails?.input?.code || '';
  const initialOutput = initialDetails?.output?.code || '';
  const initialInputLanguage = initialDetails?.input?.language || 'language-javascript';
  const initialOutputLanguage = initialDetails?.output?.language || 'language-javascript';

  setTimeout(() => initHomeInteractions(tools), 0);

  return `
    <section class="hero">
      <div class="shell hero__inner">
        <div class="hero-card">
          <p class="hero-eyebrow">Calm, powerful developer instruments</p>
          <h2 class="hero-title">DevToolbox is a lab for curious builders.</h2>
          <p class="hero-copy">${APP_META.mission}</p>
          <div class="hero-actions">
            <a class="btn" href="#/tools">Launch the toolbox</a>
            <a class="button-ghost" href="#/study">Read the case study</a>
          </div>
          <div class="hero-badges" role="list">
            <span class="hero-badge" role="listitem">Offline first</span>
            <span class="hero-badge" role="listitem">Keyboard native</span>
            <span class="hero-badge" role="listitem">Privacy safe</span>
          </div>
        </div>
        <div class="highlight-grid" aria-label="Highlights">
          <div class="highlight-card">
            <strong>14 handcrafted tools</strong>
            <span>Regex, JWTs, SQL, Markdown, and more — all unified by a glassy UI language.</span>
          </div>
          <div class="highlight-card">
            <strong>Responsive &amp; inclusive</strong>
            <span>Fluid typography, accessible focus states, and light/dark modes that remember your choice.</span>
          </div>
          <div class="highlight-card">
            <strong>Zero telemetry</strong>
            <span>Everything runs locally with service-worker caching and copy feedback that stays private.</span>
          </div>
        </div>
      </div>
    </section>
    <section class="tool-catalog" id="tool-catalog">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="section-heading__label">Tool catalog</p>
            <h2 class="section-heading__title">Explore the instruments</h2>
          </div>
          <a class="button-ghost" href="#/tools">Browse all tools</a>
        </div>
        <div class="tool-grid" role="list">
          ${featured
            .map((tool, index) => {
              return `
                <article class="tool-card${index === 0 ? ' is-active' : ''}" data-tool-card data-slug="${tool.slug}" role="listitem" tabindex="0">
                  <div class="tool-card__header">
                    <span class="tool-card__icon" aria-hidden="true">
                      <img src="${tool.icon}" alt="" />
                    </span>
                    <div class="tool-card__meta">
                      <h3 class="tool-card__title">${tool.name}</h3>
                      <span class="tool-card__tag">${tool.category}</span>
                    </div>
                  </div>
                  <p class="tool-card__copy">${tool.description}</p>
                  <div class="tool-card__actions">
                    <button class="button-ghost" type="button" data-tool-modal="${tool.slug}">Quick look</button>
                    <a class="btn" href="#/tools/${tool.slug}">Launch</a>
                  </div>
                  <div class="tool-card__footer">${tool.tip}</div>
                </article>
              `;
            })
            .join('')}
        </div>
      </div>
    </section>
    <section class="tool-preview" aria-labelledby="tool-preview-heading">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="section-heading__label">Live detail</p>
            <h2 class="section-heading__title" id="tool-preview-heading">Deep dive without leaving the page</h2>
          </div>
        </div>
      </div>
      <div class="shell">
        <div class="tool-preview__surface" id="tool-preview" role="region" aria-live="polite" data-active="${initialTool?.slug || ''}">
          <div class="preview-meta">
            <span class="preview-meta__tag" id="preview-category">${initialTool?.category || ''}</span>
            <h3 class="preview-meta__title" id="preview-title">${initialTool?.name || ''}</h3>
            <p class="preview-meta__copy" id="preview-summary">${initialDetails?.summary || ''}</p>
            <ul class="preview-meta__list" id="preview-bullets">
              ${(initialDetails?.bullets || [])
                .map((bullet) => `<li>${bullet}</li>`)
                .join('')}
            </ul>
            <div class="preview-meta__controls">
              <a class="btn" id="preview-launch" href="#/tools/${initialTool?.slug || ''}">Open ${initialTool?.name || 'tool'}</a>
              <button class="button-ghost" id="preview-quick" type="button" data-tool-modal="${initialTool?.slug || ''}">Quick look</button>
              <span id="preview-favorite">${initialTool ? favoriteButton(initialTool.slug) : ''}</span>
            </div>
          </div>
          <div class="preview-sandbox" id="preview-sandbox">
            <div class="code-block">
              <button type="button" data-copy="${initialInput.replace(/`/g, '\`')}" data-message="Copied sample input">Copy input</button>
              <pre id="preview-input" class="${initialInputLanguage}"><code id="preview-input-code" class="${initialInputLanguage}">${initialInput}</code></pre>
            </div>
            <div class="code-block">
              <button type="button" data-copy="${initialOutput.replace(/`/g, '\`')}" data-message="Copied output">Copy output</button>
              <pre id="preview-output" class="${initialOutputLanguage}"><code id="preview-output-code" class="${initialOutputLanguage}">${initialOutput}</code></pre>
            </div>
            <p class="preview-meta__copy" id="preview-note">${initialDetails?.note || ''}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="architecture" aria-labelledby="architecture-heading">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="section-heading__label">How it works</p>
            <h2 class="section-heading__title" id="architecture-heading">A lightweight architecture diagram</h2>
          </div>
        </div>
        <div class="architecture__grid" data-observe>
          <div class="architecture-graph">
            <div class="architecture-node">
              <strong>UI Shell</strong>
              <span>Glassmorphic layout, responsive grid, and persistent navigation.</span>
            </div>
            <div class="architecture-node">
              <strong>Router &amp; State</strong>
              <span>Hash-based navigation keeps the app static yet dynamic.</span>
            </div>
            <div class="architecture-node">
              <strong>Tool Modules</strong>
              <span>Lazy-loaded ES modules give each tool its own sandbox.</span>
            </div>
            <div class="architecture-node">
              <strong>Service Worker</strong>
              <span>Offline caching, persistent favorites, and zero telemetry.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="docs" aria-labelledby="docs-heading">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="section-heading__label">Guides</p>
            <h2 class="section-heading__title" id="docs-heading">Documentation at your fingertips</h2>
          </div>
        </div>
        <div class="tabs" id="docs-tabs">
          <div class="tablist" role="tablist" aria-label="Documentation">
            ${['Overview', 'API', 'Examples', 'FAQ']
              .map((label, index) => `
                <button class="tab-trigger" role="tab" id="tab-${label.toLowerCase()}" data-tab-target="panel-${label.toLowerCase()}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}">${label}</button>
              `)
              .join('')}
          </div>
          <div class="tab-panel" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" aria-hidden="false">
            <p>DevToolbox is a static, offline-ready lab of developer utilities. Each tool embraces the same interaction patterns: focus on the input, run with <kbd>⌘/Ctrl + Enter</kbd>, copy output instantly, and celebrate with subtle glow feedback.</p>
            <ul>
              <li>Unified dark theme with high-contrast neutral grays.</li>
              <li>Glass panels use <code>backdrop-filter</code> when available and gracefully degrade otherwise.</li>
              <li>Motion respects <code>prefers-reduced-motion</code> and falls back to instant state changes.</li>
            </ul>
          </div>
          <div class="tab-panel" id="panel-api" role="tabpanel" aria-labelledby="tab-api" aria-hidden="true">
            <p>The client API is intentionally tiny — perfect for extending the lab with new instruments.</p>
            <div class="code-block">
              <button type="button" data-copy="import { registerTool } from 'devtoolbox';\n\nregisterTool({\n  slug: 'slug',\n  name: 'Display Name',\n  module: () => import('./tools/slug.js')\n});" data-message="Copied API snippet">Copy snippet</button>
              <pre class="language-javascript"><code class="language-javascript">import { registerTool } from 'devtoolbox';

registerTool({
  slug: 'slug',
  name: 'Display Name',
  module: () => import('./tools/slug.js')
});</code></pre>
            </div>
            <p>Tools receive a <code>tool</code> definition object and return markup; the router handles transitions and toasts.</p>
          </div>
          <div class="tab-panel" id="panel-examples" role="tabpanel" aria-labelledby="tab-examples" aria-hidden="true">
            <p>Need inspiration? Try these quick wins.</p>
            <ul>
              <li><strong>Regex Explorer:</strong> Paste log files and watch named groups animate into focus.</li>
              <li><strong>JWT Lens:</strong> Upload a token and the lab warns about algorithm downgrades.</li>
              <li><strong>Contrast Lab:</strong> Drop brand colors to see AA/AAA compliance instantly.</li>
            </ul>
          </div>
          <div class="tab-panel" id="panel-faq" role="tabpanel" aria-labelledby="tab-faq" aria-hidden="true">
            <p><strong>Does it work offline?</strong> Yes — the service worker caches the shell after the first visit.</p>
            <p><strong>Is my data safe?</strong> Absolutely. No telemetry, no network calls, and local storage stays on your device.</p>
            <p><strong>How do I contribute?</strong> Fork the repo, add a tool module, and document the experience on the study page.</p>
          </div>
        </div>
      </div>
    </section>
    <div class="tool-modal" id="tool-modal" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="tool-modal__backdrop" data-close-modal></div>
      <div class="tool-modal__dialog" role="document">
        <button class="tool-modal__close" type="button" data-close-modal aria-label="Close quick look">×</button>
        <div class="tool-modal__header">
          <img id="modal-icon" alt="" />
          <div class="tool-modal__meta">
            <span id="modal-category"></span>
            <h3 id="modal-title"></h3>
          </div>
        </div>
        <div class="tool-modal__body" id="modal-body"></div>
        <div class="preview-sandbox">
          <div class="code-block">
            <button type="button" id="modal-copy-input" data-message="Copied input">Copy input</button>
            <pre id="modal-input" class="language-javascript"><code id="modal-input-code" class="language-javascript"></code></pre>
          </div>
          <div class="code-block">
            <button type="button" id="modal-copy-output" data-message="Copied output">Copy output</button>
            <pre id="modal-output" class="language-javascript"><code id="modal-output-code" class="language-javascript"></code></pre>
          </div>
        </div>
        <div class="tool-modal__footer">
          <a class="btn" id="modal-launch" href="#/tools">Open tool</a>
          <button class="button-ghost" type="button" data-close-modal>Close</button>
        </div>
      </div>
    </div>
  `;
}

function initHomeInteractions(tools) {
  const cards = Array.from(document.querySelectorAll('[data-tool-card]'));
  const preview = document.getElementById('tool-preview');
  const previewCategory = document.getElementById('preview-category');
  const previewTitle = document.getElementById('preview-title');
  const previewSummary = document.getElementById('preview-summary');
  const previewBullets = document.getElementById('preview-bullets');
  const previewLaunch = document.getElementById('preview-launch');
  const previewQuick = document.getElementById('preview-quick');
  const previewFavorite = document.getElementById('preview-favorite');
  const previewInput = document.getElementById('preview-input');
  const previewInputCode = document.getElementById('preview-input-code');
  const previewOutput = document.getElementById('preview-output');
  const previewOutputCode = document.getElementById('preview-output-code');
  const previewNote = document.getElementById('preview-note');

  if (!preview) return;

  const selectCard = (slug) => {
    cards.forEach((card) => {
      card.classList.toggle('is-active', card.dataset.slug === slug);
    });
  };

  const updatePreview = (slug) => {
    const tool = tools.find((item) => item.slug === slug) || tools[0];
    if (!tool) return;
    const details = getPreviewDetails(tool);
    preview.dataset.active = slug;
    previewCategory.textContent = tool.category;
    previewTitle.textContent = tool.name;
    previewSummary.textContent = details.summary;
    previewBullets.innerHTML = details.bullets.map((item) => `<li>${item}</li>`).join('');
    previewLaunch.href = `#/tools/${tool.slug}`;
    previewLaunch.textContent = `Open ${tool.name}`;
    previewQuick.dataset.toolModal = tool.slug;
    previewFavorite.innerHTML = favoriteButton(tool.slug);

    previewInput.className = details.input.language;
    previewInputCode.className = details.input.language;
    previewInputCode.textContent = details.input.code;
    previewInput.previousElementSibling?.setAttribute('data-copy', details.input.code);

    previewOutput.className = details.output.language;
    previewOutputCode.className = details.output.language;
    previewOutputCode.textContent = details.output.code;
    previewOutput.previousElementSibling?.setAttribute('data-copy', details.output.code);

    previewNote.textContent = details.note;

    selectCard(tool.slug);

    if (window.Prism) {
      window.Prism.highlightAllUnder(preview);
    }
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => updatePreview(card.dataset.slug));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        updatePreview(card.dataset.slug);
      }
    });
  });

  const modal = document.getElementById('tool-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalInput = document.getElementById('modal-input');
  const modalInputCode = document.getElementById('modal-input-code');
  const modalOutput = document.getElementById('modal-output');
  const modalOutputCode = document.getElementById('modal-output-code');
  const modalCopyInput = document.getElementById('modal-copy-input');
  const modalCopyOutput = document.getElementById('modal-copy-output');
  const modalLaunch = document.getElementById('modal-launch');
  let modalReturnFocus = null;

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
    if (modalReturnFocus) {
      modalReturnFocus.focus();
      modalReturnFocus = null;
    }
  };

  const openModal = (slug, trigger) => {
    if (!modal) return;
    const tool = tools.find((item) => item.slug === slug) || tools[0];
    if (!tool) return;
    const details = getPreviewDetails(tool);
    modalReturnFocus = trigger || null;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalIcon.src = tool.icon;
    modalIcon.alt = `${tool.name} icon`;
    modalCategory.textContent = tool.category;
    modalTitle.textContent = tool.name;
    modalBody.textContent = details.summary;

    modalInput.className = details.input.language;
    modalInputCode.className = details.input.language;
    modalInputCode.textContent = details.input.code;
    modalCopyInput?.setAttribute('data-copy', details.input.code);

    modalOutput.className = details.output.language;
    modalOutputCode.className = details.output.language;
    modalOutputCode.textContent = details.output.code;
    modalCopyOutput?.setAttribute('data-copy', details.output.code);

    modalLaunch.href = `#/tools/${tool.slug}`;
    modalLaunch.textContent = `Open ${tool.name}`;

    const closeButton = modal.querySelector('.tool-modal__close');
    closeButton?.focus();

    if (window.Prism) {
      window.Prism.highlightAllUnder(modal);
    }
  };

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.closeModal !== undefined) {
        closeModal();
      }
    });
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  const quickLookTriggers = Array.from(document.querySelectorAll('[data-tool-modal]'));
  quickLookTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      openModal(trigger.getAttribute('data-tool-modal'), trigger);
    });
  });

  const observerTarget = document.querySelector('[data-observe]');
  if (observerTarget) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(observerTarget);
  }

  const tabTriggers = Array.from(document.querySelectorAll('.tab-trigger'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  const activateTab = (nextTab) => {
    tabTriggers.forEach((tab) => {
      const selected = tab === nextTab;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });
    tabPanels.forEach((panel) => {
      const hidden = panel.id !== nextTab.dataset.tabTarget;
      panel.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      if (!hidden && window.Prism) {
        window.Prism.highlightAllUnder(panel);
      }
    });
    nextTab.focus();
  };

  tabTriggers.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + direction + tabTriggers.length) % tabTriggers.length;
        activateTab(tabTriggers[nextIndex]);
      }
    });
  });

  const activeSlug = preview.dataset.active;
  if (activeSlug) {
    updatePreview(activeSlug);
  }
}
