/**
 * Student Fee Page
 * Read-only view with fee summary, breakdown, payment history, and bill download
 */

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "antd";
import { message } from "antd";
import * as feeService from "../../../services/fee.service";
import {
  FeeSummaryCard,
  FeeBreakdownCard,
  PaymentHistoryTable,
  DueWarningBanner,
  PdfPreviewModal,
} from "../../fee/components";
import { buildFeeBillPdf } from "../../fee/utils/pdfGenerator";

const StudentFeePage = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeView, setActiveView] = useState("fees");
  const [billPreviewOpen, setBillPreviewOpen] = useState(false);

  const fetchFees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await feeService.getMyFees();
      setFees(response.data || []);
      setSummary(response.summary || null);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const student = fees[0]?.studentId;
      if (student) {
        const sid = student?._id || student;
        const res = await feeService.getPaymentHistory(sid);
        setPayments(res.data || []);
      }
    } catch (error) {
      console.error("Could not load payment history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [fees]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  useEffect(() => {
    if (activeView === "history" && fees.length > 0 && payments.length === 0) {
      fetchPaymentHistory();
    }
  }, [activeView, fees, payments.length, fetchPaymentHistory]);

  const handleDownloadBill = () => {
    if (fees.length === 0) {
      message.warning("No fee records to generate bill");
      return;
    }
    setBillPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6 space-y-4">
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const pendingFees = fees.filter((f) => f.paymentStatus !== "paid");
  const paidFees = fees.filter((f) => f.paymentStatus === "paid");

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6 space-y-5">
      {/* Page Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl px-6 py-5 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight">My Fees</h1>
              <p className="text-blue-200 text-sm">
                View your fee status and download bill
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadBill}
            disabled={fees.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
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
            Download Bill PDF
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <svg
          className="w-4 h-4 text-blue-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-blue-700">
          This is a <strong>read-only</strong> view. Contact your parent or
          school administration for fee payments.
        </p>
      </div>

      {/* Due Warnings */}
      <DueWarningBanner fees={fees} />

      {/* Summary Card */}
      {summary && <FeeSummaryCard summary={summary} />}

      {/* Empty State */}
      {fees.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-slate-400"
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
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No Fees Assigned
          </h3>
          <p className="text-slate-400">
            Your fee records will appear here once assigned by the school.
          </p>
        </div>
      )}

      {fees.length > 0 && (
        <>
          {/* Tab Toggle */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {[
              { key: "fees", label: "Fee Breakdown" },
              { key: "history", label: "Payment History" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeView === key
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {activeView === "fees" && (
            <div className="space-y-5">
              {pendingFees.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <h3 className="font-bold text-slate-800">Pending Fees</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                      {pendingFees.length}
                    </span>
                  </div>
                  <FeeBreakdownCard
                    fees={pendingFees}
                    onDownloadBill={handleDownloadBill}
                    showDownload={true}
                  />
                </div>
              )}

              {paidFees.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <h3 className="font-bold text-slate-800">Paid Fees</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                      {paidFees.length}
                    </span>
                  </div>
                  <FeeBreakdownCard fees={paidFees} showDownload={false} />
                </div>
              )}
            </div>
          )}

          {activeView === "history" &&
            (historyLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <PaymentHistoryTable payments={payments} />
            ))}
        </>
      )}

      <PdfPreviewModal
        open={billPreviewOpen}
        title="Fee Bill Preview"
        build={() => {
          const student = fees[0]?.studentId || {};
          return buildFeeBillPdf(student, fees, summary);
        }}
        onClose={() => setBillPreviewOpen(false)}
        onDownloaded={() => message.success("Bill PDF downloaded")}
      />
    </div>
  );
};

export default StudentFeePage;
