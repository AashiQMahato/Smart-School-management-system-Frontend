/**
 * Professional Bill Preview Modal
 * Shows a clean invoice preview before download
 */

import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Spin, Alert, Divider } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const SCHOOL_NAME = "Sunrise School Management System";
const SCHOOL_ADDRESS = "123 Education Lane, Knowledge City - 400001";
const SCHOOL_PHONE = "+91 98765 43210";
const SCHOOL_EMAIL = "admin@ssms.edu";

export default function BillPreviewModal({
  open,
  student,
  fees = [],
  summary,
  onClose,
  onDownload,
}) {
  const [loading, setLoading] = useState(true);

  const billNumber = useMemo(
    () => `BILL-${Date.now().toString().slice(-8)}`,
    [open],
  );

  const generatedDate = useMemo(() => dayjs().format("DD MMM YYYY"), [open]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }
  }, [open]);

  // Calculate fee breakdown by type
  const feeBreakdown = useMemo(() => {
    const breakdown = {};
    fees.forEach((fee) => {
      const type = fee.feeType || "other";
      if (!breakdown[type]) {
        breakdown[type] = 0;
      }
      breakdown[type] += Number(fee.totalAmount || 0);
    });
    return breakdown;
  }, [fees]);

  const totalAmount = useMemo(
    () =>
      summary?.totalAmount ||
      fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0),
    [fees, summary],
  );

  const totalPaid = useMemo(
    () =>
      summary?.totalPaid ||
      fees.reduce((sum, f) => sum + (f.amountPaid || 0), 0),
    [fees, summary],
  );

  const balanceDue = useMemo(
    () => totalAmount - totalPaid,
    [totalAmount, totalPaid],
  );

  const dueDate = useMemo(
    () =>
      fees[0]?.dueDate ? dayjs(fees[0].dueDate).format("DD MMM YYYY") : "N/A",
    [fees],
  );

  const academicYear = useMemo(
    () => fees[0]?.academicYear || "2025-2026",
    [fees],
  );

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getFeeTypeLabel = (type) => {
    const labels = {
      tuition: "Tuition Fee",
      exam: "Examination Fee",
      transport: "Transport Fee",
      fine: "Fine",
      library: "Library Fee",
      lab: "Laboratory Fee",
      admission: "Admission Fee",
      sports: "Sports Fee",
      other: "Other Fee",
    };
    return labels[type] || type;
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={800}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => onDownload?.(student, fees, summary, billNumber)}
            className="bg-blue-600 hover:bg-blue-700">
            Download PDF
          </Button>
        </div>
      }
      className="bill-preview-modal"
      styles={{
        body: { padding: 0 },
      }}
      destroyOnClose>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white">
          {/* Bill Preview Container */}
          <div
            id="bill-preview-content"
            className="mx-auto bg-white"
            style={{
              maxWidth: "210mm",
              minHeight: "297mm",
              padding: "20mm",
            }}>
            {/* Header Section */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{SCHOOL_NAME}</h1>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {SCHOOL_ADDRESS}
                  </p>
                  <p className="text-xs opacity-90">
                    Phone: {SCHOOL_PHONE} | Email: {SCHOOL_EMAIL}
                  </p>
                </div>
                <div className="bg-white text-blue-700 px-4 py-3 rounded-lg shadow-md text-center">
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    Fee Bill
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {billNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Student & Bill Info Section */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Student Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-24">
                      Name:
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {student?.userId?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-24">
                      Roll No:
                    </span>
                    <span className="text-slate-900">
                      {student?.rollNo || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-24">
                      Class:
                    </span>
                    <span className="text-slate-900">
                      {student?.classId?.name || "N/A"} -{" "}
                      {student?.classId?.section || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Bill Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-32">
                      Academic Year:
                    </span>
                    <span className="text-slate-900 font-semibold">
                      {academicYear}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-32">
                      Generated Date:
                    </span>
                    <span className="text-slate-900">{generatedDate}</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-600 font-medium w-32">
                      Due Date:
                    </span>
                    <span className="text-red-600 font-semibold">
                      {dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Breakdown Table */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded" />
                Fee Breakdown
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(feeBreakdown).map(([type, amount], idx) => (
                      <tr
                        key={type}
                        className={`border-b border-slate-100 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}>
                        <td className="py-3 px-4 text-sm text-slate-800">
                          {getFeeTypeLabel(type)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900 font-semibold text-right">
                          {formatCurrency(amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">
                    Total Amount:
                  </span>
                  <span className="text-slate-900 font-bold text-lg">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                {totalPaid > 0 && (
                  <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3">
                    <span className="text-slate-700 font-medium">
                      Amount Paid:
                    </span>
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(totalPaid)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-base border-t-2 border-slate-300 pt-3">
                  <span className="text-slate-800 font-bold">Balance Due:</span>
                  <span
                    className={`font-bold text-xl ${
                      balanceDue > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                    {formatCurrency(balanceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="border-t border-slate-200 pt-4 mt-8">
              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  <strong>Payment Instructions:</strong> Please pay by the due
                  date to avoid late fees. Accept payment methods: Cash, Bank
                  Transfer, Online Payment, UPI.
                </p>
                <p className="text-center text-slate-500 mt-6">
                  This is a computer-generated document and does not require a
                  signature.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
