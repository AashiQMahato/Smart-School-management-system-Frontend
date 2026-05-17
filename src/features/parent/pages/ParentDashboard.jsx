/**
 * Parent Dashboard
 * Main dashboard view for parents - Shows real data from API
 * Enhanced with alerts and comparison visualizations
 */

import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Empty, message } from "antd";
import {
  CheckCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getMyChildren,
  getChildAttendance,
} from "../../../services/parent.service";
import scheduleService from "../../../services/schedule.service";
import { ScheduleView } from "../../../components/Schedule";

const ParentDashboard = () => {
  const EMPTY_GROUPED = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childAttendance, setChildAttendance] = useState([]);
  const [childScheduleData, setChildScheduleData] = useState({
    items: [],
    groupedByDay: EMPTY_GROUPED,
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDetails();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      message.error("Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async () => {
    if (!selectedChild) return;

    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const [attendanceRes, timetableRes] = await Promise.all([
        getChildAttendance(selectedChild._id, {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }).catch(() => ({ data: [] })),
        scheduleService
          .getParentSchedules()
          .catch(() => ({ data: { children: [] } })),
      ]);

      setChildAttendance(attendanceRes.data || []);
      const childrenSchedules = timetableRes.data?.children || [];
      const match = childrenSchedules.find(
        (c) => c?.student?._id === selectedChild._id,
      );
      if (match) {
        setChildScheduleData({
          items: match.items || [],
          groupedByDay: match.groupedByDay || EMPTY_GROUPED,
        });
      } else {
        setChildScheduleData({ items: [], groupedByDay: EMPTY_GROUPED });
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (!childAttendance || childAttendance.length === 0) return 0;
    const presentDays = childAttendance.filter(
      (a) => a.status === "present",
    ).length;
    return Math.round((presentDays / childAttendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Parent Dashboard 👨‍👩‍👧‍👦</h1>
              <p className="text-indigo-100 text-lg">
                Monitor your children's academic progress
              </p>
            </div>
          </div>
        </div>
        <Card className="shadow-lg rounded-2xl border-0">
          <Empty
            description="No children linked to your account yet. Please contact the school administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-purple-50 min-h-screen">
      {/* Welcome Header - Enhanced */}
      <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-purple-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Parent Dashboard 👨‍👩‍👧‍👦
            </h1>
            <p className="text-purple-100 text-lg">
              Monitor and support your children's academic journey
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 text-center">
              <p className="text-sm text-purple-100">Total Children</p>
              <p className="text-4xl font-bold">{children.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Children — pill tab switcher */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-xl text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">
                My Children
              </h2>
              <p className="text-xs text-slate-400">
                {children.length} {children.length === 1 ? "child" : "children"}{" "}
                linked to your account
              </p>
            </div>
          </div>
          {children.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              {children.map((child) => (
                <button
                  key={child._id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedChild?._id === child._id
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedChild?._id === child._id ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"}`}>
                    {(child.userId?.name || "?")[0].toUpperCase()}
                  </div>
                  {child.userId?.name?.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {children
          .filter((child) => child._id === selectedChild?._id)
          .map((child) => (
            <div key={child._id} className="p-6">
              {/* Child Profile Hero */}
              <div className="bg-linear-to-br from-purple-400 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                    <span className="text-3xl font-black text-white">
                      {(child.userId?.name || "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-2xl font-black">
                        {child.userId?.name}
                      </h2>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          (child.userId?.status || "active") === "active"
                            ? "bg-emerald-400/30 text-emerald-100"
                            : "bg-amber-400/30 text-amber-100"
                        }`}>
                        {(child.userId?.status || "active").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm mb-4">
                      {child.userId?.email || ""}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Class",
                          value: `${child.classId?.name || "—"} ${child.section || ""}`,
                        },
                        { label: "Roll No.", value: child.rollNumber || "—" },
                        {
                          label: "Admission No.",
                          value: child.admissionNumber || "—",
                        },
                        {
                          label: "Academic Year",
                          value: child.academicYear || "—",
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                          <div className="text-purple-200 text-xs mb-0.5">
                            {label}
                          </div>
                          <div className="font-bold text-sm truncate">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    icon: <CheckCircleOutlined className="text-xl" />,
                    value: `${calculateAttendanceRate()}%`,
                    label: "Attendance Rate",
                    bg: "bg-emerald-500",
                    light: "bg-emerald-50",
                    text: "text-emerald-600",
                  },
                  {
                    icon: <BookOutlined className="text-xl" />,
                    value: child.classId?.subjects?.length || 0,
                    label: "Subjects",
                    bg: "bg-blue-500",
                    light: "bg-blue-50",
                    text: "text-blue-600",
                  },
                  {
                    icon: <TeamOutlined className="text-xl" />,
                    value:
                      child.classId?.classTeacher?.userId?.name ||
                      "Not Assigned",
                    label: "Class Teacher",
                    bg: "bg-purple-400",
                    light: "bg-purple-50",
                    text: "text-purple-500",
                    small: true,
                  },
                  {
                    icon: <CalendarOutlined className="text-xl" />,
                    value: child.admissionDate
                      ? new Date(child.admissionDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )
                      : "N/A",
                    label: "Admitted",
                    bg: "bg-amber-500",
                    light: "bg-amber-50",
                    text: "text-amber-600",
                    small: true,
                  },
                ].map(({ icon, value, label, bg, light, text, small }) => (
                  <div
                    key={label}
                    className={`${light} rounded-2xl p-4 flex items-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow`}>
                    <div
                      className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-white shrink-0`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-black ${small ? "text-sm" : "text-xl"} ${text} truncate`}>
                        {value}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Overview */}
              {childAttendance.length > 0 &&
                (() => {
                  const presentCount = childAttendance.filter(
                    (a) => a.status === "present",
                  ).length;
                  const absentCount = childAttendance.filter(
                    (a) => a.status === "absent",
                  ).length;
                  const lateCount = childAttendance.filter(
                    (a) => a.status !== "present" && a.status !== "absent",
                  ).length;
                  const rate = calculateAttendanceRate();
                  const rateBar =
                    rate >= 90
                      ? "bg-emerald-500"
                      : rate >= 75
                        ? "bg-amber-500"
                        : "bg-red-500";
                  const rateText =
                    rate >= 90
                      ? "text-emerald-600"
                      : rate >= 75
                        ? "text-amber-600"
                        : "text-red-600";
                  return (
                    <div className="mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckCircleOutlined className="text-emerald-600" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">
                              Attendance — This Month
                            </span>
                            <p className="text-xs text-slate-400">
                              {childAttendance.length} school days tracked
                            </p>
                          </div>
                        </div>
                        <Link
                          to="/parent/attendance"
                          className="text-xs text-purple-600 font-semibold hover:underline">
                          View All →
                        </Link>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all ${rateBar}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span
                            className={`text-lg font-black ${rateText} min-w-12 text-right`}>
                            {rate}%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                            <div className="text-2xl font-black text-emerald-600">
                              {presentCount}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Present
                            </div>
                          </div>
                          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                            <div className="text-2xl font-black text-red-500">
                              {absentCount}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Absent
                            </div>
                          </div>
                          <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                            <div className="text-2xl font-black text-amber-500">
                              {lateCount}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Late / Other
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-2">
                            Recent 14 days
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {childAttendance.slice(-14).map((a, i) => (
                              <div
                                key={i}
                                title={`${new Date(a.date).toLocaleDateString()} — ${a.status}`}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-default ${
                                  a.status === "present"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : a.status === "absent"
                                      ? "bg-red-100 text-red-600"
                                      : "bg-amber-100 text-amber-600"
                                }`}>
                                {new Date(a.date).getDate()}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded bg-emerald-200 inline-block"></span>{" "}
                              Present
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded bg-red-200 inline-block"></span>{" "}
                              Absent
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded bg-amber-200 inline-block"></span>{" "}
                              Late
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Timetable */}
              <Card
                className="mb-6 shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0"
                title={
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <ClockCircleOutlined className="text-indigo-600" />
                    </div>
                    <span className="font-bold">Timetable</span>
                  </div>
                }
                extra={
                  <div className="flex items-center gap-3">
                    <Link to={`/parent/children/${child._id}`}>
                      View Profile
                    </Link>
                    <Link to={`/parent/child-schedule?child=${child._id}`}>
                      View Full Schedule
                    </Link>
                  </div>
                }>
                <ScheduleView
                  groupedByDay={childScheduleData.groupedByDay}
                  showTeacher={true}
                  showClass={false}
                  emptyTitle="No timetable published"
                  emptySubtitle="This child’s class schedule will appear once the admin publishes it."
                />
              </Card>

              <Row gutter={[16, 16]}>
                {/* Class Teacher Info */}
                <Col xs={24} md={12}>
                  <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <TeamOutlined className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-slate-800">
                        Class Teacher
                      </span>
                    </div>
                    <div className="p-5">
                      {child.classId?.classTeacher ? (
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-indigo-500">
                              {(child.classId.classTeacher.userId?.name ||
                                "T")[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-base mb-1 truncate">
                              {child.classId.classTeacher.userId?.name ||
                                "Not Assigned"}
                            </h4>
                            <div className="text-slate-500 text-sm flex items-center gap-1.5">
                              <MailOutlined className="text-xs" />
                              <span className="truncate">
                                {child.classId.classTeacher.userId?.email ||
                                  "N/A"}
                              </span>
                            </div>
                            {child.classId.classTeacher.userId?.phone && (
                              <div className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
                                <PhoneOutlined className="text-xs" />
                                {child.classId.classTeacher.userId?.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Empty
                          description="No class teacher assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </div>
                  </div>
                </Col>

                {/* Student Info */}
                <Col xs={24} md={12}>
                  <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IdcardOutlined className="text-purple-600" />
                      </div>
                      <span className="font-bold text-slate-800">
                        Student Information
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Full Name", value: child.userId?.name },
                          { label: "Email", value: child.userId?.email },
                          { label: "Phone", value: child.userId?.phone },
                          { label: "Section", value: child.section },
                          {
                            label: "Admission No.",
                            value: child.admissionNumber,
                          },
                          { label: "Academic Year", value: child.academicYear },
                          {
                            label: "Status",
                            value: child.enrollmentStatus || "active",
                          },
                          { label: "Blood Group", value: child.bloodGroup },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="bg-slate-50 rounded-xl p-3">
                            <div className="text-xs text-slate-400 mb-0.5">
                              {label}
                            </div>
                            <div className="font-semibold text-slate-800 text-sm truncate">
                              {value || "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Recent Attendance */}
                <Col xs={24} md={12}>
                  <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <CheckCircleOutlined className="text-emerald-600" />
                        </div>
                        <span className="font-bold text-slate-800">
                          Recent Attendance
                        </span>
                      </div>
                      <Link
                        to="/parent/attendance"
                        className="text-xs text-purple-600 font-semibold hover:underline">
                        View All →
                      </Link>
                    </div>
                    <div className="p-4">
                      {attendanceLoading ? (
                        <div className="text-center py-6">
                          <Spin size="small" />
                        </div>
                      ) : childAttendance.length > 0 ? (
                        <div className="space-y-1">
                          {childAttendance
                            .slice(-7)
                            .reverse()
                            .map((record, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                      record.status === "present"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : record.status === "absent"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-amber-100 text-amber-600"
                                    }`}>
                                    {new Date(record.date).getDate()}
                                  </div>
                                  <span className="text-sm text-slate-600">
                                    {new Date(record.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                  </span>
                                </div>
                                <span
                                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    record.status === "present"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : record.status === "absent"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-amber-100 text-amber-600"
                                  }`}>
                                  {record.status?.charAt(0).toUpperCase() +
                                    record.status?.slice(1)}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <Empty
                          description="No attendance records found"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </div>
                  </div>
                </Col>

                {/* Subjects */}
                <Col xs={24} md={12}>
                  <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOutlined className="text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-800">
                          Class Subjects
                        </span>
                      </div>
                      {child.classId?.subjects?.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          {child.classId.subjects.length}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      {child.classId?.subjects?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {child.classId.subjects.map((subject, index) => {
                            const name = subject?.name || String(subject);
                            const code = subject?.code || null;
                            const colors = [
                              "bg-purple-100 text-purple-700",
                              "bg-blue-100 text-blue-700",
                              "bg-emerald-100 text-emerald-700",
                              "bg-amber-100 text-amber-700",
                              "bg-rose-100 text-rose-700",
                              "bg-indigo-100 text-indigo-700",
                            ];
                            const color = colors[index % colors.length];
                            return (
                              <div
                                key={subject?._id || index}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${color}`}>
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-800 text-sm truncate">
                                    {name}
                                  </div>
                                  {code && (
                                    <div className="text-xs text-slate-500">
                                      Code: {code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Empty
                          description="No subjects assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <CalendarOutlined className="text-lg text-indigo-600" />
          </div>
          <span className="font-bold text-slate-800 text-lg">
            Quick Actions
          </span>
        </div>
        <div className="p-6">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Link to="/parent/attendance">
                <div className="group p-6 bg-green-50 rounded-2xl text-center hover:bg-green-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircleOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    View Attendance
                  </div>
                  <div className="text-xs text-slate-600">
                    Check attendance records
                  </div>
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={6}>
              <Link to="/parent/children">
                <div className="group p-6 bg-purple-50 rounded-2xl text-center hover:bg-purple-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TeamOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    My Children
                  </div>
                  <div className="text-xs text-slate-600">
                    View all children details
                  </div>
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={6}>
              <Link to="/parent/performance/grades">
                <div className="group p-6 bg-blue-50 rounded-2xl text-center hover:bg-blue-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrophyOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Grades</div>
                  <div className="text-xs text-slate-600">
                    View academic performance
                  </div>
                </div>
              </Link>
            </Col>
            <Col xs={12} sm={6}>
              <Link to="/parent/fees/status">
                <div className="group p-6 bg-amber-50 rounded-2xl text-center hover:bg-amber-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CalendarOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Fee Status
                  </div>
                  <div className="text-xs text-slate-600">
                    Check payment status
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
