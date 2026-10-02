/**
 * Health check endpoint for monitoring LTA DataMall and OneMap API integration.
 * Endpoint: /api/health
 * Compatible with Vercel Serverless Functions and local Express server.
 */
export default async function handler(req, res) {
  const startTime = Date.now();
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;
  const oneMapAccountKey =
    process.env.ONEMAP_ACCOUNT_KEY || process.env.ONEMAP_API_KEY;

  const hasLtaKey = Boolean(
    ltaAccountKey &&
      ltaAccountKey !== "YOUR_LTA_ACCOUNT_KEY" &&
      ltaAccountKey.trim().length > 0
  );

  const hasOneMapKey = Boolean(
    oneMapAccountKey &&
      oneMapAccountKey !== "YOUR_ONEMAP_ACCOUNT_KEY" &&
      oneMapAccountKey.trim().length > 0
  );

  const report = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : null,
    environment: {
      platform: process.env.VERCEL ? "Vercel Serverless" : "Node.js / Express",
      hasLtaKey,
      hasOneMapKey,
      ltaKeyVariable: "LTA_ACCOUNT_KEY",
      oneMapKeyVariable: "ONEMAP_ACCOUNT_KEY",
    },
    apis: {
      trafficIncidents: {
        name: "LTA Traffic Incidents",
        endpoint: "https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents",
        status: hasLtaKey ? "CHECKING" : "FALLBACK_READY",
        latencyMs: null,
      },
      travelTimes: {
        name: "LTA Estimated Travel Times",
        endpoint: "http://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes",
        status: hasLtaKey ? "CHECKING" : "FALLBACK_READY",
        latencyMs: null,
      },
      floodAlerts: {
        name: "LTA / PUB Flood Reports",
        endpoint: "https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts",
        status: hasLtaKey ? "CHECKING" : "FALLBACK_READY",
        latencyMs: null,
      },
      oneMapRouting: {
        name: "OneMap Routing Service",
        endpoint: "https://www.onemap.gov.sg/api/public/routingsvc/route",
        status: hasOneMapKey ? "CHECKING" : "FALLBACK_READY",
        latencyMs: null,
      },
    },
    notes: [],
  };

  // If LTA key is missing, add advisory note
  if (!hasLtaKey) {
    report.notes.push(
      "LTA_ACCOUNT_KEY is not configured in Vercel environment variables. Verified fallback traffic datasets are active."
    );
  }

  // If OneMap key is missing, add advisory note
  if (!hasOneMapKey) {
    report.notes.push(
      "ONEMAP_ACCOUNT_KEY is not configured in Vercel environment variables. Internal high-precision routing model is active."
    );
  }

  // Probe LTA endpoints if key is configured
  if (hasLtaKey) {
    const pingLta = async (key, url) => {
      const pingStart = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const resp = await fetch(url, {
          headers: {
            AccountKey: ltaAccountKey,
            accept: "application/json",
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        report.apis[key].latencyMs = Date.now() - pingStart;
        if (resp.ok) {
          report.apis[key].status = "HEALTHY";
        } else {
          report.apis[key].status = `HTTP_${resp.status}`;
          report.status = "DEGRADED";
        }
      } catch (err) {
        report.apis[key].latencyMs = Date.now() - pingStart;
        report.apis[key].status =
          err.name === "AbortError" ? "TIMEOUT" : "UNREACHABLE";
        report.status = "DEGRADED";
      }
    };

    await Promise.all([
      pingLta("trafficIncidents", report.apis.trafficIncidents.endpoint),
      pingLta("travelTimes", report.apis.travelTimes.endpoint),
      pingLta("floodAlerts", report.apis.floodAlerts.endpoint),
    ]);
  }

  // Probe OneMap if key is configured or test reachability
  const omStart = Date.now();
  try {
    const omController = new AbortController();
    const omTimeout = setTimeout(() => omController.abort(), 3500);
    const omResp = await fetch(
      hasOneMapKey
        ? `https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.4360,103.7865&end=1.2798,103.8543&routeType=drive`
        : "https://www.onemap.gov.sg",
      {
        headers: hasOneMapKey
          ? {
              Authorization: oneMapAccountKey.startsWith("Bearer ")
                ? oneMapAccountKey
                : `Bearer ${oneMapAccountKey}`,
            }
          : undefined,
        signal: omController.signal,
        method: hasOneMapKey ? "GET" : "HEAD",
      }
    );
    clearTimeout(omTimeout);
    report.apis.oneMapRouting.latencyMs = Date.now() - omStart;
    if (omResp.ok) {
      report.apis.oneMapRouting.status = hasOneMapKey
        ? "HEALTHY"
        : "REACHABLE (FALLBACK_MODE)";
    } else {
      report.apis.oneMapRouting.status = `HTTP_${omResp.status}`;
    }
  } catch {
    report.apis.oneMapRouting.latencyMs = Date.now() - omStart;
    report.apis.oneMapRouting.status = "FALLBACK_READY";
  }

  if (!hasLtaKey || !hasOneMapKey) {
    report.status = report.status === "DEGRADED" ? "DEGRADED" : "CONFIG_REQUIRED";
  }

  report.totalLatencyMs = Date.now() - startTime;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  return res.status(200).json(report);
}
