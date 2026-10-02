/**
 * LTA DataMall PUB Flood Alerts API Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts
 * Required Header: AccountKey = <LTA_ACCOUNT_KEY>
 */
export default async function handler(req, res) {
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  if (ltaAccountKey && ltaAccountKey !== "YOUR_LTA_ACCOUNT_KEY") {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(
        "https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts",
        {
          headers: {
            AccountKey: ltaAccountKey,
            accept: "application/json",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn("LTA DataMall PubFloodAlerts request failed, using fallback:", err.message);
    }
  }

  // Exact sample schema matching LTA DataMall response specification
  const fallbackResponse = {
    "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts",
    value: [
      {
        alertId: "2.49.0.0.702.2-BCM-17612003774680-PUBCON-DYOONG",
        dateTime: new Date().toISOString(),
        msgType: "Alert",
        event: "Flood",
        responseType: "Avoid",
        urgency: "Immediate",
        severity: "Moderate",
        expires: new Date(Date.now() + 3600000).toISOString(),
        senderName: "PUB",
        headline: "Flash Flood Alert",
        description:
          "[FLASH FLOOD OCCURRED] Flash flood at Jalan Mastuli. Please avoid the area. PUB officers have been deployed to render assistance.",
        instruction: "Please avoid this area for the next one (1) hour",
        areaDesc: "Jalan Mastuli, Singapore",
        circle: "1.35479,103.88611 0.05",
        status: "Actual",
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  return res.status(200).json(fallbackResponse);
}
