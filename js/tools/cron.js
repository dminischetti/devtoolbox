import { toolPage } from './base.js';

export default function renderCron(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="space-y-4">
        <label for="cron-input">Cron expression</label>
        <input id="cron-input" value="*/5 * * * *" />
      </div>
      <div class="space-y-4">
        <label for="cron-timezone">Timezone</label>
        <select id="cron-timezone">
          <option value="UTC">UTC</option>
          <option value="local">Local time</option>
        </select>
      </div>
    `,
    actions: `
      <button class="button-primary" id="cron-translate" data-run>Translate</button>
      <button class="button-ghost" id="cron-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <div>
          <h3 class="text-lg font-semibold">Human schedule</h3>
          <p id="cron-human" class="text-zinc-100/80"></p>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Upcoming runs</h3>
          <ul id="cron-runs" class="space-y-2 font-mono text-xs"></ul>
        </div>
      </div>
    `,
    notes: 'Cron Poet transforms symbols into prose and previews the next five runs in your chosen timezone.'
  });
}

function init() {
  const input = document.getElementById('cron-input');
  const timezone = document.getElementById('cron-timezone');
  const human = document.getElementById('cron-human');
  const runs = document.getElementById('cron-runs');

  const translate = () => {
    const expression = input.value.trim();
    try {
      const parts = expression.split(/\s+/);
      if (parts.length < 5 || parts.length > 6) throw new Error('Cron must have 5 or 6 parts');
      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      human.textContent = cronToHuman({ minute, hour, dayOfMonth, month, dayOfWeek });
      const schedule = nextRuns({ minute, hour, dayOfMonth, month, dayOfWeek }, timezone.value === 'local');
      runs.innerHTML = schedule.map((date) => `<li>${date}</li>`).join('');
    } catch (error) {
      human.textContent = error.message;
      runs.innerHTML = '';
    }
  };

  const clear = () => {
    input.value = '';
    human.textContent = '';
    runs.innerHTML = '';
  };

  document.getElementById('cron-translate')?.addEventListener('click', translate);
  document.getElementById('cron-clear')?.addEventListener('click', clear);
  translate();
}

function cronToHuman({ minute, hour, dayOfMonth, month, dayOfWeek }) {
  const describe = (value, unit) => {
    if (value === '*') return `every ${unit}`;
    if (value.startsWith('*/')) return `every ${value.slice(2)} ${unit}`;
    return `${unit} at ${value}`;
  };
  const pieces = [describe(minute, 'minute'), describe(hour, 'hour'), describe(dayOfMonth, 'day'), describe(month, 'month'), describe(dayOfWeek, 'weekday')];
  return pieces.join(', ');
}

function nextRuns(parts, useLocal) {
  const now = new Date();
  const results = [];
  let date = new Date(now.getTime());
  while (results.length < 5) {
    date.setMinutes(date.getMinutes() + 1, 0, 0);
    if (matches(date, parts)) {
      results.push(useLocal ? date.toString() : date.toUTCString());
    }
    if (results.length >= 5) break;
  }
  return results;
}

function matches(date, { minute, hour, dayOfMonth, month, dayOfWeek }) {
  const check = (value, actual) => {
    if (value === '*') return true;
    if (value.startsWith('*/')) {
      const step = Number(value.slice(2));
      return actual % step === 0;
    }
    return value.split(',').some((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        return actual >= start && actual <= end;
      }
      return Number(part) === actual;
    });
  };
  return (
    check(minute, date.getUTCMinutes()) &&
    check(hour, date.getUTCHours()) &&
    check(dayOfMonth, date.getUTCDate()) &&
    check(month, date.getUTCMonth() + 1) &&
    check(dayOfWeek, date.getUTCDay())
  );
}
