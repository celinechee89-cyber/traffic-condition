export interface CameraLocation {
  key: string;
  title: string;
  expressway: string;
  cam: string;
  speed: string;
  speedNum: number;
  weather: string;
  visibility: string;
  frameTime: string;
  latency: string;
  image: string;
  alt: string;
  coords: { x: string; y: string };
}

export const CCTV_PRIMARY_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCZ2md3ZSX-fTLrO-sg-ytvTyLwTMGrx-BvOBkkakS6lSoCesHF0514XVLanz5Jl9ZfsXgCDlCrVsQigOYErMwC5QiPFHg_9ZrFLmgO3YPBrVbZlw7OgwGC3mQl1dxzCQ8VVZL4erWYNQeY0TcJhxIPqHrgv4A-q_20E-L4o4egq4_KRizEtRI3w71ozgQRQPcI_H-mrBCXl5vd32ZjnukT3v9nPkoc-Ii-6Ih2eueYJfIkJzwS8Xm";

export const CAMERA_LOCATIONS: Record<string, CameraLocation> = {
  cte: {
    key: "cte",
    title: "CTE (Towards City) - Braddell Flyover",
    expressway: "CTE",
    cam: "CAM 4702",
    speed: "48 km/h",
    speedNum: 48,
    weather: "Clear, Dry Pavement",
    visibility: "100%",
    frameTime: "09:24:12 SGT",
    latency: "2.4s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Singapore CTE expressway near Braddell flyover with five lanes of fluid automobile traffic passing under direction sign gantries",
    coords: { x: "51.5%", y: "50%" },
  },
  woodlands: {
    key: "woodlands",
    title: "Woodlands Checkpoint (BKE towards Causeway)",
    expressway: "BKE",
    cam: "CAM 2701",
    speed: "35 km/h",
    speedNum: 35,
    weather: "Clear, Dry Pavement",
    visibility: "100%",
    frameTime: "09:24:08 SGT",
    latency: "1.9s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Woodlands checkpoint crossing heading to Malaysia with dense vehicle lanes and security booths under sunny daylight",
    coords: { x: "37%", y: "39%" },
  },
  tuas: {
    key: "tuas",
    title: "Tuas Checkpoint (AYE towards Second Link)",
    expressway: "AYE",
    cam: "CAM 1704",
    speed: "24 km/h",
    speedNum: 24,
    weather: "Clear, Dry Pavement",
    visibility: "98%",
    frameTime: "09:24:15 SGT",
    latency: "2.1s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Tuas Second Link expressway approach with heavy container truck queues and passenger car delays under bright tropical sun",
    coords: { x: "15%", y: "67%" },
  },
  sentosa: {
    key: "sentosa",
    title: "Sentosa Gateway (Towards HarbourFront)",
    expressway: "AYE",
    cam: "CAM 3901",
    speed: "62 km/h",
    speedNum: 62,
    weather: "Clear, Dry Pavement",
    visibility: "100%",
    frameTime: "09:24:10 SGT",
    latency: "1.8s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Sentosa gateway arterial road flanked by tropical palms and Marina bay skyline background in crisp morning lighting",
    coords: { x: "48%", y: "83%" },
  },
  pie: {
    key: "pie",
    title: "PIE (Towards Tuas) - Jurong East Ave 1",
    expressway: "PIE",
    cam: "CAM 5109",
    speed: "54 km/h",
    speedNum: 54,
    weather: "Clear, Dry Pavement",
    visibility: "100%",
    frameTime: "09:24:04 SGT",
    latency: "2.2s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Pan Island Expressway stretch approaching Jurong East with elevated MRT viaduct running parallel and smooth traffic flow",
    coords: { x: "30%", y: "62%" },
  },
  sle: {
    key: "sle",
    title: "SLE (Towards CTE) - After Mandai Ave",
    expressway: "SLE",
    cam: "CAM 7704",
    speed: "21 km/h",
    speedNum: 21,
    weather: "Clear, Lane 2 Obstruction",
    visibility: "100%",
    frameTime: "09:24:16 SGT",
    latency: "2.0s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Seletar Expressway near Mandai exit showing congestion tailback and EMAS recovery vehicle on shoulder",
    coords: { x: "44%", y: "38%" },
  },
  kpe: {
    key: "kpe",
    title: "KPE Tunnel (Towards ECP) - Defu Portal",
    expressway: "KPE",
    cam: "CAM 8701",
    speed: "65 km/h",
    speedNum: 65,
    weather: "Tunnel Controlled Ventilation",
    visibility: "100%",
    frameTime: "09:24:11 SGT",
    latency: "1.7s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Kallang-Paya Lebar Expressway underground tunnel portal with illuminated lane control signals",
    coords: { x: "60%", y: "53%" },
  },
  tpe: {
    key: "tpe",
    title: "TPE (Towards Changi) - Punggol Way",
    expressway: "TPE",
    cam: "CAM 6208",
    speed: "78 km/h",
    speedNum: 78,
    weather: "Clear, Dry Pavement",
    visibility: "100%",
    frameTime: "09:24:09 SGT",
    latency: "2.1s buffer latency",
    image: CCTV_PRIMARY_IMG,
    alt: "Tampines Expressway near Punggol interchange showing free-flowing traffic across all four lanes",
    coords: { x: "72%", y: "44%" },
  },
};

