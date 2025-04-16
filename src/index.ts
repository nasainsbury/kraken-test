import { Device, Outages, PostOutage } from "./interfaces";
import { Kraken } from "./kraken";
import { isError } from "./util";

async function main(apiKey: string, siteId: string) {
  const kraken = new Kraken(
    "https://api.krakenflex.systems/interview-tests-mock-api/v1",
    apiKey
  );

  let siteName: string;
  let devices: Device[] = [];

  try {
    console.info("Attempting to GET site information", siteId);
    const siteInfo = await kraken.getSite(siteId);

    console.info("Site information received:");
    console.info("Name:", siteInfo.name);
    console.info("Id:", siteInfo.id);
    console.info("Devices:", siteInfo.devices.length);
    siteName = siteInfo.name;
    devices = siteInfo.devices;
  } catch (err) {
    if (isError(err)) {
      console.error(err.message);
    } else {
      console.error("Unknown error", err);
    }
    return;
  }

  console.log("");

  const deviceMap: Map<string, Device> = devices.reduce((map, device) => {
    map.set(device.id, device);
    return map;
  }, new Map<string, Device>());

  let outages: Outages = [];

  try {
    console.info("Attempting to GET outages");
    outages = await kraken.getOutages();
    console.info("Recieved outages:", outages.length);
  } catch (err) {
    if (isError(err)) {
      console.error(err.message);
    } else {
      console.error("Unknown error", err);
    }
    return;
  }

  console.log("");

  const transformedOutages: PostOutage[] = [];

  for (const outage of outages) {
    if (new Date(outage.begin) >= new Date("2022-01-01T00:00:00.000Z")) {
      const device = deviceMap.get(outage.id);

      if (device) {
        transformedOutages.push({
          ...outage,
          name: device.name,
        });
      }
    }
  }

  try {
    console.info("Attempting to POST outages");
    await kraken.createOutage(siteId, transformedOutages);
  } catch (err) {
    if (isError(err)) {
      console.error(err.message);
    } else {
      console.error("Unknown error", err);
    }
    return;
  }

  console.info("Successfully posted outages");
}

main("EltgJ5G8m44IzwE6UN2Y4B4NjPW77Zk6FJK3lL23", "norwich-pear-tree");
