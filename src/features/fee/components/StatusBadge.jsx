/**
 * StatusBadge - Reusable fee/payment status badge
 */

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    ring: "ring-slate-200",
  },
  partial: {
    label: "Partial",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
  },
  overdue: {
    label: "Overdue",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    ring: "ring-red-200",
  },
  success: {
    label: "Success",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
    ring: "ring-red-200",
  },
};

const SIZE_MAP = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-sm px-3 py-1.5 font-semibold",
};

export default function StatusBadge({
  status,
  size = "md",
  showDot = true,
  className = "",
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unpaid;
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ${config.bg} ${config.text} ${config.ring} ${sizeClass} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      )}
      {config.label}
    </span>
  );
}
