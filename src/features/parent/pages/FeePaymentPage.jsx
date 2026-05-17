/**
 * Parent Fee Payment Page
 * Real API integration with child selector, payment flow, history, receipts
 * Modern, trustworthy, mobile-friendly design
 */

import { useState, useEffect } from "react";
import { Button, Modal, Select, message, Empty, Radio } from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  BankOutlined,
  WalletOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as feeService from "../../../services/fee.service";
import * as parentService from "../../../services/parent.service";
import {
  FeeSummaryCard,
  FeeBreakdownCard,
  PaymentHistoryTable,
  DueWarningBanner,
  PdfPreviewModal,
} from "../../fee/components";
import {
  buildFeeBillPdf,
  generatePaymentReceipt,
} from "../../fee/utils/pdfGenerator";

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "online", label: "Net Banking", icon: "🏦" },
  { value: "wallet", label: "Wallet", icon: "👛" },
];

const ParentFeePaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [billPreviewOpen, setBillPreviewOpen] = useState(false);

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchFees(selectedChildId);
      fetchPaymentHistory(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await parentService.getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChildId(childrenData[0]._id);
      }
    } catch (error) {
      message.error(error.message || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (studentId) => {
    try {
      const response = await feeService.getFeesByStudent(studentId);
      setFees(response.data || []);
      setSummary(response.summary || null);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    }
  };

  const fetchPaymentHistory = async (studentId) => {
    try {
      const response = await feeService.getPaymentHistory(studentId);
      setPaymentHistory(response.data || []);
    } catch (error) {
      console.error("Failed to load payment history:", error);
    }
  };

  const handlePay = async () => {
    if (!selectedFee) return;
    setProcessing(true);
    try {
      // Simulate a brief processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await feeService.parentPayment(selectedFee._id, {
        amountPaid: selectedFee.balanceDue,
        paymentMethod,
        transactionRef: `TXN-${Date.now()}`,
      });

      setPaymentSuccess(true);
      setLastPayment(result.data?.payment);
      message.success("Payment successful!");
      fetchFees(selectedChildId);
      fetchPaymentHistory(selectedChildId);
    } catch (error) {
      message.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedFee(null);
    setPaymentSuccess(false);
    setLastPayment(null);
    setPaymentMethod("upi");
  };

  const selectedChild = children.find((c) => c._id === selectedChildId);

  const getStatusConfig = (status) => {
    const configs = {
      paid: {
        color: "success",
        label: "Paid",
        icon: <CheckCircleOutlined />,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
      },
      unpaid: {
        color: "default",
        label: "Unpaid",
        icon: <ClockCircleOutlined />,
        bg: "bg-slate-50",
        text: "text-slate-700",
      },
      partial: {
        color: "warning",
        label: "Partial",
        icon: <ExclamationCircleOutlined />,
        bg: "bg-amber-50",
        text: "text-amber-700",
      },
      overdue: {
        color: "error",
        label: "Overdue",
        icon: <WarningOutlined />,
        bg: "bg-red-50",
        text: "text-red-700",
      },
    };
    return configs[status] || configs.unpaid;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 -m-6 min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-slate-50 p-6 -m-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BankOutlined className="text-3xl text-blue-400" />
          </div>
          <p className="text-slate-500">No children linked to your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-blue-50 via-white to-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BankOutlined className="text-xl" />
              </div>
              <h1 className="text-3xl font-black">Fee Payment</h1>
            </div>
            <p className="text-blue-200">
              View, manage, and pay your children&apos;s fees securely
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                if (fees.length === 0) {
                  message.warning("No fees to generate bill");
                  return;
                }
                setBillPreviewOpen(true);
              }}
              disabled={fees.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold border border-white/30 transition-colors disabled:opacity-40">
              <DownloadOutlined />
              Download Bill
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                showHistory
                  ? "bg-white text-blue-700"
                  : "bg-white/15 text-white border border-white/30 hover:bg-white/25"
              }`}>
              <HistoryOutlined />
              {showHistory ? "View Fees" : "Payment History"}
            </button>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <span className="font-bold text-slate-800">Select Child</span>
        </div>
        <div className="p-5 flex flex-wrap items-center gap-3">
          {children.map((child) => (
            <button
              key={child._id}
              onClick={() => setSelectedChildId(child._id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                selectedChildId === child._id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  selectedChildId === child._id
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}>
                {(child.userId?.name || "S")[0].toUpperCase()}
              </div>
              {child.userId?.name || "Student"}
              {child.classId && (
                <span
                  className={`text-xs ${selectedChildId === child._id ? "text-blue-100" : "text-slate-400"}`}>
                  · {child.classId.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Due Warnings */}
      <DueWarningBanner fees={fees} />

      {/* Summary Card */}
      {summary && (
        <FeeSummaryCard
          summary={summary}
          studentName={selectedChild?.userId?.name}
          academicYear={fees[0]?.academicYear}
        />
      )}

      {/* Main Content */}
      {showHistory ? (
        <PaymentHistoryTable
          payments={paymentHistory}
          onDownloadReceipt={(payment) => {
            const relatedFee = fees.find(
              (f) => f._id === (payment.feeId?._id || payment.feeId),
            );
            generatePaymentReceipt(
              payment,
              relatedFee || payment.feeId,
              selectedChild,
            );
            message.success("Receipt downloaded");
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Pending Fees */}
          {fees.filter((f) => f.paymentStatus !== "paid").length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ClockCircleOutlined className="text-amber-600" />
                </div>
                <span className="font-bold text-slate-800">Pending Fees</span>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full ml-auto">
                  {fees.filter((f) => f.paymentStatus !== "paid").length}
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {fees
                  .filter((f) => f.paymentStatus !== "paid")
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((fee) => {
                    const statusConfig = getStatusConfig(fee.paymentStatus);
                    const isOverdue = new Date(fee.dueDate) < new Date();
                    return (
                      <div
                        key={fee._id}
                        className={`rounded-2xl border-2 p-5 ${isOverdue ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"} hover:shadow-md transition-shadow`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="font-bold text-slate-900">
                              {fee.description || fee.feeType}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.icon} {statusConfig.label}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-black text-slate-900">
                              ₹{fee.balanceDue?.toLocaleString()}
                            </p>
                            {fee.totalAmount !== fee.balanceDue && (
                              <p className="text-xs text-slate-400">
                                of ₹{fee.totalAmount?.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {fee.amountPaid > 0 && (
                          <div className="bg-emerald-100 rounded-xl px-3 py-2 mb-3">
                            <span className="text-xs font-semibold text-emerald-700">
                              ✓ Already paid: ₹
                              {fee.amountPaid?.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-slate-500"}`}>
                            Due: {new Date(fee.dueDate).toLocaleDateString()}
                            {isOverdue && (
                              <span className="ml-1 text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                                OVERDUE
                              </span>
                            )}
                          </p>
                          <Button
                            type="primary"
                            icon={<CreditCardOutlined />}
                            onClick={() => {
                              setSelectedFee(fee);
                              setPaymentModalOpen(true);
                            }}
                            className="bg-blue-600! border-blue-600! rounded-xl font-semibold">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Paid Fees */}
          {fees.filter((f) => f.paymentStatus === "paid").length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircleOutlined className="text-emerald-600" />
                </div>
                <span className="font-bold text-slate-800">Paid Fees</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full ml-auto">
                  {fees.filter((f) => f.paymentStatus === "paid").length}
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {fees
                  .filter((f) => f.paymentStatus === "paid")
                  .map((fee) => (
                    <div
                      key={fee._id}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 flex items-start justify-between">
                      <div className="min-w-0 pr-3">
                        <p className="font-bold text-slate-800">
                          {fee.description || fee.feeType}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 bg-emerald-100 text-emerald-700">
                          <CheckCircleOutlined /> Paid
                        </span>
                        {fee.paidDate && (
                          <p className="text-xs text-slate-400 mt-1">
                            Paid on{" "}
                            {new Date(fee.paidDate).toLocaleDateString()}
                          </p>
                        )}
                        {fee.receiptNumber && (
                          <p className="text-xs font-mono text-blue-500 mt-0.5">
                            {fee.receiptNumber}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xl font-black text-emerald-600">
                          ₹{fee.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {fees.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BankOutlined className="text-2xl text-blue-400" />
              </div>
              <Empty
                description="No fees found for this child"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      )}

      <PdfPreviewModal
        open={billPreviewOpen}
        title="Fee Bill Preview"
        build={() => {
          const student = fees[0]?.studentId || selectedChild || {};
          return buildFeeBillPdf(student, fees, summary);
        }}
        onClose={() => setBillPreviewOpen(false)}
        onDownloaded={() => message.success("Bill PDF downloaded")}
      />

      {/* Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onCancel={closePaymentModal}
        footer={null}
        width={480}
        centered
        closable={!processing}>
        {paymentSuccess ? (
          /* Success State */
          <div className="text-center py-8 px-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircleOutlined className="text-4xl text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-slate-500 mb-6">
              Your payment has been processed successfully.
            </p>
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-black text-emerald-600 text-lg">
                  ₹{selectedFee?.balanceDue?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold">
                  {paymentMethod.toUpperCase()}
                </span>
              </div>
              {lastPayment?.receiptNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Receipt</span>
                  <span className="font-mono text-blue-600">
                    {lastPayment.receiptNumber}
                  </span>
                </div>
              )}
            </div>
            <Button
              type="primary"
              onClick={closePaymentModal}
              className="bg-blue-600! border-blue-600! rounded-2xl! h-12! px-10! font-bold!"
              size="large">
              Done
            </Button>
          </div>
        ) : (
          /* Payment Form */
          <div className="px-2">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCardOutlined className="text-2xl" />
              </div>
              <h2 className="text-xl font-black">Confirm Payment</h2>
            </div>

            {selectedFee && (
              <>
                <div className="bg-slate-50 rounded-2xl p-5 mb-5 space-y-3">
                  {[
                    {
                      label: "Student",
                      value: selectedChild?.userId?.name || "Student",
                    },
                    {
                      label: "Fee Type",
                      value: selectedFee.description || selectedFee.feeType,
                    },
                    {
                      label: "Due Date",
                      value: new Date(selectedFee.dueDate).toLocaleDateString(),
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-800">
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      Amount to Pay
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      ₹{selectedFee.balanceDue?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Payment Method
                  </p>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full">
                    <div className="grid grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            paymentMethod === method.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}>
                          <Radio value={method.value} className="hidden" />
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-semibold text-slate-700">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </Radio.Group>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePay}
                  loading={processing}
                  className="bg-blue-600! border-blue-600! rounded-2xl! h-14! text-lg! font-black!">
                  {processing
                    ? "Processing..."
                    : `Pay ₹${selectedFee.balanceDue?.toLocaleString()}`}
                </Button>
                <p className="text-xs text-center text-slate-400 mt-3">
                  🔒 Secure payment. Your information is encrypted.
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParentFeePaymentPage;
