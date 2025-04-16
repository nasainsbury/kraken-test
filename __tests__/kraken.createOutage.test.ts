import { Kraken } from "../src/kraken";

describe("getOutages", () => {
  const kraken = new Kraken("", "");

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("Correctly creates outage", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 200 })
    );

    const outages = await kraken.createOutage("example", []);

    expect(outages).toEqual(true);
  });

  it("Returns a 403", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 403 })
    );

    expect(async () => {
      await kraken.createOutage("example", []);
    }).rejects.toThrow("Unauthorized - 403");
  });

  it("Returns a 429", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 429 })
    );

    expect(async () => {
      await kraken.createOutage("example", []);
    }).rejects.toThrow("API Key limit exceeded - 429");
  });

  it("Returns a 404", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 404 })
    );

    expect(async () => {
      await kraken.createOutage("example", []);
    }).rejects.toThrow("Site ID: example does not exist - 404");
  });

  it("Returns a 500", () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    expect(async () => {
      await kraken.createOutage("example", []);
    }).rejects.toThrow("Unknown error");
  });
});
