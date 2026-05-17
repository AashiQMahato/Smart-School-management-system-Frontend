/**
 * My Classes Page
 * Modern and user-friendly page for teachers to view assigned classes
 */

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Spin,
  Empty,
  Button,
  Tooltip,
  Progress,
  Avatar,
  Badge,
  Divider,
  Modal,
  List,
} from "antd";
import {
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  UserOutlined,
  RiseOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PageHeader, LoadingScreen, EmptyState } from "../../../components/UI";
import {
  getMyAssignments,
  getStudentsByClass,
} from "../../../services/teacher.service";
import { message } from "antd";

const isDebugEnabled = () => {
  try {
    return localStorage.getItem("ssms_debug") === "1";
  } catch {
    return false;
  }
};

const MyClassesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classesData, setClassesData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchClassesData();
  }, []);

  const fetchClassesData = async () => {
    try {
      setLoading(true);
      const response = await getMyAssignments();

      if (isDebugEnabled()) {
        console.log("[MyClassesPage] getMyAssignments raw", response);
      }

      const assignedClasses = response?.data?.assignedClasses || [];
      const assignedSubjects = response?.data?.assignedSubjects || [];
      const assignedSubjectPairs = response?.data?.assignedSubjectPairs || [];
      const classTeacherOf = response?.data?.classTeacherOf || [];

      // Build enhanced class data
      const classesMap = new Map();

      // Add assigned classes
      assignedClasses.forEach((cls) => {
        const classId = cls._id || cls;
        const className = cls.name || "Unknown";
        const section = cls.section || "";
        const academicYear = cls.academicYear || "";

        if (!classesMap.has(classId)) {
          classesMap.set(classId, {
            id: classId,
            name: className,
            section: section,
            academicYear: academicYear,
            displayName: section ? `${className} - ${section}` : className,
            subjects: [],
            isClassTeacher: false,
            totalStudents: 0,
          });
        }
      });

      // Add subjects to classes (prefer schedule-derived class+subject pairs)
      if (Array.isArray(assignedSubjectPairs) && assignedSubjectPairs.length) {
        assignedSubjectPairs.forEach((pair) => {
          const classValue = pair.classId;
          const subjectValue = pair.subjectId;

          const classId = classValue?._id || classValue;
          const subjectId = subjectValue?._id || subjectValue;
          const subjectName = subjectValue?.name || "Unknown Subject";

          if (!classId) return;

          if (!classesMap.has(classId)) {
            classesMap.set(classId, {
              id: classId,
              name: classValue?.name || "Unknown",
              section: classValue?.section || "",
              academicYear: classValue?.academicYear || "",
              displayName: classValue?.section
                ? `${classValue?.name} - ${classValue?.section}`
                : classValue?.name || "Unknown",
              subjects: [],
              isClassTeacher: false,
              totalStudents: 0,
            });
          }

          const classData = classesMap.get(classId);
          classData.subjects.push({
            id: subjectId,
            name: subjectName,
          });
        });
      } else {
        // Legacy fallback
        assignedSubjects.forEach((subject) => {
          const classId = subject.classId?._id || subject.classId;
          if (classId && classesMap.has(classId)) {
            const classData = classesMap.get(classId);
            classData.subjects.push({
              id: subject._id || subject,
              name: subject.name || "Unknown Subject",
            });
          }
        });
      }

      // Mark class teacher status
      classTeacherOf.forEach((cls) => {
        const classId = cls._id || cls;
        if (classesMap.has(classId)) {
          classesMap.get(classId).isClassTeacher = true;
        } else {
          // Add class if not already present
          classesMap.set(classId, {
            id: classId,
            name: cls.name || "Unknown",
            section: cls.section || "",
            academicYear: cls.academicYear || "",
            displayName: cls.section
              ? `${cls.name} - ${cls.section}`
              : cls.name,
            subjects: [],
            isClassTeacher: true,
            totalStudents: 0,
          });
        }
      });

      const classesArray = Array.from(classesMap.values());

      if (isDebugEnabled()) {
        console.log("[MyClassesPage] Processed classes data", classesArray);
      }
      // Fetch student counts for each class
      for (const classData of classesArray) {
        try {
        
          const studentsRes = await getStudentsByClass(classData.id);
        
          classData.totalStudents = studentsRes?.data?.length || 0;

          if (isDebugEnabled()) {
            console.log("[MyClassesPage] students fetched", {
              classId: classData.id,
              totalStudents: classData.totalStudents,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching students for class ${classData.id}:`,
            error,
          );

          if (isDebugEnabled()) {
            console.log("[MyClassesPage] fetch students failed", {
              classId: classData.id,
              errorMessage: error?.message,
            });
          }

          classData.totalStudents = 0;
        }
      }

      setClassesData(classesArray);
    } catch (error) {
      console.error("Error fetching classes:", error);
      message.error("Failed to load classes data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (classData) => {
    setSelectedClass(classData);
    setDetailModalVisible(true);
    setLoadingStudents(true);

    try {
      if (isDebugEnabled()) {
        console.log("[MyClassesPage] handleViewDetails", {
          classId: classData?.id,
          classData,
        });
      }
      const response = await getStudentsByClass(classData.id);
      setClassStudents(response?.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Failed to load students");

      if (isDebugEnabled()) {
        console.log("[MyClassesPage] handleViewDetails failed", {
          classId: classData?.id,
          errorMessage: error?.message,
        });
      }

      setClassStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const getTotalStudents = () => {
    return classesData.reduce((sum, cls) => sum + cls.totalStudents, 0);
  };

  const getTotalSubjects = () => {
    const uniqueSubjects = new Set();
    classesData.forEach((cls) => {
      cls.subjects.forEach((subject) => uniqueSubjects.add(subject.id));
    });
    return uniqueSubjects.size;
  };

  const getClassTeacherCount = () => {
    return classesData.filter((cls) => cls.isClassTeacher).length;
  };

  if (loading) {
    return <LoadingScreen message="Loading your classes..." />;
  }

  if (classesData.length === 0) {
    return (
      <div>
        <PageHeader
          title="My Classes"
          subtitle="View and manage all your assigned classes"
          breadcrumbs={[
            { label: "Teacher", path: "/teacher/dashboard" },
            { label: "My Classes" },
          ]}
        />
        <EmptyState
          title="No Classes Assigned"
          description="You don't have any classes assigned yet. Please contact the administrator."
          icon={<BookOutlined />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        subtitle="View and manage all your assigned classes"
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">Total Classes</span>
            }
            value={classesData.length}
            prefix={<BookOutlined className="text-indigo-500" />}
            styles={{ color: "#6366f1", fontWeight: "bold" }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">Total Students</span>
            }
            value={getTotalStudents()}
            prefix={<TeamOutlined className="text-emerald-500" />}
            styles={{ color: "#10b981", fontWeight: "bold" }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">
                Subjects Teaching
              </span>
            }
            value={getTotalSubjects()}
            prefix={<FileTextOutlined className="text-amber-500" />}
            styles={{ color: "#f59e0b", fontWeight: "bold" }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-500">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">
                Class Teacher Of
              </span>
            }
            value={getClassTeacherCount()}
            prefix={<StarOutlined className="text-rose-500" />}
            styles={{ color: "#f43f5e", fontWeight: "bold" }}
          />
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesData.map((classData, index) => (
          <Card
            key={classData.id}
            className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden border-0"
            style={{
              background: `linear-gradient(135deg, ${getGradientColors(index)} 0%, ${getGradientColors(index, true)} 100%)`,
            }}>
            {/* Class Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    size={48}
                    icon={<BookOutlined />}
                    style={{
                      backgroundColor: "#ffffff40",
                      color: "#ffffff",
                      fontSize: "24px",
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-0">
                      {classData.displayName}
                    </h3>
                    {classData.academicYear && (
                      <div className="text-xs text-white/80">
                        <CalendarOutlined className="mr-1" />
                        {classData.academicYear}
                      </div>
                    )}
                  </div>
                </div>

                {classData.isClassTeacher && (
                  <Badge
                    count="Class Teacher"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#6366f1",
                      fontWeight: "600",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  />
                )}
              </div>
            </div>

            <Divider style={{ borderColor: "#ffffff40", margin: "16px 0" }} />

            {/* Class Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-xl text-white" />
                  <span className="text-white font-medium">Students</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {classData.totalStudents}
                </span>
              </div>

              {classData.subjects.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarsOutlined className="text-white" />
                    <span className="text-white font-medium text-sm">
                      Subjects Teaching ({classData.subjects.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {classData.subjects.slice(0, 3).map((subject) => (
                      <Tag
                        key={subject.id}
                        color="white"
                        style={{
                          color: "#4f46e5",
                          fontWeight: "500",
                          border: "none",
                        }}>
                        {subject.name}
                      </Tag>
                    ))}
                    {classData.subjects.length > 3 && (
                      <Tag
                        color="white"
                        style={{
                          color: "#4f46e5",
                          fontWeight: "500",
                          border: "none",
                        }}>
                        +{classData.subjects.length - 3} more
                      </Tag>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(classData)}
                block
                size="large"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#ffffff",
                  color: "#4f46e5",
                  fontWeight: "600",
                  height: "44px",
                }}
                className="hover:opacity-90">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Class Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              icon={<BookOutlined />}
              style={{ backgroundColor: "#6366f1" }}
            />
            <div>
              <div className="text-lg font-bold">
                {selectedClass?.displayName}
              </div>
              <div className="text-sm font-normal text-gray-500">
                Class Details & Students
              </div>
            </div>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
        className="class-detail-modal">
        {selectedClass && (
          <div className="space-y-4">
            {/* Class Info */}
            <Card className="bg-linear-to-br from-indigo-50 to-purple-50">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="text-sm text-gray-600">Academic Year</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedClass.academicYear || "N/A"}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-600">Total Students</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {selectedClass.totalStudents}
                  </div>
                </Col>
                <Col span={24}>
                  <div className="text-sm text-gray-600 mb-2">Subjects</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.subjects.length > 0 ? (
                      selectedClass.subjects.map((subject) => (
                        <Tag
                          key={subject.id}
                          color="indigo"
                          className="text-sm">
                          {subject.name}
                        </Tag>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">
                        No subjects assigned
                      </span>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Students List */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TeamOutlined />
                Students in this Class
              </h4>

              {loadingStudents ? (
                <div className="text-center py-8">
                  <Spin spinning size="large" tip="Loading students...">
                    <div className="h-16" />
                  </Spin>
                </div>
              ) : classStudents.length > 0 ? (
                <List
                  className="max-h-96 overflow-y-auto"
                  dataSource={classStudents}
                  renderItem={(student, index) => (
                    <List.Item className="hover:bg-gray-50 px-4 rounded-lg transition-colors">
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={40}
                            icon={<UserOutlined />}
                            style={{
                              backgroundColor: getAvatarColor(index),
                            }}>
                            {student.rollNumber || index + 1}
                          </Avatar>
                        }
                        title={
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {student.userId?.name || "Unknown Student"}
                            </span>
                            {student.enrollmentStatus === "active" && (
                              <CheckCircleOutlined className="text-green-500" />
                            )}
                          </div>
                        }
                        description={
                          <div className="flex gap-4 text-sm">
                            <span>
                              Admission: {student.admissionNumber || "N/A"}
                            </span>
                            {student.rollNumber && (
                              <span>Roll: {student.rollNumber}</span>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="No students found in this class"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Helper function to get gradient colors
const getGradientColors = (index, isSecondary = false) => {
  const gradients = [
    ["#6366f1", "#8b5cf6"], // Indigo to Purple
    ["#ec4899", "#f43f5e"], // Pink to Rose
    ["#3b82f6", "#06b6d4"], // Blue to Cyan
    ["#10b981", "#14b8a6"], // Emerald to Teal
    ["#f59e0b", "#f97316"], // Amber to Orange
    ["#8b5cf6", "#d946ef"], // Purple to Fuchsia
  ];

  const gradientPair = gradients[index % gradients.length];
  return isSecondary ? gradientPair[1] : gradientPair[0];
};

// Helper function to get avatar color
const getAvatarColor = (index) => {
  const colors = [
    "#6366f1",
    "#ec4899",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#14b8a6",
    "#f43f5e",
  ];
  return colors[index % colors.length];
};

export default MyClassesPage;
