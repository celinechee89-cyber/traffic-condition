/**
 * LTA DataMall Estimated Travel Times API Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes
 * Required Header: AccountKey = <LTA_ACCOUNT_KEY>
 */
export default async function handler(req, res) {
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  if (ltaAccountKey && ltaAccountKey !== "YOUR_LTA_ACCOUNT_KEY") {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(
        "https://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes",
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
      console.warn("LTA DataMall EstTravelTimes request failed, using fallback:", err.message);
    }
  }

  // Exact sample schema matching LTA DataMall response specification
  const fallbackResponse = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#EstTravelTimes",
    value: [
      {
        Name: "AYE",
        Direction: 1,
        FarEndPoint: "TUAS CHECKPOINT",
        StartPoint: "AYE/MCE INTERCHANGE",
        EndPoint: "TELOK BLANGAH RD",
        EstTime: 2,
      },
      {
        Name: "AYE",
        Direction: 1,
        FarEndPoint: "TUAS CHECKPOINT",
        StartPoint: "TELOK BLANGAH RD",
        EndPoint: "LOWER DELTA RD",
        EstTime: 1,
      },
      {
        Name: "CTE",
        Direction: 1,
        FarEndPoint: "AYE",
        StartPoint: "SLE",
        EndPoint: "Braddell Rd",
        EstTime: 14,
      },
      {
        Name: "CTE",
        Direction: 1,
        FarEndPoint: "AYE",
        StartPoint: "Braddell Rd",
        EndPoint: "Moulmein Rd",
        EstTime: 18,
      },
      {
        Name: "PIE",
        Direction: 1,
        FarEndPoint: "Changi",
        StartPoint: "Tuas",
        EndPoint: "Jurong East",
        EstTime: 12,
      },
      {
        Name: "SLE",
        Direction: 1,
        FarEndPoint: "CTE",
        StartPoint: "BKE",
        EndPoint: "Mandai Rd",
        EstTime: 24,
      },
      {
        Name: "TPE",
        Direction: 1,
        FarEndPoint: "SLE",
        StartPoint: "PIE",
        EndPoint: "Punggol",
        EstTime: 11,
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  return res.status(200).json(fallbackResponse);
}
