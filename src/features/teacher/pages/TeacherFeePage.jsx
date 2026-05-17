/**
 * TeacherFeePage — Read-only fee overview for teachers
 * Class teachers can view the fee status of students in their classes.
 * No payment actions — strictly read-only.
 */

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  Table,
  Tag,
  Spin,
  Empty,
  Modal,
  Tooltip,
  Input,
  Statistic,
  message,
} from "antd";
import {
  DollarOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  getMyClasses,
  getStudentsByClass,
} from "../../../services/teacher.service";
import { getFeesByStudent } from "../../../services/fee.service";
import {
  StatusBadge,
  FeeBreakdownCard,
  DueWarningBanner,
} from "../../fee/components";

const { Option } = Select;
const { Search } = Input;

// ── Helpers ─────────────────────────────────────────────────────────────────

function calcSummary(fees = []) {
  return fees.reduce(
    (acc, f) => ({
      total: acc.total + (f.totalAmount || 0),
      paid: acc.paid + (f.amountPaid || 0),
      balance: acc.balance + (f.balanceDue || 0),
      overdue:
        acc.overdue +
        (f.paymentStatus !== "paid" && new Date(f.dueDate) < new Date()
          ? 1
          : 0),
    }),
    { total: 0, paid: 0, balance: 0, overdue: 0 },
  );
}

function overallStatus(fees = []) {
  if (!fees.length) return "none";
  const unpaid = fees.filter((f) => f.paymentStatus !== "paid");
  if (!unpaid.length) return "paid";
  const overdue = unpaid.filter((f) => new Date(f.dueDate) < new Date());
  if (overdue.length) return "overdue";
  const partial = fees.some((f) => f.paymentStatus === "partial");
  if (partial) return "partial";
  return "unpaid";
}

