"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DualCalendar } from "@umestay/ui/composite";
import { Stars } from "@umestay/ui";
import type { PropertySummaryRow } from "@umestay/db";

interface BookingCardProps {
  property: PropertySummaryRow;
  locale: "zh" | "ja" | "en";
  blockedDates?: string[];
  initialCheckin?: string;
  initialCheckout?: string;
  initialGuests?: number;
}

const L = {
  zh: {
    perNight: "晚",
    perMonth: "个月",
    selectDates: "请选择日期",
    guests: "人数",
    guestsUnit: "位",
    bookNow: "立即预订",
    loginToBook: "登录后预订",
    nights: "晚",
    months: "个月",
    subtotal: "房费",
    cleaningFee: "清洁费",
    total: "合计",
  },
  ja: {
    perNight: "泊",
    perMonth: "ヶ月",
    selectDates: "日程を選択してください",
    guests: "人数",
    guestsUnit: "名",
    bookNow: "今すぐ予約",
    loginToBook: "予約するにはログイン",
    nights: "泊",
    months: "ヶ月",
    subtotal: "宿泊料金",
    cleaningFee: "清掃料金",
    total: "合計",
  },
  en: {
    perNight: "night",
    perMonth: "month",
    selectDates: "Select dates",
    guests: "Guests",
    guestsUnit: "",
    bookNow: "Book now",
    loginToBook: "Log in to book",
    nights: "nights",
    months: "months",
    subtotal: "Room rate",
    cleaningFee: "Cleaning fee",
    total: "Total",
  },
};

function diffDays(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function diffMonths(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (db.getFullYear() - da.getFullYear()) * 12 + db.getMonth() - da.getMonth();
}

export function BookingCard({
  property,
  locale,
  blockedDates = [],
  initialCheckin,
  initialCheckout,
  initialGuests = 1,
}: BookingCardProps) {
  const router = useRouter();
  const t = L[locale];

  const [checkin, setCheckin]   = useState(initialCheckin ?? "");
  const [checkout, setCheckout] = useState(initialCheckout ?? "");
  const [guests, setGuests]     = useState(initialGuests);
  const [calOpen, setCalOpen]   = useState(false);

  const isMonthly = property.type === "monthly";
  const unitPrice = isMonthly ? property.price_monthly : property.price_daily;

  const nights  = checkin && checkout ? diffDays(checkin, checkout) : 0;
  const months  = checkin && checkout ? diffMonths(checkin, checkout) : 0;
  const units   = isMonthly ? months : nights;
  const subtotal = units > 0 && unitPrice ? units * unitPrice : null;
  const total    = subtotal != null ? subtotal + (property.cleaning_fee ?? 0) : null;

  const handleBook = () => {
    const qs = new URLSearchParams();
    if (checkin)  qs.set("checkin", checkin);
    if (checkout) qs.set("checkout", checkout);
    qs.set("guests", String(guests));
    router.push(`/${locale}/bookings/new?property=${property.id}&${qs.toString()}`);
  };

  const priceLabel = unitPrice
    ? `¥${unitPrice.toLocaleString()} / ${isMonthly ? t.perMonth : t.perNight}`
    : "–";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-card p-5 sticky top-24">
      {/* Price */}
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-2xl font-bold text-gray-900">
          ¥{unitPrice?.toLocaleString() ?? "–"}
        </span>
        <span className="text-sm text-gray-500">/ {isMonthly ? t.perMonth : t.perNight}</span>
        {(property.rating_avg ?? 0) > 0 && (
          <div className="ml-auto">
            <Stars rating={property.rating_avg} count={property.review_count} size="sm" />
          </div>
        )}
      </div>

      {/* Date picker trigger */}
      <button
        onClick={() => setCalOpen(true)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left text-sm mb-3 hover:border-gray-400 transition-colors"
      >
        {checkin && checkout ? (
          <span className="text-gray-900">{checkin} → {checkout}</span>
        ) : (
          <span className="text-gray-400">{t.selectDates}</span>
        )}
      </button>

      {/* Guests */}
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-4">
        <span className="text-sm text-gray-700">{t.guests}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            disabled={guests <= 1}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-500 disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {guests}{t.guestsUnit}
          </span>
          <button
            onClick={() => setGuests(Math.min(property.max_guests, guests + 1))}
            disabled={guests >= property.max_guests}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-500 disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Price breakdown */}
      {subtotal != null && (
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>
              {priceLabel} × {units} {isMonthly ? t.months : t.nights}
            </span>
            <span>¥{subtotal.toLocaleString()}</span>
          </div>
          {property.cleaning_fee > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>{t.cleaningFee}</span>
              <span>¥{property.cleaning_fee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-1">
            <span>{t.total}</span>
            <span>¥{total?.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleBook}
        disabled={!checkin || !checkout}
        className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t.bookNow}
      </button>

      {/* Calendar modal */}
      {calOpen && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCalOpen(false)} />
          <div className="relative z-10">
            <DualCalendar
              checkin={checkin || null}
              checkout={checkout || null}
              onRangeChange={(start, end) => {
                setCheckin(start);
                setCheckout(end);
                setCalOpen(false);
              }}
              onClose={() => setCalOpen(false)}
              blockedDates={blockedDates.map(d => new Date(`${d}T00:00:00`))}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  );
}
