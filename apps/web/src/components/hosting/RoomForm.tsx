"use client";

import { useState } from "react";

interface RoomFormProps {
  locale: string;
  roomId?: string;
  defaultValues?: Record<string, unknown>;
  labels: { [key: string]: string };
  saveRoom: (formData: FormData) => Promise<{ error?: string } | void>;
}

const TOTAL_STEPS = 5;

function StepIndicator({ step, labels }: { step: number; labels: { [key: string]: string } }) {
  const stepLabels = [
    labels.form_step_basic,
    labels.form_step_location,
    labels.form_step_setup,
    labels.form_step_pricing,
    labels.form_step_review,
  ];
  return (
    <div className="flex items-center gap-1.5 mb-8 overflow-x-auto">
      {stepLabels.map((label, i) => {
        const idx = i + 1;
        const isActive = idx === step;
        const isDone = idx < step;
        return (
          <div key={idx} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <div
                className={[
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                  isActive ? "bg-primary text-white" : isDone ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : idx}
              </div>
              <span className={["text-xs font-medium hidden sm:block", isActive ? "text-gray-900" : isDone ? "text-primary" : "text-gray-400"].join(" ")}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={["h-px w-5 mx-0.5", isDone ? "bg-primary/30" : "bg-gray-200"].join(" ")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Counter({
  label, value, min = 0, max = 20, onChange,
}: {
  label: string | undefined; value: number; min?: number; max?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-800">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-medium text-gray-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none";
const textareaCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none";

// ── Amenity definitions ────────────────────────────────────────────────────
const POPULAR_AMENITIES = [
  ["wifi", "form_amenity_wifi", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </svg>
  )],
  ["tv", "form_amenity_tv", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )],
  ["kitchen", "form_amenity_kitchen", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="3" width="20" height="18" rx="1" />
      <rect x="6" y="7" width="12" height="7" rx="0.5" />
      <line x1="6" y1="17" x2="6" y2="17.01" strokeWidth={2} />
      <line x1="10" y1="17" x2="10" y2="17.01" strokeWidth={2} />
    </svg>
  )],
  ["washer", "form_amenity_washer", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <circle cx="8" cy="6" r="0.8" fill="currentColor" />
      <line x1="11" y1="6" x2="14" y2="6" />
    </svg>
  )],
  ["parking", "form_amenity_parking", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="1" y="5" width="22" height="14" rx="2" />
      <path d="M4 19v2M20 19v2M1 10h22" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  )],
  ["air_conditioning", "form_amenity_air_conditioning", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="1" y="3" width="22" height="10" rx="2" />
      <path d="M7 17l-2 4M12 17v4M17 17l2 4" />
      <line x1="5" y1="8" x2="19" y2="8" />
    </svg>
  )],
  ["workspace", "form_amenity_workspace", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="3" width="20" height="13" rx="1" />
      <path d="M8 21h8M12 17v4" />
      <path d="M6 8h4M6 11h2" />
    </svg>
  )],
] as [string, string, React.ReactNode][];

const PREMIUM_AMENITIES = [
  ["pool", "form_amenity_pool", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M2 12c1.333-1.333 2.667-2 4-2s2.667.667 4 2 2.667 2 4 2 2.667-.667 4-2" />
      <path d="M2 17c1.333-1.333 2.667-2 4-2s2.667.667 4 2 2.667 2 4 2 2.667-.667 4-2" />
      <path d="M10 4V2M14 6l-4-4M14 2l-4 4" />
    </svg>
  )],
  ["hot_tub", "form_amenity_hot_tub", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M5 20h14a2 2 0 002-2v-4H3v4a2 2 0 002 2z" />
      <path d="M3 14V9a1 1 0 011-1h16a1 1 0 011 1v5" />
      <path d="M7 4c0 1.5 2 1.5 2 3M12 4c0 1.5 2 1.5 2 3" />
    </svg>
  )],
  ["terrace", "form_amenity_terrace", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="14" width="18" height="2" />
      <rect x="5" y="16" width="14" height="5" />
      <path d="M3 14L12 5l9 9" />
      <line x1="9" y1="16" x2="9" y2="21" />
      <line x1="15" y1="16" x2="15" y2="21" />
    </svg>
  )],
  ["bbq", "form_amenity_bbq", (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M4 11a8 8 0 0016 0H4z" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <path d="M7 5c0 1.5 2 1.5 2 3M12 4c0 1.5 2 1.5 2 3" />
    </svg>
  )],
] as [string, string, React.ReactNode][];

