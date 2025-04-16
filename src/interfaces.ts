import { z } from "zod";

export const OutagesSchema = z.array(
  z.object({
    id: z.string(),
    end: z.string().datetime(),
    begin: z.string().datetime(),
  })
);

export const SiteDevicesSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const SiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  devices: z.array(SiteDevicesSchema),
});

export interface PostOutage {
  id: string;
  name: string;
  begin: string;
  end: string;
}

export type Outages = z.infer<typeof OutagesSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Device = z.infer<typeof SiteDevicesSchema>;

export interface EnergyAPI {
  getOutages: () => Promise<Outages>;
  getSite: (siteId: string) => Promise<Site>;
  createOutage: (siteId: string, outage: PostOutage[]) => Promise<boolean>;
}
