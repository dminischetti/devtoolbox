import { APP_META } from '../state.js';

export default function renderStudy() {
  return `
    <article class="py-24 space-y-24">
      <section class="space-y-6">
        <p class="text-sm uppercase tracking-[0.35em] text-indigo-200/70">Case Study</p>
        <h2 class="text-4xl font-semibold">Executive Summary</h2>
        <p class="text-lg text-indigo-100/85 leading-relaxed max-w-3xl">DevToolbox exists to prove that a static site can feel luxurious. It merges precision engineering, privacy-by-design principles, and tactile design patterns into a single toolbox that respects developers and their craft.</p>
        <div class="glass-panel p-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 class="text-xl font-semibold">Mission</h3>
            <p class="mt-3 text-sm leading-relaxed">${APP_META.mission}</p>
          </div>
          <div class="space-y-2 text-sm">
            <p><strong>Tools built:</strong> 14</p>
            <p><strong>Bundle budget:</strong> < 200 KB, zero analytics</p>
            <p><strong>Latency goal:</strong> First paint under 1 second on mid-tier laptops.</p>
          </div>
        </div>
      </section>

      <section class="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold">Design Philosophy</h2>
          <p class="leading-relaxed text-indigo-100/85">Simplicity is an act of empathy. The interface leans on calm gradients, crisp typography, and motion that responds to users. Every tool uses consistent layouts — header, workspace, output — so muscle memory kicks in quickly.</p>
          <ul class="space-y-3 text-sm text-indigo-100/80">
            <li>• Minimal chrome, maximum clarity.</li>
            <li>• Micro-animations cue state changes and reward mastery.</li>
            <li>• Dark mode by default, light mode for sunlit studios.</li>
          </ul>
        </div>
        <div class="glass-panel p-8">
          <h3 class="text-lg font-semibold">UX Tenets</h3>
          <ol class="mt-4 space-y-3 text-sm opacity-90">
            <li>1. Make actions obvious and reversible.</li>
            <li>2. Give copy feedback instantly.</li>
            <li>3. Celebrate success with pulses, not fireworks.</li>
          </ol>
        </div>
      </section>

      <section class="space-y-8">
        <h2 class="text-3xl font-semibold">Architecture</h2>
        <div class="glass-panel p-8">
          <svg viewBox="0 0 800 360" class="w-full h-auto" role="img" aria-label="Architecture diagram">
            <defs>
              <linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7f5bff" />
                <stop offset="100%" stop-color="#40c9ff" />
              </linearGradient>
            </defs>
            <rect x="40" y="40" width="720" height="280" rx="24" fill="rgba(255,255,255,0.04)" stroke="rgba(127,91,255,0.4)" />
            <g class="architecture" fill="none" stroke="url(#moduleGradient)" stroke-width="2.5">
              <rect x="80" y="80" width="200" height="120" rx="18" fill="rgba(127, 91, 255, 0.08)" />
              <rect x="320" y="80" width="200" height="120" rx="18" fill="rgba(64, 201, 255, 0.08)" />
              <rect x="560" y="80" width="160" height="120" rx="18" fill="rgba(120, 98, 255, 0.08)" />
              <rect x="200" y="220" width="400" height="80" rx="18" fill="rgba(255,255,255,0.05)" />
              <path d="M280 140 H320" /><path d="M520 140 H560" /><path d="M400 200 V220" />
            </g>
            <g fill="rgba(255,255,255,0.8)" font-family="Inter" font-size="16" text-anchor="middle">
              <text x="180" y="150">Router &amp; State</text>
              <text x="420" y="150">UI Components</text>
              <text x="640" y="150">Service Worker</text>
              <text x="400" y="270">Tools Modules</text>
            </g>
          </svg>
          <p class="mt-6 text-sm leading-relaxed text-indigo-100/80">The router listens to hash changes and hydrates pages lazily. Tools are ES modules loaded on demand. The service worker caches the shell, while utilities manage persistence, time, color math, and copy feedback.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Performance Strategy</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed">
          <p>Lazy-load each tool module only when launched to keep initial load lean. No bundler, no frameworks — just vanilla ES modules and Tailwind CDN. Animations use transform/opacity for 60 FPS results.</p>
          <p>First paint target was < 1 second on a 2019 MacBook Air served locally. We optimized by using CSS gradients instead of heavy imagery and by caching sample data.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Security &amp; Privacy</h2>
        <div class="glass-panel p-8 text-sm leading-relaxed space-y-3">
          <p>No external requests after load. Tools like JWT Lens and JSON Doctor operate entirely client-side. There is no eval, no remote logging, and sensitive examples stay local.</p>
          <p>Favorites and theme state live in localStorage. Service worker uses stale-while-revalidate to keep assets fresh without blocking.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">UX System</h2>
        <div class="grid gap-8 lg:grid-cols-2">
          <div class="glass-panel p-8 text-sm leading-relaxed space-y-3">
            <p>Hover tilt hints at depth, copy toasts confirm actions, and validation pulses celebrate success. A glowing cursor ring follows focusable elements for keyboard users.</p>
            <p>Markdown previews, diff highlights, and SQL formatting share design patterns so users know where to look for results.</p>
          </div>
          <div class="glass-panel p-8 text-sm leading-relaxed space-y-3">
            <p>Inline GIF previews demonstrate the microinteractions (stored locally to respect privacy). Sticky headers and progressive disclosure keep content digestible.</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Design Evolution Timeline</h2>
        <div class="relative pl-8 border-l border-indigo-500/40 space-y-6 text-sm">
          <div>
            <h3 class="font-semibold">Week 1 — Sketching rituals</h3>
            <p class="text-indigo-100/80">Notebook explorations of card tilts, color palettes, and how to reduce cognitive load.</p>
          </div>
          <div>
            <h3 class="font-semibold">Week 2 — Interaction choreography</h3>
            <p class="text-indigo-100/80">Prototype of copy toasts, keyboard flows, and cron translator microcopy.</p>
          </div>
          <div>
            <h3 class="font-semibold">Week 3 — Performance passes</h3>
            <p class="text-indigo-100/80">Audit for unused CSS, removed blocking assets, and tested offline-first caching.</p>
          </div>
          <div>
            <h3 class="font-semibold">Week 4 — Case study polish</h3>
            <p class="text-indigo-100/80">Animated architecture diagram, timeline narrative, and signature moment.</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Testing &amp; Resilience</h2>
        <div class="glass-panel p-8 text-sm leading-relaxed space-y-3">
          <p>Manual testing covered keyboard navigation, offline mode, JSON schema validation, diff accuracy, and cron translation edge cases. A11y pass ensured color contrast and focus visibility.</p>
          <p>Fallback messages handle malformed inputs gracefully, nudging users with friendly, human language.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Future Vision (v3)</h2>
        <div class="glass-panel p-8 text-sm leading-relaxed space-y-3">
          <p>Integrate WASM-powered parsers for YAML, TOML, and protobuf. Add sandboxed code runners for isolated experimentation. Invite AI-assisted prompts to suggest regex tweaks, SQL optimizations, and schema migrations.</p>
        </div>
      </section>

      <section class="space-y-6 text-center">
        <blockquote class="text-2xl font-semibold text-indigo-100/90">“Every small tool hides a big idea. — Dominic Minischetti”</blockquote>
        <p class="text-sm opacity-80">Crafted with care by Dominic Minischetti · <a class="underline" href="https://minischetti.org" target="_blank" rel="noopener">minischetti.org</a> · <a class="underline" href="mailto:dominic.minischetti@gmail.com">dominic.minischetti@gmail.com</a></p>
      </section>
    </article>
  `;
}
