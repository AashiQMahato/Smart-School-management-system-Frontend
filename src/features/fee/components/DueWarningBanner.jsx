/**
 * DueWarningBanner - Shows alert when fees are overdue or due soon
 */

import { useEffect, useState } from "react";

function getDaysUntilDue(dueDate) {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function DueWarningBanner({ fees }) {
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (!fees || fees.length === 0) return;
    const w = [];
    const overdue = fees.filter((f) => f.paymentStatus === "overdue");
    const dueSoon = fees.filter((f) => {
      if (f.paymentStatus === "paid") return false;
      const days = getDaysUntilDue(f.dueDate);
      return days >= 0 && days <= 7;
    });

    if (overdue.length > 0) {
      w.push({
        type: "overdue",
        message: `${overdue.length} fee${overdue.length > 1 ? "s are" : " is"} overdue. Late fines may apply.`,
        total: overdue.reduce((s, f) => s + f.balanceDue, 0),
      });
    }
    if (dueSoon.length > 0) {
      const nextDue = dueSoon.sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      )[0];
      const days = getDaysUntilDue(nextDue.dueDate);
      w.push({
        type: "warning",
        message:
          days === 0
            ? "A fee payment is due TODAY!"
            : `${dueSoon.length > 1 ? `${dueSoon.length} fees are` : "1 fee is"} due within ${days} day${days !== 1 ? "s" : ""}.`,
        total: dueSoon.reduce((s, f) => s + f.balanceDue, 0),
      });
    }
    setWarnings(w);
  }, [fees]);

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
            w.type === "overdue"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
          <span className="text-lg leading-none">
            {w.type === "overdue" ? "🚨" : "⚠️"}
          </span>
          <div className="flex-1">
            {w.message}
            {w.total > 0 && (
              <span
                className={`ml-2 font-bold ${w.type === "overdue" ? "text-red-600" : "text-amber-700"}`}>
                (₹{w.total.toLocaleString("en-IN")})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
