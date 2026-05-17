/**
 * Student Attendance Page - Modern & Classy Design
 * View attendance records with beautiful, clean interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  message,
  DatePicker,
  Select,
  Empty,
  Table,
  Tag,
  Spin,
  Statistic,
  Row,
  Col,
  Space,
  Typography,
  Alert,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BookOutlined,
  TrophyOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import {
  getMyAttendance,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import {
  getMySubjects,
  getMyStudentProfile,
} from "../../../services/student.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const StudentAttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const range = getCurrentMonthRange();
    return [dayjs(range.startDate), dayjs(range.endDate)];
  });

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();

      const classId =
        profileRes.data?.class?._id || profileRes.data?.classId?._id;

      if (classId) {
        const subjectsRes = await getMySubjects(classId);
        setSubjects(subjectsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getMyAttendance(params);
      setAttendance(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, dateRange]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

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
          <BookOutlined />
          <span>Subject</span>
        </Space>
      ),
      dataIndex: "subjectId",
      key: "subject",
      render: (subject) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <BookOutlined className="text-purple-600" />
          </div>
          <span className="font-medium text-slate-700">
            {subject?.name || "N/A"}
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

  if (loading && attendance.length === 0) {
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
        title="My Attendance"
        subtitle="Track your attendance records and maintain excellent performance"
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card className="border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow">
            <Statistic
              title={
                <Text className="text-slate-600 flex items-center gap-2">
                  <CalendarOutlined />
                  Total Days
                </Text>
              }
              value={stats.total}
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
              value={stats.present}
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
              value={stats.absent}
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
              value={stats.late}
              styles={{ color: "#d97706", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Attendance Rate Card */}
      {stats.total > 0 && (
        <Card className="border-0 shadow-md rounded-xl">
          <Row align="middle" gutter={24}>
            <Col xs={24} md={4}>
              <div className="text-center">
                <div className="relative inline-block">
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
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Text className="text-2xl font-bold text-slate-900">
                      {attendanceRate}%
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={20}>
              <Title level={4} className="mb-2 flex items-center gap-2">
                <TrophyOutlined className="text-blue-600" />
                Your Attendance Rate
              </Title>
              <Text className="text-slate-600 block mb-3">
                {attendanceRate >= 75
                  ? "Excellent! Keep up the great work. You're maintaining excellent attendance."
                  : attendanceRate >= 50
                    ? "Good effort, but try to improve your attendance to stay on track."
                    : "Your attendance needs improvement. Please prioritize regular attendance."}
              </Text>
              {attendanceRate < 75 && (
                <Alert
                  message="Attendance Target: 75%"
                  description={`You need ${Math.max(0, Math.ceil((75 * stats.total - stats.present * 100) / 25))} more present days to reach 75% attendance.`}
                  type="warning"
                  icon={<AlertOutlined />}
                  showIcon
                  className="mt-2"
                />
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <div className="mb-4">
          <Title level={5} className="mb-0 flex items-center gap-2">
            <CalendarOutlined className="text-blue-600" />
            Filter Attendance Records
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={12}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <CalendarOutlined className="mr-2" />
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
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <BookOutlined className="mr-2" />
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
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {subjects.map((subject) => (
                <Select.Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

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
                Your daily attendance history
              </Text>
            </div>
          </div>
        }>
        <Table
          columns={columns}
          dataSource={attendance}
          rowKey="_id"
          loading={loading}
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
                description="No attendance records found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          className="modern-table"
        />
      </Card>
    </div>
  );
};

export default StudentAttendancePage;
