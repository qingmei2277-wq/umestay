"use client";

import { useState, useTransition } from "react";

interface Booking {
  id: string;
  property_id: string;
  status: string;
  checkin: string | null;
  checkout: string | null;
  total_price: number | null;
  guests: number | null;
  created_at: string;
}

interface HostingBookingsListProps {
  bookings: Booking[];
  locale: string;
  labels: { [key: string]: string };
  confirmBooking: (id: string) => Promise<{ error?: string; ok?: boolean }>;
  rejectBooking: (id: string, reason: string) => Promise<{ error?: string; ok?: boolean }>;
}

const TAB_STATUSES = ["all", "pending_payment", "confirmed", "checked_in", "completed", "cancelled_by_host"] as const;

function getTabLabel(status: string, labels: { [key: string]: string }): string {
  const map: Record<string, string | undefined> = {
    all: labels.booking_status_all,
    pending_payment: labels.booking_status_pending,
    confirmed: labels.booking_status_confirmed,
    checked_in: labels.booking_status_checked_in,
    completed: labels.booking_status_completed,
    cancelled_by_host: labels.booking_status_cancelled,
  };
  return map[status] ?? status;
}

function StatusBadge({ status, labels }: { status: string; labels: { [key: string]: string } }) {
  const classes: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    checked_in: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled_by_host: "bg-red-100 text-red-600",
    cancelled: "bg-red-100 text-red-600",
  };
  const cls = classes[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {getTabLabel(status, labels)}
    </span>
  );
}

function BookingCard({
  booking,
  labels,
  confirmBooking,
  rejectBooking,
}: {
  booking: Booking;
  labels: { [key: string]: string };
  confirmBooking: HostingBookingsListProps["confirmBooking"];
  rejectBooking: HostingBookingsListProps["rejectBooking"];
}) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPendingStatus = booking.status === "pending_payment";

  function handleConfirm() {
    startTransition(async () => {
      setErrorMsg(null);
      const res = await confirmBooking(booking.id);
      if (res.error) setErrorMsg(res.error);
    });
  }

  function handleReject() {
    if (!rejectReason.trim()) return;
    startTransition(async () => {
      setErrorMsg(null);
      const res = await rejectBooking(booking.id, rejectReason);
      if (res.error) setErrorMsg(res.error);
      else setShowReject(false);
    });
  }

  const dateRange =
    booking.checkin && booking.checkout
      ? `${booking.checkin} ~ ${booking.checkout}`
      : "—";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <StatusBadge status={booking.status} labels={labels} />
          <p className="text-xs text-gray-500">
            {labels.booking_dates}: <span className="text-gray-800 font-medium">{dateRange}</span>
          </p>
          {booking.guests != null && (
            <p className="text-xs text-gray-500">
              {labels.booking_guests}: <span className="text-gray-800 font-medium">{booking.guests}</span>
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          {booking.total_price != null && (
            <p className="text-sm font-semibold text-gray-900">¥{booking.total_price.toLocaleString()}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{booking.created_at.slice(0, 10)}</p>
        </div>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}

      {isPendingStatus && !showReject && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 bg-primary text-white text-xs font-medium rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-primary-600 transition-colors"
          >
            {isPending ? "..." : labels.booking_confirm}
          </button>
          <button
            onClick={() => setShowReject(true)}
            disabled={isPending}
            className="flex-1 border border-red-200 text-red-600 text-xs font-medium rounded-lg px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {labels.booking_reject}
          </button>
        </div>
      )}

      {isPendingStatus && showReject && (
        <div className="space-y-2">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={labels.booking_reject_reason}
            className="w-full border border-gray-200 rounded-lg text-xs px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isPending || !rejectReason.trim()}
              className="flex-1 bg-red-500 text-white text-xs font-medium rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-red-600 transition-colors"
            >
              {isPending ? "..." : labels.booking_reject_confirm}
            </button>
            <button
              onClick={() => { setShowReject(false); setRejectReason(""); }}
              className="px-4 py-2 text-xs text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function HostingBookingsList({
  bookings,
  locale: _locale,
  labels,
  confirmBooking,
  rejectBooking,
}: HostingBookingsListProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filtered = activeTab === "all"
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {TAB_STATUSES.map((status) => {
          const count = status === "all"
            ? bookings.length
            : bookings.filter((b) => b.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={[
                "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeTab === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {getTabLabel(status, labels)}
              {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">{labels.no_bookings}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              labels={labels}
              confirmBooking={confirmBooking}
              rejectBooking={rejectBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}
