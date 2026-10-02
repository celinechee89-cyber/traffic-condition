import React, { useState } from "react";
import {
  CAMERA_LOCATIONS,
  CameraLocation,
  ERP_GANTRIES,
  EXPRESSWAY_FLOW_INDEX,
  PGS_CARPARKS,
} from "../data/trafficData";

interface SecondaryProps {
  onNavigateToPlanner: (presetDest?: string) => void;
  onEnlargeCamera: (cam: CameraLocation) => void;
  onOpenHazardModal: () => void;
}

export const LiveTrafficMapScreen: React.FC<SecondaryProps> = ({
  onNavigateToPlanner,
  onEnlargeCamera,
  onOpenHazardModal,
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<string>("ALL");

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low px-margin py-space-md shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded uppercase tracking-wider">
                EMAS GIS TELEMETRY
              </span>
              <span className="text-secondary font-label-md text-label-md font-bold uppercase tracking-wide">
                Island-Wide Corridor Command
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight leading-tight">
              Live Traffic Speed Map &amp; VMS Advisories
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
              Real-time overhead Variable Message Sign (VMS) broadcasts, expressway corridor velocity sensors, and Parking Guidance System (PGS) lot availability.
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => onNavigateToPlanner()}
              className="px-space-md py-space-xs rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>Open Route Planner</span>
            </button>
            <button
              onClick={onOpenHazardModal}
              className="px-space-md py-space-xs rounded bg-secondary text-on-secondary font-headline-sm text-headline-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">report</span>
              <span>Report Incident</span>
            </button>
          </div>
        </div>
      </section>

      <section className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-lg">
          {/* Overhead Electronic VMS Signboards Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-primary text-on-primary p-space-md rounded-xl shadow-md flex flex-col justify-between border-l-4 border-error">
              <div className="flex items-center justify-between text-label-sm font-label-sm text-inverse-primary">
                <span>VMS OVERHEAD BOARD • SLE KM 8.4</span>
                <span className="px-1.5 py-0.5 rounded bg-error text-on-error">ACTIVE ALERT</span>
              </div>
              <div className="my-space-sm font-mono text-[15px] tracking-wide text-tertiary-fixed font-bold uppercase">
                ACCIDENT AFTER MANDAI AVE. LANE 2 BLOCKED. AVOID RIGHT LANE.
              </div>
              <div className="flex items-center justify-between text-[11px] text-inverse-primary">
                <span>Est. Travel to CTE: 28 mins (+18m)</span>
                <button
                  onClick={() => onEnlargeCamera(CAMERA_LOCATIONS.sle)}
                  className="text-secondary-fixed hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">videocam</span> CAM 7704
                </button>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-space-md rounded-xl shadow-md flex flex-col justify-between border-l-4 border-secondary-container">
              <div className="flex items-center justify-between text-label-sm font-label-sm text-inverse-primary">
                <span>VMS OVERHEAD BOARD • CTE KM 6.2</span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary">HEAVY FLOW</span>
              </div>
              <div className="my-space-sm font-mono text-[15px] tracking-wide text-secondary-fixed font-bold uppercase">
                CONGESTION FROM BRADDELL TO MOULMEIN RD. USE KPE FOR CITY.
              </div>
              <div className="flex items-center justify-between text-[11px] text-inverse-primary">
                <span>Est. Travel to AYE: 19 mins (+8m)</span>
                <button
                  onClick={() => onEnlargeCamera(CAMERA_LOCATIONS.cte)}
                  className="text-secondary-fixed hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">videocam</span> CAM 4702
                </button>
              </div>
            </div>

            <div className="bg-primary text-on-primary p-space-md rounded-xl shadow-md flex flex-col justify-between border-l-4 border-on-tertiary-container">
              <div className="flex items-center justify-between text-label-sm font-label-sm text-inverse-primary">
                <span>VMS OVERHEAD BOARD • TPE KM 11.0</span>
                <span className="px-1.5 py-0.5 rounded bg-on-tertiary-container text-on-primary">FREE FLOW</span>
              </div>
              <div className="my-space-sm font-mono text-[15px] tracking-wide text-tertiary-fixed font-bold uppercase">
                SMOOTH TRAFFIC TO CHANGI AIRPORT. DRIVE SAFELY, KEEP LEFT.
              </div>
              <div className="flex items-center justify-between text-[11px] text-inverse-primary">
                <span>Est. Travel to Changi T3: 14 mins</span>
                <button
                  onClick={() => onEnlargeCamera(CAMERA_LOCATIONS.tpe)}
                  className="text-secondary-fixed hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">videocam</span> CAM 6208
                </button>
              </div>
            </div>
          </div>

          {/* Corridor Velocity Matrix & PGS Parking Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">speed</span>
                  <span>Expressway Sector Telemetry</span>
                </h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["ALL", "CTE", "PIE", "AYE", "SLE", "TPE"].map((cor) => (
                    <button
                      key={cor}
                      onClick={() => setSelectedCorridor(cor)}
                      className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                        selectedCorridor === cor
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {cor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                {EXPRESSWAY_FLOW_INDEX.filter(
                  (item) => selectedCorridor === "ALL" || item.code.startsWith(selectedCorridor)
                ).map((item) => (
                  <div
                    key={item.code}
                    className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between gap-space-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          {item.code}
                        </span>
                        <span className="text-body-sm text-on-surface-variant ml-2">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-label-sm text-label-sm ${
                          item.status === "error"
                            ? "bg-error-container text-on-error-container"
                            : item.status === "moderate"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-tertiary-fixed text-on-tertiary-fixed"
                        }`}
                      >
                        {item.statusTitle}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span
                        className={`text-[24px] font-bold tabular-nums ${
                          item.status === "error"
                            ? "text-error"
                            : item.status === "moderate"
                            ? "text-secondary"
                            : "text-tertiary-container"
                        }`}
                      >
                        {item.speed}{" "}
                        <span className="text-[12px] font-normal text-on-surface-variant">
                          km/h avg
                        </span>
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Direction: {item.direction}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.barWidth} ${
                          item.status === "error"
                            ? "bg-error"
                            : item.status === "moderate"
                            ? "bg-secondary-container"
                            : "bg-on-tertiary-container"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PGS Real-Time Carpark Lots Sidebar */}
            <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    local_parking
                  </span>
                  <span>PGS Live Carpark Availability</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                  Real-time
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Electronic Parking Guidance System (PGS) lot counters across major commercial hubs.
              </p>
              <div className="flex flex-col gap-space-sm mt-1">
                {PGS_CARPARKS.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm"
                  >
                    <div>
                      <div className="font-label-sm text-label-sm text-secondary uppercase">
                        {cp.zone}
                      </div>
                      <div className="font-headline-sm text-[14px] text-primary">
                        {cp.name}
                      </div>
                      <button
                        onClick={() => onNavigateToPlanner(cp.name)}
                        className="text-[11px] text-primary font-semibold hover:underline mt-0.5 flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[13px]">directions</span>
                        Route here
                      </button>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[20px] font-bold text-tertiary-container tabular-nums">
                        {cp.lotsAvailable}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        of {cp.totalLots} lots
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ErpGantriesScreen: React.FC<SecondaryProps> = ({ onNavigateToPlanner }) => {
  const [vehicleClass, setVehicleClass] = useState<string>("cars");
  const [corridorFilter, setCorridorFilter] = useState<string>("ALL");

  const multiplier =
    vehicleClass === "motorcycles" ? 0.5 : vehicleClass === "heavy" ? 1.5 : 1.0;

  const formatRate = (rateStr: string) => {
    const val = parseFloat(rateStr.replace("$", ""));
    return `$${(val * multiplier).toFixed(2)}`;
  };

  const filteredGantries = ERP_GANTRIES.filter(
    (g) => corridorFilter === "ALL" || g.corridor.includes(corridorFilter)
  );

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low px-margin py-space-md shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded uppercase tracking-wider">
                ERP 2.0 &amp; GANTRY TELEMETRY
              </span>
              <span className="text-secondary font-label-md text-label-md font-bold uppercase tracking-wide">
                Active Surcharge Schedule
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight leading-tight">
              ERP Gantries &amp; Time-Band Rates
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
              Check current Electronic Road Pricing (ERP) charges across expressways, arterial roads, and the Central Business District (CBD) cordon.
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <select
              value={vehicleClass}
              onChange={(e) => setVehicleClass(e.target.value)}
              className="px-space-md py-2 rounded bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm outline-none cursor-pointer"
            >
              <option value="cars">Passenger Cars / Taxis (1.0x)</option>
              <option value="motorcycles">Motorcycles (0.5x)</option>
              <option value="heavy">Heavy Goods Vehicles / Buses (1.5x)</option>
            </select>
            <button
              onClick={() => onNavigateToPlanner()}
              className="px-space-md py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
            >
              Calculate Trip ERP
            </button>
          </div>
        </div>
      </section>

      <section className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-space-md">
          <div className="flex items-center justify-between flex-wrap gap-space-sm">
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "CTE", "CBD", "AYE", "PIE", "KPE", "MCE"].map((cor) => (
                <button
                  key={cor}
                  onClick={() => setCorridorFilter(cor)}
                  className={`px-3 py-1.5 rounded font-label-sm text-label-sm transition-colors ${
                    corridorFilter === cor
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {cor === "ALL" ? "All Corridors (68 Gantries)" : cor}
                </button>
              ))}
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Active Time Slot Highlighted: 09:00 - 09:30 SGT
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high text-primary font-label-sm text-label-sm uppercase">
                  <th className="py-3 px-4">Gantry ID</th>
                  <th className="py-3 px-4">Location &amp; Corridor</th>
                  <th className="py-3 px-4 text-right">08:00 - 08:30</th>
                  <th className="py-3 px-4 text-right">08:30 - 09:00</th>
                  <th className="py-3 px-4 text-right bg-secondary-fixed text-on-secondary-fixed">
                    09:00 - 09:30 (NOW)
                  </th>
                  <th className="py-3 px-4 text-right">09:30 - 10:00</th>
                  <th className="py-3 px-4 text-right">18:00 - 19:00</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                {filteredGantries.map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {g.gantryCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-headline-sm text-[14px] text-primary">
                        {g.name}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {g.corridor} • {g.direction}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatRate(g.rates["08:00-08:30"])}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatRate(g.rates["08:30-09:00"])}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-secondary bg-secondary-fixed/40">
                      {formatRate(g.rates["09:00-09:30"])}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatRate(g.rates["09:30-10:00"])}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatRate(g.rates["18:00-19:00"])}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded font-label-sm text-label-sm ${
                          g.status === "Active"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-tertiary-fixed text-on-tertiary-fixed"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export const CamerasScreen: React.FC<SecondaryProps> = ({ onEnlargeCamera }) => {
  const [filterExp, setFilterExp] = useState<string>("ALL");
  const cameras = Object.values(CAMERA_LOCATIONS).filter(
    (c) => filterExp === "ALL" || c.expressway === filterExp
  );

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low px-margin py-space-md shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded uppercase tracking-wider">
                EMAS SURVEILLANCE GRID
              </span>
              <span className="text-secondary font-label-md text-label-md font-bold uppercase tracking-wide">
                64 Live Optical Feeds
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight leading-tight">
              Expressway &amp; Checkpoint Traffic Cameras
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
              Live optical snapshots refreshed every 20 seconds across all Singapore expressways, Woodlands Causeway, and Tuas Second Link.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {["ALL", "CTE", "AYE", "PIE", "SLE", "BKE", "KPE", "TPE"].map((exp) => (
              <button
                key={exp}
                onClick={() => setFilterExp(exp)}
                className={`px-3 py-1.5 rounded font-label-sm text-label-sm transition-colors ${
                  filterExp === exp
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {cameras.map((cam) => (
            <div
              key={cam.key}
              className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-primary-container overflow-hidden">
                  <img
                    src={cam.image}
                    alt={cam.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-error text-on-error text-[10px] font-bold uppercase tracking-wider">
                    LIVE EMAS
                  </span>
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary/85 text-on-primary text-[10px] font-mono">
                    {cam.cam}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-primary font-label-sm text-label-sm">
                    {cam.expressway}
                  </span>
                </div>
                <div className="p-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-primary leading-snug">
                    {cam.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                    <span>
                      Avg Speed:{" "}
                      <strong
                        className={
                          cam.speedNum < 40
                            ? "text-error"
                            : cam.speedNum < 60
                            ? "text-secondary"
                            : "text-tertiary-container"
                        }
                      >
                        {cam.speed}
                      </strong>
                    </span>
                    <span className="font-mono text-[11px]">{cam.frameTime}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-on-surface-variant">
                    {cam.weather} • Vis: {cam.visibility}
                  </div>
                </div>
              </div>
              <div className="px-space-md pb-space-md">
                <button
                  onClick={() => onEnlargeCamera(cam)}
                  className="w-full py-2 rounded bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  <span>Inspect High-Def Feed</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const DigitalServicesScreen: React.FC<{
  mode: "digital-services" | "vehicle-ownership";
  onOpenSingpass: () => void;
}> = ({ mode, onOpenSingpass }) => {
  const [plateInput, setPlateInput] = useState("SBA 8824 X");
  const [lookupResult, setLookupResult] = useState<{
    plate: string;
    roadTaxExpiry: string;
    obuStatus: string;
    erpArrears: string;
    coeCategory: string;
  } | null>({
    plate: "SBA 8824 X",
    roadTaxExpiry: "18 Apr 2027 (Valid - GiRO Active)",
    obuStatus: "ERP 2.0 OBU Installed & Verified",
    erpArrears: "$0.00 (No Outstanding ERP Charges)",
    coeCategory: "Cat A (Car up to 1600cc & 97kW)",
  });

  const handleCheckVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;
    setLookupResult({
      plate: plateInput.toUpperCase(),
      roadTaxExpiry: "18 Apr 2027 (Valid - GiRO Active)",
      obuStatus: "ERP 2.0 OBU Installed & Verified",
      erpArrears: "$0.00 (No Outstanding ERP Charges)",
      coeCategory: "Cat A (Car up to 1600cc & 97kW)",
    });
  };

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low px-margin py-space-md shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded uppercase tracking-wider">
                LTA E-SERVICES GATEWAY
              </span>
              <span className="text-secondary font-label-md text-label-md font-bold uppercase tracking-wide">
                {mode === "digital-services"
                  ? "Digital Transactions & VEP"
                  : "Vehicle Ownership & COE Bidding"}
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight leading-tight">
              {mode === "digital-services"
                ? "Digital Services, Road Tax & ERP 2.0 OBU"
                : "Owning & Driving: COE Open Bidding & Rebates"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
              Manage vehicle registration, Road Tax renewals, Certificate of Entitlement (COE) open bidding exercises, and Foreign Vehicle Entry Permits (VEP).
            </p>
          </div>
          <button
            onClick={onOpenSingpass}
            className="px-space-md py-2 rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Access MyVehicle Dashboard via Singpass</span>
          </button>
        </div>
      </section>

      <section className="w-full px-margin py-space-lg">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left 5 cols: Instant Vehicle Status Lookup */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">directions_car</span>
                <span>Quick Vehicle Compliance Inquiry</span>
              </h2>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                Instant Check
              </span>
            </div>
            <form onSubmit={handleCheckVehicle} className="flex gap-space-xs">
              <input
                type="text"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value)}
                placeholder="Enter Vehicle Registration No. (e.g. SBA 8824 X)"
                className="flex-1 px-3 py-2 rounded bg-surface font-body-sm text-body-sm text-on-surface outline-none focus:bg-surface-container-low"
              />
              <button
                type="submit"
                className="px-space-md py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
              >
                Verify
              </button>
            </form>

            {lookupResult && (
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                <div className="flex items-center justify-between border-b border-surface-container-highest pb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Registered Plate
                  </span>
                  <span className="font-mono font-bold text-primary text-[15px]">
                    {lookupResult.plate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-body-sm">
                  <span className="text-on-surface-variant">Road Tax Validity:</span>
                  <span className="font-semibold text-tertiary-container">
                    {lookupResult.roadTaxExpiry}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-body-sm">
                  <span className="text-on-surface-variant">ERP 2.0 On-Board Unit:</span>
                  <span className="font-semibold text-primary">{lookupResult.obuStatus}</span>
                </div>
                <div className="flex items-center justify-between py-1 text-body-sm">
                  <span className="text-on-surface-variant">ERP / Notice Status:</span>
                  <span className="font-semibold text-tertiary-container">
                    {lookupResult.erpArrears}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 text-body-sm">
                  <span className="text-on-surface-variant">COE Classification:</span>
                  <span className="font-semibold text-primary">{lookupResult.coeCategory}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right 7 cols: Latest COE Open Bidding Exercise Results */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  October 2026 1st Open Bidding Exercise (COE)
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Official Quota Premium (QP) and Prevailing Quota Premium (PQP) rates across vehicle categories.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                Live Exercise
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-primary font-label-sm text-label-sm uppercase">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Vehicle Classification</th>
                    <th className="py-2.5 px-3 text-right">Quota</th>
                    <th className="py-2.5 px-3 text-right">Bids</th>
                    <th className="py-2.5 px-3 text-right">Quota Premium (QP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-primary">Cat A</td>
                    <td className="py-2.5 px-3">Cars up to 1600cc &amp; 97kW / EVs up to 110kW</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">1,042</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">1,489</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      $96,400
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-primary">Cat B</td>
                    <td className="py-2.5 px-3">Cars above 1600cc or 97kW / EVs above 110kW</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">685</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">992</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      $108,001
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-primary">Cat C</td>
                    <td className="py-2.5 px-3">Goods Vehicles &amp; Buses</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">234</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">356</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      $71,500
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-primary">Cat D</td>
                    <td className="py-2.5 px-3">Motorcycles</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">520</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">641</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      $9,389
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-primary">Cat E</td>
                    <td className="py-2.5 px-3">Open Category (All except motorcycles)</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">182</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">318</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary tabular-nums">
                      $109,500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
