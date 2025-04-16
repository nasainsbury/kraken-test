import { Kraken } from "../src/kraken";

describe("getSite", () => {
  const kraken = new Kraken("", "");

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("Correctly returns site", async () => {
    const response = {
      id: "example",
      name: "example",
      devices: [],
    };

    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(response), { status: 200 })
    );

    const outages = await kraken.getSite("example");

    expect(outages).toEqual(response);
  });

  it("Returns a 200, but with invalid data", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    expect(async () => {
      await kraken.getSite("example");
    }).rejects.toThrow("Invalid data returned");
  });

  it("Returns a 403", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 403 })
    );

    expect(async () => {
      await kraken.getSite("example");
    }).rejects.toThrow("Unauthorized - 403");
  });

  it("Returns a 429", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 429 })
    );

    expect(async () => {
      await kraken.getSite("example");
    }).rejects.toThrow("API Key limit exceeded - 429");
  });

  it("Returns a 404", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 404 })
    );

    expect(async () => {
      await kraken.getSite("example");
    }).rejects.toThrow("Site ID: example does not exist - 404");
  });

  it("Returns a 500", () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    expect(async () => {
      await kraken.getSite("example");
    }).rejects.toThrow("Unknown error");
  });
});