export interface ExpresswayFlow {
  code: string;
  name: string;
  speed: number;
  direction: string;
  status: "error" | "moderate" | "smooth";
  statusTitle: string;
  barWidth: string;
  animate?: boolean;
}

export const EXPRESSWAY_FLOW_INDEX: ExpresswayFlow[] = [
  {
    code: "CTE",
    name: "Central Expressway",
    speed: 32,
    direction: "Towards City",
    status: "error",
    statusTitle: "Slow",
    barWidth: "w-[35%]",
    animate: true,
  },
  {
    code: "PIE",
    name: "Pan Island Expressway",
    speed: 54,
    direction: "Towards Changi",
    status: "moderate",
    statusTitle: "Moderate",
    barWidth: "w-[60%]",
  },
  {
    code: "AYE",
    name: "Ayer Rajah Expressway",
    speed: 24,
    direction: "Towards Tuas",
    status: "error",
    statusTitle: "Accident delay",
    barWidth: "w-[28%]",
  },
  {
    code: "TPE",
    name: "Tampines Expressway",
    speed: 78,
    direction: "Towards SLE",
    status: "smooth",
    statusTitle: "Smooth",
    barWidth: "w-[85%]",
  },
  {
    code: "BKE",
    name: "Bukit Timah Expressway",
    speed: 72,
    direction: "Both Bounds",
    status: "smooth",
    statusTitle: "Smooth",
    barWidth: "w-[80%]",
  },
  {
    code: "KPE Tunnel",
    name: "Kallang-Paya Lebar Exp",
    speed: 65,
    direction: "Both Bounds",
    status: "smooth",
    statusTitle: "Normal",
    barWidth: "w-[75%]",
  },
  {
    code: "MCE Tunnel",
    name: "Marina Coastal Expressway",
    speed: 70,
    direction: "Coastal Transit",
    status: "smooth",
    statusTitle: "Smooth",
    barWidth: "w-[80%]",
  },
  {
    code: "SLE",
    name: "Seletar Expressway",
    speed: 21,
    direction: "Mandai Stretch",
    status: "error",
    statusTitle: "Accident",
    barWidth: "w-[24%]",
    animate: true,
  },
];

export interface ErpGantryItem {
  id: string;
  gantryCode: string;
  name: string;
  corridor: string;
  direction: string;
  rates: {
    "08:00-08:30": string;
    "08:30-09:00": string;
    "09:00-09:30": string;
    "09:30-10:00": string;
    "18:00-19:00": string;
  };
  currentRate: string;
  status: "Active" | "Free Flow";
  mapCoords: { x: string; y: string };
}

