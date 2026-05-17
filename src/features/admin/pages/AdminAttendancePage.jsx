/**
 * Admin Attendance Page - Modern & Classy Design
 * Manage all attendance records with beautiful interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  message,
  Modal,
  Form,
  Select,
  Input,
  Empty,
  Table,
  Tag,
  DatePicker,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  getAttendanceByClass,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../../../services/attendance.service";
import { getAllClasses } from "../../../services/class.service";
import { getAllSubjects } from "../../../services/subject.service";
import dayjs from "dayjs";

const { confirm } = Modal;
const { RangePicker } = DatePicker;

const AdminAttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editModal, setEditModal] = useState({ visible: false, record: null });
  const [form] = Form.useForm();

  // Filters
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes] = await Promise.all([
        getAllClasses(),
        getAllSubjects(),
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      message.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const params = {
        classId: selectedClass,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const [attendanceRes, summaryRes] = await Promise.all([
        getAttendanceByClass(params),
        getAttendanceSummary(params).catch(() => null),
      ]);

      setAttendance(attendanceRes.data || []);
      setSummary(summaryRes?.data || null);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject, dateRange]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedSubject, dateRange, fetchAttendance]);

  // Handle edit
  const handleEdit = (record) => {
    setEditModal({ visible: true, record });
    form.setFieldsValue({
      status: record.status,
      remarks: record.remarks,
    });
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateAttendance(editModal.record._id, values);
      message.success("Attendance updated successfully");
      setEditModal({ visible: false, record: null });
      form.resetFields();
      fetchAttendance();
    } catch (error) {
      message.error(error.message || "Error updating attendance");
    }
  };

  // Handle delete
  const handleDelete = (record) => {
    const student = record.studentId;
    const studentName =
      student?.userId?.name || student?.user?.name || "this student";

    confirm({
      title: "Delete Attendance Record",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: `Are you sure you want to delete this attendance record for ${studentName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteAttendance(record._id);
          message.success("Attendance deleted successfully");
          fetchAttendance();
        } catch (error) {
          message.error(error.message || "Error deleting attendance");
        }
      },
    });
  };

  // Calculate local summary
  const localSummary = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    localSummary.total > 0
      ? Math.round((localSummary.present / localSummary.total) * 100)
      : 0;

  // Filter subjects by selected class
  const filteredSubjects = subjects.filter((subject) => {
    if (!selectedClass) return true;

    const selected = String(selectedClass);

    const singleClassId = subject?.classId?._id || subject?.classId;
    if (singleClassId && String(singleClassId) === selected) return true;

    const multi = Array.isArray(subject?.classIds) ? subject.classIds : [];
    return multi.some((c) => String(c?._id || c) === selected);
  });

  // Table columns with modern design
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          <CalendarOutlined />
          <span>Date</span>
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <div className="text-xs text-blue-600 font-semibold">
              {dayjs(date).format("MMM")}
            </div>
            <div className="text-sm font-bold text-blue-900">
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
        <div className="flex items-center gap-1">
          <UserOutlined />
          <span>Student</span>
        </div>
      ),
      dataIndex: "studentId",
      key: "student",
      render: (studentId) => {
        const student = studentId;
        const userName =
          student?.userId?.name || student?.user?.name || "Unknown Student";
        const rollNumber = student?.rollNumber || "N/A";

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shrink-0">
              {userName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{userName}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <TeamOutlined className="text-[10px]" />
                Roll: {rollNumber}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <TeamOutlined />
          <span>Class</span>
        </div>
      ),
      dataIndex: "classId",
      key: "class",
      render: (cls, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <TeamOutlined className="text-indigo-600" />
          </div>
          <span className="font-medium text-slate-700">
            {(cls?.name || record?.class?.name) ?? "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <BookOutlined />
          <span>Subject</span>
        </div>
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
      filters: [
        { text: "Present", value: "present" },
        { text: "Absent", value: "absent" },
        { text: "Late", value: "late" },
      ],
      onFilter: (value, record) => record.status === value,
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
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit">
            <button
              onClick={() => handleEdit(record)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-colors">
              <EditOutlined className="text-blue-600" />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDelete(record)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
              <DeleteOutlined className="text-red-600" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <CalendarOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Attendance Management
              </h1>
              <p className="text-blue-100 text-sm mt-0.5">
                Manage all attendance records across the institution
              </p>
            </div>
          </div>
          <button
            onClick={fetchAttendance}
            disabled={loading || !selectedClass}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm disabled:opacity-50">
            <ReloadOutlined className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats strip — visible when a class is selected */}
        {selectedClass && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              {
                label: "Total Records",
                value: localSummary.total,
                bg: "bg-white/15",
              },
              {
                label: "Present",
                value: localSummary.present,
                bg: "bg-emerald-500/30",
              },
              {
                label: "Absent",
                value: localSummary.absent,
                bg: "bg-red-500/30",
              },
              {
                label: "Late",
                value: localSummary.late,
                bg: "bg-amber-500/30",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-2xl p-3 text-center border border-white/10`}>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-blue-100 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <FilterOutlined className="text-blue-600" />
          </div>
          <h2 className="font-bold text-slate-800 text-sm">
            Filter Attendance Records
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Class
            </label>
            <Select
              placeholder="Select Class"
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                setSelectedSubject(null);
              }}
              className="w-full"
              size="large"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {classes.map((cls) => (
                <Select.Option key={cls._id} value={cls._id}>
                  {cls.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Subject
            </label>
            <Select
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              size="large"
              disabled={!selectedClass}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {filteredSubjects.map((subject) => (
                <Select.Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Date Range
            </label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
              size="large"
              format="MMM DD, YYYY"
            />
          </div>
          <div className="flex items-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAttendance}
              loading={loading}
              disabled={!selectedClass}
              size="large"
              className="w-full">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Attendance Rate Gauge */}
      {selectedClass && localSummary.total > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <svg className="w-28 h-28">
                <circle
                  cx="56"
                  cy="56"
                  r="52"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="52"
                  stroke={
                    attendanceRate >= 75
                      ? "#10b981"
                      : attendanceRate >= 50
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${attendanceRate * 3.27} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 56 56)"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-black text-slate-900">
                  {attendanceRate}%
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrophyOutlined className="text-blue-600" />
                <h3 className="font-bold text-slate-900">
                  Overall Attendance Rate
                </h3>
              </div>
              <p className="text-slate-500 text-sm">
                {attendanceRate >= 75
                  ? "Excellent attendance across the institution!"
                  : attendanceRate >= 50
                    ? "Good attendance. Some classes need improvement."
                    : "Low attendance. Immediate intervention required."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <CalendarOutlined className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">
              Attendance Records
            </h2>
            <p className="text-xs text-slate-400">
              Manage and monitor student attendance
            </p>
          </div>
        </div>
        <div className="p-4">
          {!selectedClass ? (
            <Empty
              description={
                <span className="text-slate-500">
                  Please select a class to view attendance records
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-8"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={attendance}
              rowKey="_id"
              loading={loading}
              rowClassName={(record) => {
                if (record?.status === "present") return "bg-emerald-50";
                if (record?.status === "absent") return "bg-red-50";
                if (record?.status === "late") return "bg-amber-50";
                return "";
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} records`,
                className: "px-4",
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="No attendance records found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              scroll={{ x: 1000 }}
            />
          )}
        </div>
      </div>

      {/* Edit Attendance Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <EditOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Edit Attendance
            </span>
          </div>
        }
        open={editModal.visible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModal({ visible: false, record: null });
          form.resetFields();
        }}
        okText="Update"
        okButtonProps={{ className: "bg-blue-600" }}
        width={500}>
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}>
            <Select size="large">
              <Select.Option value="present">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-emerald-500" />
                  <span>Present</span>
                </div>
              </Select.Option>
              <Select.Option value="absent">
                <div className="flex items-center gap-2">
                  <CloseCircleOutlined className="text-red-500" />
                  <span>Absent</span>
                </div>
              </Select.Option>
              <Select.Option value="late">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-amber-500" />
                  <span>Late</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea
              rows={4}
              maxLength={500}
              placeholder="Add any remarks or notes..."
              showCount
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAttendancePage;