const STATUS_COLOR = {
  paid: "success",
  partial: "warning",
  unpaid: "default",
  overdue: "error",
  none: "default",
};
const STATUS_LABEL = {
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
  overdue: "Overdue",
  none: "No Fees",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function TeacherFeePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentFees, setStudentFees] = useState({}); // { studentId: fees[] }
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingFeeId, setLoadingFeeId] = useState(null); // studentId being loaded
  const [search, setSearch] = useState("");
  const [detailStudent, setDetailStudent] = useState(null); // for modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // ── Load classes ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyClasses();
        const list = res?.data || res || [];
        setClasses(list);
        if (list.length > 0) {
          const firstId = list[0]?._id || list[0]?.id;
          setSelectedClass(firstId);
        }
      } catch {
        message.error("Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, []);

  // ── Load students when class changes ──────────────────────────────────────
  useEffect(() => {
    if (!selectedClass) return;
    setStudents([]);
    setStudentFees({});
    setSearch("");
    setLoadingStudents(true);
    (async () => {
      try {
        const res = await getStudentsByClass(selectedClass);
        const list = res?.data || res || [];
        setStudents(list);
        // Prefetch fee summary for all students (in batches to avoid flooding)
        fetchAllFees(list);
      } catch {
        message.error("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    })();
  }, [selectedClass]);

  // ── Prefetch fees for all students in class ───────────────────────────────
  const fetchAllFees = useCallback(async (studentList) => {
    const BATCH = 5;
    for (let i = 0; i < studentList.length; i += BATCH) {
      const batch = studentList.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (s) => {
          const sid = s._id || s.id;
          if (!sid) return;
          try {
            const res = await getFeesByStudent(sid);
            const fees = res?.data || res || [];
            setStudentFees((prev) => ({ ...prev, [sid]: fees }));
          } catch {
            setStudentFees((prev) => ({ ...prev, [sid]: [] }));
          }
        }),
      );
    }
  }, []);

  // ── Open student fee detail modal ─────────────────────────────────────────
  const openDetail = useCallback(
    async (student) => {
      const sid = student._id || student.id;
      setDetailStudent({ student, fees: studentFees[sid] || [] });
      setDetailModalOpen(true);
      // Re-fetch to get latest
      if (!loadingFeeId) {
        setLoadingFeeId(sid);
        try {
          const res = await getFeesByStudent(sid);
          const fees = res?.data || res || [];
          setStudentFees((prev) => ({ ...prev, [sid]: fees }));
          setDetailStudent({ student, fees });
        } catch {
          /* keep cached */
        } finally {
          setLoadingFeeId(null);
        }
      }
    },
    [studentFees, loadingFeeId],
  );

  // ── Derived data ──────────────────────────────────────────────────────────
  const filteredStudents = students.filter((s) => {
    const name = s.userId?.name || s.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const overdueFees = students.flatMap((s) => {
    const sid = s._id || s.id;
    const fees = studentFees[sid] || [];
    return fees
      .filter(
        (f) => f.paymentStatus !== "paid" && new Date(f.dueDate) < new Date(),
      )
      .map((f) => ({ ...f, studentName: s.userId?.name || s.name }));
  });

  // Class-level stats
  const totalStudents = students.length;
  const paidCount = students.filter((s) => {
    const sid = s._id || s.id;
    const fees = studentFees[sid];
    if (!fees) return false;
    return fees.length > 0 && fees.every((f) => f.paymentStatus === "paid");
  }).length;
  const overdueCount = students.filter((s) => {
    const sid = s._id || s.id;
    const fees = studentFees[sid] || [];
    return fees.some(
      (f) => f.paymentStatus !== "paid" && new Date(f.dueDate) < new Date(),
    );
  }).length;
  const pendingCount = totalStudents - paidCount;

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      title: "#",
      key: "idx",
      width: 48,
      render: (_, __, i) => (
        <span className="text-slate-400 text-sm">{i + 1}</span>
      ),
    },
    {
      title: "Student",
      key: "name",
      render: (_, rec) => {
        const name = rec.userId?.name || rec.name || "—";
        const rollNo = rec.rollNumber || rec.admissionNumber || "";
        return (
          <div>
            <p className="font-semibold text-slate-800">{name}</p>
            {rollNo && <p className="text-xs text-slate-400">{rollNo}</p>}
          </div>
        );
      },
    },
    {
      title: "Fee Status",
      key: "status",
      width: 130,
      render: (_, rec) => {
        const sid = rec._id || rec.id;
        const fees = studentFees[sid];
        if (fees === undefined) {
          return <Spin size="small" />;
        }
        const st = overallStatus(fees);
        return (
          <Tag color={STATUS_COLOR[st]} className="font-semibold">
            {STATUS_LABEL[st]}
          </Tag>
        );
      },
    },
    {
      title: "Balance Due",
      key: "balance",
      width: 130,
      render: (_, rec) => {
        const sid = rec._id || rec.id;
        const fees = studentFees[sid];
        if (fees === undefined) return <Spin size="small" />;
        const { balance } = calcSummary(fees);
        return (
          <span
            className={`font-bold ${
              balance > 0 ? "text-red-600" : "text-emerald-600"
            }`}>
            ₹{balance.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Overdue",
      key: "overdue",
      width: 100,
      render: (_, rec) => {
        const sid = rec._id || rec.id;
        const fees = studentFees[sid];
        if (fees === undefined) return <Spin size="small" />;
        const { overdue } = calcSummary(fees);
        return overdue > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            <WarningOutlined /> {overdue}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: (_, rec) => (
        <Tooltip title="View fee details">
          <button
            onClick={() => openDetail(rec)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            <EyeOutlined /> View
          </button>
        </Tooltip>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loadingClasses) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Empty description="You are not assigned as class teacher for any class." />
      </div>
    );
  }

  const selectedClassObj = classes.find(
    (c) => (c._id || c.id) === selectedClass,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 pt-10 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <DollarOutlined className="text-white text-xl" />
                </div>
                <h1 className="text-2xl font-black text-white leading-tight">
                  Fee Overview
                </h1>
              </div>
              <p className="text-blue-200 text-sm">
                Read-only view — contact admin for payment issues
              </p>
            </div>
            {/* Class selector */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                Class
              </span>
              <Select
                value={selectedClass}
                onChange={setSelectedClass}
                className="w-52"
                size="large">
                {classes.map((c) => (
                  <Option key={c._id || c.id} value={c._id || c.id}>
                    {c.name
                      ? `${c.name}${c.section ? ` – ${c.section}` : ""}`
                      : `Class ${c._id}`}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              {
                label: "Total Students",
                value: totalStudents,
                icon: <TeamOutlined />,
                color: "text-white",
              },
              {
                label: "Fully Paid",
                value: paidCount,
                icon: <CheckCircleOutlined />,
                color: "text-emerald-300",
              },
              {
                label: "Pending",
                value: pendingCount,
                icon: <ClockCircleOutlined />,
                color: "text-amber-300",
              },
              {
                label: "Overdue",
                value: overdueCount,
                icon: <ExclamationCircleOutlined />,
                color: "text-red-300",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-blue-200 mt-0.5 flex items-center gap-1">
                  {stat.icon} {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16 space-y-5">
        {/* Overdue alert banner */}
        {overdueFees.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <ExclamationCircleOutlined className="text-red-500 text-lg mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-red-700 text-sm">
                {overdueCount} student{overdueCount !== 1 ? "s" : ""} with
                overdue fees in this class
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                Please inform concerned students/parents to clear dues promptly.
              </p>
            </div>
          </div>
        )}

        {/* Student fee table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-800">
                {selectedClassObj?.name
                  ? `${selectedClassObj.name}${selectedClassObj.section ? ` – ${selectedClassObj.section}` : ""}`
                  : "Students"}{" "}
                — Fee Status
              </span>
            </div>
            <Search
              placeholder="Search student..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60"
              allowClear
            />
          </div>

          <div className="p-4">
            {loadingStudents ? (
              <div className="flex justify-center py-16">
                <Spin size="large" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <Empty description="No students found" className="py-10" />
            ) : (
              <Table
                dataSource={filteredStudents}
                columns={columns}
                rowKey={(r) => r._id || r.id}
                pagination={{ pageSize: 15, showSizeChanger: false }}
                size="middle"
                className="[&_.ant-table-thead_th]:bg-slate-50"
              />
            )}
          </div>
        </div>

        {/* Defaulters section */}
        {overdueFees.length > 0 && (
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <WarningOutlined className="text-red-600" />
              </div>
              <span className="font-bold text-slate-800">
                Defaulters — Overdue Fees
              </span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full ml-auto">
                {overdueFees.length}
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {overdueFees.map((fee, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-red-200 bg-red-50/40 p-4">
                  <p className="font-bold text-slate-800 text-sm">
                    {fee.studentName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {fee.description || fee.feeType}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-red-600 font-black">
                      ₹{fee.balanceDue?.toLocaleString()}
                    </span>
                    <span className="text-xs text-red-500">
                      Due {new Date(fee.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Student Detail Modal ───────────────────────────────────────── */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={680}
        title={null}
        className="[&_.ant-modal-content]:p-0 [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-content]:overflow-hidden"
        destroyOnClose>
        {detailStudent && (
          <div>
            {/* Modal header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <h2 className="text-lg font-black text-white">
                {detailStudent.student?.userId?.name ||
                  detailStudent.student?.name}
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">
                Fee details — read only
              </p>
            </div>

            <div className="p-5 space-y-4">
              <DueWarningBanner fees={detailStudent.fees} />

              {detailStudent.fees.length === 0 ? (
                <Empty description="No fees assigned" />
              ) : (
                <FeeBreakdownCard
                  fees={detailStudent.fees}
                  showDownload={false}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
