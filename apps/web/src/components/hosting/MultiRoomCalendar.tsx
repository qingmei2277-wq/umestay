"use client";

import Link from "next/link";

interface RoomCalendarData {
  id: string;
  title: string;
  locale: string;
  blockedDates: Set<string>;
  bookedDates: Map<string, string>;
}

interface MultiRoomCalendarProps {
  rooms: RoomCalendarData[];
  startDate: string;
  labels: { [key: string]: string };
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDayLabel(dateStr: string): string {
  return String(parseInt(dateStr.slice(8), 10));
}

export function MultiRoomCalendar({ rooms, startDate, labels }: MultiRoomCalendarProps) {
  const start = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }

  function getCellClass(room: RoomCalendarData, dateStr: string): string {
    const base = "w-7 h-7 flex items-center justify-center rounded text-xs ";
    const bookingStatus = room.bookedDates.get(dateStr);
    if (bookingStatus === "confirmed" || bookingStatus === "checked_in") {
      return base + "bg-blue-100 text-blue-700";
    }
    if (bookingStatus === "pending_payment") {
      return base + "bg-yellow-100 text-yellow-700";
    }
    if (room.blockedDates.has(dateStr)) {
      return base + "bg-gray-200 text-gray-400";
    }
    return base + "bg-green-50 text-green-600";
  }

  if (rooms.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        {labels.no_rooms ?? "No rooms"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header row */}
        <div className="flex items-center gap-0">
          <div className="w-40 shrink-0" />
          {dates.map((d) => (
            <div key={d} className="w-7 flex items-center justify-center">
              <span className="text-xs text-gray-400">{getDayLabel(d)}</span>
            </div>
          ))}
        </div>

        {/* Month labels row */}
        <div className="flex items-center gap-0 mb-1">
          <div className="w-40 shrink-0" />
          {dates.map((d, i) => {
            const isFirst = i === 0 || d.slice(8) === "01";
            return (
              <div key={d} className="w-7 flex items-center justify-center">
                {isFirst && (
                  <span className="text-xs text-gray-500 font-medium">
                    {parseInt(d.slice(5, 7), 10)}月
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Room rows */}
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center gap-0 py-1 border-t border-gray-100">
            <div className="w-40 shrink-0 pr-3">
              <Link
                href={`/${room.locale}/hosting/rooms/${room.id}/calendar`}
                className="text-xs text-gray-800 font-medium hover:text-primary truncate block"
              >
                {room.title}
              </Link>
            </div>
            {dates.map((d) => (
              <div key={d} className="w-7 flex items-center justify-center">
                <span className={getCellClass(room, d)} title={d}>
                  &nbsp;
                </span>
              </div>
            ))}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-3 h-3 rounded bg-green-50 border border-green-200 inline-block" />
            {labels.calendar_legend_available ?? "空室"}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 inline-block" />
            {labels.calendar_legend_confirmed}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200 inline-block" />
            {labels.calendar_legend_pending}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-3 h-3 rounded bg-gray-200 border border-gray-300 inline-block" />
            {labels.calendar_legend_blocked_manual}
          </span>
        </div>
      </div>
    </div>
  );
}
