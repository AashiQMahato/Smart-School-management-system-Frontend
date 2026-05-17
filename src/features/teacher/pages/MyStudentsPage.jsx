/**
 * My Students Page
 * Modern teacher page for viewing and managing assigned students with real data
 */

import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Tag,
  Input,
  Select,
  Statistic,
  Spin,
  Empty,
  Button,
  Tooltip,
  Badge,
  Row,
  Col,
  Modal,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  BookOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  TeamOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PageHeader, LoadingScreen, EmptyState } from "../../../components/UI";
import {
  getMyAssignments,
  getStudentsByClass,
} from "../../../services/teacher.service";

const { Search } = Input;

const MyStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);

      // Get teacher's assignments (classes can come from multiple sources)
      const response = await getMyAssignments();
      const assignments = response?.data || {};

      const assignedClasses = Array.isArray(assignments.assignedClasses)
        ? assignments.assignedClasses
        : [];
      const classTeacherOf = Array.isArray(assignments.classTeacherOf)
        ? assignments.classTeacherOf
        : [];
      const assignedSubjectPairs = Array.isArray(
        assignments.assignedSubjectPairs,
      )
        ? assignments.assignedSubjectPairs
        : [];

      const scheduleClasses = assignedSubjectPairs
        .map((pair) => pair?.classId)
        .filter(Boolean);

      const allClassSources = [
        ...assignedClasses,
        ...classTeacherOf,
        ...scheduleClasses,
      ];

      // Build unique classes list
      const uniqueClasses = [];
      const classMap = new Map();

      allClassSources.forEach((cls) => {
        const rawId = cls?._id || cls?.id || cls;
        if (!rawId) return;

        const classId = String(rawId);
        const className = cls?.name || "Unknown";
        const section = cls?.section || "";

        if (!classMap.has(classId)) {
          const displayName = section ? `${className} - ${section}` : className;
          classMap.set(classId, {
            id: classId,
            name: className,
            section: section,
            displayName: displayName,
            students: [],
          });
          uniqueClasses.push({
            value: classId,
            label: displayName,
          });
        }
      });

      setClassesData(uniqueClasses);

      // Fetch students for each class
      const studentsPromises = Array.from(classMap.values()).map(
        async (classData) => {
          try {
            const studentsRes = await getStudentsByClass(classData.id);
            const students = studentsRes?.data || [];

            // Enhance student data with class info
            return students.map((student) => ({
              ...student,
              classInfo: classData,
              displayClass: classData.displayName,
              classId: classData.id,
            }));
          } catch (error) {
            console.error(
              `Error fetching students for class ${classData.id}:`,
              error,
            );
            return [];
          }
        },
      );

      const studentsResults = await Promise.all(studentsPromises);
      const allStudentsFlat = studentsResults.flat();

      setAllStudents(allStudentsFlat);
    } catch (error) {
      console.error("Error fetching students data:", error);
      message.error("Failed to load students data");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = allStudents.filter((student) => {
    const matchesClass =
      selectedClass === "all" || student.classId === selectedClass;

    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return matchesClass;

    const name = String(student?.userId?.name || "").toLowerCase();
    const admission = String(student?.admissionNumber || "").toLowerCase();
    const roll = String(student?.rollNumber || "").toLowerCase();

    const matchesSearch =
      name.includes(q) || admission.includes(q) || roll.includes(q);

    return matchesClass && matchesSearch;
  });

  const getEnrollmentColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "graduated":
        return "processing";
      case "transferred":
        return "warning";
      default:
        return "default";
    }
  };

  const getEnrollmentLabel = (status) => {
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";
  };

  const getClassStats = () => {
    const stats = {};

    allStudents.forEach((student) => {
      const classId = student.classId;
      const displayClass = student.displayClass;

      if (!stats[classId]) {
        stats[classId] = {
          displayName: displayClass,
          total: 0,
          active: 0,
        };
      }

      stats[classId].total++;
      if (student.enrollmentStatus === "active") {
        stats[classId].active++;
      }
    });

    return stats;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setDetailModalVisible(true);
  };

  if (loading) {
    return <LoadingScreen message="Loading students data..." />;
  }

  if (allStudents.length === 0) {
    return (
      <div>
        <PageHeader
          title="My Students"
          subtitle="View and manage all students in your assigned classes"
        />
        <EmptyState
          title="No Students Found"
          description="You don't have any students assigned to your classes yet."
          icon={<TeamOutlined />}
        />
      </div>
    );
  }

  const classStats = getClassStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Students"
        subtitle="View and manage all students in your assigned classes"
      />

      {/* Overview Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
            <Statistic
              title={
                <span className="text-gray-600 font-medium">
                  Total Students
                </span>
              }
              value={allStudents.length}
              prefix={<TeamOutlined className="text-indigo-500" />}
              styles={{ color: "#6366f1", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
            <Statistic
              title={
                <span className="text-gray-600 font-medium">
                  Active Students
                </span>
              }
              value={
                allStudents.filter((s) => s.enrollmentStatus === "active")
                  .length
              }
              prefix={<CheckCircleOutlined className="text-emerald-500" />}
              styles={{ color: "#10b981", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500">
            <Statistic
              title={
                <span className="text-gray-600 font-medium">Total Classes</span>
              }
              value={classesData.length}
              prefix={<BookOutlined className="text-amber-500" />}
              styles={{ color: "#f59e0b", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-500">
            <Statistic
              title={
                <span className="text-gray-600 font-medium">
                  Currently Viewing
                </span>
              }
              value={filteredStudents.length}
              prefix={<FilterOutlined className="text-rose-500" />}
              styles={{ color: "#f43f5e", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search by name, admission, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80"
            size="large"
            allowClear
            prefix={<SearchOutlined />}
          />
          <Select
            value={selectedClass}
            onChange={setSelectedClass}
            className="w-48"
            size="large"
            placeholder="Select Class"
            options={[{ value: "all", label: "All Classes" }, ...classesData]}
          />
          <div className="flex-1" />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStudentsData}
            size="large">
            Refresh
          </Button>
        </div>
      </Card>


      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-6">
          {filteredStudents.map((student, index) => (
            <Card
              key={student._id || student.id}
              className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden border-0"
              style={{
                background: `linear-gradient(135deg, ${getStudentCardGradient(index)} 0%, ${getStudentCardGradient(index, true)} 100%)`,
              }}>
              <div className="text-center mb-4">
                <Badge
                  count={
                    student.enrollmentStatus === "active" ? (
                      <CheckCircleOutlined className="text-green-500 text-lg" />
                    ) : null
                  }>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#6366f1",
                      fontSize: "32px",
                      border: "4px solid rgba(255, 255, 255, 0.4)",
                    }}
                  />
                </Badge>

                <h3 className="font-bold text-white text-lg mt-3 mb-1">
                  {student.userId?.name || "Unknown Student"}
                </h3>

                <div className="text-white/90 text-sm mb-2">
                  {student.displayClass}
                </div>

                <Tag
                  color={getEnrollmentColor(student.enrollmentStatus)}
                  style={{ fontWeight: 500 }}>
                  {getEnrollmentLabel(student.enrollmentStatus)}
                </Tag>
              </div>

              <div className="space-y-2 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
                  <span className="text-white/90 text-sm flex items-center gap-1">
                    <IdcardOutlined />
                    Admission
                  </span>
                  <span className="text-white font-semibold text-sm">
                    {student.admissionNumber || "N/A"}
                  </span>
                </div>

                {student.rollNumber && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
                    <span className="text-white/90 text-sm flex items-center gap-1">
                      <BookOutlined />
                      Roll No.
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {student.rollNumber}
                    </span>
                  </div>
                )}

                {student.academicYear && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
                    <span className="text-white/90 text-sm flex items-center gap-1">
                      <CalendarOutlined />
                      Year
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {student.academicYear}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewStudent(student)}
                block
                size="large"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#ffffff",
                  color: "#4f46e5",
                  fontWeight: "600",
                  height: "40px",
                }}
                className="hover:opacity-90">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <Empty
            description="No students found matching your filters"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}

      {/* Student Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Avatar
              size={50}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#6366f1" }}
            />
            <div>
              <div className="text-lg font-bold">
                {selectedStudent?.userId?.name || "Student Details"}
              </div>
              <div className="text-sm font-normal text-gray-500">
                Complete Information
              </div>
            </div>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}>
        {selectedStudent && (
          <div className="space-y-4 mt-4">
            {/* Status Badge */}
            <div className="flex justify-center">
              <Tag
                color={getEnrollmentColor(selectedStudent.enrollmentStatus)}
                style={{
                  fontSize: "14px",
                  padding: "6px 16px",
                  fontWeight: "600",
                }}>
                {getEnrollmentLabel(selectedStudent.enrollmentStatus)}
              </Tag>
            </div>

            <Divider />

            {/* Student Information */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="text-sm text-gray-600 mb-1">
                    <IdcardOutlined className="mr-2" />
                    Admission Number
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedStudent.admissionNumber || "N/A"}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="text-sm text-gray-600 mb-1">
                    <BookOutlined className="mr-2" />
                    Roll Number
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedStudent.rollNumber || "N/A"}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="text-sm text-gray-600 mb-1">
                    <TeamOutlined className="mr-2" />
                    Class
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedStudent.displayClass || "N/A"}
                  </div>
                </Col>

                <Col span={12}>
                  <div className="text-sm text-gray-600 mb-1">
                    <CalendarOutlined className="mr-2" />
                    Academic Year
                  </div>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedStudent.academicYear || "N/A"}
                  </div>
                </Col>

                {selectedStudent.userId?.email && (
                  <Col span={24}>
                    <div className="text-sm text-gray-600 mb-1">
                      <MailOutlined className="mr-2" />
                      Email
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {selectedStudent.userId.email}
                    </div>
                  </Col>
                )}

                {selectedStudent.userId?.phone && (
                  <Col span={24}>
                    <div className="text-sm text-gray-600 mb-1">
                      <PhoneOutlined className="mr-2" />
                      Phone
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {selectedStudent.userId.phone}
                    </div>
                  </Col>
                )}
              </Row>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                className="flex-1">
                Mark Attendance
              </Button>
              <Button icon={<TrophyOutlined />} size="large" className="flex-1">
                View Results
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Helper function to get gradient colors for student cards
const getStudentCardGradient = (index, isSecondary = false) => {
  const gradients = [
    ["#6366f1", "#8b5cf6"], // Indigo to Purple
    ["#3b82f6", "#06b6d4"], // Blue to Cyan
    ["#10b981", "#14b8a6"], // Emerald to Teal
    ["#f59e0b", "#f97316"], // Amber to Orange
    ["#ec4899", "#f43f5e"], // Pink to Rose
    ["#8b5cf6", "#d946ef"], // Purple to Fuchsia
  ];

  const gradientPair = gradients[index % gradients.length];
  return isSecondary ? gradientPair[1] : gradientPair[0];
};

export default MyStudentsPage;
