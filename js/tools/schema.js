import { toolPage } from './base.js';

export default function renderSchema(tool) {
  setTimeout(() => init());
  return toolPage(tool, {
    workspace: `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <label for="schema-input">JSON Schema</label>
          <textarea id="schema-input" rows="12"></textarea>
        </div>
        <div class="space-y-4">
          <label for="schema-data">JSON Data</label>
          <textarea id="schema-data" rows="12"></textarea>
        </div>
      </div>
    `,
    actions: `
      <button class="button-primary" id="schema-run" data-run>Validate</button>
      <button class="button-ghost" id="schema-load">Load sample</button>
      <button class="button-ghost" id="schema-clear" data-clear>Clear</button>
    `,
    output: `
      <div class="space-y-4 text-sm">
        <h3 class="text-lg font-semibold">Result</h3>
        <div id="schema-result"></div>
      </div>
    `,
    notes: 'JSON Schema Validator implements core checks for type, required fields, and property types.'
  });
}

async function init() {
  const schemaInput = document.getElementById('schema-input');
  const dataInput = document.getElementById('schema-data');
  const result = document.getElementById('schema-result');

  const validate = () => {
    try {
      const schema = JSON.parse(schemaInput.value);
      const data = JSON.parse(dataInput.value);
      const errors = validateData(schema, data, '#');
      if (!errors.length) {
        result.innerHTML = '<p class="text-sm text-zinc-300 font-medium">Valid ✓</p>';
      } else {
        result.innerHTML = `<ul class="space-y-2">${errors
          .map((err) => `<li class="text-sm text-zinc-100 font-semibold">${err}</li>`)
          .join('')}</ul>`;
      }
    } catch (error) {
      result.innerHTML = `<p class="text-sm text-zinc-100 font-semibold">${error.message}</p>`;
    }
  };

  const loadSample = async () => {
    const [schemaRes, dataRes] = await Promise.all([
      fetch('./data/examples/sample.schema.json'),
      fetch('./data/examples/sample.json')
    ]);
    schemaInput.value = await schemaRes.text();
    dataInput.value = await dataRes.text();
    validate();
  };

  const clear = () => {
    schemaInput.value = '';
    dataInput.value = '';
    result.innerHTML = '';
  };

  document.getElementById('schema-run')?.addEventListener('click', validate);
  document.getElementById('schema-load')?.addEventListener('click', loadSample);
  document.getElementById('schema-clear')?.addEventListener('click', clear);
}

function validateData(schema, data, path) {
  const errors = [];
  if (schema.type) {
    if (schema.type === 'object') {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        errors.push(`${path} should be an object`);
        return errors;
      }
      if (schema.required) {
        schema.required.forEach((key) => {
          if (!(key in data)) errors.push(`${path} missing required property ${key}`);
        });
      }
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([key, child]) => {
          if (key in data) {
            errors.push(...validateData(child, data[key], `${path}/${key}`));
          }
        });
      }
    } else if (schema.type === 'array') {
      if (!Array.isArray(data)) {
        errors.push(`${path} should be an array`);
      } else if (schema.items) {
        data.forEach((item, index) => {
          errors.push(...validateData(schema.items, item, `${path}/${index}`));
        });
      }
    } else if (schema.type === 'string') {
      if (typeof data !== 'string') errors.push(`${path} should be a string`);
    } else if (schema.type === 'number') {
      if (typeof data !== 'number') errors.push(`${path} should be a number`);
    } else if (schema.type === 'boolean') {
      if (typeof data !== 'boolean') errors.push(`${path} should be a boolean`);
    }
  }
  return errors;
}