export const ERP_GANTRIES: ErpGantryItem[] = [
  {
    id: "erp-cte-braddell",
    gantryCode: "GT-31",
    name: "CTE Southbound before Braddell Rd",
    corridor: "CTE",
    direction: "Towards City",
    rates: {
      "08:00-08:30": "$2.00",
      "08:30-09:00": "$3.00",
      "09:00-09:30": "$2.00",
      "09:30-10:00": "$1.00",
      "18:00-19:00": "$0.00",
    },
    currentRate: "$2.00",
    status: "Active",
    mapCoords: { x: "55%", y: "48%" },
  },
  {
    id: "erp-cbd-sheares",
    gantryCode: "GT-12",
    name: "CBD Cordon - Benjamin Sheares Ave",
    corridor: "CBD / ECP",
    direction: "Towards Marina Blvd",
    rates: {
      "08:00-08:30": "$1.00",
      "08:30-09:00": "$2.00",
      "09:00-09:30": "$1.00",
      "09:30-10:00": "$0.00",
      "18:00-19:00": "$2.00",
    },
    currentRate: "$1.00",
    status: "Active",
    mapCoords: { x: "58%", y: "76%" },
  },
  {
    id: "erp-aye-clementi",
    gantryCode: "GT-44",
    name: "AYE Eastbound after Clementi Ave 6",
    corridor: "AYE",
    direction: "Towards City",
    rates: {
      "08:00-08:30": "$2.00",
      "08:30-09:00": "$2.50",
      "09:00-09:30": "$1.50",
      "09:30-10:00": "$0.50",
      "18:00-19:00": "$0.00",
    },
    currentRate: "$1.50",
    status: "Active",
    mapCoords: { x: "34%", y: "72%" },
  },
  {
    id: "erp-pie-adam",
    gantryCode: "GT-52",
    name: "PIE Eastbound after Adam Rd",
    corridor: "PIE",
    direction: "Towards Changi",
    rates: {
      "08:00-08:30": "$1.50",
      "08:30-09:00": "$2.00",
      "09:00-09:30": "$1.00",
      "09:30-10:00": "$0.00",
      "18:00-19:00": "$0.00",
    },
    currentRate: "$1.00",
    status: "Active",
    mapCoords: { x: "44%", y: "60%" },
  },
  {
    id: "erp-kpe-defu",
    gantryCode: "GT-68",
    name: "KPE Southbound after Defu Flyover",
    corridor: "KPE",
    direction: "Towards City",
    rates: {
      "08:00-08:30": "$2.50",
      "08:30-09:00": "$3.00",
      "09:00-09:30": "$2.00",
      "09:30-10:00": "$1.00",
      "18:00-19:00": "$0.00",
    },
    currentRate: "$2.00",
    status: "Active",
    mapCoords: { x: "63%", y: "58%" },
  },
  {
    id: "erp-mce-east",
    gantryCode: "GT-73",
    name: "MCE Westbound before Maxwell Rd",
    corridor: "MCE",
    direction: "Towards AYE",
    rates: {
      "08:00-08:30": "$0.00",
      "08:30-09:00": "$1.00",
      "09:00-09:30": "$0.00",
      "09:30-10:00": "$0.00",
      "18:00-19:00": "$2.00",
    },
    currentRate: "$0.00",
    status: "Free Flow",
    mapCoords: { x: "53%", y: "81%" },
  },
];

export interface ClosureItem {
  id: string;
  category: "events" | "permanent" | "temporary";
  badgeText: string;
  badgeStyle: "secondary" | "primary";
  dateLabel: string;
  title: string;
  descriptionHtml: {
    prefix: string;
    bold: string;
    suffix: string;
  };
  metaLine1: { label: string; value: string };
  metaLine2: { label: string; value: string };
  linkIcon: string;
  linkLabel: string;
  statusText: string;
  statusStyle: "neutral" | "error";
  blueprintDetails: {
    referenceCode: string;
    affectedLanes: string;
    contractor: string;
    advisoryNotes: string[];
  };
}

