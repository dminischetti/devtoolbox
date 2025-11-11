const listeners = new Set();
let installed = false;

function normalizeError(error) {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === 'string' ? error : JSON.stringify(error));
}

/**
 * Report an error with structured logging and optional user messaging.
 * @param {string} context - Identifier describing where the error occurred.
 * @param {unknown} error - Error instance or value to normalize.
 * @param {{ userMessage?: string, data?: Record<string, unknown> }} [options]
 * @returns {{ error: Error, message: string }} Normalized error info and UI-safe message.
 */
export function handleError(context, error, options = {}) {
  const normalized = normalizeError(error);
  const message = options.userMessage ?? 'Something went wrong. Please try again.';
  const payload = {
    context,
    message: normalized.message,
    ...(options.data ? { data: options.data } : {})
  };
  // eslint-disable-next-line no-console
  console.error('[DevToolbox]', payload, normalized);
  listeners.forEach((listener) => listener(payload, normalized));
  return { error: normalized, message };
}

/**
 * Subscribe to handled errors (useful for logging or telemetry).
 * @param {(payload: object, error: Error) => void} listener - Callback invoked on errors.
 * @returns {() => void} Cleanup function.
 */
export function onError(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Install global error handlers that route to the structured logger.
 */
export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return;
  window.addEventListener('error', (event) => {
    handleError('global:uncaught', event.error || event.message, {
      data: { source: event.filename, line: event.lineno, column: event.colno }
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    handleError('global:unhandled-rejection', event.reason);
  });
  installed = true;
}
