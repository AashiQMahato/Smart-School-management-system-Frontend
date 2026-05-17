/**
 * AttendanceTable Component
 * Displays attendance records in a table format with filtering and actions
 */

import { Table, Tag, Button, Tooltip, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAttendanceStatusBadge } from "../../services/attendance.service";

const AttendanceTable = ({
  data = [],
  loading = false,
  onEdit = null,
  onDelete = null,
  showActions = false,
  showStudent = true,
  showClass = false,
  showSubject = true,
}) => {
  const getStatusTag = (status) => {
    const config = {
      present: { color: "success", text: "Present" },
      absent: { color: "error", text: "Absent" },
      late: { color: "warning", text: "Late" },
    };

    const { color, text } = config[status] || {
      color: "default",
      text: status,
    };

    return <Tag color={color}>{text}</Tag>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: 120,
    },
    showStudent && {
      title: "Student",
      dataIndex: "studentId",
      key: "studentName",
      render: (studentId, record) => {
        const student = studentId;
        const userName =
          student?.userId?.name || student?.user?.name || "Unknown";
        const userEmail = student?.userId?.email || student?.user?.email || "";

        return (
          <div>
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
        );
      },
      sorter: (a, b) => {
        const nameA =
          a.studentId?.userId?.name || a.studentId?.user?.name || "";
        const nameB =
          b.studentId?.userId?.name || b.studentId?.user?.name || "";
        return nameA.localeCompare(nameB);
      },
    },
    showClass && {
      title: "Class",
      key: "class",
      render: (_, record) => (
        <span>
          {record.classId?.name || record.class?.name || "N/A"}{" "}
          {record.classId?.section || record.class?.section
            ? `- ${record.classId?.section || record.class?.section}`
            : ""}
        </span>
      ),
    },
    showSubject && {
      title: "Subject",
      dataIndex: ["subjectId", "name"],
      key: "subjectName",
      render: (text, record) =>
        text || record.subject?.name || record.subjectId?.name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Present", value: "present" },
        { text: "Absent", value: "absent" },
        { text: "Late", value: "late" },
      ],
      onFilter: (value, record) => record.status === value,
      width: 100,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "Marked By",
      key: "markedBy",
      render: (_, record) => (
        <div>
          <div className="text-sm">{record.markedBy?.name}</div>
          <Tag size="small" color="blue">
            {record.markedByRole}
          </Tag>
        </div>
      ),
      width: 150,
    },
    showActions && {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          {onEdit && (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                size="small"
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ].filter(Boolean);

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="_id"
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
        showTotal: (total) => `Total ${total} records`,
      }}
      scroll={{ x: 800 }}
      className="attendance-table"
    />
  );
};

export default AttendanceTable;
