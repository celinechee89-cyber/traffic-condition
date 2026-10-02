import React, { useState } from "react";
import { CAMERA_LOCATIONS, CameraLocation, ClosureItem } from "../data/trafficData";

export const EnlargeCameraModal: React.FC<{
  camera: CameraLocation | null;
  onClose: () => void;
  onSelectCamera: (cam: CameraLocation) => void;
}> = ({ camera, onClose, onSelectCamera }) => {
  if (!camera) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary text-on-primary px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
              videocam
            </span>
            <span className="font-headline-sm text-headline-sm">
              EMAS High-Definition Surveillance Console • {camera.cam}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-primary-container text-on-primary flex items-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="relative bg-primary-container h-[380px] sm:h-[440px] w-full overflow-hidden">
          <img
            src={camera.image}
            alt={camera.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm uppercase">
              LIVE EMAS OPTICAL STREAM
            </span>
            <span className="px-2 py-0.5 rounded bg-primary/85 text-on-primary font-mono text-[12px]">
              {camera.cam} • {camera.expressway}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 bg-primary/85 backdrop-blur-md text-on-primary p-space-sm rounded-lg flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-headline-sm text-headline-sm">{camera.title}</div>
              <div className="text-[12px] text-inverse-primary">
                Weather: {camera.weather} • Visibility: {camera.visibility} • Frame:{" "}
                {camera.frameTime}
              </div>
            </div>
            <div className="text-right">
              <div className="text-label-sm font-label-sm text-tertiary-fixed uppercase">
                Radar Corridor Speed
              </div>
              <div className="text-[20px] font-bold tabular-nums">{camera.speed}</div>
            </div>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
              Switch Camera:
            </span>
            {Object.values(CAMERA_LOCATIONS).map((c) => (
              <button
                key={c.key}
                onClick={() => onSelectCamera(c)}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                  c.key === camera.key
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-primary hover:bg-surface-container-high"
                }`}
              >
                {c.cam} ({c.expressway})
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export const ClosureBlueprintModal: React.FC<{
  item: ClosureItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary text-on-primary px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
              {item.linkIcon}
            </span>
            <span className="font-headline-sm text-headline-sm">
              {item.linkLabel} • {item.blueprintDetails.referenceCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-primary-container text-on-primary flex items-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md">
          <div className="flex items-start justify-between gap-space-sm">
            <div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm uppercase">
                {item.badgeText}
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mt-1">
                {item.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Effective Period: <strong>{item.dateLabel}</strong> • Status:{" "}
                <strong>{item.statusText}</strong>
              </p>
            </div>
          </div>

          <div className="p-space-md rounded-lg bg-surface-container-low grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-body-sm">
            <div>
              <span className="text-on-surface-variant block text-[11px] uppercase font-bold">
                Affected Carriageway
              </span>
              <span className="font-semibold text-primary">
                {item.blueprintDetails.affectedLanes}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px] uppercase font-bold">
                Managing Division
              </span>
              <span className="font-semibold text-primary">
                {item.blueprintDetails.contractor}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px] uppercase font-bold">
                {item.metaLine1.label}
              </span>
              <span className="font-semibold text-primary">{item.metaLine1.value}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[11px] uppercase font-bold">
                {item.metaLine2.label}
              </span>
              <span className="font-semibold text-primary">{item.metaLine2.value}</span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <h4 className="font-headline-sm text-headline-sm text-primary">
              Traffic Marshalling &amp; Diversion Instructions
            </h4>
            <ul className="flex flex-col gap-1.5 text-body-sm text-on-surface-variant">
              {item.blueprintDetails.advisoryNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                    subdirectory_arrow_right
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-space-sm border-t border-surface-container flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant">
              Issued by LTA Traffic Management &amp; Road Operations Group
            </span>
            <button
              onClick={onClose}
              className="px-space-md py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
            >
              Acknowledge Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReportHazardModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmitted: (msg: string) => void;
}> = ({ open, onClose, onSubmitted }) => {
  const [corridor, setCorridor] = useState("SLE (Towards CTE)");
  const [hazardType, setHazardType] = useState("Stalled Vehicle / Breakdown");
  const [lane, setLane] = useState("Lane 2 (Center-Right)");
  const [landmark, setLandmark] = useState("Near Mandai Ave Exit 9");
  const [contact, setContact] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitted(
      `EMAS Dispatch #EM-${Math.floor(1000 + Math.random() * 9000)} logged for ${corridor} (${hazardType}). Recovery team alerted.`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-secondary text-on-secondary px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[20px]">report</span>
            <span className="font-headline-sm text-headline-sm">
              LTA EMAS 24/7 Road Hazard &amp; Obstruction Report
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:opacity-80 flex items-center">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md">
          <p className="text-body-sm text-on-surface-variant">
            Reports are transmitted directly to the LTA EMAS Operations Control Centre for expressway recovery and VMS warning activation.
          </p>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-primary uppercase">
              Expressway / Arterial Corridor
            </label>
            <select
              value={corridor}
              onChange={(e) => setCorridor(e.target.value)}
              className="p-2 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
            >
              <option>SLE (Towards CTE)</option>
              <option>CTE (Towards City / AYE)</option>
              <option>PIE (Towards Tuas)</option>
              <option>PIE (Towards Changi Airport)</option>
              <option>AYE (Towards Tuas Checkpoint)</option>
              <option>ECP (Towards City / MCE)</option>
              <option>KPE Tunnel / TPE Corridor</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-primary uppercase">
                Hazard / Incident Type
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="p-2 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
              >
                <option>Stalled Vehicle / Breakdown</option>
                <option>Oil Slick / Chemical Spill</option>
                <option>Road Debris / Fallen Tree</option>
                <option>Multi-Vehicle Collision</option>
                <option>Flash Flood / Ponding</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-primary uppercase">
                Affected Lane
              </label>
              <select
                value={lane}
                onChange={(e) => setLane(e.target.value)}
                className="p-2 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
              >
                <option>Lane 1 (Extreme Right)</option>
                <option>Lane 2 (Center-Right)</option>
                <option>Lane 3 (Center-Left)</option>
                <option>Lane 4 / Left Shoulder</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-primary uppercase">
              Nearest Exit / Lamp Post / Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              required
              className="p-2 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-primary uppercase">
              Mobile Number for SMS Dispatch Update (Optional)
            </label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+65 9XXX XXXX"
              className="p-2 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
            />
          </div>

          <div className="pt-space-xs flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded bg-surface-container text-on-surface font-label-md text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-md py-2 rounded bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90"
            >
              Transmit to EMAS Control
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SingpassModal: React.FC<{
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
}> = ({ open, onClose, isLoggedIn, onLoginSuccess }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary text-on-primary px-space-md py-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-headline-sm text-headline-sm">
              Singpass Digital Identity Gateway
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-primary-container flex">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-space-lg flex flex-col items-center text-center gap-space-md">
          {isLoggedIn ? (
            <>
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  Authenticated via Singpass
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Vehicle Profile Synced: <strong>SBA 8824 X</strong> (OBU Unit #9041-A)
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 rounded bg-primary text-on-primary font-label-md text-label-md"
              >
                Return to OneMotoring Portal
              </button>
            </>
          ) : (
            <>
              <div className="font-headline-md text-headline-md text-primary">
                Log in with Singpass App
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Sync your registered vehicles, ERP 2.0 OBU alerts, and personalized commute corridors.
              </p>
              <div className="w-40 h-40 rounded-lg bg-surface-container-low border-2 border-primary flex flex-col items-center justify-center p-3">
                <span className="material-symbols-outlined text-[88px] text-primary">
                  qr_code_2
                </span>
                <span className="text-[10px] font-bold text-error uppercase tracking-wider">
                  SINGPASS VERIFIED QR
                </span>
              </div>
              <button
                onClick={() => {
                  onLoginSuccess();
                  onClose();
                }}
                className="w-full py-2.5 rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-colors"
              >
                Simulate Instant Singpass Tap
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
