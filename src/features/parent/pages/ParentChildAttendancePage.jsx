/**
 * Parent Child Attendance Page — Modern redesign
 */

import { useState, useEffect, useCallback } from "react";
import {
  DatePicker,
  Select,
  Empty,
  Table,
  Spin,
  message,
  Tag,
  Space,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  getAttendanceForChild,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import { getAllSubjects } from "../../../services/subject.service";
import { getMyChildren } from "../../../services/parent.service";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

const { RangePicker } = DatePicker;

const ParentChildAttendancePage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const range = getCurrentMonthRange();
    return [dayjs(range.startDate), dayjs(range.endDate)];
  });

  // Fetch children
  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const list = response.data || [];
      setChildren(list);

      const preselected = searchParams.get("child");
      const hasPreselected =
        preselected && list.some((c) => c._id === preselected);
      if (hasPreselected) {
        setSelectedChild(preselected);
      } else if (list.length > 0) {
        setSelectedChild(list[0]._id);
      }
    } catch (error) {
      message.error("Error fetching children");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    if (!selectedChild) return;

    try {
      setLoading(true);
      const params = {
        childId: selectedChild,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getAttendanceForChild(params);
      setAttendance(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedChild, selectedSubject, dateRange]);

  useEffect(() => {
    fetchChildren();
    fetchSubjects();
  }, [fetchChildren, fetchSubjects]);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance();
    }
  }, [selectedChild, fetchAttendance]);

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // Get selected child info
  const selectedChildInfo = children.find(
    (child) => child._id === selectedChild,
  );

  // Table columns with modern design
  const columns = [
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Date</span>
        </Space>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex flex-col items-center justify-center">
            <div className="text-xs text-violet-600 font-semibold">
              {dayjs(date).format("MMM")}
            </div>
            <div className="text-sm font-bold text-violet-900">
              {dayjs(date).format("DD")}
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-700">
              {dayjs(date).format("ddd")}
            </div>
            <div className="text-xs text-slate-500">
              {dayjs(date).format("YYYY")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <BookOutlined />
          <span>Subject</span>
        </Space>
      ),
      dataIndex: "subjectId",
      key: "subject",
      render: (subject, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <BookOutlined className="text-purple-600" />
          </div>
          <span className="font-medium text-slate-700">
            {(subject?.name || record?.subject?.name) ?? "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => {
        const config = {
          present: {
            icon: <CheckCircleOutlined />,
            label: "Present",
            className: "border-emerald-200 bg-emerald-50 text-emerald-700",
          },
          absent: {
            icon: <CloseCircleOutlined />,
            label: "Absent",
            className: "border-red-200 bg-red-50 text-red-700",
          },
          late: {
            icon: <ClockCircleOutlined />,
            label: "Late",
            className: "border-amber-200 bg-amber-50 text-amber-700",
          },
        };
        const statusConfig = config[status] || config.present;
        return (
          <Tag
            icon={statusConfig.icon}
            className={`px-3 py-1 font-medium border ${statusConfig.className}`}>
            {statusConfig.label}
          </Tag>
        );
      },
    },
  ];

  if (loading && children.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const rateColor =
    attendanceRate >= 90
      ? "bg-emerald-500"
      : attendanceRate >= 75
        ? "bg-amber-500"
        : "bg-red-500";
  const rateText =
    attendanceRate >= 90
      ? "text-emerald-600"
      : attendanceRate >= 75
        ? "text-amber-600"
        : "text-red-600";
  const rateCircle =
    attendanceRate >= 75
      ? "#8b5cf6"
      : attendanceRate >= 50
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-indigo-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-xl" />
              </div>
              <h1 className="text-3xl font-black">Child&apos;s Attendance</h1>
            </div>
            <p className="text-indigo-200">
              Monitor your child&apos;s attendance records and academic
              performance
            </p>
          </div>
          {stats.total > 0 && (
            <div className="hidden md:flex items-center gap-4">
              {[
                { label: "Total", value: stats.total, bg: "bg-white/15" },
                {
                  label: "Present",
                  value: stats.present,
                  bg: "bg-emerald-500/30",
                },
                { label: "Absent", value: stats.absent, bg: "bg-red-500/30" },
              ].map(({ label, value, bg }) => (
                <div
                  key={label}
                  className={`${bg} backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20 text-center`}>
                  <p className="text-xs text-indigo-200">{label}</p>
                  <p className="text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Child Selector */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <TeamOutlined className="text-purple-600" />
          </div>
          <span className="font-bold text-slate-800">Select Your Child</span>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Select
              placeholder="Select a child"
              value={selectedChild}
              onChange={setSelectedChild}
              className="w-full sm:w-72"
              size="large">
              {children.map((child) => (
                <Select.Option key={child._id} value={child._id}>
                  {child.userId?.name || "Student"}
                </Select.Option>
              ))}
            </Select>
            {selectedChildInfo && (
              <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">
                    {(selectedChildInfo.userId?.name || "S")[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedChildInfo.userId?.name || "Student"}
                  </p>
                  <p className="text-xs text-slate-500">
                    <TeamOutlined className="mr-1" />
                    {selectedChildInfo.classId?.name || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedChild ? (
        <>
          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <CalendarOutlined className="text-xl" />,
                label: "Total Days",
                value: stats.total,
                bg: "bg-slate-500",
                light: "bg-slate-50",
                text: "text-slate-700",
              },
              {
                icon: <CheckCircleOutlined className="text-xl" />,
                label: "Present",
                value: stats.present,
                bg: "bg-emerald-500",
                light: "bg-emerald-50",
                text: "text-emerald-700",
              },
              {
                icon: <CloseCircleOutlined className="text-xl" />,
                label: "Absent",
                value: stats.absent,
                bg: "bg-red-500",
                light: "bg-red-50",
                text: "text-red-700",
              },
              {
                icon: <ClockCircleOutlined className="text-xl" />,
                label: "Late",
                value: stats.late,
                bg: "bg-amber-500",
                light: "bg-amber-50",
                text: "text-amber-700",
              },
            ].map(({ icon, label, value, bg, light, text }) => (
              <div
                key={label}
                className={`${light} rounded-2xl p-4 flex items-center gap-3 border border-white shadow-sm`}>
                <div
                  className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-white shrink-0`}>
                  {icon}
                </div>
                <div>
                  <div className={`text-2xl font-black ${text}`}>{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Rate */}
          {stats.total > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <TrophyOutlined className="text-violet-600" />
                </div>
                <span className="font-bold text-slate-800">
                  Attendance Rate
                </span>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Circle */}
                  <div className="relative shrink-0">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke={rateCircle}
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${attendanceRate * 3.27} 327`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black ${rateText}`}>
                        {attendanceRate}%
                      </span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full ${rateColor} transition-all`}
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-lg font-black min-w-12 text-right ${rateText}`}>
                        {attendanceRate}%
                      </span>
                    </div>
                    <p className="text-slate-600 mb-4">
                      {attendanceRate >= 95
                        ? "🏆 Outstanding! Your child maintains excellent attendance."
                        : attendanceRate >= 75
                          ? "👍 Good attendance. Keep encouraging regular attendance."
                          : attendanceRate >= 50
                            ? "⚠️ Moderate attendance. Please ensure more regular school attendance."
                            : "🚨 Low attendance. Please prioritize daily school attendance."}
                    </p>
                    {attendanceRate >= 95 && (
                      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                        <StarOutlined className="text-emerald-600 mt-0.5" />
                        <p className="text-sm text-emerald-700">
                          Outstanding {attendanceRate}% rate — this dedication
                          contributes significantly to academic success!
                        </p>
                      </div>
                    )}
                    {attendanceRate < 75 && (
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                        <ExclamationCircleOutlined className="text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-700">
                          Attendance below 75% target.{" "}
                          {Math.max(
                            0,
                            Math.ceil(
                              (75 * stats.total - stats.present * 100) / 25,
                            ),
                          )}{" "}
                          more present days needed to reach the recommended
                          rate.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarOutlined className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-800">Filter Records</span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Date Range
                </label>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="MMM DD, YYYY"
                  className="w-full"
                  size="large"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <BookOutlined className="mr-1" />
                  Subject
                </label>
                <Select
                  placeholder="All Subjects"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  allowClear
                  className="w-full"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }>
                  {subjects.map((subject) => (
                    <Select.Option key={subject._id} value={subject._id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-violet-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">
                    Attendance Records
                  </span>
                  <p className="text-xs text-slate-400">
                    {attendance.length} records
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <Table
                columns={columns}
                dataSource={attendance}
                rowKey="_id"
                loading={loading}
                rowClassName={(record) => {
                  const s = record?.status;
                  if (s === "present") return "bg-emerald-50/50";
                  if (s === "absent") return "bg-red-50/50";
                  if (s === "late") return "bg-amber-50/50";
                  return "";
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} records`,
                }}
                locale={{
                  emptyText: (
                    <Empty
                      description="No attendance records found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleOutlined className="text-2xl text-purple-400" />
          </div>
          <p className="text-slate-500">
            Please select a child to view attendance records
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentChildAttendancePage;
