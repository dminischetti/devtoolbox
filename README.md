# DevToolbox — A Developer’s Personal Lab

> Thoughtful Tools. Beautifully Engineered.

DevToolbox is a static, offline-friendly toolbox that treats engineering craft as a design discipline. Fourteen micro-apps share a cohesive shell, unified interactions, and documented intent. Every module runs locally — no telemetry, no server calls.

![Hero preview](./assets/cover.svg)

## Live Demo

Host the repository on GitHub Pages or any static host. The entry point is [`index.html`](./index.html); all routes use the hash-based router, so deep links like `#/tools/regex` work instantly.

## Tools

| Tool | Description |
| --- | --- |
| Regex Explorer | Highlight matches and understand capture groups. |
| JSON Doctor | Validate and prettify JSON payloads. |
| JWT Lens | Decode tokens securely, offline. |
| Base64 Studio | Encode/decode text with UTF-8 awareness. |
| UUID Generator | Stream cryptographically-strong UUIDs. |
| Hash Forge | Hash messages with Web Crypto. |
| Cron Poet | Translate crons into human phrasing. |
| Time Atlas | Compare dates and zones. |
| HTTP Whisperer | Search status codes with guidance. |
| SQL Formatter | Beautify SQL with keyword casing. |
| Diff Canvas | Visualize line-level changes. |
| Markdown Renderer | Preview Markdown with elegant typography. |
| JSON Schema Validator | Check payloads against schemas. |
| Contrast Lab | Evaluate color accessibility. |

## Why DevToolbox?

This project intentionally leans on the web platform to demonstrate:

- **Framework-free architecture.** Every tool is an ES module with a predictable shell, reinforcing fundamentals.
- **Offline-first thinking.** A service worker and structured caching make the experience resilient during flaky demos.
- **Accessibility as a default.** High-contrast palettes, keyboard shortcuts, and semantic markup guide the UX.
- **Security mindfulness.** Strict CSP headers, sanitized diff rendering, and cautious JWT handling keep the lab safe.

## Setup

No bundler is required. Serve the repository from any static host:

```bash
# Install dev dependencies for testing (optional for browsing)
npm install

# Launch a simple HTTP server
npx serve .
# or
python -m http.server 8000
```

## Testing

Utility modules are covered by unit tests using [Vitest](https://vitest.dev/). Run them locally or in CI:

```bash
npm test
```

Test files mirror the structure of `js/utils/` under `tests/utils/` to keep coverage discoverable.

## Architecture

- **Vanilla ES Modules** — Router, state, and tools are modular and lazy-loaded.
- **Tailwind + custom CSS** — Styles via CDN plus handcrafted variables/animations.
- **Service Worker** — Caches the shell for offline re-visits.
- **Utilities** — Shared helpers for storage, strings, dates, and color math.

## Architecture Decisions

- **No bundler.** Prioritizes debuggability over bundle size; the tools are fast enough without a build step.
- **Hash routing.** Keeps deployment simple on static hosts with zero server configuration.
- **CDN dependencies.** Fonts and Tailwind ship via CDN to reduce repo churn (trade-off: network dependency on first load).
- **Documented craft.** Design reasoning lives in [`notebooks/design-journal.md`](./notebooks/design-journal.md) for deeper dives.

```
js/
├── app.js           # bootstraps router + shortcuts
├── router.js        # hash router with lazy modules
├── state.js         # tool metadata + persisted favorites
├── tools/           # individual tool modules
└── pages/           # home, tools hub, and case study
```

## UX & Accessibility

- Unified dark theme built from neutral grays.
- Keyboard shortcuts: `/` search, `Cmd/Ctrl + Enter` run, `Esc` clear, `g t` tools, `g s` study.
- Copy toasts, glow pulses, and gentle tilts add feedback without distraction.
- WCAG AA contrast targets; focus states glow and remain visible.

## Adding a Tool

1. Create a module in `js/tools/<slug>.js` that exports a default render function.
2. Use `toolPage(tool, { workspace, output, actions, notes })` to keep layout consistent.
3. Register metadata in [`js/state.js`](./js/state.js).
4. Include any local data/examples under `data/` if necessary.

## Privacy & Security

- No analytics scripts or external requests after initial load.
- Tools like JWT Lens and JSON Doctor never send pasted data anywhere.
- Service worker uses a small cache and respects the same-origin policy.
- CSP headers and sanitizer-aware utilities defend against XSS within tools.

## License

MIT © Dominic Minischetti
