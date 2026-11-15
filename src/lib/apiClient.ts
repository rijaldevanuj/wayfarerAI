/**
 * Browser-side fetch wrapper with:
 * - AbortController for cancellable requests
 * - Stale requestId guard to prevent out-of-order responses
 * - Typed error handling
 */

let currentRequestId = 0;
let currentController: AbortController | null = null;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: string;
  stale?: boolean;
}

/**
 * Aborts any in-flight request and initiates a new one.
 * Returns { stale: true } if a newer request was fired before this one resolved.
 */
export async function fetchItinerary<T>(
  url: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  // Abort previous request
  if (currentController) {
    currentController.abort();
  }

  const controller = new AbortController();
  currentController = controller;
  const requestId = ++currentRequestId;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    // Guard against stale responses
    if (requestId !== currentRequestId) {
      return { stale: true };
    }

    const json = await res.json();

    if (!res.ok) {
      return {
        error: json.error || `Request failed with status ${res.status}`,
        code: json.code || 'UNKNOWN',
      };
    }

    return { data: json as T };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { stale: true };
    }
    return {
      error: err instanceof Error ? err.message : 'Network error',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Cancel any in-flight request.
 */
export function abortCurrentRequest(): void {
  if (currentController) {
    currentController.abort();
    currentController = null;
  }
}
