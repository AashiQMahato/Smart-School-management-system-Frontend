/**
 * PDF Generator Utility
 * Generates professional Fee Bills and Payment Receipts using jsPDF
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SCHOOL_NAME = "Sunrise School Management System";
const SCHOOL_ADDRESS = "123 Education Lane, Knowledge City - 400001";
const SCHOOL_PHONE = "+91 98765 43210";
const SCHOOL_EMAIL = "admin@ssms.edu";

// ─── Color Palette ────────────────────────────────────────────────
const COLORS = {
  primary: [37, 99, 235], // blue-600
  success: [16, 185, 129], // emerald-500
  dark: [15, 23, 42], // slate-900
  muted: [100, 116, 139], // slate-500
  light: [241, 245, 249], // slate-100
  white: [255, 255, 255],
  border: [226, 232, 240], // slate-200
  warning: [245, 158, 11], // amber-500
  danger: [239, 68, 68], // red-500
};

/** Draw school header block */
function drawHeader(doc, title, docNumber) {
  const pageW = doc.internal.pageSize.width;

  // Blue header bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageW, 42, "F");

  // School name
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(SCHOOL_NAME, 14, 16);

  // School contact
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`${SCHOOL_ADDRESS} | ${SCHOOL_PHONE} | ${SCHOOL_EMAIL}`, 14, 24);

  // Document type badge (right side)
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(pageW - 72, 8, 58, 26, 3, 3, "F");
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageW - 43, 19, { align: "center" });
  if (docNumber) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.text(docNumber, pageW - 43, 28, { align: "center" });
  }

  return 50; // y position after header
}

/** Draw a two-column info block */
function drawInfoBlock(doc, leftItems, rightItems, startY) {
  const pageW = doc.internal.pageSize.width;
  const midX = pageW / 2;

  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, startY, pageW - 28, leftItems.length * 7 + 10, 3, 3, "F");

  let y = startY + 9;
  leftItems.forEach(({ label, value }) => {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.muted);
    doc.text(label + ":", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    doc.text(String(value || "—"), 60, y);
    y += 7;
  });

  y = startY + 9;
  rightItems.forEach(({ label, value, highlight }) => {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.muted);
    doc.text(label + ":", midX + 6, y);
    doc.setFont("helvetica", highlight ? "bold" : "normal");
    doc.setTextColor(...(highlight ? COLORS.primary : COLORS.dark));
    doc.text(String(value || "—"), midX + 52, y);
    y += 7;
  });

  return startY + leftItems.length * 7 + 16;
}

/** Draw footer */
function drawFooter(doc, note) {
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;

  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(14, pageH - 22, pageW - 14, pageH - 22);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.muted);
  if (note) doc.text(note, 14, pageH - 15);
  doc.text(
    `Generated on ${new Date().toLocaleString()} | Powered by SSMS`,
    pageW - 14,
    pageH - 15,
    { align: "right" },
  );
}

// ──────────────────────────────────────────────────────────────────
// GENERATE FEE BILL  (Before Payment)
// ──────────────────────────────────────────────────────────────────
function inr(amount) {
  const value = Number(amount || 0);
  return `₹${value.toLocaleString("en-IN")}`;
}