// ─────────────────────────────────────────────────────────────────────────────

export function RoomForm({ locale, roomId, defaultValues = {}, labels, saveRoom }: RoomFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — Basic Info
  const [propertyStructure, setPropertyStructure] = useState((defaultValues.property_structure as string) ?? "");
  const [roomOffering, setRoomOffering] = useState((defaultValues.room_offering as string) ?? "");
  const [titleZh, setTitleZh] = useState((defaultValues.title_zh as string) ?? "");
  const [titleJa, setTitleJa] = useState((defaultValues.title_ja as string) ?? "");
  const [titleEn, setTitleEn] = useState((defaultValues.title_en as string) ?? "");
  const [descriptionZh, setDescriptionZh] = useState((defaultValues.description_zh as string) ?? "");
  const [type, setType] = useState((defaultValues.type as string) ?? "daily");
  const [licenseNumber, setLicenseNumber] = useState((defaultValues.license_number as string) ?? "");
  const [checkinMethod, setCheckinMethod] = useState((defaultValues.checkin_method as string) ?? "");
  const [cancellationPolicy, setCancellationPolicy] = useState((defaultValues.cancellation_policy as string) ?? "");
  const [houseRules, setHouseRules] = useState((defaultValues.house_rules as string) ?? "");

  // Step 2 — Location
  const [prefecture, setPrefecture] = useState((defaultValues.prefecture as string) ?? "");
  const [city, setCity] = useState((defaultValues.city as string) ?? "");
  const [addressDetail, setAddressDetail] = useState((defaultValues.address_detail as string) ?? "");
  const [nearestStation, setNearestStation] = useState((defaultValues.nearest_station as string) ?? "");
  const [stationWalkMin, setStationWalkMin] = useState((defaultValues.station_walk_min as string) ?? "");
  const [areaSqm, setAreaSqm] = useState((defaultValues.area_sqm as string) ?? "");
  const [floor, setFloor] = useState((defaultValues.floor as string) ?? "");

  // Step 3 — Setup (counters + amenities)
  const [maxGuests, setMaxGuests] = useState(Number((defaultValues.max_guests as string) ?? 1) || 1);
  const [bedrooms, setBedrooms] = useState(Number((defaultValues.bedrooms as string) ?? 1) || 1);
  const [beds, setBeds] = useState(Number((defaultValues.beds as string) ?? 1) || 1);
  const [bathrooms, setBathrooms] = useState(Number((defaultValues.bathrooms as string) ?? 1) || 1);

  const initAmenities = () => {
    const raw = (defaultValues.amenities as string) ?? "";
    return new Set(raw ? raw.split(",").filter(Boolean) : []);
  };
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(initAmenities);

  const toggleAmenity = (key: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Step 4 — Pricing
  const [priceDaily, setPriceDaily] = useState((defaultValues.price_daily as string) ?? "");
  const [priceMonthly, setPriceMonthly] = useState((defaultValues.price_monthly as string) ?? "");
  const [cleaningFee, setCleaningFee] = useState((defaultValues.cleaning_fee as string) ?? "");
  const [depositAmount, setDepositAmount] = useState((defaultValues.deposit_amount as string) ?? "");

  function handleNext() {
    setError(null);
    if (step === 1 && !titleZh.trim()) {
      setError("请填写" + labels.form_title_zh);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handlePrev() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(action: "draft" | "publish") {
    setError(null);
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("locale", locale);
      fd.append("action", action);
      if (roomId) fd.append("room_id", roomId);

      // Step 1
      fd.append("property_structure", propertyStructure);
      fd.append("room_offering", roomOffering);
      fd.append("title_zh", titleZh);
      fd.append("title_ja", titleJa);
      fd.append("title_en", titleEn);
      fd.append("description_zh", descriptionZh);
      fd.append("type", type);
      fd.append("license_number", licenseNumber);
      fd.append("checkin_method", checkinMethod);
      fd.append("cancellation_policy", cancellationPolicy);
      fd.append("house_rules", houseRules);

      // Step 2
      fd.append("prefecture", prefecture);
      fd.append("city", city);
      fd.append("address_detail", addressDetail);
      fd.append("nearest_station", nearestStation);
      fd.append("station_walk_min", stationWalkMin);
      fd.append("area_sqm", areaSqm);
      fd.append("floor", floor);

      // Step 3
      fd.append("max_guests", String(maxGuests));
      fd.append("bedrooms", String(bedrooms));
      fd.append("beds", String(beds));
      fd.append("bathrooms", String(bathrooms));
      fd.append("amenities", Array.from(selectedAmenities).join(","));

      // Step 4
      fd.append("price_daily", priceDaily);
      fd.append("price_monthly", priceMonthly);
      fd.append("cleaning_fee", cleaningFee);
      fd.append("deposit_amount", depositAmount);

      const result = await saveRoom(fd);
      if (result && "error" in result && result.error) {
        setError(result.error);
      }
    } catch {
      // redirect() throws — that's expected on success
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <StepIndicator step={step} labels={labels} />

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Step 1: Basic Info ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-8">

          {/* 房源建筑类型 */}
          <div>
            <p className="text-base font-semibold text-gray-900 mb-4">{labels.form_structure_question}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                ["house", labels.form_structure_house, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <path d="M16 3L2 14h3v15h8v-8h6v8h8V14h3L16 3z" />
                  </svg>
                )],
                ["apartment", labels.form_structure_apartment, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <rect x="4" y="4" width="10" height="24" />
                    <rect x="18" y="10" width="10" height="18" />
                    <line x1="7" y1="9" x2="7" y2="9.01" strokeWidth={2} />
                    <line x1="11" y1="9" x2="11" y2="9.01" strokeWidth={2} />
                    <line x1="7" y1="14" x2="7" y2="14.01" strokeWidth={2} />
                    <line x1="11" y1="14" x2="11" y2="14.01" strokeWidth={2} />
                    <line x1="21" y1="14" x2="21" y2="14.01" strokeWidth={2} />
                    <line x1="25" y1="14" x2="25" y2="14.01" strokeWidth={2} />
                    <line x1="21" y1="19" x2="21" y2="19.01" strokeWidth={2} />
                    <line x1="25" y1="19" x2="25" y2="19.01" strokeWidth={2} />
                  </svg>
                )],
                ["hotel", labels.form_structure_hotel, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <rect x="6" y="2" width="20" height="28" />
                    <line x1="10" y1="7" x2="10" y2="7.01" strokeWidth={2} />
                    <line x1="14" y1="7" x2="14" y2="7.01" strokeWidth={2} />
                    <line x1="18" y1="7" x2="18" y2="7.01" strokeWidth={2} />
                    <line x1="22" y1="7" x2="22" y2="7.01" strokeWidth={2} />
                    <line x1="10" y1="12" x2="10" y2="12.01" strokeWidth={2} />
                    <line x1="14" y1="12" x2="14" y2="12.01" strokeWidth={2} />
                    <line x1="18" y1="12" x2="18" y2="12.01" strokeWidth={2} />
                    <line x1="22" y1="12" x2="22" y2="12.01" strokeWidth={2} />
                    <rect x="12" y="23" width="8" height="7" />
                  </svg>
                )],
                ["ryokan", labels.form_structure_ryokan, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <path d="M4 14l12-10 12 10" />
                    <path d="M6 13v3l-2 1v2h24v-2l-2-1v-3" />
                    <path d="M7 19v9h18v-9" />
                    <path d="M9 22h4v6H9zM19 22h4v6h-4z" />
                  </svg>
                )],
              ] as [string, string, React.ReactNode][]).map(([val, lbl, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPropertyStructure(val)}
                  className={[
                    "flex flex-col justify-between p-4 rounded-xl border-2 text-left transition-colors h-[100px]",
                    propertyStructure === val ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400",
                  ].join(" ")}
                >
                  <span className="text-gray-700">{icon}</span>
                  <span className="text-sm font-medium text-gray-900 mt-2">{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 整个房源 / 一个房间 */}
          <div>
            <p className="text-base font-semibold text-gray-900 mb-4">{labels.form_offering_question}</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                ["entire", labels.form_offering_entire, labels.form_offering_entire_desc, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 flex-shrink-0">
                    <path d="M16 3L2 14h3v15h8v-8h6v8h8V14h3L16 3z" />
                  </svg>
                )],
                ["room", labels.form_offering_room, labels.form_offering_room_desc, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 flex-shrink-0">
                    <rect x="5" y="3" width="22" height="26" rx="1" />
                    <path d="M19 16a3 3 0 110-6 3 3 0 010 6z" />
                    <line x1="5" y1="29" x2="27" y2="29" />
                  </svg>
                )],
              ] as [string, string, string, React.ReactNode][]).map(([val, title, desc, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRoomOffering(val)}
                  className={[
                    "w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 text-left transition-colors",
                    roomOffering === val ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <span className="text-gray-600 ml-4">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 短租/月租 */}
          <div>
            <p className="text-base font-semibold text-gray-900 mb-4">{labels.form_type}</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                ["daily", labels.form_type_daily, (
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <rect x="3" y="6" width="26" height="22" rx="2" />
                    <line x1="3" y1="12" x2="29" y2="12" />
                    <line x1="10" y1="3" x2="10" y2="9" />
                    <line x1="22" y1="3" x2="22" y2="9" />
                    <line x1="9" y1="18" x2="23" y2="18" />
                    <line x1="9" y1="23" x2="17" y2="23" />
                  </svg>
                )],
                ["monthly", labels.form_type_monthly, (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <path d="M11 10v4h4"/><path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5"/><path d="M16 2v4"/><path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5"/><path d="M21 22v-4h-4"/><path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"/><path d="M3 10h4"/><path d="M8 2v4"/>
                  </svg>
                )],
              ] as [string, string, React.ReactNode][]).map(([val, lbl, icon]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setType(val)}
                  className={[
                    "flex flex-col justify-between p-4 rounded-xl border-2 text-left transition-colors h-[96px]",
                    type === val ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400",
                  ].join(" ")}
                >
                  <span className="text-gray-700">{icon}</span>
                  <span className="text-sm font-medium text-gray-900 mt-2">{lbl}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-5">
            <div>
              <Label required>{labels.form_title_zh}</Label>
              <input type="text" className={inputCls} value={titleZh} onChange={(e) => setTitleZh(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_title_ja}</Label>
              <input type="text" className={inputCls} value={titleJa} onChange={(e) => setTitleJa(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_title_en}</Label>
              <input type="text" className={inputCls} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_description_zh}</Label>
              <textarea rows={4} className={textareaCls} value={descriptionZh} onChange={(e) => setDescriptionZh(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_checkin_method}</Label>
              <input type="text" className={inputCls} value={checkinMethod} onChange={(e) => setCheckinMethod(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_cancellation_policy}</Label>
              <textarea rows={3} className={textareaCls} value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_house_rules}</Label>
              <textarea rows={3} className={textareaCls} value={houseRules} onChange={(e) => setHouseRules(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Location ───────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{labels.form_prefecture}</Label>
              <input type="text" className={inputCls} value={prefecture} onChange={(e) => setPrefecture(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_city}</Label>
              <input type="text" className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>{labels.form_address_detail}</Label>
            <input type="text" className={inputCls} value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{labels.form_nearest_station}</Label>
              <input type="text" className={inputCls} value={nearestStation} onChange={(e) => setNearestStation(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_walk_min}</Label>
              <input type="number" min={0} className={inputCls} value={stationWalkMin} onChange={(e) => setStationWalkMin(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{labels.form_area}</Label>
              <input type="number" min={0} step="0.1" className={inputCls} value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} />
            </div>
            <div>
              <Label>{labels.form_floor}</Label>
              <input type="number" className={inputCls} value={floor} onChange={(e) => setFloor(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Setup (counters + amenities) ───────────────────────────── */}
      {step === 3 && (
        <div className="space-y-10">

          {/* 计数器区块 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{labels.form_setup_basics_title}</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">{labels.form_setup_basics_hint}</p>
            <div className="border border-gray-200 rounded-xl px-5 divide-y divide-gray-100">
              <Counter label={labels.form_guests}    value={maxGuests} min={1} onChange={setMaxGuests} />
              <Counter label={labels.form_bedrooms}  value={bedrooms}  min={0} onChange={setBedrooms} />
              <Counter label={labels.form_beds}      value={beds}      min={1} onChange={setBeds} />
              <Counter label={labels.form_bathrooms} value={bathrooms} min={0} onChange={setBathrooms} />
            </div>
          </div>

          {/* 设施区块 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{labels.form_amenities_title}</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">{labels.form_amenities_hint}</p>

            <p className="text-sm font-semibold text-gray-800 mb-3">{labels.form_amenities_popular}</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {POPULAR_AMENITIES.map(([key, labelKey, icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAmenity(key)}
                  className={[
                    "flex flex-col p-4 rounded-xl border-2 text-left transition-colors",
                    selectedAmenities.has(key) ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400",
                  ].join(" ")}
                >
                  <span className="text-gray-700 mb-3">{icon}</span>
                  <span className="text-sm font-medium text-gray-900">{labels[labelKey]}</span>
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-3">{labels.form_amenities_premium}</p>
            <div className="grid grid-cols-3 gap-3">
              {PREMIUM_AMENITIES.map(([key, labelKey, icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAmenity(key)}
                  className={[
                    "flex flex-col p-4 rounded-xl border-2 text-left transition-colors",
                    selectedAmenities.has(key) ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400",
                  ].join(" ")}
                >
                  <span className="text-gray-700 mb-3">{icon}</span>
                  <span className="text-sm font-medium text-gray-900">{labels[labelKey]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Pricing ────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-5">
          {(type === "daily" || type === "both") && (
            <div>
              <Label>{labels.form_price_daily}</Label>
              <input type="number" min={0} className={inputCls} value={priceDaily} onChange={(e) => setPriceDaily(e.target.value)} />
            </div>
          )}
          {(type === "monthly" || type === "both") && (
            <div>
              <Label>{labels.form_price_monthly}</Label>
              <input type="number" min={0} className={inputCls} value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} />
            </div>
          )}
          {type === "daily" && (
            <div>
              <Label>{labels.form_price_monthly}</Label>
              <input type="number" min={0} className={inputCls} value={priceMonthly} onChange={(e) => setPriceMonthly(e.target.value)} />
            </div>
          )}
          <div>
            <Label>{labels.form_cleaning_fee}</Label>
            <input type="number" min={0} className={inputCls} value={cleaningFee} onChange={(e) => setCleaningFee(e.target.value)} />
          </div>
          <div>
            <Label>{labels.form_deposit}</Label>
            <input type="number" min={0} className={inputCls} value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Step 5: Review ─────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6">
          <ReviewSection title={labels.form_step_basic}>
            {propertyStructure && <ReviewRow label={labels.form_structure_question} value={labels[`form_structure_${propertyStructure}`] ?? propertyStructure} />}
            {roomOffering && <ReviewRow label={labels.form_offering_question} value={labels[`form_offering_${roomOffering}`] ?? roomOffering} />}
            <ReviewRow label={labels.form_type} value={(type === "daily" ? labels.form_type_daily : labels.form_type_monthly) ?? ""} />
            <ReviewRow label={labels.form_title_zh} value={titleZh} />
            {titleJa && <ReviewRow label={labels.form_title_ja} value={titleJa} />}
            {titleEn && <ReviewRow label={labels.form_title_en} value={titleEn} />}
            {descriptionZh && <ReviewRow label={labels.form_description_zh} value={descriptionZh} multiline />}
            {checkinMethod && <ReviewRow label={labels.form_checkin_method} value={checkinMethod} />}
            {cancellationPolicy && <ReviewRow label={labels.form_cancellation_policy} value={cancellationPolicy} multiline />}
            {houseRules && <ReviewRow label={labels.form_house_rules} value={houseRules} multiline />}
          </ReviewSection>

          <ReviewSection title={labels.form_step_location}>
            {prefecture && <ReviewRow label={labels.form_prefecture} value={prefecture} />}
            {city && <ReviewRow label={labels.form_city} value={city} />}
            {addressDetail && <ReviewRow label={labels.form_address_detail} value={addressDetail} />}
            {nearestStation && <ReviewRow label={labels.form_nearest_station} value={nearestStation} />}
            {stationWalkMin && <ReviewRow label={labels.form_walk_min} value={stationWalkMin} />}
            {areaSqm && <ReviewRow label={labels.form_area} value={areaSqm} />}
            {floor && <ReviewRow label={labels.form_floor} value={floor} />}
          </ReviewSection>

          <ReviewSection title={labels.form_step_setup}>
            <ReviewRow label={labels.form_guests}    value={String(maxGuests)} />
            <ReviewRow label={labels.form_bedrooms}  value={String(bedrooms)} />
            <ReviewRow label={labels.form_beds}      value={String(beds)} />
            <ReviewRow label={labels.form_bathrooms} value={String(bathrooms)} />
            {selectedAmenities.size > 0 && (
              <ReviewRow
                label={labels.form_amenities_title}
                value={Array.from(selectedAmenities).map((k) => labels[`form_amenity_${k}`] ?? k).join("、")}
              />
            )}
          </ReviewSection>

          <ReviewSection title={labels.form_step_pricing}>
            {priceDaily && <ReviewRow label={labels.form_price_daily} value={priceDaily} />}
            {priceMonthly && <ReviewRow label={labels.form_price_monthly} value={priceMonthly} />}
            {cleaningFee && <ReviewRow label={labels.form_cleaning_fee} value={cleaningFee} />}
            {depositAmount && <ReviewRow label={labels.form_deposit} value={depositAmount} />}
          </ReviewSection>
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between pt-5 border-t border-gray-100">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {labels.form_prev}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{step}/{TOTAL_STEPS}</span>

          {step < TOTAL_STEPS && (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              {labels.form_next}
            </button>
          )}

          {step === TOTAL_STEPS && (
            <>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "..." : labels.form_save_draft}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("publish")}
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "..." : labels.form_publish}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function ReviewRow({ label, value, multiline = false }: { label: string | undefined; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-36 flex-shrink-0 text-gray-500">{label}</dt>
      <dd className={["text-gray-900 flex-1", multiline ? "whitespace-pre-wrap" : ""].join(" ")}>{value}</dd>
    </div>
  );
}
