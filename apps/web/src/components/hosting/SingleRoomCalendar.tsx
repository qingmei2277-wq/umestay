"use client";

import { useState, useTransition } from "react";

interface Block {
  blocked_date: string;
  source: string;
  note?: string | null;
}

interface Booking {
  checkin: string;
  checkout: string;
  status: string;
  id: string;
}

interface SingleRoomCalendarProps {
  propertyId: string;
  blocks: Block[];
  bookings: Booking[];
  labels: { [key: string]: string };
  blockDates: (propertyId: string, dates: string[], note?: string) => Promise<{ error?: string; ok?: boolean }>;
  unblockDates: (propertyId: string, dates: string[]) => Promise<{ error?: string; ok?: boolean }>;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur < last) {
    dates.push(formatDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getMonthDays(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(formatDate(new Date(year, month, d)));
  }
  return cells;
}

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function SingleRoomCalendar({
  propertyId,
  blocks: initialBlocks,
  bookings,
  labels,
  blockDates,
  unblockDates,
}: SingleRoomCalendarProps) {
  const today = new Date();
  const [isPending, startTransition] = useTransition();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [blockReason, setBlockReason] = useState("maintenance");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const blockedSet = new Set(blocks.map((b) => b.blocked_date));
  const hostexSet = new Set(blocks.filter((b) => b.source === "hostex").map((b) => b.blocked_date));

  const bookedDates = new Map<string, string>();
  for (const bk of bookings) {
    if (bk.checkin && bk.checkout) {
      for (const d of getDatesInRange(bk.checkin, bk.checkout)) {
        bookedDates.set(d, bk.status);
      }
    }
  }

  const months = [
    { year: today.getFullYear(), month: today.getMonth() },
    {
      year: today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      month: (today.getMonth() + 1) % 12,
    },
  ];

  function getDayClass(dateStr: string): string {
    const base = "w-8 h-8 flex items-center justify-center rounded-full text-xs cursor-pointer select-none transition-colors ";
    const isPast = dateStr < formatDate(today);
    if (isPast) return base + "text-gray-300 cursor-default";
    if (selected.has(dateStr)) return base + "bg-primary text-white font-semibold";
    const bookingStatus = bookedDates.get(dateStr);
    if (bookingStatus === "confirmed" || bookingStatus === "checked_in") return base + "bg-blue-100 text-blue-700 font-medium";
    if (bookingStatus === "pending_payment") return base + "bg-yellow-100 text-yellow-700 font-medium";
    if (hostexSet.has(dateStr)) return base + "bg-orange-100 text-orange-600";
    if (blockedSet.has(dateStr)) return base + "bg-gray-200 text-gray-500";
    return base + "hover:bg-gray-100 text-gray-900";
  }

  function handleDayClick(dateStr: string) {
    const isPast = dateStr < formatDate(today);
    if (isPast) return;

    if (bookedDates.has(dateStr)) return;

    if (blockedSet.has(dateStr)) {
      // unblock immediately
      startTransition(async () => {
        setErrorMsg(null);
        const res = await unblockDates(propertyId, [dateStr]);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setBlocks((prev) => prev.filter((b) => b.blocked_date !== dateStr));
        }
      });
      return;
    }

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  }

  function handleBlock() {
    if (selected.size === 0) return;
    const dates = Array.from(selected);
    const fullNote = [labels[`calendar_block_reason_${blockReason}`] ?? blockReason, note].filter(Boolean).join(": ");
    startTransition(async () => {
      setErrorMsg(null);
      const res = await blockDates(propertyId, dates, fullNote || undefined);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setBlocks((prev) => [
          ...prev,
          ...dates.map((d) => ({ blocked_date: d, source: "manual", note: fullNote || null })),
        ]);
        setSelected(new Set());
        setNote("");
      }
    });
  }

  function handleClearSelection() {
    setSelected(new Set());
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{errorMsg}</div>
      )}

      {/* Month grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {months.map(({ year, month }) => {
          const monthLabel = new Date(year, month, 1).toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
          const cells = getMonthDays(year, month);
          return (
            <div key={`${year}-${month}`} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-sm">{monthLabel}</span>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAY_HEADERS.map((h) => (
                  <div key={h} className="text-center text-xs text-gray-400 font-medium py-1">{h}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((dateStr, i) =>
                  dateStr == null ? (
                    <div key={`e-${i}`} />
                  ) : (
                    <div
                      key={dateStr}
                      className="flex items-center justify-center"
                      onClick={() => handleDayClick(dateStr)}
                    >
                      <span className={getDayClass(dateStr)}>
                        {parseInt(dateStr.slice(8), 10)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Block panel */}
      {selected.size > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            {labels.calendar_block_title} — {selected.size} {selected.size === 1 ? "日" : "日"}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 shrink-0">{labels.calendar_block_reason}</label>
            <select
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg text-xs px-2 py-1.5 bg-white"
            >
              <option value="maintenance">{labels.calendar_block_reason_maintenance}</option>
              <option value="personal">{labels.calendar_block_reason_personal}</option>
              <option value="other">{labels.calendar_block_reason_other}</option>
            </select>
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={labels.calendar_block_reason}
            className="w-full border border-gray-200 rounded-lg text-xs px-3 py-1.5"
          />
          <div className="flex gap-2">
            <button
              onClick={handleBlock}
              disabled={isPending}
              className="flex-1 bg-primary text-white text-xs font-medium rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-primary-600 transition-colors"
            >
              {isPending ? "..." : labels.calendar_block_confirm}
            </button>
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 text-xs text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 inline-block" />
          {labels.calendar_legend_confirmed}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 inline-block" />
          {labels.calendar_legend_pending}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300 inline-block" />
          {labels.calendar_legend_blocked_manual}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300 inline-block" />
          {labels.calendar_legend_blocked_hostex}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          選択済み
        </span>
      </div>
    </div>
  );
}
