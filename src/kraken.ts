import { fetchWithRetry } from "./fetch";
import { EnergyAPI, SiteSchema, PostOutage, OutagesSchema } from "./interfaces";

export class Kraken implements EnergyAPI {
  constructor(private baseUrl: string, private apiKey: string) {}

  public async getOutages() {
    const request = await fetchWithRetry(`${this.baseUrl}/outages`, {
      headers: {
        "x-api-key": this.apiKey,
      },
    });

    if (request.status === 200) {
      const data = await request.json();
      const parsed = OutagesSchema.safeParse(data);

      if (parsed.success) {
        return parsed.data;
      } else {
        throw new Error("Invalid data returned");
      }
    }

    switch (request.status) {
      case 403:
        throw new Error("Unauthorized - 403");
      case 429:
        throw new Error("API Key limit exceeded - 429");
      default:
        throw new Error("Unknown error");
    }
  }

  public async getSite(siteId: string) {
    const request = await fetchWithRetry(
      `${this.baseUrl}/site-info/${siteId}`,
      {
        headers: {
          "x-api-key": this.apiKey,
        },
      }
    );

    if (request.status === 200) {
      const data = await request.json();
      const parsed = SiteSchema.safeParse(data);

      if (parsed.success) {
        return parsed.data;
      } else {
        throw new Error("Invalid data returned");
      }
    }

    switch (request.status) {
      case 403:
        throw new Error("Unauthorized - 403");
      case 404:
        throw new Error(`Site ID: ${siteId} does not exist - 404`);
      case 429:
        throw new Error("API Key limit exceeded - 429");
      default:
        throw new Error("Unknown error");
    }
  }

  public async createOutage(siteId: string, outages: PostOutage[]) {
    const request = await fetchWithRetry(
      `${this.baseUrl}/site-outages/${siteId}`,
      {
        method: "POST",
        body: JSON.stringify(outages),
        headers: {
          "x-api-key": this.apiKey,
        },
      }
    );

    if (request.status === 200) {
      return true;
    }

    switch (request.status) {
      case 403:
        throw new Error("Unauthorized - 403");
      case 404:
        throw new Error(`Site ID: ${siteId} does not exist - 404`);
      case 429:
        throw new Error("API Key limit exceeded - 429");
      default:
        throw new Error("Unknown error");
    }
  }
}
