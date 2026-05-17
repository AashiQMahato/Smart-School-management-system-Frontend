/**
 * Teacher Dashboard
 * Main dashboard view for teachers - Shows real data from API
 * Enhanced with modern analytics and visualizations
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  List,
  Avatar,
  Tag,
  Badge,
  Spin,
  Empty,
  message,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BookOutlined,
  HomeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getMyAssignments,
  getMySchedule,
  getMyClasses,
  getStudentsByClass,
} from "../../../services/teacher.service";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    assignedClasses: [],
    assignedSubjects: [],
    classTeacherOf: [],
    schedule: [],
    totalStudents: 0,
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch assignments (classes and subjects assigned)
      const assignmentsRes = await getMyAssignments().catch(() => ({
        data: { assignedClasses: [], assignedSubjects: [] },
      }));

      // Fetch classes where user is class teacher
      const classTeacherRes = await getMyClasses().catch(() => ({ data: [] }));

      // Fetch schedule
      setScheduleLoading(true);
      const scheduleRes = await getMySchedule().catch(() => ({ data: [] }));
      setScheduleLoading(false);

      const rawAssignedClasses = assignmentsRes.data?.assignedClasses || [];
      const rawAssignedSubjects = assignmentsRes.data?.assignedSubjects || [];

      // Prefer schedule-derived assignment items when available (deduped in teacher.service)
      const assignedFromItems = Array.isArray(assignmentsRes.items)
        ? assignmentsRes.items.map((x) => x?.classId).filter(Boolean)
        : [];

      const mergedAssignedClasses = [
        ...rawAssignedClasses,
        ...assignedFromItems,
      ];

      const uniqueAssignedClasses = [
        ...new Map(
          mergedAssignedClasses.filter(Boolean).map((cls) => {
            const id = cls?._id || cls;
            return [String(id), cls];
          }),
        ).values(),
      ];

      const uniqueAssignedSubjects = [
        ...new Map(
          rawAssignedSubjects.filter(Boolean).map((sub) => {
            const id = sub?._id || sub;
            return [String(id), sub];
          }),
        ).values(),
      ];

      // Fetch per-class student counts (assignedClasses doesn't include a students array)
      const classIds = uniqueAssignedClasses
        .map((cls) => cls?._id || cls)
        .filter(Boolean)
        .map((id) => String(id));

      const countsEntries = await Promise.all(
        classIds.map(async (id) => {
          try {
            const studentsRes = await getStudentsByClass(id);
            return [id, studentsRes?.data?.length || 0];
          } catch {
            return [id, 0];
          }
        }),
      );

      const classStudentCounts = Object.fromEntries(countsEntries);

      const enhancedAssignedClasses = uniqueAssignedClasses.map((cls) => {
        const id = String(cls?._id || cls);
        const totalStudents = classStudentCounts[id] || 0;

        if (typeof cls === "object" && cls !== null) {
          return { ...cls, totalStudents };
        }

        return { _id: id, name: String(cls), totalStudents };
      });

      const totalStudents = enhancedAssignedClasses.reduce(
        (sum, cls) => sum + (cls?.totalStudents || 0),
        0,
      );

      setTeacherData({
        assignedClasses: enhancedAssignedClasses,
        assignedSubjects: uniqueAssignedSubjects,
        classTeacherOf: classTeacherRes.data || [],
        schedule: scheduleRes.data || [],
        totalStudents,
      });
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return teacherData.schedule.filter(
      (s) => s.dayOfWeek?.toLowerCase() === today,
    );
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  const todaySchedule = getTodaySchedule();

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Welcome Header - Enhanced */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl border border-blue-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome Back, Teacher! 🎓
            </h1>
            <p className="text-blue-100 text-lg">
              Here's your overview for today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => navigate("/teacher/attendance?mark=1")}
              className="bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm shadow-lg">
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Stats - Clean solid cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">
            {teacherData.totalStudents}
          </h3>
          <p className="text-blue-100 text-sm font-medium">My Students</p>
        </div>

        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-2xl" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">{todaySchedule.length}</h3>
          <p className="text-emerald-100 text-sm font-medium">Classes Today</p>
        </div>

        <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <HomeOutlined className="text-2xl" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">
            {teacherData.assignedClasses.length}
          </h3>
          <p className="text-amber-100 text-sm font-medium">Assigned Classes</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl" />
            </div>
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Teaching
            </span>
          </div>
          <h3 className="text-4xl font-bold mb-1">
            {teacherData.assignedSubjects.length}
          </h3>
          <p className="text-purple-100 text-sm font-medium">Subjects</p>
        </div>
      </div>

   

      <Row gutter={[16, 16]}>
        {/* Today's Schedule */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-green-600" />
                </div>
                <span className="font-bold">Today's Schedule</span>
              </div>
            }
            extra={
              <Link
                to="/teacher/schedule"
                className="text-indigo-600 hover:text-indigo-800 font-semibold">
                View Full
              </Link>
            }
            loading={scheduleLoading}
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {todaySchedule.length > 0 ? (
              <List
                dataSource={todaySchedule}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">
                            {item.classId?.name || "Class"} -{" "}
                            {item.subjectId?.name || "Subject"}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {formatTime(item.startTime)} -{" "}
                            {formatTime(item.endTime)}
                          </div>
                        </div>
                      </div>
                      <Tag color="blue">{item.room || "TBA"}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No classes scheduled for today"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Assigned Classes */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HomeOutlined className="text-blue-400" />
                </div>
                <span className="font-bold">My Classes</span>
              </div>
            }
            extra={
              <Link
                to="/teacher/classes"
                className="text-indigo-600 hover:text-indigo-800 font-semibold">
                View All
              </Link>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {teacherData.assignedClasses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teacherData.assignedClasses.slice(0, 6).map((cls) => {
                  const name = cls?.name || "Class";
                  const section = cls?.section ? ` - ${cls.section}` : "";
                  const count = cls?.totalStudents ?? 0;

                  return (
                    <div
                      key={cls?._id || `${name}${section}`}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <TeamOutlined className="text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {name}
                            {section}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {cls?.academicYear || ""}
                          </div>
                        </div>
                      </div>

                      <Tag color="blue" className="m-0 font-semibold">
                        {count} students
                      </Tag>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty
                description="No classes assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Assigned Subjects */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOutlined className="text-purple-600" />
                </div>
                <span className="font-bold">My Subjects</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {teacherData.assignedSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teacherData.assignedSubjects.map((subject, index) => {
                  const name = subject?.name || String(subject);
                  const code = subject?.code || null;

                  return (
                    <div
                      key={subject?._id || index}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-200 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                          <BookOutlined className="text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {code ? `Code: ${code}` : ""}
                          </div>
                        </div>
                      </div>

                      {code ? (
                        <Tag color="purple" className="m-0 font-semibold">
                          {code}
                        </Tag>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty
                description="No subjects assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-indigo-600" />
                </div>
                <span className="font-bold">Quick Actions</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/teacher/attendance">
                <div className="group p-5 bg-linear-to-br from-green-50 to-green-100 rounded-2xl text-center hover:from-green-100 hover:to-green-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircleOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Mark Attendance
                  </div>
                  <div className="text-xs text-slate-600">
                    Take class attendance
                  </div>
                </div>
              </Link>
              <Link to="/teacher/assignments">
                <div className="group p-5 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileTextOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Assignments
                  </div>
                  <div className="text-xs text-slate-600">Create & manage</div>
                </div>
              </Link>
              <Link to="/teacher/schedule">
                <div className="group p-5 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CalendarOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Schedule</div>
                  <div className="text-xs text-slate-600">View timetable</div>
                </div>
              </Link>
              <Link to="/teacher/students">
                <div className="group p-5 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl text-center hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TeamOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Students</div>
                  <div className="text-xs text-slate-600">
                    View all students
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;
