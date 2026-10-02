import React, { useRef, useState } from "react";
import {
  CAMERA_LOCATIONS,
  CCTV_PRIMARY_IMG,
  CLOSURE_ITEMS,
  CameraLocation,
  ClosureItem,
  ERP_GANTRIES,
  PGS_CARPARKS,
} from "./data/trafficData";
import {
  CamerasScreen,
  DigitalServicesScreen,
  ErpGantriesScreen,
  LiveTrafficMapScreen,
} from "./components/SecondaryScreens";
import {
  ApiHealthModal,
  ClosureBlueprintModal,
  EnlargeCameraModal,
  ReportHazardModal,
  SingpassModal,
} from "./components/PortalModals";

type NavPage =
  | "live-traffic-map"
  | "route-planner"
  | "erp-rates"
  | "expressway-cameras"
  | "digital-services"
  | "vehicle-ownership";

export default function App() {
  const [activeNav, setActiveNav] = useState<NavPage>("route-planner");
  const [mainTab, setMainTab] = useState<"updates" | "closures" | "works">("updates");
  const [showGovIdentify, setShowGovIdentify] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [origin, setOrigin] = useState("Woodlands Ave 2 (Blk 883)");
  const [destination, setDestination] = useState("Marina Bay Financial Centre Tower 2");
  const [preference, setPreference] = useState<"fastest" | "notolls" | "noincidents">("fastest");
  const [routePulsing, setRoutePulsing] = useState(false);

  const [audioAlerts, setAudioAlerts] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [layers, setLayers] = useState({
    speed: true,
    incidents: true,
    cameras: false,
    erp: false,
    pgs: false,
  });
  const [mapRefreshing, setMapRefreshing] = useState(false);
  const [pulsingIncident, setPulsingIncident] = useState<string | null>(null);

  const [activeCameraKey, setActiveCameraKey] = useState<string>("cte");
  const [cameraSelectValue, setCameraSelectValue] = useState<string>("");
  const [enlargedCamera, setEnlargedCamera] = useState<CameraLocation | null>(null);

  const [closureFilter, setClosureFilter] = useState<
    "all" | "events" | "temporary" | "permanent"
  >("all");
  const [selectedClosureItem, setSelectedClosureItem] = useState<ClosureItem | null>(null);

  const [hazardModalOpen, setHazardModalOpen] = useState(false);
  const [singpassModalOpen, setSingpassModalOpen] = useState(false);
  const [isSingpassLoggedIn, setIsSingpassLoggedIn] = useState(false);
  const [apiHealthModalOpen, setApiHealthModalOpen] = useState(false);
  const [liveIncidentsCount, setLiveIncidentsCount] = useState<number>(8);
  const [liveFloodCount, setLiveFloodCount] = useState<number>(0);

  // Poll /api/traffic-incidents and /api/flood-alerts
  React.useEffect(() => {
    fetch("/api/traffic-incidents")
      .then((res) => res.json())
      .then((data) => {
        if (data.value && Array.isArray(data.value)) {
          setLiveIncidentsCount(data.value.length);
        }
      })
      .catch(() => {});

    fetch("/api/flood-alerts")
      .then((res) => res.json())
      .then((data) => {
        if (data.value && Array.isArray(data.value)) {
          setLiveFloodCount(data.value.length);
        }
      })
      .catch(() => {});
  }, []);

  const cctvBoxRef = useRef<HTMLDivElement>(null);
  const slePinRef = useRef<HTMLDivElement>(null);
  const closuresSectionRef = useRef<HTMLElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const getRouteTelemetry = () => {
    const destLower = destination.toLowerCase();
    if (destLower.includes("changi")) {
      return {
        mins: preference === "notolls" ? 31 : 26,
        km: "29.8 km",
        delay: "+2m delay",
        corridor: "SLE → TPE → ECP (Changi)",
        note: "Smooth traffic along TPE Eastbound.",
        erpCount: preference === "notolls" ? 0 : 1,
        erpOriginal: "$2.00",
        erpTotal: preference === "notolls" ? "$0.00 Total" : "$1.00 Total",
        gantries:
          preference === "notolls"
            ? [{ label: "• Avoided TPE/PIE Gantries (Arterial Bypass):", price: "$0.00" }]
            : [{ label: "• TPE Eastbound before Punggol:", price: "$1.00" }],
        svgPath: "M 372,252 Q 440,240 520,260 Q 640,250 780,290 L 870,330",
        destCoords: { x: 870, y: 330, label: "DESTINATION (CHANGI T3)" },
      };
    }
    if (destLower.includes("tuas")) {
      return {
        mins: 29,
        km: "27.1 km",
        delay: "+11m delay",
        corridor: "BKE → PIE → AYE (Tuas)",
        note: "Heavy slowdown approaching Tuas West Rd.",
        erpCount: preference === "notolls" ? 0 : 1,
        erpOriginal: "$3.00",
        erpTotal: preference === "notolls" ? "$0.00 Total" : "$1.50 Total",
        gantries: [
          {
            label: "• AYE Westbound before Tuas Checkpoint:",
            price: preference === "notolls" ? "$0.00" : "$1.50",
          },
        ],
        svgPath: "M 370,250 L 375,320 L 380,380 Q 260,390 130,400 L 140,430",
        destCoords: { x: 140, y: 430, label: "DESTINATION (TUAS)" },
      };
    }
    if (destLower.includes("jurong")) {
      return {
        mins: 22,
        km: "19.5 km",
        delay: "+4m delay",
        corridor: "BKE → PIE → Jurong Town Hall Rd",
        note: "Moderate flow along PIE Westbound.",
        erpCount: 0,
        erpOriginal: "$1.50",
        erpTotal: "$0.00 Total",
        gantries: [{ label: "• BKE / PIE Off-Peak Corridor:", price: "$0.00" }],
        svgPath: "M 370,250 L 375,320 L 380,380 Q 300,388 240,395",
        destCoords: { x: 240, y: 395, label: "DESTINATION (JURONG)" },
      };
    }
    if (preference === "notolls") {
      return {
        mins: 43,
        km: "28.9 km",
        delay: "+9m delay",
        corridor: "BKE → Lornie Hwy → Queensway",
        note: "ERP-free arterial route bypassing CTE & CBD Cordon.",
        erpCount: 0,
        erpOriginal: "$3.00",
        erpTotal: "$0.00 Total",
        gantries: [
          { label: "• CTE Braddell Sbound (Bypassed):", price: "$0.00" },
          { label: "• CBD Cordon Sheares Ave (Bypassed):", price: "$0.00" },
        ],
        svgPath: "M 370,250 L 375,320 L 380,380 Q 450,435 520,495 L 535,490",
        destCoords: { x: 535, y: 490, label: "DESTINATION (MBFC)" },
      };
    }
    if (preference === "noincidents") {
      return {
        mins: 37,
        km: "30.2 km",
        delay: "+3m delay",
        corridor: "TPE → KPE Tunnel → MCE",
        note: "Bypasses SLE Mandai accident & CTE Moulmein slowdown.",
        erpCount: 2,
        erpOriginal: "$5.00",
        erpTotal: "$3.00 Total",
        gantries: [
          { label: "• KPE Southbound after Defu Flyover:", price: "$2.00" },
          { label: "• CBD Cordon Sheares Ave:", price: "$1.00" },
        ],
        svgPath: "M 372,252 Q 440,240 520,260 Q 560,280 600,320 L 585,410 L 555,480 L 535,490",
        destCoords: { x: 535, y: 490, label: "DESTINATION (MBFC)" },
      };
    }
    return {
      mins: 34,
      km: "26.4 km",
      delay: "+8m delay",
      corridor: "SLE → CTE → Marina Blvd",
      note: "Congestion detected along CTE after Moulmein Rd.",
      erpCount: 2,
      erpOriginal: "$5.00",
      erpTotal: "$3.00 Total",
      gantries: [
        { label: "• CTE Braddell Sbound (09:00 - 09:30):", price: "$2.00" },
        { label: "• CBD Cordon Sheares Ave:", price: "$1.00" },
      ],
      svgPath: "M 372,252 Q 440,240 520,260 L 515,340 L 510,420 L 520,495 L 535,490",
      destCoords: { x: 535, y: 490, label: "DESTINATION (MBFC)" },
    };
  };

  const telemetry = getRouteTelemetry();
  const activeCamera = CAMERA_LOCATIONS[activeCameraKey] || CAMERA_LOCATIONS.cte;

  const handlePreviewCamera = (key: string) => {
    if (CAMERA_LOCATIONS[key]) {
      setActiveCameraKey(key);
      cctvBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleJumpToCamera = (key: string) => {
    setCameraSelectValue(key);
    if (key) {
      handlePreviewCamera(key);
    }
  };

  const handleCycleNextCamera = () => {
    const keys = Object.keys(CAMERA_LOCATIONS);
    const currentIndex = keys.indexOf(activeCameraKey);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    setActiveCameraKey(nextKey);
  };

  const handleSwapRoute = () => {
    setOrigin(destination);
    setDestination(origin);
    handleRecalculateRoute();
  };

  const handleGetCurrentLocation = () => {
    setOrigin("Current Location (Ang Mo Kio Ave 3)");
    triggerToast("GPS Location acquired: Ang Mo Kio Ave 3");
  };

  const handleRecalculateRoute = () => {
    setRoutePulsing(true);
    setTimeout(() => setRoutePulsing(false), 350);
  };

  const handleToggleMapLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoomToIncident = (type: string) => {
    setPulsingIncident(type);
    slePinRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setPulsingIncident(null), 900);
  };

  const handleRefreshMapData = () => {
    setMapRefreshing(true);
    setTimeout(() => {
      setMapRefreshing(false);
      triggerToast("EMAS Telemetry & OneMap GIS layers synchronized.");
    }, 350);
  };

  const handleSwitchMainTab = (tab: "updates" | "closures" | "works") => {
    setMainTab(tab);
    if (tab === "closures") {
      setClosureFilter("all");
      closuresSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "works") {
      setClosureFilter("permanent");
      closuresSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;
    if (q.includes("erp") || q.includes("gantry")) {
      setActiveNav("erp-rates");
      return;
    }
    if (q.includes("cam") || q.includes("cctv") || q.includes("tuas") || q.includes("woodlands")) {
      if (q.includes("tuas")) handlePreviewCamera("tuas");
      else if (q.includes("woodlands")) handlePreviewCamera("woodlands");
      else setActiveNav("expressway-cameras");
      return;
    }
    setDestination(searchQuery.trim());
    setActiveNav("route-planner");
    handleRecalculateRoute();
    triggerToast(`Route destination updated to "${searchQuery.trim()}"`);
  };

  const visibleClosures = CLOSURE_ITEMS.filter(
    (c) => closureFilter === "all" || c.category === closureFilter
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-primary text-on-primary px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm border border-primary-container">
          <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
            check_circle
          </span>
          <span className="font-body-sm text-body-sm">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-inverse-primary hover:text-on-primary ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-40 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(11,37,69,0.06)]">
        <div className="bg-surface-container-high w-full py-1 px-margin">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[14px] text-primary">
                account_balance
              </span>
              <span>A Singapore Government Agency Website</span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="hidden sm:inline">
                Official Public Transport &amp; Traffic Gateway
              </span>
              <button
                type="button"
                onClick={() => setShowGovIdentify((prev) => !prev)}
                className="hover:text-primary cursor-pointer flex items-center gap-0.5"
              >
                <span>How to identify</span>
                <span className="material-symbols-outlined text-[13px]">
                  {showGovIdentify ? "expand_less" : "expand_more"}
                </span>
              </button>
            </div>
          </div>
          {showGovIdentify && (
            <div className="max-w-[1440px] mx-auto py-2 mt-1 border-t border-outline-variant/40 grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm text-on-surface">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                  verified
                </span>
                <div>
                  <strong>Official website links end with .gov.sg</strong>
                  <p className="text-on-surface-variant text-[11px]">
                    Government agencies communicate via .gov.sg websites (e.g. onemotoring.lta.gov.sg).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                  lock
                </span>
                <div>
                  <strong>Secure websites use HTTPS</strong>
                  <p className="text-on-surface-variant text-[11px]">
                    Look for a lock icon or https:// as an added precaution. Share sensitive information only on official, secure websites.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-28 max-w-[1440px] mx-auto px-margin flex flex-col justify-center">
          <div className="flex items-center justify-between py-space-xs">
            <div className="flex items-center gap-space-lg">
              <button
                type="button"
                onClick={() => setActiveNav("route-planner")}
                className="flex items-center gap-space-sm text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[22px]">
                    traffic
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-primary leading-tight tracking-tight">
                    OneMotoring
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                    Land Transport Authority
                  </span>
                </div>
              </button>

              <nav className="hidden xl:flex items-center gap-space-sm">
                {(
                  [
                    { id: "live-traffic-map", label: "Live Traffic Map" },
                    { id: "route-planner", label: "Route Planner" },
                    { id: "erp-rates", label: "ERP Gantries" },
                    { id: "expressway-cameras", label: "Cameras" },
                    { id: "digital-services", label: "Digital Services" },
                    { id: "vehicle-ownership", label: "Owning & Driving" },
                  ] as { id: NavPage; label: string }[]
                ).map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "transition-colors bg-primary-container text-on-primary font-headline-sm px-space-md py-space-xs rounded cursor-pointer"
                          : "px-space-md py-space-xs text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-colors cursor-pointer"
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-space-md">
              <form
                onSubmit={handleGlobalSearch}
                className="hidden md:flex items-center bg-surface-container-low px-space-md py-space-xs rounded gap-space-sm"
              >
                <span className="material-symbols-outlined text-outline text-[18px]">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent font-body-sm text-body-sm text-on-surface outline-none w-52 placeholder:text-outline"
                  placeholder="Search expressways, gantries, postal..."
                  type="text"
                />
              </form>
              <button
                type="button"
                onClick={() => setSingpassModalOpen(true)}
                className="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs bg-primary text-on-primary font-headline-sm text-headline-sm rounded hover:bg-primary-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>{isSingpassLoggedIn ? "MyVehicle" : "Singpass"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSingpassModalOpen(true)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
                title="Motorist Account Profile"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-xs font-label-md text-label-md">
            <div className="flex items-center gap-space-lg overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                <span className="text-on-surface font-bold">Live Traffic Conditions:</span>
                <span className="text-on-surface-variant">Active Monitoring</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-on-surface font-bold">Island-wide Incidents:</span>
                <span className="text-on-surface-variant">8 Verified Alerts</span>
              </div>
              <div className="hidden sm:flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[14px] text-outline">
                  schedule
                </span>
                <span className="text-on-surface-variant">Updated: Just now</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-space-md">
              <button
                type="button"
                onClick={() => setHazardModalOpen(true)}
                className="text-secondary hover:text-on-secondary-container flex items-center gap-space-xs font-label-md text-label-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">report</span>
                <span>Report Road Hazard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-28 bg-surface flex-1">
        {activeNav === "live-traffic-map" && (
          <LiveTrafficMapScreen
            onNavigateToPlanner={(dest) => {
              if (dest) setDestination(dest);
              setActiveNav("route-planner");
            }}
            onEnlargeCamera={(cam) => setEnlargedCamera(cam)}
            onOpenHazardModal={() => setHazardModalOpen(true)}
          />
        )}

        {activeNav === "erp-rates" && (
          <ErpGantriesScreen
            onNavigateToPlanner={() => setActiveNav("route-planner")}
            onEnlargeCamera={(cam) => setEnlargedCamera(cam)}
            onOpenHazardModal={() => setHazardModalOpen(true)}
          />
        )}

        {activeNav === "expressway-cameras" && (
          <CamerasScreen
            onNavigateToPlanner={() => setActiveNav("route-planner")}
            onEnlargeCamera={(cam) => setEnlargedCamera(cam)}
            onOpenHazardModal={() => setHazardModalOpen(true)}
          />
        )}

        {(activeNav === "digital-services" || activeNav === "vehicle-ownership") && (
          <DigitalServicesScreen
            mode={activeNav}
            onOpenSingpass={() => setSingpassModalOpen(true)}
          />
        )}

        {activeNav === "route-planner" && (
          <div className="flex flex-col w-full">
            <section className="w-full bg-surface-container-high py-space-sm px-margin">
              <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                  <button
                    type="button"
                    onClick={() => setActiveNav("route-planner")}
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </button>
                  <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                  <button
                    type="button"
                    onClick={() => setActiveNav("vehicle-ownership")}
                    className="hover:text-primary transition-colors"
                  >
                    Driving
                  </button>
                  <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                  <button
                    type="button"
                    onClick={() => setActiveNav("live-traffic-map")}
                    className="hover:text-primary transition-colors"
                  >
                    Traffic Information &amp; Road Works
                  </button>
                  <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                  <span className="text-primary font-bold">
                    Traffic Updates, Road Closures &amp; Road Works
                  </span>
                </div>
                <div className="flex items-center gap-space-md">
                  <button
                    type="button"
                    onClick={() => setApiHealthModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
                    title="Click to check LTA DataMall and OneMap API health status"
                  >
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
                    <span>EMAS Telemetry Sync: Online</span>
                    <span className="material-symbols-outlined text-[13px] text-outline">info</span>
                  </button>
                  <span className="text-on-surface-variant font-label-sm text-label-sm hidden md:inline">
                    Data Refreshed: Today, 09:24 SGT
                  </span>
                </div>
              </div>
            </section>

            <section className="w-full bg-surface-container-low px-margin py-space-md shadow-sm">
              <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded uppercase tracking-wider">
                      LTA traffic.smart
                    </span>
                    <span className="text-secondary font-label-md text-label-md font-bold uppercase tracking-wide">
                      Live Operations Portal
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight leading-tight">
                    Traffic Updates, Road Closures &amp; Road Works
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-3xl">
                    Real-time intelligent transit monitoring, dynamic expressway camera telemetry, ERP gantry surcharge tracking, and route disruption guidance across Singapore.
                  </p>
                </div>

                <div className="flex items-center bg-surface-container p-1 rounded-lg self-start md:self-auto shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleSwitchMainTab("updates")}
                    className={
                      mainTab === "updates"
                        ? "px-space-md py-space-xs rounded bg-surface-container-lowest text-primary font-headline-sm text-headline-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        : "px-space-md py-space-xs rounded text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      traffic
                    </span>
                    <span>Traffic Updates</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchMainTab("closures")}
                    className={
                      mainTab === "closures"
                        ? "px-space-md py-space-xs rounded bg-surface-container-lowest text-primary font-headline-sm text-headline-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        : "px-space-md py-space-xs rounded text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">no_crash</span>
                    <span>Closures</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface text-[10px] font-bold">
                      14
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchMainTab("works")}
                    className={
                      mainTab === "works"
                        ? "px-space-md py-space-xs rounded bg-surface-container-lowest text-primary font-headline-sm text-headline-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        : "px-space-md py-space-xs rounded text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">engineering</span>
                    <span>Road Works</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-surface-variant text-on-surface text-[10px] font-bold">
                      42
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <section className="w-full px-margin py-space-lg">
              <div className="max-w-[1440px] mx-auto">
                <div className="w-full mb-space-md p-space-md rounded-xl bg-error-container text-on-error-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded bg-error text-on-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                    <div>
                      <div className="font-headline-sm text-headline-sm text-on-error-container flex items-center gap-2">
                        <span>SLE &amp; CTE Major Congestion Advisory</span>
                        <span className="px-2 py-0.5 text-label-sm font-label-sm rounded bg-error text-on-error uppercase font-bold">
                          Severe Delay (+18m)
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-error-container mt-0.5">
                        Accident on SLE (towards CTE) after Mandai Ave with tailback extending 3.8km to Woodlands Ave 2. Vehicles breakdown at Bartley Rd &amp; AYE Tuas West.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm shrink-0">
                    <button
                      type="button"
                      onClick={() => handleZoomToIncident("sle")}
                      className="px-space-md py-space-xs bg-error text-on-error font-label-md text-label-md rounded shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        travel_explore
                      </span>
                      <span>Locate on Map</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioAlerts((prev) => !prev)}
                      className={`px-space-md py-space-xs font-label-md text-label-md rounded shadow-sm transition-colors flex items-center gap-1 cursor-pointer ${
                        audioAlerts
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        notifications_active
                      </span>
                      <span>{audioAlerts ? "Sound Alert: ON" : "Sound Alert: Off"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                  <div className="lg:col-span-4 flex flex-col gap-space-md">
                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md">
                      <div className="flex items-center justify-between pb-space-sm">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-primary text-[22px]">
                            alt_route
                          </span>
                          <h2 className="font-headline-md text-headline-md text-primary">
                            Plan Your Journey
                          </h2>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                          Dynamic AI Route
                        </span>
                      </div>

                      <div className="mt-space-sm flex flex-col gap-space-sm relative">
                        <div className="absolute left-[19px] top-[34px] bottom-[48px] w-0.5 bg-surface-container-highest z-0"></div>

                        <div className="relative z-10 flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 text-[12px] font-bold">
                            A
                          </div>
                          <div className="flex-1 relative">
                            <input
                              className="w-full pl-3 pr-10 py-2 rounded bg-surface font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-low transition-colors"
                              placeholder="Enter Starting Point..."
                              type="text"
                              value={origin}
                              onChange={(e) => setOrigin(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={handleGetCurrentLocation}
                              className="absolute right-2 top-2 text-outline hover:text-primary cursor-pointer"
                              title="Use Current GPS"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                my_location
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="relative z-10 flex justify-end pr-3 -my-2">
                          <button
                            type="button"
                            onClick={handleSwapRoute}
                            className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary flex items-center justify-center shadow-sm transition-transform active:rotate-180 cursor-pointer"
                            title="Swap Origin and Destination"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              swap_vert
                            </span>
                          </button>
                        </div>

                        <div className="relative z-10 flex items-center gap-space-xs">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shrink-0 text-[12px] font-bold">
                            B
                          </div>
                          <div className="flex-1 relative">
                            <input
                              className="w-full pl-3 pr-10 py-2 rounded bg-surface font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-low transition-colors"
                              placeholder="Enter Destination..."
                              type="text"
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast("Saved to Favorite Commute Destinations.")
                              }
                              className="absolute right-2 top-2 text-outline hover:text-primary cursor-pointer"
                              title="Recent Favorites"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                star
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-space-sm pt-space-xs flex items-center gap-1.5 flex-wrap">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Presets:
                        </span>
                        <button
                          type="button"
                          onClick={() => setDestination("Changi Airport T3")}
                          className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                        >
                          Changi T3
                        </button>
                        <button
                          type="button"
                          onClick={() => setDestination("Tuas Checkpoint")}
                          className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                        >
                          Tuas Checkpoint
                        </button>
                        <button
                          type="button"
                          onClick={() => setDestination("Jurong East Westgate")}
                          className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                        >
                          Jurong Gateway
                        </button>
                      </div>

                      <div className="mt-space-md p-space-sm rounded bg-surface-container-low flex flex-col gap-2">
                        <span className="font-label-md text-label-md text-primary font-bold">
                          Routing Preferences
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setPreference("fastest")}
                            className={
                              preference === "fastest"
                                ? "p-1.5 rounded text-center bg-primary text-on-primary font-label-sm text-label-sm flex flex-col items-center gap-1 cursor-pointer"
                                : "p-1.5 rounded text-center bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex flex-col items-center gap-1 cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">speed</span>
                            <span>Fastest</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreference("notolls")}
                            className={
                              preference === "notolls"
                                ? "p-1.5 rounded text-center bg-primary text-on-primary font-label-sm text-label-sm flex flex-col items-center gap-1 cursor-pointer"
                                : "p-1.5 rounded text-center bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex flex-col items-center gap-1 cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">toll</span>
                            <span>Avoid ERP</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreference("noincidents")}
                            className={
                              preference === "noincidents"
                                ? "p-1.5 rounded text-center bg-primary text-on-primary font-label-sm text-label-sm flex flex-col items-center gap-1 cursor-pointer"
                                : "p-1.5 rounded text-center bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex flex-col items-center gap-1 cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              report_off
                            </span>
                            <span>Avoid Alerts</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-space-md p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-headline-xl text-headline-xl text-primary font-bold">
                              {telemetry.mins}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-primary">
                              mins
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                              ({telemetry.km})
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              trending_up
                            </span>
                            {telemetry.delay}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Via <strong className="text-primary">{telemetry.corridor}</strong>.{" "}
                          {telemetry.note}
                        </p>

                        <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface font-label-md text-label-md">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-secondary text-[16px]">
                              credit_card
                            </span>
                            <span>Active ERP Gantries ({telemetry.erpCount}):</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-on-surface-variant line-through text-body-sm">
                              {telemetry.erpOriginal}
                            </span>
                            <span className="font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm">
                              {telemetry.erpTotal}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-on-surface-variant flex flex-col gap-1 pl-1">
                          {telemetry.gantries.map((g, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span>{g.label}</span>
                              <span className="font-semibold text-primary">{g.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRecalculateRoute}
                        className="mt-space-md w-full py-2.5 rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          navigation
                        </span>
                        <span>Calculate Optimal Travel Route</span>
                      </button>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-secondary text-[20px]">
                            notification_important
                          </span>
                          <h3 className="font-headline-sm text-headline-sm text-primary">
                            Live Alerts On Your Route
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                          3 Impacting
                        </span>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
                        <div className="flex items-center justify-between pl-1">
                          <span className="font-label-sm text-label-sm uppercase font-bold text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              car_crash
                            </span>
                            Accident • Lane 2 Blocked
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            08:52 SGT
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-semibold pl-1">
                          Accident on AYE (towards Tuas) after Tuas West Rd. Avoid lane 2.
                        </p>
                        <div className="flex items-center justify-between pl-1 pt-1">
                          <span className="text-[11px] text-on-surface-variant">
                            Severity: Heavy Slowdown
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreviewCamera("tuas")}
                            className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              videocam
                            </span>{" "}
                            View CCTV
                          </button>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
                        <div className="flex items-center justify-between pl-1">
                          <span className="font-label-sm text-label-sm uppercase font-bold text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              car_repair
                            </span>
                            Vehicle Breakdown
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            09:22 SGT
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-semibold pl-1">
                          Vehicle Breakdown on SLE (towards CTE) after Woodlands Ave 2. Lane 2 obstruction.
                        </p>
                        <div className="flex items-center justify-between pl-1 pt-1">
                          <span className="text-[11px] text-on-surface-variant">
                            EMAS Tow Truck Dispatched
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreviewCamera("woodlands")}
                            className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              videocam
                            </span>{" "}
                            View CCTV
                          </button>
                        </div>
                      </div>

                      <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                        <div className="flex items-center justify-between pl-1">
                          <span className="font-label-sm text-label-sm uppercase font-bold text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              traffic
                            </span>
                            Expressway Slowdown
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            09:18 SGT
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-semibold pl-1">
                          Incident on CTE (towards AYE) after Moulmein Rd. Speed averaging 28km/h.
                        </p>
                        <div className="flex items-center justify-between pl-1 pt-1">
                          <span className="text-[11px] text-on-surface-variant">
                            Estimated Clearing: 25 mins
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePreviewCamera("cte")}
                            className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              videocam
                            </span>{" "}
                            View CCTV
                          </button>
                        </div>
                      </div>

                      <div className="p-space-sm rounded bg-surface-container flex items-center justify-between gap-space-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-outline text-[18px]">
                            sms
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            Notify via Gov SMS alert
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !smsEnabled;
                            setSmsEnabled(nextState);
                            triggerToast(
                              nextState
                                ? "Gov.sg Traffic Alerts: SMS notifications activated for this planned journey route."
                                : "Gov.sg SMS route notifications paused."
                            );
                          }}
                          className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors cursor-pointer ${
                            smsEnabled
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary"
                          }`}
                        >
                          {smsEnabled ? "Enabled" : "Enable"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col gap-space-md">
                    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col">
                      <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleMapLayer("speed")}
                            className={
                              layers.speed
                                ? "px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                : "px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex items-center gap-1 transition-all cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">speed</span>
                            <span>Traffic Speed</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMapLayer("incidents")}
                            className={
                              layers.incidents
                                ? "px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                : "px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex items-center gap-1 transition-all cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              crisis_alert
                            </span>
                            <span>Incidents / Alerts</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMapLayer("cameras")}
                            className={
                              layers.cameras
                                ? "px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                : "px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex items-center gap-1 transition-all cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              videocam
                            </span>
                            <span>Cameras (64)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMapLayer("erp")}
                            className={
                              layers.erp
                                ? "px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                : "px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex items-center gap-1 transition-all cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">toll</span>
                            <span>ERP Gantries</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMapLayer("pgs")}
                            className={
                              layers.pgs
                                ? "px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                : "px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high flex items-center gap-1 transition-all cursor-pointer"
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              local_parking
                            </span>
                            <span>PGS Parking</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-space-xs">
                          <select
                            value={cameraSelectValue}
                            onChange={(e) => handleJumpToCamera(e.target.value)}
                            className="text-[12px] bg-surface-container-lowest font-body-sm text-primary py-1 px-2 rounded outline-none shadow-sm cursor-pointer"
                          >
                            <option value="">Jump to Camera...</option>
                            <option value="woodlands">Woodlands Checkpoint</option>
                            <option value="tuas">Tuas Checkpoint</option>
                            <option value="cte">CTE (Braddell Flyover)</option>
                            <option value="sentosa">Sentosa Gateway</option>
                            <option value="pie">PIE (Jurong East)</option>
                          </select>
                          <button
                            type="button"
                            onClick={handleRefreshMapData}
                            className="p-1 rounded bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                            title="Reload Feed"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              refresh
                            </span>
                          </button>
                        </div>
                      </div>

                      <div
                        className={`relative w-full h-[520px] bg-[#dbe8fc] overflow-hidden select-none transition-opacity duration-300 ${
                          mapRefreshing ? "opacity-70" : "opacity-100"
                        }`}
                      >
                        <svg
                          className="w-full h-full object-cover pointer-events-auto"
                          viewBox="0 0 1000 620"
                        >
                          <defs>
                            <linearGradient
                              id="islandLandGrad"
                              x1="0%"
                              x2="100%"
                              y1="0%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#ffffff"></stop>
                              <stop offset="100%" stopColor="#f0f4fd"></stop>
                            </linearGradient>
                            <filter
                              height="140%"
                              id="routeGlow"
                              width="140%"
                              x="-20%"
                              y="-20%"
                            >
                              <feDropShadow
                                dx="0"
                                dy="1"
                                floodColor="#001026"
                                floodOpacity="0.35"
                                stdDeviation="2"
                              ></feDropShadow>
                            </filter>
                          </defs>

                          <path
                            d="M 120,380 
                               C 130,340 180,310 240,300 
                               C 280,260 340,240 420,240 
                               C 480,210 580,215 670,240 
                               C 740,230 810,250 860,280 
                               C 895,300 930,330 920,360 
                               C 910,380 870,400 830,420 
                               C 780,440 730,460 670,470 
                               C 610,480 540,510 470,510 
                               C 390,520 330,490 270,480 
                               C 210,480 160,450 130,420 Z"
                            fill="url(#islandLandGrad)"
                            stroke="#c4d5f5"
                            strokeWidth="2"
                          ></path>

                          <path
                            d="M 210,510 C 240,500 270,515 280,535 C 270,555 230,560 200,545 Z"
                            fill="#f0f4fd"
                            stroke="#c4d5f5"
                            strokeWidth="1.5"
                          ></path>
                          <path
                            d="M 450,535 C 480,530 510,540 500,560 C 470,565 440,550 450,535 Z"
                            fill="#f0f4fd"
                            stroke="#c4d5f5"
                            strokeWidth="1.5"
                          ></path>
                          <path
                            d="M 525,545 C 540,540 555,548 550,558 C 535,562 520,555 525,545 Z"
                            fill="#f0f4fd"
                            stroke="#c4d5f5"
                            strokeWidth="1.5"
                          ></path>

                          <path
                            d="M 430,300 C 445,315 440,335 430,345 C 415,340 415,315 430,300 Z"
                            fill="#dbe8fc"
                            opacity="0.8"
                          ></path>
                          <path
                            d="M 470,330 C 485,340 490,365 475,370 C 460,365 460,345 470,330 Z"
                            fill="#dbe8fc"
                            opacity="0.8"
                          ></path>

                          <g
                            className={`transition-opacity duration-300 ${
                              layers.speed ? "opacity-100" : "opacity-25"
                            }`}
                          >
                            <g>
                              <path
                                d="M 130,400 Q 260,390 380,380"
                                fill="none"
                                stroke="#fc6018"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                              <path
                                d="M 380,380 Q 520,375 660,380"
                                fill="none"
                                stroke="#ba1a1a"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                              <path
                                d="M 660,380 Q 780,385 890,340"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 140,430 Q 240,445 350,440"
                                fill="none"
                                stroke="#ba1a1a"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                              <path
                                d="M 350,440 Q 450,455 520,495"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 520,260 L 515,340 L 510,420 L 518,485"
                                fill="none"
                                stroke="#ba1a1a"
                                strokeLinecap="round"
                                strokeWidth="5.5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 370,250 L 375,320 L 380,380"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="4.5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 370,250 Q 440,240 520,260"
                                fill="none"
                                stroke="#ba1a1a"
                                strokeDasharray="8 3"
                                strokeLinecap="round"
                                strokeWidth="5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 520,260 Q 640,250 780,290 L 870,330"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="4.5"
                              ></path>
                            </g>

                            <g>
                              <path
                                d="M 600,320 L 585,410 L 555,480"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="4.5"
                              ></path>
                              <path
                                d="M 520,495 Q 560,505 600,480"
                                fill="none"
                                stroke="#4e9c4d"
                                strokeLinecap="round"
                                strokeWidth="4"
                              ></path>
                            </g>
                          </g>

                          <g
                            filter="url(#routeGlow)"
                            className={`transition-opacity duration-300 ${
                              routePulsing ? "opacity-40" : "opacity-100"
                            }`}
                          >
                            <path
                              d={telemetry.svgPath}
                              fill="none"
                              opacity="0.9"
                              stroke="#001026"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="7"
                            ></path>
                            <path
                              d={telemetry.svgPath}
                              fill="none"
                              stroke="#fc6018"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3.5"
                            ></path>
                          </g>

                          <text
                            fill="#001026"
                            fontFamily="Public Sans"
                            fontSize="12"
                            fontWeight="700"
                            x="350"
                            y="235"
                          >
                            WOODLANDS
                          </text>
                          <text
                            fill="#44474e"
                            fontFamily="Public Sans"
                            fontSize="11"
                            fontWeight="600"
                            x="545"
                            y="240"
                          >
                            YISHUN
                          </text>
                          <text
                            fill="#44474e"
                            fontFamily="Public Sans"
                            fontSize="11"
                            fontWeight="600"
                            x="495"
                            y="325"
                          >
                            ANG MO KIO
                          </text>
                          <text
                            fill="#001026"
                            fontFamily="Public Sans"
                            fontSize="12"
                            fontWeight="700"
                            x="210"
                            y="415"
                          >
                            JURONG
                          </text>
                          <text
                            fill="#001026"
                            fontFamily="Public Sans"
                            fontSize="12"
                            fontWeight="700"
                            x="750"
                            y="335"
                          >
                            TAMPINES
                          </text>
                          <text
                            fill="#44474e"
                            fontFamily="Public Sans"
                            fontSize="11"
                            fontWeight="600"
                            x="830"
                            y="320"
                          >
                            CHANGI
                          </text>
                          <text
                            fill="#001026"
                            fontFamily="Public Sans"
                            fontSize="13"
                            fontWeight="800"
                            x="515"
                            y="465"
                          >
                            CITY / CBD
                          </text>

                          <rect
                            fill="#0b2545"
                            height="15"
                            rx="3"
                            width="34"
                            x="360"
                            y="360"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Public Sans"
                            fontSize="9"
                            fontWeight="700"
                            x="365"
                            y="371"
                          >
                            PIE
                          </text>

                          <rect
                            fill="#0b2545"
                            height="15"
                            rx="3"
                            width="34"
                            x="498"
                            y="295"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Public Sans"
                            fontSize="9"
                            fontWeight="700"
                            x="504"
                            y="306"
                          >
                            CTE
                          </text>

                          <rect
                            fill="#0b2545"
                            height="15"
                            rx="3"
                            width="34"
                            x="250"
                            y="435"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Public Sans"
                            fontSize="9"
                            fontWeight="700"
                            x="256"
                            y="446"
                          >
                            AYE
                          </text>

                          <rect
                            fill="#0b2545"
                            height="15"
                            rx="3"
                            width="32"
                            x="420"
                            y="235"
                          ></rect>
                          <text
                            fill="#ffffff"
                            fontFamily="Public Sans"
                            fontSize="9"
                            fontWeight="700"
                            x="426"
                            y="246"
                          >
                            SLE
                          </text>

                          <g transform="translate(372, 252)">
                            <circle fill="#001026" r="9"></circle>
                            <circle fill="#ffffff" r="4"></circle>
                            <text
                              fill="#001026"
                              fontFamily="Public Sans"
                              fontSize="11"
                              fontWeight="800"
                              x="-4"
                              y="-13"
                            >
                              START
                            </text>
                          </g>

                          <g
                            transform={`translate(${telemetry.destCoords.x}, ${telemetry.destCoords.y})`}
                          >
                            <circle fill="#fc6018" filter="url(#routeGlow)" r="11"></circle>
                            <circle fill="#ffffff" r="5"></circle>
                            <text
                              fill="#a83900"
                              fontFamily="Public Sans"
                              fontSize="11"
                              fontWeight="800"
                              x="14"
                              y="4"
                            >
                              {telemetry.destCoords.label}
                            </text>
                          </g>
                        </svg>

                        {layers.incidents && (
                          <>
                            <div
                              ref={slePinRef}
                              className={`absolute top-[38%] left-[44%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform ${
                                pulsingIncident === "sle" ? "scale-125" : ""
                              }`}
                              onClick={() => handlePreviewCamera("sle")}
                            >
                              <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg animate-bounce">
                                <span className="material-symbols-outlined text-[18px]">
                                  warning
                                </span>
                              </div>
                              <div className="hidden group-hover:flex absolute left-9 top-0 w-64 bg-surface-container-lowest p-space-sm rounded-lg shadow-xl flex-col gap-1 z-30 pointer-events-none">
                                <span className="text-[11px] font-bold text-error uppercase">
                                  Accident • Lane 2 Blocked
                                </span>
                                <div className="font-headline-sm text-[13px] text-primary leading-tight">
                                  SLE after Mandai Ave towards CTE
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                  Congestion tailback ~3.8km. Speed: 18 km/h.
                                </div>
                              </div>
                            </div>

                            <div
                              className="absolute top-[58%] left-[51%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                              onClick={() => handlePreviewCamera("cte")}
                            >
                              <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-[16px]">
                                  car_repair
                                </span>
                              </div>
                              <div className="hidden group-hover:flex absolute left-8 top-0 w-60 bg-surface-container-lowest p-space-sm rounded-lg shadow-xl flex-col gap-1 z-30 pointer-events-none">
                                <span className="text-[11px] font-bold text-secondary uppercase">
                                  CTE (towards AYE)
                                </span>
                                <div className="font-headline-sm text-[12px] text-primary">
                                  Incident after Moulmein Rd
                                </div>
                                <div className="text-[11px] text-on-surface-variant">
                                  Speeds dropped to 28 km/h
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div
                          className="absolute top-[50%] left-[51.5%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                          onClick={() => handlePreviewCamera("cte")}
                        >
                          <div className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow flex items-center gap-1 hover:bg-primary-container transition-transform group-hover:scale-105">
                            <span className="material-symbols-outlined text-[13px] text-tertiary-fixed">
                              videocam
                            </span>
                            <span>CTE Braddell</span>
                          </div>
                        </div>

                        <div
                          className="absolute top-[67%] left-[15%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                          onClick={() => handlePreviewCamera("tuas")}
                        >
                          <div className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow flex items-center gap-1 hover:bg-primary-container transition-transform group-hover:scale-105">
                            <span className="material-symbols-outlined text-[13px] text-tertiary-fixed">
                              videocam
                            </span>
                            <span>Tuas Checkpoint</span>
                          </div>
                        </div>

                        {layers.cameras && (
                          <>
                            <div
                              className="absolute top-[39%] left-[35%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                              onClick={() => handlePreviewCamera("woodlands")}
                            >
                              <div className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow flex items-center gap-1 hover:bg-primary-container">
                                <span className="material-symbols-outlined text-[13px] text-tertiary-fixed">
                                  videocam
                                </span>
                                <span>Woodlands BKE</span>
                              </div>
                            </div>
                            <div
                              className="absolute top-[46%] left-[72%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                              onClick={() => handlePreviewCamera("tpe")}
                            >
                              <div className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow flex items-center gap-1 hover:bg-primary-container">
                                <span className="material-symbols-outlined text-[13px] text-tertiary-fixed">
                                  videocam
                                </span>
                                <span>TPE Punggol</span>
                              </div>
                            </div>
                          </>
                        )}

                        <div
                          className="absolute top-[48%] left-[55%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                          onClick={() => setActiveNav("erp-rates")}
                        >
                          <div className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm shadow font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-secondary">
                              toll
                            </span>
                            <span>ERP $2.00</span>
                          </div>
                        </div>

                        {layers.erp &&
                          ERP_GANTRIES.slice(1, 4).map((g) => (
                            <div
                              key={g.id}
                              style={{ left: g.mapCoords.x, top: g.mapCoords.y }}
                              onClick={() => setActiveNav("erp-rates")}
                              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            >
                              <div className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm shadow font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px] text-secondary">
                                  toll
                                </span>
                                <span>
                                  {g.corridor} {g.currentRate}
                                </span>
                              </div>
                            </div>
                          ))}

                        {layers.pgs &&
                          PGS_CARPARKS.map((cp) => (
                            <div
                              key={cp.id}
                              style={{ left: cp.coords.x, top: cp.coords.y }}
                              onClick={() => {
                                setDestination(cp.name);
                                triggerToast(
                                  `${cp.zone}: ${cp.lotsAvailable} available parking lots`
                                );
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            >
                              <div className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shadow font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">
                                  local_parking
                                </span>
                                <span>
                                  {cp.zone}: {cp.lotsAvailable}
                                </span>
                              </div>
                            </div>
                          ))}

                        <div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur p-space-sm rounded-lg shadow-md flex flex-col gap-1 text-[11px] font-body-sm text-on-surface">
                          <span className="font-bold text-primary text-label-sm uppercase">
                            Traffic Speed Legend
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-1.5 rounded-full bg-on-tertiary-container"></span>{" "}
                              &gt; 60 km/h
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-1.5 rounded-full bg-secondary-container"></span>{" "}
                              40-60 km/h
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-1.5 rounded-full bg-error"></span> &lt; 40
                              km/h
                            </span>
                          </div>
                        </div>

                        <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded text-[10px] text-on-surface-variant">
                          OneMap © SLA | EMAS Real-time Telemetry
                        </div>
                      </div>

                      <div
                        ref={cctvBoxRef}
                        className="p-space-md bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-space-md"
                      >
                        <div className="flex items-center gap-space-md w-full md:w-auto">
                          <div className="w-40 h-24 rounded bg-primary-container relative overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                            <img
                              className="w-full h-full object-cover"
                              alt={activeCamera.alt}
                              referrerPolicy="no-referrer"
                              src={CCTV_PRIMARY_IMG}
                            />
                            <span className="absolute top-1 left-1 px-1 rounded bg-error text-on-error text-[9px] font-bold tracking-wider uppercase">
                              LIVE EMAS
                            </span>
                            <span className="absolute bottom-1 right-1 px-1 rounded bg-primary/80 text-on-primary text-[9px] font-mono">
                              {activeCamera.cam}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-headline-sm text-headline-sm text-primary">
                                {activeCamera.title}
                              </h4>
                              <span className="px-2 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                                Active Feed
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                              Speed:{" "}
                              <strong className="text-secondary">{activeCamera.speed}</strong>{" "}
                              • Weather: {activeCamera.weather} • Visibility:{" "}
                              {activeCamera.visibility}
                            </p>
                            <span className="text-[11px] text-on-surface-variant mt-1 font-mono">
                              Frame Time: {activeCamera.frameTime} • {activeCamera.latency}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-space-sm w-full md:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => setEnlargedCamera(activeCamera)}
                            className="px-space-md py-space-xs rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              fullscreen
                            </span>
                            <span>Enlarge Feed</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCycleNextCamera}
                            className="px-space-md py-space-xs rounded bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              skip_next
                            </span>
                            <span>Next Camera</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary">
                            network_check
                          </span>
                          <span>Island Expressway Network Flow Index</span>
                        </h3>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          9 Monitored Corridors
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-space-sm pt-space-xs">
                        <div
                          onClick={() => handlePreviewCamera("cte")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              CTE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"
                              title="Slow"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-error">
                              32{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Towards City
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-error h-full w-[35%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("pie")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              PIE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-secondary-container"
                              title="Moderate"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-secondary">
                              54{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Towards Changi
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-secondary-container h-full w-[60%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("tuas")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              AYE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-error"
                              title="Accident delay"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-error">
                              24{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Towards Tuas
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-error h-full w-[28%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("tpe")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              TPE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"
                              title="Smooth"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-tertiary-container">
                              78{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Towards SLE
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-on-tertiary-container h-full w-[85%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("woodlands")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              BKE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"
                              title="Smooth"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-tertiary-container">
                              72{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Both Bounds
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-on-tertiary-container h-full w-[80%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("kpe")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              KPE Tunnel
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"
                              title="Normal"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-tertiary-container">
                              65{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Both Bounds
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-on-tertiary-container h-full w-[75%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("sentosa")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              MCE Tunnel
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"
                              title="Smooth"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-tertiary-container">
                              70{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Coastal Transit
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-on-tertiary-container h-full w-[80%]"></div>
                          </div>
                        </div>

                        <div
                          onClick={() => handlePreviewCamera("sle")}
                          className="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-headline-sm text-[14px] text-primary font-bold">
                              SLE
                            </span>
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"
                              title="Accident"
                            ></span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-[20px] font-bold text-error">
                              21{" "}
                              <span className="text-[12px] font-normal text-on-surface-variant">
                                km/h
                              </span>
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Mandai Stretch
                            </span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="bg-error h-full w-[24%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={closuresSectionRef}
              className="w-full px-margin py-space-lg bg-surface-container-low"
            >
              <div className="max-w-[1440px] mx-auto flex flex-col gap-space-md">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm font-bold uppercase">
                      Public Transport Infrastructure
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                      Scheduled Closures, Events &amp; Major Works
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Cross Island Line (CRL), North-South Corridor (NSC), and weekend civic car-free zones across the island.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setClosureFilter("all")}
                      className={
                        closureFilter === "all"
                          ? "px-3 py-1.5 rounded bg-primary text-on-primary font-label-sm text-label-sm shadow-sm cursor-pointer"
                          : "px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                      }
                    >
                      All Disruptions
                    </button>
                    <button
                      type="button"
                      onClick={() => setClosureFilter("events")}
                      className={
                        closureFilter === "events"
                          ? "px-3 py-1.5 rounded bg-primary text-on-primary font-label-sm text-label-sm shadow-sm cursor-pointer"
                          : "px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                      }
                    >
                      Events (Joo Chiat / F1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setClosureFilter("temporary")}
                      className={
                        closureFilter === "temporary"
                          ? "px-3 py-1.5 rounded bg-primary text-on-primary font-label-sm text-label-sm shadow-sm cursor-pointer"
                          : "px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                      }
                    >
                      Temporary Tunnel / Slip
                    </button>
                    <button
                      type="button"
                      onClick={() => setClosureFilter("permanent")}
                      className={
                        closureFilter === "permanent"
                          ? "px-3 py-1.5 rounded bg-primary text-on-primary font-label-sm text-label-sm shadow-sm cursor-pointer"
                          : "px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high cursor-pointer"
                      }
                    >
                      Permanent Projects
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  {visibleClosures.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              item.badgeStyle === "secondary"
                                ? "px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase"
                                : "px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold uppercase"
                            }
                          >
                            {item.badgeText}
                          </span>
                          <span className="text-body-sm text-on-surface-variant">
                            {item.dateLabel}
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                          {item.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.descriptionHtml.prefix}
                          {item.descriptionHtml.bold && (
                            <strong>{item.descriptionHtml.bold}</strong>
                          )}
                          {item.descriptionHtml.suffix}
                        </p>
                        <div className="p-space-sm rounded bg-surface-container-low text-[12px] flex flex-col gap-1 mt-space-xs">
                          <span className="text-on-surface-variant">
                            {item.metaLine1.label}:{" "}
                            <strong className="text-primary">{item.metaLine1.value}</strong>
                          </span>
                          <span className="text-on-surface-variant">
                            {item.metaLine2.label}:{" "}
                            <strong className="text-primary">{item.metaLine2.value}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="pt-space-md flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedClosureItem(item)}
                          className="text-primary font-label-md text-label-md font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {item.linkIcon}
                          </span>
                          <span>{item.linkLabel}</span>
                        </button>
                        <span
                          className={
                            item.statusStyle === "error"
                              ? "px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold"
                              : "px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm"
                          }
                        >
                          {item.statusText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        support_agent
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-primary">
                        Spotted a Road Hazard or Oil Slick?
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        LTA EMAS Operations Center operates 24/7. Call{" "}
                        <strong className="text-primary">
                          1800-CALL LTA (1800 2255 582)
                        </strong>{" "}
                        for expressway vehicle recovery.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      type="button"
                      onClick={() => setHazardModalOpen(true)}
                      className="px-space-md py-space-xs rounded bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Online Feedback Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setHazardModalOpen(true)}
                      className="px-space-md py-space-xs rounded bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">report</span>
                      <span>Report Road Obstruction</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low mt-space-xl shadow-[0_-1px_6px_rgba(11,37,69,0.03)]">
        <div className="max-w-[1440px] mx-auto px-margin py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-xl">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <div className="w-7 h-7 rounded bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[16px]">
                    traffic
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  OneMotoring
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Official intelligent mobility and digital traffic portal managed by the Land Transport Authority (LTA) of Singapore.
              </p>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                  verified_user
                </span>
                <span>GovTech Certified Secure Service</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h4 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                Intelligent Transit
              </h4>
              <button
                type="button"
                onClick={() => setActiveNav("live-traffic-map")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Expressway Speed Map
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("expressway-cameras")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Live EMAS Surveillance CCTV
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("erp-rates")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                ERP Gantries &amp; Current Rates
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("route-planner")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Dynamic Congestion Routing
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h4 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                Vehicle Services
              </h4>
              <button
                type="button"
                onClick={() => setActiveNav("digital-services")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Road Tax Renewal
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("vehicle-ownership")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                COE Open Bidding System
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("digital-services")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Vehicle Transfer &amp; Deregistration
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("digital-services")}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Foreign Vehicle Entry Permit (VEP)
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <h4 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                Support &amp; Contact
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                LTA 24/7 Traffic Incident Hotline:
                <br />
                <span className="font-bold text-primary">
                  1800-CALL LTA (1800 2255 582)
                </span>
              </p>
              <button
                type="button"
                onClick={() => setHazardModalOpen(true)}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Feedback &amp; Road Obstruction Report
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerToast("WCAG 2.1 AAA Civic Accessibility Standards Active.")
                }
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Accessibility Standards
              </button>
            </div>
          </div>

          <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex flex-wrap items-center gap-space-md">
              <button
                type="button"
                onClick={() =>
                  triggerToast("Government of Singapore Privacy Statement.")
                }
                className="hover:text-on-surface cursor-pointer"
              >
                Privacy Statement
              </button>
              <button
                type="button"
                onClick={() => triggerToast("OneMotoring Terms of Use.")}
                className="hover:text-on-surface cursor-pointer"
              >
                Terms of Use
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerToast("GovTech Vulnerability Disclosure Programme.")
                }
                className="hover:text-on-surface cursor-pointer"
              >
                Vulnerability Disclosure
              </button>
              <button
                type="button"
                onClick={() => setHazardModalOpen(true)}
                className="hover:text-on-surface cursor-pointer"
              >
                Rate This Site
              </button>
            </div>
            <div>© 2025 Government of Singapore. All Rights Reserved.</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EnlargeCameraModal
        camera={enlargedCamera}
        onClose={() => setEnlargedCamera(null)}
        onSelectCamera={(cam) => setEnlargedCamera(cam)}
      />

      <ClosureBlueprintModal
        item={selectedClosureItem}
        onClose={() => setSelectedClosureItem(null)}
      />

      <ReportHazardModal
        open={hazardModalOpen}
        onClose={() => setHazardModalOpen(false)}
        onSubmitted={(msg) => triggerToast(msg)}
      />

      <SingpassModal
        open={singpassModalOpen}
        onClose={() => setSingpassModalOpen(false)}
        isLoggedIn={isSingpassLoggedIn}
        onLoginSuccess={() => {
          setIsSingpassLoggedIn(true);
          triggerToast("Singpass authenticated: Vehicle SBA 8824 X linked.");
        }}
      />

      <ApiHealthModal
        open={apiHealthModalOpen}
        onClose={() => setApiHealthModalOpen(false)}
      />
    </div>
  );
}
