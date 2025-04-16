import { Kraken } from "../src/kraken";

describe("getOutages", () => {
  const kraken = new Kraken("", "");

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("Correctly returns outages", async () => {
    const response = [
      {
        id: "002b28fc-283c-47ec-9af2-ea287336dc1b",
        begin: "2021-07-26T17:09:31.036Z",
        end: "2021-08-29T00:37:42.253Z",
      },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(response), { status: 200 })
    );

    const outages = await kraken.getOutages();

    expect(outages).toEqual(response);
  });

  it("Returns a 200, but with invalid data", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify([{ name: "invalid data" }]), { status: 200 })
    );

    expect(async () => {
      await kraken.getOutages();
    }).rejects.toThrow("Invalid data returned");
  });

  it("Returns a 403", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 403 })
    );

    expect(async () => {
      await kraken.getOutages();
    }).rejects.toThrow("Unauthorized - 403");
  });

  it("Returns a 429", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 429 })
    );

    expect(async () => {
      await kraken.getOutages();
    }).rejects.toThrow("API Key limit exceeded - 429");
  });

  it("Returns a 404", () => {
    (fetch as jest.Mock).mockResolvedValueOnce(
      new Response(null, { status: 404 })
    );

    expect(async () => {
      await kraken.getOutages();
    }).rejects.toThrow("Unknown error");
  });

  it("Returns a 500", () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));

    expect(async () => {
      await kraken.getOutages();
    }).rejects.toThrow("Unknown error");
  });
});
