# DevToolbox · Design Journal

## Early Sketches & Goals
- Map the toolbox as a constellation: hero, cards, tool shells, case study.
- Maintain a 200 KB budget — no bundlers, keep dependencies minimal.
- Ensure every tool shares the same skeleton for cognitive fluency.

## UI/UX Trade-offs
- **Tailwind via CDN vs. custom CSS**: Tailwind speeds up layout, but I added custom CSS variables and glassmorphism details to stay opinionated.
- **SPA router**: Chose hash-based navigation to avoid server config; compromises SEO but maintains offline simplicity.
- **Animation restraint**: Balanced delight with readability — pulses, tilts, and gradients stay subtle.

## Performance Experiments
- Removed heavyweight libraries in favor of bespoke utilities (e.g., custom diff, cron interpreter).
- Cached sample data locally to avoid network waterfall.
- Verified that initial paint remains snappy by lazy-loading tool modules only when routes demand them.

## Accessibility Checklist
- [x] Semantic headings and region labels.
- [x] Focus states with high-contrast glow.
- [x] Keyboard shortcuts with discoverable help dialog.
- [x] WCAG AA contrast confirmed via Contrast Lab.
- [x] Live region for copy toast to announce feedback.

## Reflection
DevToolbox demonstrates that developer tooling can feel like a boutique experience. Engineering rigour and design taste are not competing forces — they’re partners. Each interaction, from copy toast to diff summary, communicates respect for the person using it. The lab is my proof that developers deserve tools that are as thoughtful as the products they build.
