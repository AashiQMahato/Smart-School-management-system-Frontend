/**
 * Teacher Attendance Page - Modern & Classy Design
 * View attendance records with beautiful, clean interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  Table,
  Tag,
  Empty,
  Spin,
  message,
  Progress,
  Statistic,
  Row,
  Col,
  Space,
  Avatar,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/UI";
import { getMyAssignments } from "../../../services/teacher.service";
import {
  getAttendanceByClass,
  getAttendanceSummary,
} from "../../../services/attendance.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TeacherAttendancePage = () => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);

  // Filters
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyAssignments();
      setAssignments(response.items || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("Failed to load your classes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setAttendanceLoading(true);

      const params = {
        classId: selectedClass,
        startDate: dateRange[0]?.format("YYYY-MM-DD"),
        endDate: dateRange[1]?.format("YYYY-MM-DD"),
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
      console.error("Error fetching attendance:", error);
      message.error("Failed to load attendance records");
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedClass, selectedSubject, dateRange]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedSubject, dateRange, fetchAttendance]);

  // Get unique classes from assignments
  const classOptions = [
    ...new Map(
      assignments
        .filter((a) => a.classId)
        .map((a) => {
          const cls = a.classId;
          return [
            cls._id || cls,
            { value: cls._id || cls, label: cls.name || "Unknown Class" },
          ];
        }),
    ).values(),
  ];

  // Get subjects for selected class
  const subjectOptions = assignments
    .filter((a) => {
      const classId = a.classId?._id || a.classId;
      return (
        selectedClass &&
        String(classId) === String(selectedClass) &&
        a.subjectId
      );
    })
    .map((a) => ({
      value: a.subjectId._id || a.subjectId,
      label: a.subjectId.name || "Unknown Subject",
    }));

  // Calculate local summary from attendance data
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
        <Space>
          <UserOutlined />
          <span>Student</span>
        </Space>
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
            <Avatar
              size={40}
              className="bg-blue-500 shrink-0"
              icon={<UserOutlined />}>
              {userName?.[0]?.toUpperCase()}
            </Avatar>
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
      filters: [
        { text: "Present", value: "present" },
        { text: "Absent", value: "absent" },
        { text: "Late", value: "late" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = {
          present: {
            color: "success",
            icon: <CheckCircleOutlined />,
            label: "Present",
            className: "border-emerald-200 bg-emerald-50 text-emerald-700",
          },
          absent: {
            color: "error",
            icon: <CloseCircleOutlined />,
            label: "Absent",
            className: "border-red-200 bg-red-50 text-red-700",
          },
          late: {
            color: "warning",
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
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
      render: (remarks) => (
        <span className="text-slate-600 italic">{remarks || "—"}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle="View and manage attendance records for your classes"
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/teacher/attendance/mark")}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 shadow-md h-12 px-6 font-semibold">
            Mark Attendance
          </Button>
        }
      />

      {/* Filter Card */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <div className="mb-4">
          <Title level={5} className="mb-0 flex items-center gap-2">
            <FilterOutlined className="text-blue-600" />
            Filter Attendance Records
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <TeamOutlined className="mr-2" />
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
              options={classOptions}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <BookOutlined className="mr-2" />
              Subject
            </label>
            <Select
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              size="large"
              options={subjectOptions}
              disabled={!selectedClass}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <CalendarOutlined className="mr-2" />
              Date Range
            </label>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
              size="large"
              format="MMM DD, YYYY"
            />
          </Col>

          <Col xs={24} sm={12} lg={2}>
            <label className="block text-sm font-semibold text-slate-700 mb-2 opacity-0">
              Action
            </label>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAttendance}
              loading={attendanceLoading}
              disabled={!selectedClass}
              size="large"
              className="w-full">
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Cards */}
      {selectedClass && (
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-slate-600 flex items-center gap-2">
                    <TeamOutlined />
                    Total Records
                  </Text>
                }
                value={localSummary.total}
                styles={{ color: "#475569", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-emerald-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-emerald-700 flex items-center gap-2 font-semibold">
                    <CheckCircleOutlined />
                    Present
                  </Text>
                }
                value={localSummary.present}
                styles={{ color: "#059669", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-red-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-red-700 flex items-center gap-2 font-semibold">
                    <CloseCircleOutlined />
                    Absent
                  </Text>
                }
                value={localSummary.absent}
                styles={{ color: "#dc2626", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-amber-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-amber-700 flex items-center gap-2 font-semibold">
                    <ClockCircleOutlined />
                    Late
                  </Text>
                }
                value={localSummary.late}
                styles={{ color: "#d97706", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Attendance Rate Progress */}
      {selectedClass && localSummary.total > 0 && (
        <Card className="border-0 shadow-md rounded-xl">
          <Row align="middle" gutter={24}>
            <Col xs={24} md={4}>
              <div className="text-center">
                <Progress
                  type="circle"
                  percent={attendanceRate}
                  strokeColor={{
                    "0%":
                      attendanceRate >= 75
                        ? "#10b981"
                        : attendanceRate >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                    "100%":
                      attendanceRate >= 75
                        ? "#059669"
                        : attendanceRate >= 50
                          ? "#d97706"
                          : "#dc2626",
                  }}
                  strokeWidth={8}
                  width={100}
                />
              </div>
            </Col>
            <Col xs={24} md={20}>
              <Title level={4} className="mb-2 flex items-center gap-2">
                <TrophyOutlined className="text-blue-600" />
                Overall Attendance Rate
              </Title>
              <Text className="text-slate-600">
                {attendanceRate >= 75
                  ? "Excellent attendance! Students are performing well."
                  : attendanceRate >= 50
                    ? "Good attendance. Some improvements needed."
                    : "Low attendance. Immediate attention required."}
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Attendance Table */}
      <Card
        className="border-0 shadow-lg rounded-2xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-blue-600 text-lg" />
            </div>
            <div>
              <Title level={4} className="mb-0">
                Attendance Records
              </Title>
              <Text className="text-slate-500 text-sm">
                View and track student attendance
              </Text>
            </div>
          </div>
        }>
        {!selectedClass ? (
          <Empty
            description={
              <div>
                <Text className="text-slate-600">
                  Please select a class to view attendance records
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={attendance}
            rowKey="_id"
            loading={attendanceLoading}
            rowClassName={(record) => {
              const status = record?.status;
              if (status === "present") return "bg-emerald-50";
              if (status === "absent") return "bg-red-50";
              if (status === "late") return "bg-amber-50";
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
                  description="No attendance records found for the selected filters"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            className="modern-table"
          />
        )}
      </Card>
    </div>
  );
};

export default TeacherAttendancePage;
