import { Table, Tag } from "antd";
import GradeBadge from "./GradeBadge";

const ResultTable = ({
  results = [],
  loading = false,
  showStudent = true,
  showSubject = true,
}) => {
  const columns = [];

  if (showStudent) {
    columns.push({
      title: "Student",
      dataIndex: ["studentId"],
      key: "student",
      render: (s) => s?.userId?.name || "—",
      sorter: (a, b) =>
        (a.studentId?.userId?.name || "").localeCompare(
          b.studentId?.userId?.name || "",
        ),
    });
    columns.push({
      title: "Roll No",
      dataIndex: ["studentId", "rollNumber"],
      key: "roll",
      width: 100,
      render: (v) => v || "—",
    });
  }

  if (showSubject) {
    columns.push({
      title: "Subject",
      dataIndex: ["subjectId"],
      key: "subject",
      render: (s) => (s ? `${s.name} (${s.code})` : "—"),
    });
  }

  columns.push(
    {
      title: "Marks",
      key: "marks",
      width: 120,
      render: (_, r) => (
        <span className="font-semibold">
          {r.marksObtained}
          <span className="text-slate-400 font-normal"> / {r.maxMarks}</span>
        </span>
      ),
      sorter: (a, b) => a.marksObtained - b.marksObtained,
    },
    {
      title: "%",
      dataIndex: "percentage",
      key: "pct",
      width: 80,
      render: (v) => (v != null ? `${parseFloat(v).toFixed(1)}%` : "—"),
      sorter: (a, b) => (a.percentage || 0) - (b.percentage || 0),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      render: (g) => <GradeBadge grade={g} />,
    },
    {
      title: "Status",
      key: "status",
      width: 80,
      render: (_, r) => {
        if (r.isPassed === null || r.isPassed === undefined) return "—";
        return r.isPassed ? (
          <Tag color="success">PASS</Tag>
        ) : (
          <Tag color="error">FAIL</Tag>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
      render: (v) => v || "—",
    },
  );

  return (
    <Table
      columns={columns}
      dataSource={results}
      rowKey={(r) => r._id}
      loading={loading}
      pagination={{ pageSize: 20 }}
      scroll={{ x: 700 }}
      size="middle"
    />
  );
};

export default ResultTable;
