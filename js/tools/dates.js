import { toolPage } from './base.js';
import { convertToZone, diffInUnits, listTimezones, relativeTime, toIso } from '../utils/dates.js';

export default function renderDates(tool) {
  setTimeout(() => init());
  const options = listTimezones()
    .slice(0, 40)
    .map((zone) => `<option value="${zone}">${zone}</option>`)
    .join('');
  return toolPage(tool, {
    workspace: `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <label for="date-primary">Primary date</label>
          <input id="date-primary" type="datetime-local" />
        </div>
        <div class="space-y-4">
          <label for="date-secondary">Secondary date</label>
          <input id="date-secondary" type="datetime-local" />
        </div>
      </div>
      <div class="space-y-4">
        <label for="date-zone">Timezone</label>
        <select id="date-zone">${options}</select>
      </div>
    `,
    actions: `
      <button class="button-primary" id="date-run" data-run>Compute</button>
      <button class="button-ghost" id="date-now">Set to now</button>
      <button class="button-ghost" id="date-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">ISO snapshot</h3>
          <p id="date-iso" class="font-mono break-all"></p>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Relative time</h3>
          <p id="date-relative"></p>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Difference</h3>
          <ul id="date-diff" class="space-y-1"></ul>
        </div>
      </div>
    `,
    notes: 'Time Atlas compares two instants, converts them to custom zones, and reveals relative offsets for quick reasoning.'
  });
}

function init() {
  const primary = document.getElementById('date-primary');
  const secondary = document.getElementById('date-secondary');
  const zone = document.getElementById('date-zone');
  const iso = document.getElementById('date-iso');
  const relative = document.getElementById('date-relative');
  const diff = document.getElementById('date-diff');

  const setNow = () => {
    const now = new Date();
    primary.value = toLocalInput(now);
    secondary.value = toLocalInput(new Date(now.getTime() + 3600000));
    compute();
  };

  const compute = () => {
    if (!primary.value) {
      iso.textContent = 'Choose a primary date.';
      return;
    }
    const base = new Date(primary.value);
    iso.textContent = `${toIso(base)} → ${convertToZone(base, zone.value)}`;
    relative.textContent = secondary.value
      ? relativeTime(new Date(secondary.value), base)
      : relativeTime(new Date(), base);
    if (secondary.value) {
      const metrics = diffInUnits(new Date(primary.value), new Date(secondary.value));
      diff.innerHTML = Object.entries(metrics)
        .map(([unit, value]) => `<li>${unit}: <span class="text-zinc-100/85">${value}</span></li>`)
        .join('');
    } else {
      diff.innerHTML = '<li>Set a secondary date to compare differences.</li>';
    }
  };

  const clear = () => {
    primary.value = '';
    secondary.value = '';
    iso.textContent = '';
    relative.textContent = '';
    diff.innerHTML = '';
  };

  document.getElementById('date-run')?.addEventListener('click', compute);
  document.getElementById('date-now')?.addEventListener('click', setNow);
  document.getElementById('date-clear')?.addEventListener('click', clear);

  setNow();
}

function toLocalInput(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
