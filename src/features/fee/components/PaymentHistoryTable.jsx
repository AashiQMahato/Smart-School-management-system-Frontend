/**
 * PaymentHistoryTable - Modern payment history table with receipt download
 */

import StatusBadge from "./StatusBadge";

const METHOD_ICONS = {
  upi: "📱",
  card: "💳",
  cash: "💵",
  online: "🏦",
  "bank-transfer": "🏦",
  wallet: "👛",
  cheque: "📋",
};

export default function PaymentHistoryTable({
  payments,
  onDownloadReceipt,
  fee,
}) {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No payment history yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Payments will appear here once made
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <span className="font-bold text-slate-800">Payment History</span>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full">
          {payments.length} transactions
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">
                Date
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Transaction ID
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">
                Fee Type
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Amount
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Method
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">
                Status
              </th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((payment, i) => (
              <tr
                key={payment._id || i}
                className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(payment.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                    {payment.transactionRef || payment.receiptNumber || "—"}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-slate-600 capitalize">
                    {payment.feeId?.feeType ||
                      (fee?.feeType ? fee.feeType : "—")}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-emerald-700">
                    ₹{(payment.amount || 0).toLocaleString("en-IN")}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-base" title={payment.paymentMethod}>
                    {METHOD_ICONS[payment.paymentMethod] || "💳"}
                  </span>
                  <span className="block text-xs text-slate-500 uppercase mt-0.5">
                    {payment.paymentMethod || "—"}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusBadge status={payment.status || "success"} size="sm" />
                </td>
                <td className="px-6 py-4 text-center">
                  {onDownloadReceipt && payment.status === "success" ? (
                    <button
                      onClick={() => onDownloadReceipt(payment)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 opacity-0 group-hover:opacity-100"
                      title="Download Receipt">
                      <svg
                        className="w-3.5 h-3.5"
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
                      Receipt
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
