import { storage } from './utils/storage.js';

const TOOL_DEFINITIONS = [
  {
    slug: 'regex',
    name: 'Regex Explorer',
    icon: './assets/icons/regex.svg',
    tagline: 'Test, highlight, and explain regular expressions instantly.',
    category: 'Parsing',
    description: 'Live match tester with highlights, flags toggles, and friendly explanations.',
    tip: 'Use non-greedy quantifiers like .*? to avoid catastrophic backtracking.'
  },
  {
    slug: 'json',
    name: 'JSON Doctor',
    icon: './assets/icons/json.svg',
    tagline: 'Validate, prettify, and understand JSON payloads.',
    category: 'Data',
    description: 'Schema-aware validation with indentation controls and diff hints.',
    tip: 'Prefer double quotes for keys and strings to keep JSON spec-compliant.'
  },
  {
    slug: 'jwt',
    name: 'JWT Lens',
    icon: './assets/icons/jwt.svg',
    tagline: 'Decode JSON Web Tokens without leaking secrets.',
    category: 'Security',
    description: 'Offline-safe decoder with header/payload details and algorithm hints.',
    tip: 'Never paste production secrets into third-party JWT debuggers.'
  },
  {
    slug: 'base64',
    name: 'Base64 Studio',
    icon: './assets/icons/base64.svg',
    tagline: 'Encode and decode with UTF-8 awareness.',
    category: 'Encoding',
    description: 'Understand raw bytes and decode issues with clarity.',
    tip: 'When transporting JSON via Base64, remember to handle UTF-8 characters properly.'
  },
  {
    slug: 'uuid',
    name: 'UUID Generator',
    icon: './assets/icons/uuid.svg',
    tagline: 'Generate RFC4122-compliant identifiers.',
    category: 'Identity',
    description: 'Stream of v4 UUIDs with collision probability notes.',
    tip: 'Store UUIDs as strings — integer conversions can lose precision.'
  },
  {
    slug: 'hash',
    name: 'Hash Forge',
    icon: './assets/icons/hash.svg',
    tagline: 'Digest messages using SHA variants via Web Crypto.',
    category: 'Security',
    description: 'Browser-based hashing with hex + base64 output and entropy hints.',
    tip: 'Hashing is one-way — add salts if you need password protection.'
  },
  {
    slug: 'cron',
    name: 'Cron Poet',
    icon: './assets/icons/cron.svg',
    tagline: 'Translate cron syntax into human prose.',
    category: 'Automation',
    description: 'Explain expressions, highlight ranges, and preview run cadence.',
    tip: 'Remember that many crons treat both 0 and 7 as Sunday.'
  },
  {
    slug: 'dates',
    name: 'Time Atlas',
    icon: './assets/icons/dates.svg',
    tagline: 'Convert and compare dates across zones.',
    category: 'Temporal',
    description: 'Relative humanized time, ISO conversion, and timezone math.',
    tip: 'Always store server timestamps in UTC to avoid daylight savings bugs.'
  },
  {
    slug: 'http',
    name: 'HTTP Whisperer',
    icon: './assets/icons/http.svg',
    tagline: 'Search HTTP status codes and semantic meanings.',
    category: 'Networking',
    description: 'Quick lookup with patterns, plus recommended remediation steps.',
    tip: '4xx codes indicate client input issues; don’t retry blindly.'
  },
  {
    slug: 'sqlfmt',
    name: 'SQL Formatter',
    icon: './assets/icons/sql.svg',
    tagline: 'Beautify SQL with consistent casing and spacing.',
    category: 'Data',
    description: 'Formatter with style presets, diff preview, and copy helpers.',
    tip: 'Uppercase keywords improve readability in collaborative queries.'
  },
  {
    slug: 'diff',
    name: 'Diff Canvas',
    icon: './assets/icons/diff.svg',
    tagline: 'Visualize differences between snippets.',
    category: 'Collaboration',
    description: 'Color-coded inline diff with summary metrics.',
    tip: 'Keep diffs tight — review small, coherent changes for better feedback.'
  },
  {
    slug: 'md',
    name: 'Markdown Renderer',
    icon: './assets/icons/md.svg',
    tagline: 'Preview Markdown with beautiful typography.',
    category: 'Content',
    description: 'Live preview, outline generator, and export-friendly HTML.',
    tip: 'Use headings sequentially (H2 after H1) to maintain accessibility.'
  },
  {
    slug: 'schema',
    name: 'JSON Schema Validator',
    icon: './assets/icons/schema.svg',
    tagline: 'Validate payloads against schemas locally.',
    category: 'Quality',
    description: 'Ajv-powered validation with error inspector and success pulse.',
    tip: 'Add descriptions to schema fields — future you will say thanks.'
  },
  {
    slug: 'contrast',
    name: 'Contrast Lab',
    icon: './assets/icons/contrast.svg',
    tagline: 'Check color accessibility across states.',
    category: 'Design',
    description: 'WCAG AA/AAA contrast evaluation with palette suggestions.',
    tip: 'Contrast ratios of at least 4.5:1 keep text legible for most readers.'
  }
];

const state = {
  favorites: new Set(storage.get('dt-favorites') || []),
  tools: TOOL_DEFINITIONS,
  search: ''
};

export function getTools() {
  return state.tools;
}

export function getToolBySlug(slug) {
  return state.tools.find((tool) => tool.slug === slug);
}

export function setSearchTerm(term) {
  state.search = term;
}

export function getSearchTerm() {
  return state.search;
}

export function isFavorite(slug) {
  return state.favorites.has(slug);
}

export function toggleFavorite(slug) {
  if (state.favorites.has(slug)) {
    state.favorites.delete(slug);
  } else {
    state.favorites.add(slug);
  }
  storage.set('dt-favorites', Array.from(state.favorites));
  return isFavorite(slug);
}

export function getFavorites() {
  return Array.from(state.favorites);
}

export const APP_META = {
  name: 'DevToolbox — A Developer’s Personal Lab',
  tagline: 'Thoughtful Tools. Beautifully Engineered.',
  mission:
    'Merge precision engineering and aesthetic design into a cohesive, static, privacy-friendly toolbox for developers — and document every decision as a case study.'
};
