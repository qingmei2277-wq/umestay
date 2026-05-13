"use client";

import { useTransition } from "react";
import Link from "next/link";

interface Room {
  id: string;
  title_zh: string | null;
  title_ja: string | null;
  title_en: string | null;
  status: string;
  type: string | null;
  managed_by: string | null;
  prefecture: string | null;
  city: string | null;
  price_daily: number | null;
  price_monthly: number | null;
}

interface RoomsListProps {
  rooms: Room[];
  locale: string;
  labels: {
    edit: string;
    calendar: string;
    statusActive: string;
    statusInactive: string;
    statusDraft: string;
    managedPlatform: string;
    managedHost: string;
    toggleActive: string;
    toggleInactive: string;
    noRooms: string;
  };
  toggleStatus: (roomId: string, currentStatus: string) => Promise<{ error?: string; status?: string }>;
}

function StatusBadge({ status, labels }: { status: string; labels: RoomsListProps["labels"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {labels.statusActive}
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
        {labels.statusDraft}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {labels.statusInactive}
    </span>
  );
}

function RoomCard({
  room,
  locale,
  labels,
  toggleStatus,
}: {
  room: Room;
  locale: string;
  labels: RoomsListProps["labels"];
  toggleStatus: RoomsListProps["toggleStatus"];
}) {
  const [isPending, startTransition] = useTransition();

  const title = room.title_zh ?? room.title_ja ?? room.title_en ?? "—";
  const location = [room.prefecture, room.city].filter(Boolean).join(" ");
  const isActive = room.status === "active";

  const handleToggle = () => {
    startTransition(async () => {
      await toggleStatus(room.id, room.status);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <StatusBadge status={room.status} labels={labels} />
            {room.type && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                {room.type}
              </span>
            )}
            {room.managed_by && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                {room.managed_by === "platform" ? labels.managedPlatform : labels.managedHost}
              </span>
            )}
          </div>
          {location && (
            <p className="mt-1.5 text-xs text-gray-500">{location}</p>
          )}
          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
            {room.price_daily != null && (
              <span>¥{room.price_daily.toLocaleString()} / 日</span>
            )}
            {room.price_monthly != null && (
              <span>¥{room.price_monthly.toLocaleString()} / 月</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <Link
          href={`/${locale}/hosting/rooms/${room.id}/edit`}
          className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {labels.edit}
        </Link>
        <Link
          href={`/${locale}/hosting/rooms/${room.id}/calendar`}
          className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {labels.calendar}
        </Link>
        <button
          onClick={handleToggle}
          disabled={isPending || room.status === "draft"}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {isPending
            ? "..."
            : isActive
            ? labels.toggleInactive
            : labels.toggleActive}
        </button>
      </div>
    </div>
  );
}

export function RoomsList({ rooms, locale, labels, toggleStatus }: RoomsListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🏠</span>
        <p className="text-sm text-gray-500">{labels.noRooms}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          locale={locale}
          labels={labels}
          toggleStatus={toggleStatus}
        />
      ))}
    </div>
  );
}
