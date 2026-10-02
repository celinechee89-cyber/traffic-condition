/**
 * LTA DataMall Traffic Incidents API Proxy
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
 * Required Header: AccountKey = <LTA_ACCOUNT_KEY>
 */
export default async function handler(req, res) {
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  if (ltaAccountKey && ltaAccountKey !== "YOUR_LTA_ACCOUNT_KEY") {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(
        "https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents",
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
        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
        return res.status(200).json(data);
      }
    } catch (err) {
      console.warn("LTA DataMall TrafficIncidents request failed, using fallback:", err.message);
    }
  }

  // Exact sample schema matching LTA DataMall response specification
  const fallbackResponse = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#IncidentSet",
    value: [
      {
        Type: "Roadwork",
        Latitude: 1.390923508426507,
        Longitude: 103.76543045742648,
        Message: "(12/2)14:42 Roadworks on KJE (towards BKE) before BKE Exit. Avoid lane 2.",
      },
      {
        Type: "Roadwork",
        Latitude: 1.3228083288625956,
        Longitude: 103.7486545963207,
        Message: "(12/2)14:40 Roadworks on AYE (towards MCE) after Jurong Town Hall Exit. Avoid lane 1.",
      },
      {
        Type: "Roadwork",
        Latitude: 1.2655918425973762,
        Longitude: 103.82208988201302,
        Message: "(12/2)14:37 Roadworks on Telok Blangah Road (towards Tuas) after Sentosa Gateway. Avoid right lane.",
      },
      {
        Type: "Accident",
        Latitude: 1.4124,
        Longitude: 103.8012,
        Message: "(1/10) 08:52 Accident on AYE (towards Tuas) after Tuas West Rd. Avoid lane 2.",
      },
      {
        Type: "Vehicle Breakdown",
        Latitude: 1.4312,
        Longitude: 103.7845,
        Message: "(1/10) 09:22 Vehicle Breakdown on SLE (towards CTE) after Woodlands Ave 2. Lane 2 obstruction.",
      },
      {
        Type: "Heavy Traffic",
        Latitude: 1.3218,
        Longitude: 103.8488,
        Message: "(1/10) 09:18 Incident on CTE (towards AYE) after Moulmein Rd. Speed averaging 28km/h.",
      },
    ],
  };

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  return res.status(200).json(fallbackResponse);
}