function sectionTitle(doc, title, y, color = COLORS.primary) {
  doc.setFillColor(...color);
  doc.roundedRect(14, y - 4, 4, 6, 2, 2, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text(title, 20, y);
}

const FEE_TYPE_COLORS = {
  tuition: [37, 99, 235],
  exam: [124, 58, 237],
  transport: [5, 150, 105],
  fine: [239, 68, 68],
  library: [217, 119, 6],
  lab: [220, 38, 38],
  admission: [8, 145, 178],
  sports: [202, 138, 4],
  other: [107, 114, 128],
};

function statusPillColors(status) {
  switch (status) {
    case "paid":
      return { fill: [16, 185, 129], text: [255, 255, 255] };
    case "partial":
      return { fill: [245, 158, 11], text: [255, 255, 255] };
    case "overdue":
      return { fill: [239, 68, 68], text: [255, 255, 255] };
    default:
      return { fill: [100, 116, 139], text: [255, 255, 255] };
  }
}

export function buildFeeBillPdf(student, fees, summary, options = {}) {
  const doc = new jsPDF({
    orientation: options.orientation || "landscape",
    unit: "mm",
    format: "a4",
  });

  const billNumber =
    options.billNumber || `BILL-${Date.now().toString(36).toUpperCase()}`;
  const generatedDate = new Date().toLocaleDateString("en-IN");

  // Header
  let y = drawHeader(doc, "FEE BILL", billNumber);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Fee Bill / Invoice", 14, y + 3);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated: ${generatedDate}`, 14, y + 10);
  y += 18;

  const studentName = student?.userId?.name || student?.name || "Student";
  const className = student?.classId?.name
    ? `${student.classId.name}${student.classId.section ? " - " + student.classId.section : ""}`
    : "N/A";
  const admissionNo = student?.admissionNumber || "N/A";
  const rollNo = student?.rollNumber || "N/A";
  const academicYear = fees?.[0]?.academicYear || "N/A";
  const dueDateText = fees?.[0]?.dueDate
    ? new Date(fees[0].dueDate).toLocaleDateString("en-IN")
    : "N/A";

  y = drawInfoBlock(
    doc,
    [
      { label: "Student", value: studentName },
      { label: "Class", value: className },
      { label: "Admission No.", value: admissionNo },
      { label: "Roll No.", value: rollNo },
    ],
    [
      { label: "Academic Year", value: academicYear },
      { label: "Bill No.", value: billNumber, highlight: true },
      { label: "Bill Date", value: generatedDate },
      { label: "Due Date", value: dueDateText },
    ],
    y,
  );

  y += 7;

  // Totals (colorful cards)
  const totalFee =
    summary?.totalAmount ||
    (fees || []).reduce((s, f) => s + (f.totalAmount || 0), 0);
  const totalPaid =
    summary?.totalPaid ||
    (fees || []).reduce((s, f) => s + (f.amountPaid || 0), 0);
  const totalBalance =
    summary?.totalBalance ||
    (fees || []).reduce((s, f) => s + (f.balanceDue || 0), 0);

  const pageW = doc.internal.pageSize.width;
  const cardY = y;
  const cardW = (pageW - 28 - 8) / 3;
  const cards = [
    {
      label: "Total",
      value: inr(totalFee),
      fill: COLORS.light,
      valueColor: COLORS.dark,
    },
    {
      label: "Paid",
      value: inr(totalPaid),
      fill: [236, 253, 245],
      valueColor: COLORS.success,
    },
    {
      label: "Balance",
      value: inr(totalBalance),
      fill: [254, 242, 242],
      valueColor: COLORS.danger,
    },
  ];
  cards.forEach((c, i) => {
    const x = 14 + i * (cardW + 4);
    doc.setFillColor(...c.fill);
    doc.roundedRect(x, cardY, cardW, 16, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.muted);
    doc.text(c.label.toUpperCase(), x + 6, cardY + 6);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...c.valueColor);
    doc.text(c.value, x + 6, cardY + 13);
  });

  y += 22;

  // Fee type summary (grouped)
  const typeTotals = (fees || []).reduce((acc, f) => {
    const t = f.feeType || "other";
    acc[t] = (acc[t] || 0) + (f.totalAmount || 0);
    return acc;
  }, {});
  const summaryRows = Object.entries(typeTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([t, amt]) => [FEE_TYPE_LABELS[t] || t, inr(amt)]);

  if (summaryRows.length) {
    sectionTitle(doc, "Fee Type Summary", y);
    y += 3;
    autoTable(doc, {
      startY: y,
      head: [["Fee Type", "Total"]],
      body: summaryRows,
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: COLORS.dark },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { halign: "right" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: pageW - 14 - 110 },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // Fee components table
  sectionTitle(doc, "Fee Components", y, COLORS.primary);
  y += 3;

  const sortedFees = [...(fees || [])].sort((a, b) => {
    const at = a.feeType || "";
    const bt = b.feeType || "";
    if (at !== bt) return at.localeCompare(bt);
    return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
  });

  const rows = sortedFees.map((fee, idx) => [
    idx + 1,
    FEE_TYPE_LABELS[fee.feeType] || fee.feeType,
    fee.description || "—",
    inr(fee.amount),
    fee.discount > 0 ? `-${inr(fee.discount).slice(1)}` : "—",
    fee.fine > 0 ? `+${inr(fee.fine).slice(1)}` : "—",
    inr(fee.totalAmount),
    fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("en-IN") : "—",
    getStatusLabel(fee.paymentStatus),
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "#",
        "Type",
        "Description",
        "Amount",
        "Discount",
        "Late Fine",
        "Total",
        "Due",
        "Status",
      ],
    ],
    body: rows,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8.8,
    },
    bodyStyles: { fontSize: 8.5, textColor: COLORS.dark, valign: "middle" },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 28 },
      2: { cellWidth: 78 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right", fontStyle: "bold" },
      7: { cellWidth: 20, halign: "center" },
      8: { cellWidth: 22, halign: "center", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 1) {
        const fee = sortedFees[data.row.index];
        const color = FEE_TYPE_COLORS[fee?.feeType] || FEE_TYPE_COLORS.other;
        data.cell.styles.fillColor = [
          Math.min(255, color[0] + 190),
          Math.min(255, color[1] + 190),
          Math.min(255, color[2] + 190),
        ];
      }
      if (data.section === "body" && data.column.index === 8) {
        const fee = sortedFees[data.row.index];
        const { fill, text } = statusPillColors(fee?.paymentStatus);
        data.cell.styles.fillColor = fill;
        data.cell.styles.textColor = text;
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  // Payment instructions
  if (totalBalance > 0 && y < doc.internal.pageSize.height - 35) {
    sectionTitle(doc, "Payment Instructions", y, COLORS.warning);
    y += 4;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    const instructions = [
      "• Please pay before the due date to avoid late fees.",
      "• Modes: Cash, UPI, Card, Net Banking.",
      "• Keep this invoice for reference.",
      "• For discrepancies, contact the school office.",
    ];
    instructions.forEach((line) => {
      doc.text(line, 14, y);
      y += 5;
    });
  }

  drawFooter(
    doc,
    "This is a computer-generated document. No signature required.",
  );

  const safeName = studentName.replace(/\s+/g, "_");
  const fileName = `FeeBill_${safeName}_${billNumber}.pdf`;
  return { doc, fileName, billNumber };
}

export function generateFeeBill(student, fees, summary) {
  const { doc, fileName } = buildFeeBillPdf(student, fees, summary);
  doc.save(fileName);
}

// ──────────────────────────────────────────────────────────────────
// GENERATE PAYMENT RECEIPT (After Payment)
// ──────────────────────────────────────────────────────────────────
export function generatePaymentReceipt(payment, fee, student) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const receiptNumber =
    payment?.receiptNumber || `RCP-${Date.now().toString(36).toUpperCase()}`;
  const paymentDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  // Header
  let y = drawHeader(doc, "RECEIPT", receiptNumber);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Payment Receipt", 14, y + 4);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.success);
  doc.text("✓  Payment Confirmed", 14, y + 11);
  y += 20;

  // Student Info
  const studentName = student?.userId?.name || student?.name || "Student";
  const className = student?.classId?.name
    ? `${student.classId.name}${student.classId.section ? " - " + student.classId.section : ""}`
    : "N/A";

  y = drawInfoBlock(
    doc,
    [
      { label: "Student Name", value: studentName },
      { label: "Class", value: className },
      { label: "Admission No.", value: student?.admissionNumber || "N/A" },
      { label: "Academic Year", value: fee?.academicYear || "N/A" },
    ],
    [
      { label: "Receipt No.", value: receiptNumber, highlight: true },
      { label: "Payment Date", value: paymentDate },
      {
        label: "Payment Method",
        value: (payment?.paymentMethod || "").toUpperCase(),
      },
      { label: "Transaction ID", value: payment?.transactionRef || "—" },
    ],
    y,
  );

  y += 8;

  // Payment details table
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Payment Details", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [
      ["Fee Component", "Fee Type", "Total Amount", "Amount Paid", "Balance"],
    ],
    body: [
      [
        fee?.description ||
          FEE_TYPE_LABELS[fee?.feeType] ||
          fee?.feeType ||
          "Fee",
        (fee?.feeType || "").charAt(0).toUpperCase() +
          (fee?.feeType || "").slice(1),
        `₹${fee?.totalAmount?.toLocaleString("en-IN") || 0}`,
        `₹${payment?.amount?.toLocaleString("en-IN") || 0}`,
        `₹${(fee?.balanceDue || 0).toLocaleString("en-IN")}`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: COLORS.success,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 9, textColor: COLORS.dark },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right", fontStyle: "bold" },
      4: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Big green amount paid box
  const pageW = doc.internal.pageSize.width;
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(...COLORS.success);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, pageW - 28, 28, 4, 4, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text("Amount Paid", pageW / 2, y + 9, { align: "center" });
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.success);
  doc.text(
    `₹${payment?.amount?.toLocaleString("en-IN") || 0}`,
    pageW / 2,
    y + 22,
    { align: "center" },
  );

  y += 36;

  // Remaining balance
  if (fee?.balanceDue > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.warning);
    doc.text(
      `Remaining Balance: ₹${fee.balanceDue.toLocaleString("en-IN")} — Please pay by ${fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("en-IN") : "due date"}`,
      14,
      y,
    );
    y += 8;
  }

  // Thank you note
  y += 4;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Thank you for your payment!", 14, y);
  y += 7;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(
    "This receipt is proof of payment. Please retain it for your records.",
    14,
    y,
  );

  // Official seal placeholder
  y += 14;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.muted);
  doc.text("Authorized Signatory", pageW - 14, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text("Principal / Finance Office", pageW - 14, y + 6, { align: "right" });
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(pageW - 70, y + 10, pageW - 14, y + 10);

  drawFooter(
    doc,
    "This is an official receipt. Contact school for any queries.",
  );

  doc.save(`Receipt_${studentName.replace(/\s+/g, "_")}_${receiptNumber}.pdf`);
}

