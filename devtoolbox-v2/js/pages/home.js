import { APP_META, getTools } from '../state.js';
import { favoriteButton } from '../ui.js';

export default function renderHome() {
  const featured = getTools().slice(0, 3);
  return `
    <section class="py-24">
      <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center parallax-bg">
        <div>
          <p class="text-sm uppercase tracking-[0.35em] text-indigo-200/70">${APP_META.tagline}</p>
          <h2 class="text-4xl md:text-5xl font-semibold leading-tight mt-6">DevToolbox v2 — A Developer’s Personal Lab</h2>
          <p class="mt-6 text-lg text-indigo-100/90 max-w-2xl">
            An anthology of tools, systems, and design moves crafted for developers who love precision. Every module is offline-first, privacy-respecting, and annotated with intent.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <a href="#/tools" class="button-primary">Explore the Lab</a>
            <a href="#/study" class="button-ghost">Read the Case Study</a>
          </div>
        </div>
        <div class="glass-panel p-10 text-sm space-y-6">
          <div class="flex items-center gap-4">
            <img src="./assets/cover.svg" alt="DevToolbox interface" class="w-20 h-20 rounded-lg object-cover rotating-logo" />
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-indigo-200/60">Mission log</p>
              <h3 class="text-xl font-semibold">Designing for delight and rigor</h3>
            </div>
          </div>
          <p>We obsess over micro-interactions: copy toasts, pulsating validation, and ambient gradients that echo state changes. The lab is a case study in merging engineering discipline with aesthetic sensitivity.</p>
          <ul class="space-y-3 text-indigo-100/80">
            <li>• Bundle budget <strong>&lt; 200 KB</strong>, no tracking scripts.</li>
            <li>• Works entirely offline after first load.</li>
            <li>• Accessible via keyboard with thoughtful focus states.</li>
          </ul>
        </div>
      </div>
    </section>
    <section class="py-20">
      <header class="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 class="text-3xl font-semibold">Featured instruments</h2>
          <p class="text-indigo-100/70 mt-2">A preview of the handcrafted utilities waiting in the lab.</p>
        </div>
        <a href="#/tools" class="button-ghost">View all tools →</a>
      </header>
      <div class="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        ${featured
          .map(
            (tool) => `
              <article class="glass-panel card-tilt">
                <div class="card-inner h-full flex flex-col p-6">
                  <div class="flex items-center gap-4">
                    <img src="${tool.icon}" alt="${tool.name} icon" class="h-10 w-10" />
                    <div>
                      <h3 class="text-lg font-semibold">${tool.name}</h3>
                      <p class="text-xs uppercase tracking-[0.25em] text-indigo-200/60">${tool.category}</p>
                    </div>
                  </div>
                  <p class="mt-5 text-sm leading-relaxed flex-1">${tool.tagline}</p>
                  <div class="mt-6 flex items-center justify-between">
                    <a class="button-ghost" href="#/tools/${tool.slug}">Launch tool</a>
                    ${favoriteButton(tool.slug)}
                  </div>
                </div>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
    <section class="py-20">
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="glass-panel p-8">
          <h3 class="text-xl font-semibold">Case study ready</h3>
          <p class="mt-4 text-sm leading-relaxed">Study the architecture, the performance discipline, and the craft moves that shape DevToolbox. The study page is a narrative that unpacks every design choice.</p>
        </div>
        <div class="glass-panel p-8">
          <h3 class="text-xl font-semibold">Privacy-respecting by default</h3>
          <p class="mt-4 text-sm leading-relaxed">No analytics, no remote calls, no telemetry. Everything runs locally, so sensitive payloads never leave your machine.</p>
        </div>
        <div class="glass-panel p-8">
          <h3 class="text-xl font-semibold">Made for tactile joy</h3>
          <p class="mt-4 text-sm leading-relaxed">Micro-animations, responsive gradients, and careful typography create a sense of tactile delight that rewards exploration.</p>
        </div>
      </div>
    </section>
  `;
}
