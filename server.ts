import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// @ts-ignore
import healthHandler from "./api/health.js";
// @ts-ignore
import trafficIncidentsHandler from "./api/traffic-incidents.js";
// @ts-ignore
import travelTimesHandler from "./api/travel-times.js";
// @ts-ignore
import floodAlertsHandler from "./api/flood-alerts.js";
// @ts-ignore
import routeHandler from "./api/route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Mount API endpoints matching Vercel Serverless Function signatures
  app.all("/api/health", (req, res) => healthHandler(req, res));
  app.all("/api/traffic-incidents", (req, res) => trafficIncidentsHandler(req, res));
  app.all("/api/travel-times", (req, res) => travelTimesHandler(req, res));
  app.all("/api/flood-alerts", (req, res) => floodAlertsHandler(req, res));
  app.all("/api/route", (req, res) => routeHandler(req, res));

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Traffic portal server active on port ${PORT}`);
  });
}

startServer();
