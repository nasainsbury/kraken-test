export async function fetchWithRetry(
  url: RequestInfo | URL,
  opts?: RequestInit,
  retries: number = 3
): Promise<Response> {
  try {
    const res = await fetch(url, opts);
    if (res.status === 500) {
      throw new Error(`HTTP 500`);
    }
    return res;
  } catch (err) {
    if (retries <= 0) {
      throw err;
    }
    await new Promise((r) => setTimeout(r, 500));
    return fetchWithRetry(url, opts, retries - 1);
  }
}
