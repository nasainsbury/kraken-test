import { fetchWithRetry } from "../src/fetch";

describe("Testing custom fetch", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  it("Tries again if recieving a 500", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );

    const res = await fetchWithRetry("/test-endpoint");
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("Fails after recieving 3 500s", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    const res = await fetchWithRetry("/test-endpoint");
    expect(res.status).toBe(500);

    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("Succeeds with no retries", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 403 })
    );
    const res = await fetchWithRetry("/test-endpoint");
    expect(res.status).toBe(403);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("Can override retry amounts", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const res = await fetchWithRetry("/test-endpoint", {}, 10);
    expect(res.status).toBe(200);

    expect(fetch).toHaveBeenCalledTimes(7);
  });

  it("Will fail if not enough retries", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const res = await fetchWithRetry("/test-endpoint", {}, 2);
    expect(res.status).toBe(500);

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
