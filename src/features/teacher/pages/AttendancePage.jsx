/**
 * Attendance Management Page
 * Teacher page for marking and viewing attendance
 */

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Tag,
  Radio,
  message,
  Avatar,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import dayjs from "dayjs";

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  // Mock data
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", rollNo: "001", status: "present" },
    { id: 2, name: "Bob Williams", rollNo: "002", status: "present" },
    { id: 3, name: "Carol Davis", rollNo: "003", status: "absent" },
    { id: 4, name: "David Brown", rollNo: "004", status: "present" },
    { id: 5, name: "Eva Miller", rollNo: "005", status: "late" },
    { id: 6, name: "Frank Wilson", rollNo: "006", status: "present" },
    { id: 7, name: "Grace Lee", rollNo: "007", status: "present" },
    { id: 8, name: "Henry Taylor", rollNo: "008", status: "absent" },
  ]);

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s)),
    );
  };

  const handleMarkAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success("Attendance saved successfully");
    setLoading(false);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "present":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Present
          </Tag>
        );
      case "absent":
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Absent
          </Tag>
        );
      case "late":
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Late
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: "Roll No",
      dataIndex: "rollNo",
      key: "rollNo",
      width: 100,
    },
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center gap-2">
          <Avatar
            icon={<UserOutlined />}
            size="small"
            className="bg-blue-100 text-blue-400"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Mark Attendance",
      key: "action",
      render: (_, record) => (
        <Radio.Group
          value={record.status}
          onChange={(e) => handleStatusChange(record.id, e.target.value)}
          optionType="button"
          buttonStyle="solid">
          <Radio.Button value="present" className="text-green-600!">
            <CheckCircleOutlined />
          </Radio.Button>
          <Radio.Button value="absent" className="text-red-600!">
            <CloseCircleOutlined />
          </Radio.Button>
          <Radio.Button value="late" className="text-yellow-600!">
            <ClockCircleOutlined />
          </Radio.Button>
        </Radio.Group>
      ),
    },
  ];

  const summary = {
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
  };

  return (
    <div>
      <PageHeader
        title="Mark Attendance"
        subtitle="Record daily attendance for your classes"
        breadcrumbs={[
          { label: "Teacher", path: "/teacher/dashboard" },
          { label: "Attendance" },
        ]}
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              className="w-32"
              options={[
                { value: "9A", label: "9A" },
                { value: "9B", label: "9B" },
                { value: "10A", label: "10A" },
                { value: "10B", label: "10B" },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className="w-40"
              format="MMM DD, YYYY"
            />
          </div>
          <div className="flex-1" />
          <div className="flex gap-2">
            <Button onClick={() => handleMarkAll("present")}>
              Mark All Present
            </Button>
            <Button onClick={() => handleMarkAll("absent")}>
              Mark All Absent
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <CheckCircleOutlined className="text-2xl text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {summary.present}
          </div>
          <div className="text-sm text-gray-500">Present</div>
        </Card>
        <Card className="text-center">
          <CloseCircleOutlined className="text-2xl text-red-500 mb-2" />
          <div className="text-2xl font-bold text-red-600">
            {summary.absent}
          </div>
          <div className="text-sm text-gray-500">Absent</div>
        </Card>
        <Card className="text-center">
          <ClockCircleOutlined className="text-2xl text-yellow-500 mb-2" />
          <div className="text-2xl font-bold text-yellow-600">
            {summary.late}
          </div>
          <div className="text-sm text-gray-500">Late</div>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card
        title={`Class ${selectedClass} - ${selectedDate.format(
          "MMMM DD, YYYY",
        )}`}
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}>
            Save Attendance
          </Button>
        }>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AttendancePage;
