"use client";

interface PayoutTableProps {
  payouts: Array<Record<string, unknown>>;
  labels: { [key: string]: string };
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-700",
};

function getStatusLabel(status: string, labels: { [key: string]: string }) {
  const map: Record<string, string | undefined> = {
    pending: labels.statusPending,
    processing: labels.statusProcessing,
    paid: labels.statusPaid,
  };
  return map[status] ?? status;
}

function formatDate(dateStr: unknown) {
  if (!dateStr) return "—";
  return new Date(dateStr as string).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function PayoutTable({ payouts, labels }: PayoutTableProps) {
  if (payouts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-sm text-gray-400">
        {labels.noPayouts}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                日付
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                金額
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ステータス
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                予約 ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payouts.map((payout) => {
              const status = (payout.status as string) ?? "";
              return (
                <tr key={payout.id as string} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                    {formatDate(payout.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-900 whitespace-nowrap">
                    {payout.amount != null
                      ? `¥${(payout.amount as number).toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={[
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600",
                      ].join(" ")}
                    >
                      {getStatusLabel(status, labels)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs whitespace-nowrap">
                    {(payout.booking_id as string) ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
