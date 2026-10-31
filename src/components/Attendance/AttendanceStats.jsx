/**
 * AttendanceStats Component
 * Displays attendance statistics with visual indicators
 */

import { Card, Progress, Row, Col } from "antd";
import StatCard from "../UI/StatCard";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const AttendanceStats = ({ statistics, loading = false }) => {
  const {
    totalClasses = 0,
    present = 0,
    absent = 0,
    late = 0,
    attendancePercentage = 0,
  } = statistics || {};

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "#52c41a"; // Green
    if (percentage >= 50) return "#faad14"; // Yellow
    return "#ff4d4f"; // Red
  };

  return (
    <div className="space-y-4">
      {/* Attendance Percentage Card */}
      <Card className="border-0 shadow-sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Overall Attendance
          </h3>
          <Progress
            type="circle"
            percent={attendancePercentage}
            strokeColor={getProgressColor(attendancePercentage)}
            strokeWidth={8}
            width={150}
            format={(percent) => (
              <span className="text-2xl font-bold">{percent}%</span>
            )}
          />
          <p className="text-sm text-gray-500 mt-3">Attendance Rate</p>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatCard
            title="Total Classes"
            value={totalClasses}
            icon={<CalendarOutlined />}
            tone="blue"
          />
        </Col>

        <Col xs={24} sm={12}>
          <StatCard
            title="Present"
            value={present}
            icon={<CheckCircleOutlined />}
            tone="emerald"
          />
        </Col>

        <Col xs={24} sm={12}>
          <StatCard
            title="Absent"
            value={absent}
            icon={<CloseCircleOutlined />}
            tone="red"
          />
        </Col>

        <Col xs={24} sm={12}>
          <StatCard
            title="Late"
            value={late}
            icon={<ClockCircleOutlined />}
            tone="amber"
          />
        </Col>
      </Row>

      {/* Alert if attendance is low */}
      {attendancePercentage < 75 && attendancePercentage > 0 && (
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            ⚠️ Attendance is below 75%. Please ensure regular attendance to meet
            academic requirements.
          </p>
        </Card>
      )}
    </div>
  );
};

export default AttendanceStats;
