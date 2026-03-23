"use client";

import { useState } from "react";

interface KycStatusBannerProps {
  status: string;
  rejectReason?: string | null;
  labels: {
    pending: string;
    approved: string;
    rejected: string;
    rejectReason: (reason: string) => string;
    resubmit: string;
  };
}

export function KycStatusBanner({ status, rejectReason, labels }: KycStatusBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  if (status === "approved") {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
        <span className="text-2xl">✅</span>
        <span className="text-sm font-medium">{labels.approved}</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-6">
        <span className="text-2xl">⏳</span>
        <span className="text-sm">{labels.pending}</span>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">❌</span>
          <span className="text-sm font-medium">{labels.rejected}</span>
        </div>
        {rejectReason && (
          <p className="text-sm">{labels.rejectReason(rejectReason)}</p>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-sm text-red-600 underline"
        >
          {labels.resubmit}
        </button>
      </div>
    );
  }

  return null;
}
