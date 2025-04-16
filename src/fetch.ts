export async function fetchWithRetry(
  url: RequestInfo | URL,
  opts?: RequestInit,
  retries: number = 3
): Promise<Response> {
  const res = await fetch(url, opts);

  if (res.status === 500) {
    if (retries <= 1) {
      return res;
    }
    return fetchWithRetry(url, opts, retries - 1);
  }
  return res;
}