export const CLOSURE_ITEMS: ClosureItem[] = [
  {
    id: "joo-chiat-car-free",
    category: "events",
    badgeText: "Community Event",
    badgeStyle: "secondary",
    dateLabel: "3 - 4 Oct 2026",
    title: "Joo Chiat Car-free Day",
    descriptionHtml: {
      prefix: "Full road closure along ",
      bold: "Joo Chiat Rd",
      suffix: " between Dunman Rd and East Coast Rd. Closed from 8:00 AM (3 Oct) to 2:00 AM (4 Oct).",
    },
    metaLine1: { label: "Organiser", value: "Land Transport Authority" },
    metaLine2: { label: "Hotline", value: "8841 5929" },
    linkIcon: "picture_as_pdf",
    linkLabel: "Road Closure Map",
    statusText: "Active Notice",
    statusStyle: "neutral",
    blueprintDetails: {
      referenceCode: "LTA/EV/2026-104",
      affectedLanes: "All carriageways along Joo Chiat Rd (1.4 km stretch)",
      contractor: "LTA Active Mobility & Katong Civic Precinct",
      advisoryNotes: [
        "Bus services 16 and 33 diverted via Still Rd and Changi Rd during closure hours.",
        "Access to residential carparks along Tembeling Rd and Koon Seng Rd remains open via Still Rd.",
        "Auxiliary Police Officers deployed at Dunman Rd and East Coast Rd junctions.",
      ],
    },
  },
  {
    id: "pasir-ris-crl",
    category: "permanent",
    badgeText: "Cross Island Line (CRL)",
    badgeStyle: "primary",
    dateLabel: "Through Q4 2028",
    title: "Pasir Ris Dr 1 & Loyang Ave Diversion",
    descriptionHtml: {
      prefix: "Closed between Pasir Ris Dr 8 and Pasir Ris Central. Facilitates underground tunnelling for Pasir Ris CRL interchange station.",
      bold: "",
      suffix: "",
    },
    metaLine1: { label: "Alt Route", value: "Exit 5 via Pasir Ris Dr 12 & Dr 3" },
    metaLine2: { label: "Shuttle Support", value: "LCS1 & LCS2 to ALPS/CAC" },
    linkIcon: "map",
    linkLabel: "Diversion Blueprint",
    statusText: "Detour in effect",
    statusStyle: "error",
    blueprintDetails: {
      referenceCode: "LTA/CRL1/CR105-DIV",
      affectedLanes: "Pasir Ris Dr 1 (Eastbound & Westbound) 650m diaphragm wall box",
      contractor: "Rail Infrastructure Division (CRL Phase 1)",
      advisoryNotes: [
        "Motorists heading towards Loyang Industrial Estate are advised to use TPE Exit 5.",
        "Temporary acoustic barriers and real-time ground settlement sensors active 24/7.",
        "Pedestrian overhead bridge near Blk 512 relocated 40m east with covered linkway.",
      ],
    },
  },
  {
    id: "mce-kpe-tunnel",
    category: "temporary",
    badgeText: "Night Maintenance",
    badgeStyle: "primary",
    dateLabel: "12:00 AM - 05:00 AM",
    title: "MCE & KPE Tunnel Slip Road Works",
    descriptionHtml: {
      prefix: "ECP (City) Exit 14B to MCE (AYE) and KPE (ECP) Exit 1 scheduled closures for structural testing and tunnel washing.",
      bold: "",
      suffix: "",
    },
    metaLine1: { label: "Key Dates", value: "14, 22, 23 & 26 Oct 2026" },
    metaLine2: { label: "Alt Route", value: "Use Sheares Ave & Sims Way" },
    linkIcon: "schedule",
    linkLabel: "Night Shift Timetable",
    statusText: "Planned",
    statusStyle: "neutral",
    blueprintDetails: {
      referenceCode: "LTA/TUN/2026-Q4-09",
      affectedLanes: "Slip roads ECP Exit 14B & KPE Exit 1; Main tunnel bore open on 2 lanes",
      contractor: "LTA Tunnel Operations & M&E Systems",
      advisoryNotes: [
        "Deluge fire suppression testing and jet-fan calibration between 01:00 AM and 04:00 AM.",
        "Electronic VMS boards on ECP and PIE will display live detour arrows 2km prior to exits.",
        "Normal 3-lane tunnel operations resume promptly at 05:00 AM daily.",
      ],
    },
  },
];

export interface PgsCarpark {
  id: string;
  zone: string;
  name: string;
  lotsAvailable: number;
  totalLots: number;
  coords: { x: string; y: string };
}

export const PGS_CARPARKS: PgsCarpark[] = [
  {
    id: "pgs-mbfc",
    zone: "Marina Bay",
    name: "MBFC Towers 1-3 & Marina One",
    lotsAvailable: 412,
    totalLots: 1200,
    coords: { x: "54%", y: "80%" },
  },
  {
    id: "pgs-orchard",
    zone: "Orchard",
    name: "ION / Ngee Ann City / Wisma",
    lotsAvailable: 185,
    totalLots: 1850,
    coords: { x: "47%", y: "68%" },
  },
  {
    id: "pgs-jurong",
    zone: "Jurong Gateway",
    name: "Westgate / JEM / IMM",
    lotsAvailable: 640,
    totalLots: 2100,
    coords: { x: "24%", y: "66%" },
  },
  {
    id: "pgs-changi",
    zone: "Changi Airport",
    name: "Terminals 1-3 & Jewel",
    lotsAvailable: 1120,
    totalLots: 3800,
    coords: { x: "86%", y: "54%" },
  },
];