// ──────────────────────────────────────────────────────────────────
// GENERATE ADMIN FEE REPORT
// ──────────────────────────────────────────────────────────────────
export function generateFeeReport(fees, stats) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  let y = drawHeader(
    doc,
    "FEE REPORT",
    `RPT-${new Date().toLocaleDateString("en-IN").replace(/\//g, "")}`,
  );

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text("Fee Collection Report", 14, y + 4);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y + 11);
  y += 20;

  // Stats row
  const pageW = doc.internal.pageSize.width;
  const cols = 4;
  const colW = (pageW - 28) / cols;
  const statItems = [
    {
      label: "Total Generated",
      value: `₹${(stats?.overall?.totalAmount || 0).toLocaleString("en-IN")}`,
      color: COLORS.primary,
    },
    {
      label: "Total Collected",
      value: `₹${(stats?.overall?.totalCollected || 0).toLocaleString("en-IN")}`,
      color: COLORS.success,
    },
    {
      label: "Pending",
      value: `₹${(stats?.overall?.totalPending || 0).toLocaleString("en-IN")}`,
      color: COLORS.warning,
    },
    {
      label: "Overdue Count",
      value: stats?.overall?.overdueCount || 0,
      color: COLORS.danger,
    },
  ];

  statItems.forEach((item, i) => {
    const x = 14 + i * colW;
    doc.setFillColor(...item.color);
    doc.roundedRect(x, y, colW - 4, 20, 3, 3, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.white);
    doc.text(item.label, x + 5, y + 7);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(String(item.value), x + 5, y + 16);
  });

  y += 28;

  // Fee table
  const tableRows = fees
    .slice(0, 100)
    .map((fee, idx) => [
      idx + 1,
      fee.studentId?.userId?.name || "Student",
      fee.studentId?.classId
        ? `${fee.studentId.classId.name} ${fee.studentId.classId.section}`
        : "—",
      (fee.feeType || "").charAt(0).toUpperCase() +
        (fee.feeType || "").slice(1),
      `₹${fee.totalAmount?.toLocaleString("en-IN")}`,
      `₹${fee.amountPaid?.toLocaleString("en-IN")}`,
      `₹${fee.balanceDue?.toLocaleString("en-IN")}`,
      new Date(fee.dueDate).toLocaleDateString("en-IN"),
      getStatusLabel(fee.paymentStatus),
    ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "#",
        "Student",
        "Class",
        "Type",
        "Total",
        "Paid",
        "Balance",
        "Due Date",
        "Status",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      8: { halign: "center" },
    },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc, "Confidential - For internal use only.");
  doc.save(
    `FeeReport_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.pdf`,
  );
}

// ─── Helpers ──────────────────────────────────────────────────────
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

function getStatusLabel(status) {
  const map = {
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial",
    overdue: "Overdue",
  };
  return map[status] || status || "Unknown";
}
