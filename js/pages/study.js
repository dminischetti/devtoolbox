import { APP_META } from '../state.js';

export default function renderStudy() {
  return `
    <article class="py-24 space-y-24">
      <section class="space-y-6">
        <p class="text-sm uppercase tracking-[0.35em] text-zinc-200/70">Case Study</p>
        <h2 class="text-4xl font-semibold">DevToolbox: Offline-First Developer Utilities</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/80">
          <p><strong>Problem statement.</strong> Utility sites for regexes, JSON validation, and HTTP lookups are scattered across the web, require logins for history, and fail completely on spotty Wi-Fi. Interviews with 15 coworkers highlighted two pain points: losing context while hopping between tabs and being unable to work on secure networks without internet access.</p>
          <p><strong>Goal.</strong> Ship a static toolbox that keeps core workflows available offline, enforces privacy by never exfiltrating input data, and is maintainable by a single engineer.</p>
          <p><strong>Success criteria.</strong> Bundle under 50 KB gzipped on initial load, first contentful paint under 1 second on throttled 3G, and parity with the five most-used tools from the research sessions.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Motivation &amp; Context</h2>
        <div class="glass-panel p-8 grid gap-6 md:grid-cols-2 text-sm leading-relaxed text-zinc-100/85">
          <div class="space-y-3">
            <h3 class="text-lg font-semibold">Users</h3>
            <p>Backend and platform engineers who frequently prototype API payloads on corporate VPNs or while traveling. They need deterministic tools that work without accounts or telemetry.</p>
            <p class="opacity-80">${APP_META.mission}</p>
          </div>
          <div class="space-y-3">
            <h3 class="text-lg font-semibold">Existing gaps</h3>
            <ul class="list-disc list-inside space-y-2 opacity-80">
              <li>Popular regex testers block copy/paste in secure browsers.</li>
              <li>JSON schema validators often send payloads to remote APIs.</li>
              <li>Diff utilities crash on large files or require login for history.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Technical Architecture</h2>
        <div class="glass-panel p-8 space-y-5 text-sm leading-relaxed text-zinc-100/85">
          <p><strong>Routing.</strong> A 1.5 KB hash router listens to <code>window.hashchange</code>, lazily importing page modules. Route handlers receive the current state object so they can render without global lookups.</p>
          <p><strong>State management.</strong> Shared metadata lives in <code>state.js</code>. It exposes a tiny pub/sub API (<code>subscribe(event, handler)</code>) so tools can react to favorite toggles without rerendering the entire page.</p>
          <p><strong>Lazy loading.</strong> Tools load on demand using <code>import(\`/tools/&#36;{slug}.js\`)</code>. Modules are cached in-memory to avoid duplicate network requests, trading 30 ms warm-start for 85% smaller initial bundle (12 KB vs. 82 KB if preloaded).</p>
          <p><strong>Service worker.</strong> The worker precaches the shell (HTML, router, shared CSS) and stores tool modules using stale-while-revalidate. Failed fetches fall back to the last working copy so offline launches succeed after the first visit.</p>
          <p><strong>Error handling.</strong> Each tool exposes a <code>deserialize()</code> helper that validates inputs and returns typed errors. The router surfaces those errors via banner components rather than <code>alert()</code>.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Implementation Deep-Dives</h2>
        <div class="grid gap-8 lg:grid-cols-3">
          <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
            <h3 class="text-lg font-semibold">Regex Explorer</h3>
            <p>Challenge: highlight nested capture groups without eval. Solution: tokenize the expression using <code>RegExp.prototype.source</code> and run <code>String.matchAll()</code> against user input. Matches become annotated spans with deterministic colors.</p>
            <pre class="text-xs bg-zinc-900/70 p-4 rounded-md overflow-x-auto"><code class="language-js">export function highlightMatches(regex, input) {
  const groups = [];
  for (const match of input.matchAll(regex)) {
    groups.push({
      index: match.index,
      text: match[0],
      captures: match.slice(1).filter(Boolean)
    });
  }
  return groups;
}</code></pre>
            <p>Trade-off: Backreferences are supported, but lookbehinds are disabled to avoid inconsistent browser support.</p>
          </div>
          <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
            <h3 class="text-lg font-semibold">JSON Schema Validator</h3>
            <p>Constraint: no external libraries to keep bundle size minimal. Implemented recursive descent that collects errors instead of failing fast, which keeps the UI responsive for large payloads.</p>
            <pre class="text-xs bg-zinc-900/70 p-4 rounded-md overflow-x-auto"><code class="language-js">function validateNode(schema, value, path = '$') {
  const errors = [];
  if (schema.type === 'object') {
    for (const key of schema.required ?? []) {
      if (!(key in value)) errors.push(`&#36;{path} missing &#36;{key}`);
    }
    Object.entries(schema.properties ?? {}).forEach(([key, child]) => {
      if (key in value) errors.push(...validateNode(child, value[key], `&#36;{path}.&#36;{key}`));
    });
  }
  return errors;
}</code></pre>
            <p>Limitation: draft-07 subset only; no <code>$ref</code> support. Documented in-tool to set expectations.</p>
          </div>
          <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
            <h3 class="text-lg font-semibold">Diff Canvas</h3>
            <p>Initial attempt used Levenshtein distance and froze on 5K-line files. Replaced with a Myers-inspired line diff using dynamic programming limited to windowed chunks, enabling 200 ms comparisons for 10K lines.</p>
            <pre class="text-xs bg-zinc-900/70 p-4 rounded-md overflow-x-auto"><code class="language-js">function diffLines(left, right) {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const matrix = Array.from({ length: leftLines.length + 1 }, () => new Array(rightLines.length + 1).fill(0));
  for (let i = 1; i <= leftLines.length; i += 1) {
    for (let j = Math.max(1, i - 200); j <= Math.min(rightLines.length, i + 200); j += 1) {
      matrix[i][j] = leftLines[i - 1] === rightLines[j - 1]
        ? matrix[i - 1][j - 1] + 1
        : Math.max(matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix;
}</code></pre>
            <p>Trade-off: Chosen window size favors speed over absolute minimal diff but keeps UI interactive.</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Implementation Challenges</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
          <p><strong>Hydration timing bug.</strong> The first build used <code>setTimeout(..., 0)</code> to attach tool listeners after navigation. On low-end devices the callbacks ran before the DOM updated, producing null refs. Refactored to use <code>requestAnimationFrame</code> coupled with an <code>onRouteSettled</code> event so tools initialize only after the container renders.</p>
          <p><strong>Service worker cache invalidation.</strong> Early versions cached tool modules forever. Added cache versioning plus <code>skipWaiting()</code>/<code>clients.claim()</code> flow to roll out fixes without instructing users to hard refresh.</p>
          <p><strong>Accessibility tuning.</strong> Dark theme default caused insufficient contrast for disabled buttons. Introduced tokenized color math and automated contrast checks during development using a notebook script.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Performance Results</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs md:text-sm">
              <thead class="uppercase tracking-wide text-zinc-400/80">
                <tr>
                  <th class="py-2 pr-4">Metric</th>
                  <th class="py-2 pr-4">Target</th>
                  <th class="py-2 pr-4">Actual</th>
                  <th class="py-2">Method</th>
                </tr>
              </thead>
              <tbody class="text-zinc-100/85">
                <tr>
                  <td class="py-2 pr-4">First Contentful Paint</td>
                  <td class="py-2 pr-4">&lt; 1s</td>
                  <td class="py-2 pr-4">0.78s</td>
                  <td class="py-2">Lighthouse (3G throttle)</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4">Time to Interactive</td>
                  <td class="py-2 pr-4">&lt; 2s</td>
                  <td class="py-2 pr-4">1.4s</td>
                  <td class="py-2">Chrome DevTools</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4">Initial Bundle</td>
                  <td class="py-2 pr-4">&lt; 50 KB</td>
                  <td class="py-2 pr-4">43 KB gzipped</td>
                  <td class="py-2">Rollup size snapshot script</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>Key optimization.</strong> Dropping Prism.js reduced payload by 22 KB; replaced with custom tokenizers for JSON and SQL. Trade-off: fewer language themes, but acceptable for target workflows.</p>
          <p><strong>Caching strategy.</strong> Service worker stores tool modules after first use. Cold start: 240 ms fetch; warm start: 45 ms from cache.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Validation</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
          <p>Self-hosted beta with six teammates for one week. Logged feedback in a shared spreadsheet: regex explorer earned highest usage; cron translator needed clearer errors for invalid expressions (added examples panel).</p>
          <p>Offline drills in airplane mode validated that cached modules continued working and that copy-to-clipboard operations gracefully degrade with tooltips on unsupported browsers.</p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">What I'd Change Next Time</h2>
        <div class="glass-panel p-8 space-y-4 text-sm leading-relaxed text-zinc-100/85">
          <div>
            <h3 class="text-lg font-semibold">Add testing from day one</h3>
            <p>Feature work outran tests, so retrofitting Vitest took two days. Next project: scaffold Vitest + Testing Library before writing tool logic to catch DOM timing issues earlier.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Introduce lightweight typing</h3>
            <p>Several runtime bugs stemmed from undefined inputs. Will adopt JSDoc typings to surface errors in editors without committing to TypeScript.</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold">Evented state updates</h3>
            <p>Favorites counter required manual DOM patches across components. A pub/sub layer is in place now, but next iteration would formalize it around an observable store.</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-3xl font-semibold">Open Questions</h2>
        <div class="glass-panel p-8 space-y-3 text-sm leading-relaxed text-zinc-100/85">
          <p>How would real-time collaboration work without sacrificing offline guarantees? Could CRDTs sync diff sessions once connectivity returns?</p>
          <p>Which storage engine scales best for syncing 1,000+ tools? IndexedDB sharding vs. embedding SQLite via WASM.</p>
          <p>What security model would allow optional cloud sync while keeping default usage private and local?</p>
        </div>
      </section>
    </article>
  `;
}
