/**
 * MarkAttendancePage
 * Teacher page for marking attendance - Opens on separate route
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  message,
  Avatar,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyAssignments } from "../../../services/teacher.service";
import {
  markAttendance,
  getAttendanceByClass,
  getStudentsForAttendance,
} from "../../../services/attendance.service";
import dayjs from "dayjs";

const MarkAttendancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(
    searchParams.get("classId") || null,
  );
  const [selectedSubject, setSelectedSubject] = useState(
    searchParams.get("subjectId") || null,
  );
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [existingAttendance, setExistingAttendance] = useState(false);

  // Fetch teacher's assignments (classes & subjects)
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyAssignments();
      setAssignments(response.items || []);

      // Auto-select first class if available and not already selected
      if (response.items?.length > 0 && !selectedClass) {
        const firstAssignment =
          response.items.find((x) => x?.classId && x?.subjectId) ||
          response.items.find((x) => x?.classId) ||
          response.items[0];
        setSelectedClass(
          firstAssignment.classId?._id || firstAssignment.classId,
        );
        if (firstAssignment.subjectId) {
          setSelectedSubject(
            firstAssignment.subjectId._id || firstAssignment.subjectId,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("Failed to load your classes");
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  // Fetch students when class changes
  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;

    try {
      const response = await getStudentsForAttendance({
        classId: selectedClass,
        subjectId: selectedSubject || undefined,
        date: selectedDate?.format("YYYY-MM-DD"),
      });
      const studentsList = response.data || [];
      setStudents(studentsList);

      // Initialize attendance records
      const records = {};
      studentsList.forEach((student) => {
        records[student._id] = "present"; // Default to present
      });
      setAttendanceRecords(records);

      // Check if attendance already exists for this date
      if (selectedSubject) {
        try {
          const existingRes = await getAttendanceByClass({
            classId: selectedClass,
            subjectId: selectedSubject,
            date: selectedDate.format("YYYY-MM-DD"),
          });

          if (existingRes.data?.length > 0) {
            setExistingAttendance(true);
            // Populate existing attendance
            existingRes.data.forEach((record) => {
              if (record.student?._id) {
                records[record.student._id] = record.status;
              }
            });
            setAttendanceRecords({ ...records });
          } else {
            setExistingAttendance(false);
          }
        } catch {
          setExistingAttendance(false);
        }
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to load students");
    }
  }, [selectedClass, selectedSubject, selectedDate]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, selectedSubject, selectedDate, fetchStudents]);

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

  // Handle status change for a student
  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Mark all students with a status
  const handleMarkAll = (status) => {
    const records = {};
    students.forEach((student) => {
      records[student._id] = status;
    });
    setAttendanceRecords(records);
  };

  // Save attendance
  const handleSave = async () => {
    if (!selectedClass || !selectedSubject) {
      message.warning("Please select both class and subject");
      return;
    }

    try {
      setSaving(true);

      const attendanceData = {
        classId: selectedClass,
        subjectId: selectedSubject,
        date: selectedDate.format("YYYY-MM-DD"),
        attendanceRecords: Object.entries(attendanceRecords).map(
          ([studentId, status]) => ({
            studentId,
            status,
          }),
        ),
      };

      await markAttendance(attendanceData);
      message.success("Attendance saved successfully!");
      setExistingAttendance(true);
    } catch (error) {
      console.error("Error saving attendance:", error);
      message.error(error.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Calculate summary
  const summary = {
    total: students.length,
    present: Object.values(attendanceRecords).filter((s) => s === "present")
      .length,
    absent: Object.values(attendanceRecords).filter((s) => s === "absent")
      .length,
    late: Object.values(attendanceRecords).filter((s) => s === "late").length,
  };

  // Get selected class name
  const selectedClassName =
    classOptions.find((c) => c.value === selectedClass)?.label || "Class";
  const selectedSubjectName =
    subjectOptions.find((s) => s.value === selectedSubject)?.label || "Subject";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Mark Attendance"
          subtitle="Record attendance for your class"
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/teacher/attendance")}>
          Back to Overview
        </Button>
      </div>

      {/* Selection Card */}
      <Card className="border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
              options={classOptions}
              size="large"
            />
          </div>

          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <Select
              placeholder="Select Subject"
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              options={subjectOptions}
              disabled={!selectedClass}
              size="large"
            />
          </div>

          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className="w-full"
              format="MMMM DD, YYYY"
              size="large"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <UsergroupAddOutlined className="text-xl text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {summary.total}
              </div>
              <div className="text-sm text-slate-500">Total Students</div>
            </div>
          </div>
        </Card>

        <Card className="border border-emerald-200 bg-emerald-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircleOutlined className="text-xl text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">
                {summary.present}
              </div>
              <div className="text-sm text-emerald-600">Present</div>
            </div>
          </div>
        </Card>

        <Card className="border border-red-200 bg-red-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <CloseCircleOutlined className="text-xl text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">
                {summary.absent}
              </div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
          </div>
        </Card>

        <Card className="border border-amber-200 bg-amber-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ClockCircleOutlined className="text-xl text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700">
                {summary.late}
              </div>
              <div className="text-sm text-amber-600">Late</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-slate-500" />
            <span className="text-slate-700 font-medium">
              {selectedClassName} • {selectedSubjectName} •{" "}
              {selectedDate.format("MMMM DD, YYYY")}
            </span>
            {existingAttendance && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Already Marked
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              onClick={() => handleMarkAll("present")}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <CheckCircleOutlined /> All Present
            </Button>
            <Button
              size="small"
              onClick={() => handleMarkAll("absent")}
              className="border-red-300 text-red-700 hover:bg-red-50">
              <CloseCircleOutlined /> All Absent
            </Button>
          </div>
        </div>
      </Card>

      {/* Students List */}
      <Card
        className="border border-slate-200 shadow-sm"
        title={
          <div className="flex items-center gap-2">
            <UsergroupAddOutlined className="text-blue-600" />
            <span>Students</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            disabled={
              !selectedClass || !selectedSubject || students.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700">
            {existingAttendance ? "Update Attendance" : "Save Attendance"}
          </Button>
        }>
        {students.length === 0 ? (
          <Empty description="No students found. Please select a class." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <StudentAttendanceCard
                key={student._id}
                student={student}
                status={attendanceRecords[student._id] || "present"}
                onStatusChange={(status) =>
                  handleStatusChange(student._id, status)
                }
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Student Attendance Card Component
 */
const StudentAttendanceCard = ({ student, status, onStatusChange }) => {
  const studentName =
    student?.user?.name || student?.userId?.name || student?.name || "Student";

  const statusConfig = {
    present: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      icon: <CheckCircleOutlined className="text-emerald-600" />,
    },
    absent: {
      bg: "bg-red-50",
      border: "border-red-300",
      icon: <CloseCircleOutlined className="text-red-600" />,
    },
    late: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      icon: <ClockCircleOutlined className="text-amber-600" />,
    },
  };

  const config = statusConfig[status] || statusConfig.present;

  return (
    <div
      className={`
        p-4 rounded-xl border-2 ${config.border} ${config.bg}
        transition-all duration-200
      `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-slate-600">
            {studentName?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium text-slate-900">{studentName}</div>
            <div className="text-xs text-slate-500">
              Roll: {student.rollNumber || "N/A"}
            </div>
          </div>
        </div>
        {config.icon}
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2">
        <Tooltip title="Present">
          <button
            onClick={() => onStatusChange("present")}
            className={`
              flex-1 py-2 rounded-lg border-2 transition-all duration-200
              flex items-center justify-center gap-1 text-sm font-medium
              ${
                status === "present"
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
              }
            `}>
            <CheckCircleOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Absent">
          <button
            onClick={() => onStatusChange("absent")}
            className={`
              flex-1 py-2 rounded-lg border-2 transition-all duration-200
              flex items-center justify-center gap-1 text-sm font-medium
              ${
                status === "absent"
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600"
              }
            `}>
            <CloseCircleOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Late">
          <button
            onClick={() => onStatusChange("late")}
            className={`
              flex-1 py-2 rounded-lg border-2 transition-all duration-200
              flex items-center justify-center gap-1 text-sm font-medium
              ${
                status === "late"
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600"
              }
            `}>
            <ClockCircleOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default MarkAttendancePage;
