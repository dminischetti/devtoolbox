const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export function registerShortcuts(actions) {
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const meta = isMac ? event.metaKey : event.ctrlKey;

    if (key === '/' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      actions.onSearch?.();
    }

    if (key === 'enter' && meta) {
      event.preventDefault();
      actions.onRun?.();
    }

    if (key === 'escape') {
      actions.onClear?.();
    }

    if (event.shiftKey && key === '?') {
      event.preventDefault();
      actions.onHelp?.();
    }

    if (key === 't' && event.ctrlKey && !meta) {
      actions.onGoTools?.();
    }

    if (key === 'g' && event.ctrlKey === false && !meta) {
      // allow sequences g t / g s by tracking state
    }
  });

  let sequence = [];
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['g', 't', 's'].includes(key) && !event.metaKey && !event.ctrlKey) {
      sequence.push(key);
      sequence = sequence.slice(-2);
      if (sequence.join(' ') === 'g t') {
        event.preventDefault();
        actions.onGoTools?.();
        sequence = [];
      }
      if (sequence.join(' ') === 'g s') {
        event.preventDefault();
        actions.onGoStudy?.();
        sequence = [];
      }
    } else {
      sequence = [];
    }
  });
}
