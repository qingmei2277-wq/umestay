"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

interface BookingDetailProps {
  booking: Record<string, unknown>;
  property: Record<string, unknown>;
  locale: string;
  labels: { [key: string]: string };
  confirmBooking: (id: string) => Promise<{ error?: string; ok?: boolean }>;
  rejectBooking: (id: string, reason: string) => Promise<{ error?: string; ok?: boolean }>;
}

const STATUS_STYLES: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  checked_in: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled_by_host: "bg-red-100 text-red-700",
  cancelled_by_guest: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

function getStatusLabel(status: string, labels: { [key: string]: string }) {
  const map: Record<string, string> = {
    pending_payment: labels.statusPending,
    confirmed: labels.statusConfirmed,
    checked_in: labels.statusCheckedIn,
    completed: labels.statusCompleted,
    cancelled_by_host: labels.statusCancelled,
    cancelled_by_guest: labels.statusCancelled,
    cancelled: labels.statusCancelled,
  };
  return map[status] ?? status;
}

function getPropertyTitle(property: Record<string, unknown>, locale: string) {
  const key = `title_${locale}` as keyof typeof property;
  return (property[key] as string) || (property.title_zh as string) || "";
}

function formatDate(dateStr: unknown) {
  if (!dateStr) return "—";
  return new Date(dateStr as string).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function HostingBookingDetail({
  booking,
  property,
  locale,
  labels,
  confirmBooking,
  rejectBooking,
}: BookingDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const status = booking.status as string;
  const isPendingPayment = status === "pending_payment";
  const bookingId = booking.id as string;

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await confirmBooking(bookingId);
      if (res.error) setError(res.error);
      else setDone(true);
    });
  }

  function handleReject() {
    if (!rejectReason.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await rejectBooking(bookingId, rejectReason.trim());
      if (res.error) setError(res.error);
      else setDone(true);
    });
  }

  return (
    <div>
      <div className="mb-5">
        <Link
          href={`/${locale}/hosting/bookings`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {labels.back}
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3">
          <span
            className={[
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
              STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700",
            ].join(" ")}
          >
            {getStatusLabel(status, labels)}
          </span>
          <span className="text-xs text-gray-400 font-mono">{bookingId}</span>
        </div>

        {/* Details grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {labels.labelProperty}
            </dt>
            <dd className="text-sm text-gray-900 font-medium">
              {getPropertyTitle(property, locale)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {labels.labelDates}
            </dt>
            <dd className="text-sm text-gray-900">
              {formatDate(booking.checkin)} → {formatDate(booking.checkout)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {labels.labelGuests}
            </dt>
            <dd className="text-sm text-gray-900">{(booking.guests as number) ?? "—"}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {labels.labelTotal}
            </dt>
            <dd className="text-sm text-gray-900 font-semibold">
              {booking.total_price != null
                ? `¥${(booking.total_price as number).toLocaleString()}`
                : "—"}
            </dd>
          </div>

          {booking.host_payout != null && (
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {labels.labelPayout}
              </dt>
              <dd className="text-sm text-gray-900">
                ¥{(booking.host_payout as number).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>

        {/* Actions for pending_payment */}
        {isPendingPayment && !done && (
          <div className="border-t border-gray-100 pt-5 space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
            )}

            {!showReject ? (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {labels.confirm}
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  disabled={isPending}
                  className="flex-1 sm:flex-none border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {labels.reject}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  {labels.rejectReason}
                </label>
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isPending || !rejectReason.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    {labels.rejectConfirm}
                  </button>
                  <button
                    onClick={() => { setShowReject(false); setRejectReason(""); }}
                    disabled={isPending}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2">OK</p>
          </div>
        )}
      </div>
    </div>
  );
}
