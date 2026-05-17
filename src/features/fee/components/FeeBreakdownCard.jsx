/**
 * FeeBreakdownCard - Modern fee breakdown table card
 */

import StatusBadge from "./StatusBadge";

const FEE_TYPE_LABELS = {
  tuition: "Tuition Fee",
  exam: "Exam Fee",
  transport: "Transport Fee",
  fine: "Fine",
  library: "Library Fee",
  lab: "Lab Fee",
  admission: "Admission Fee",
  sports: "Sports Fee",
  other: "Other Fee",
};

const FEE_TYPE_ICONS = {
  tuition: "🎓",
  exam: "📝",
  transport: "🚌",
  fine: "⚠️",
  library: "📚",
  lab: "🔬",
  admission: "🏫",
  sports: "⚽",
  other: "💼",
};

export default function FeeBreakdownCard({
  fees,
  onDownloadBill,
  showDownload = true,
}) {
  if (!fees || fees.length === 0) return null;

  const totalAmount = fees.reduce((s, f) => s + (f.totalAmount || 0), 0);
  const totalPaid = fees.reduce((s, f) => s + (f.amountPaid || 0), 0);
  const totalBalance = fees.reduce((s, f) => s + (f.balanceDue || 0), 0);
  const totalFine = fees.reduce((s, f) => s + (f.fine || 0), 0);
  const totalDiscount = fees.reduce((s, f) => s + (f.discount || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-800">Fee Breakdown</span>
        </div>
        {showDownload && onDownloadBill && (
          <button
            onClick={onDownloadBill}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Bill
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">
                Fee Component
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Amount
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                Discount
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">
                Fine
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Total
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Status
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fees.map((fee) => {
              const isOverdue = fee.paymentStatus === "overdue";
              return (
                <tr
                  key={fee._id}
                  className={`hover:bg-slate-50 transition-colors ${isOverdue ? "bg-red-50/30" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">
                        {FEE_TYPE_ICONS[fee.feeType] || "💼"}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {fee.description ||
                            FEE_TYPE_LABELS[fee.feeType] ||
                            fee.feeType}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {fee.feeType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-700">
                    ₹{(fee.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-emerald-600 hidden sm:table-cell">
                    {fee.discount > 0
                      ? `-₹${fee.discount.toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-red-600 hidden sm:table-cell">
                    {fee.fine > 0
                      ? `+₹${fee.fine.toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 text-sm">
                    ₹{(fee.totalAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={fee.paymentStatus} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-slate-600"}`}>
                      {fee.dueDate
                        ? new Date(fee.dueDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Total Row */}
          <tfoot>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <td className="px-6 py-4 font-bold text-sm">Total</td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-slate-300">
                ₹
                {fees
                  .reduce((s, f) => s + (f.amount || 0), 0)
                  .toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-300 hidden sm:table-cell">
                {totalDiscount > 0
                  ? `-₹${totalDiscount.toLocaleString("en-IN")}`
                  : "—"}
              </td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-red-300 hidden sm:table-cell">
                {totalFine > 0 ? `+₹${totalFine.toLocaleString("en-IN")}` : "—"}
              </td>
              <td className="px-4 py-4 text-right font-black text-base text-white">
                ₹{totalAmount.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-4" />
              <td className="px-6 py-4 text-right">
                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">
                    ₹{totalPaid.toLocaleString("en-IN")} paid
                  </span>
                  {totalBalance > 0 && (
                    <span className="ml-2 text-red-300 font-bold">
                      ₹{totalBalance.toLocaleString("en-IN")} due
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
