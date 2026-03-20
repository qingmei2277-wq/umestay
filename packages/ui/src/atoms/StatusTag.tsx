import { cn } from "../utils/cn";

// Mirrors Database["public"]["Enums"]["booking_status"] — inline to avoid circular dep
type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "reviewed"
  | "cancelled_by_guest"
  | "cancelled_by_host"
  | "cancelled_by_admin";

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending_payment:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:           "bg-blue-50 text-blue-700 border-blue-200",
  checked_in:          "bg-primary-50 text-primary border-primary/20",
  completed:           "bg-green-50 text-green-700 border-green-200",
  reviewed:            "bg-green-50 text-green-700 border-green-200",
  cancelled_by_guest:  "bg-red-50 text-red-600 border-red-200",
  cancelled_by_host:   "bg-red-50 text-red-600 border-red-200",
  cancelled_by_admin:  "bg-gray-100 text-gray-500 border-gray-200",
};

interface StatusTagProps {
  status: BookingStatus;
  label?: string;
  className?: string;
}

export function StatusTag({ status, label, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border",
        STATUS_STYLES[status],
        className
      )}
    >
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
