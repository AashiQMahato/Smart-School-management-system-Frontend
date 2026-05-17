/**
 * StudentClassesPage
 * Shows student's class information, subjects, and teachers
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Spin,
  Empty,
  Tag,
  Avatar,
  message,
  Button,
  Input,
  Skeleton,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  MailOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getMyStudentProfile,
  getMySubjects,
} from "../../../services/student.service";

const StudentClassesPage = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      const profile = profileRes.data;
      setStudentProfile(profile);

      const classId = profile?.class?._id || profile?.classId?._id;
      if (classId) {
        setSubjectsLoading(true);
        const subjectsRes = await getMySubjects(classId);
        setSubjects(subjectsRes.data || []);
        setSubjectsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load class information");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Class</h1>
                <p className="text-slate-500 mt-1">
                  View your class details, subjects, and teachers
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  className="hover:border-blue-500 hover:text-blue-500">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        </Card>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Class</h1>
                <p className="text-slate-500 mt-1">
                  View your class details, subjects, and teachers
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  className="hover:border-blue-500 hover:text-blue-500">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <Empty description="No class information found" />
        </Card>
      </div>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const classTeacher = classInfo?.classTeacher || null;
  const classTeacherUser = classTeacher?.userId || classTeacher?.user || null;

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Class</h1>
              <p className="text-slate-500 mt-1">
                View your class details, subjects, and teachers
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Class Overview Card */}
      <Card className="border-0 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Class Icon */}
          <div className="shrink-0">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <TeamOutlined className="text-3xl text-emerald-600" />
            </div>
          </div>

          {/* Class Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {classInfo?.name || "Class"}
              </h2>
              <p className="text-slate-500 mt-1">
                Section: {classInfo?.section || "N/A"} • Academic Year:{" "}
                {classInfo?.academicYear || new Date().getFullYear()}
              </p>
            </div>

            {/* Class Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BookOutlined className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {subjects.length}
                    </div>
                    <div className="text-xs text-slate-500">Subjects</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TeamOutlined className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {classInfo?.students?.length || 0}
                    </div>
                    <div className="text-xs text-slate-500">Classmates</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <CalendarOutlined className="text-violet-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {classInfo?.academicYear || new Date().getFullYear()}
                    </div>
                    <div className="text-xs text-slate-500">Academic Year</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <ClockCircleOutlined className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {classInfo?.section || "A"}
                    </div>
                    <div className="text-xs text-slate-500">Section</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Class Teacher Card */}
      {classTeacher && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-emerald-600" />
              <span>Class Teacher</span>
            </div>
          }
          className="border-0 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              className="bg-emerald-600"
              icon={<UserOutlined />}>
              {classTeacherUser?.name?.[0]?.toUpperCase()}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {classTeacherUser?.name || "Class Teacher"}
              </h3>
              <p className="text-slate-500">
                {classTeacher.qualification || "Teacher"}
              </p>
              {classTeacherUser?.email && (
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                  <MailOutlined />
                  <span>{classTeacherUser.email}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Subjects Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BookOutlined className="text-emerald-600" />
            <span>My Subjects</span>
            <Tag color="emerald" className="ml-2">
              {subjects.length} subjects
            </Tag>
          </div>
        }
        className="border-0 shadow-sm">
        {subjectsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spin />
          </div>
        ) : subjects.length === 0 ? (
          <Empty description="No subjects assigned yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Subject Card Component
 */
const SubjectCard = ({ subject }) => {
  const subjectColors = {
    Mathematics: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    Science: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    English: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    History: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    Geography: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    Physics: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    Chemistry: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    Biology: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    default: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
  };

  const colorScheme = subjectColors[subject.name] || subjectColors.default;
  const assignedTeacher = subject?.assignedTeacher || null;
  const assignedTeacherUser =
    assignedTeacher?.userId || assignedTeacher?.user || null;

  return (
    <div
      className={`
        p-4 rounded-xl border ${colorScheme.border} ${colorScheme.bg}
        hover:shadow-md transition-all duration-200
      `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${colorScheme.bg} flex items-center justify-center`}>
            <BookOutlined className={colorScheme.text} />
          </div>
          <div>
            <h4 className={`font-semibold ${colorScheme.text}`}>
              {subject.name}
            </h4>
            {subject.code && (
              <span className="text-xs text-slate-500">
                Code: {subject.code}
              </span>
            )}
          </div>
        </div>
        <Tag color={subject.isActive ? "green" : "default"} className="text-xs">
          {subject.isActive ? "Active" : "Inactive"}
        </Tag>
      </div>

      {/* Teacher Info */}
      {assignedTeacher && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              className="bg-slate-600"
              icon={<UserOutlined />}>
              {assignedTeacherUser?.name?.[0]?.toUpperCase()}
            </Avatar>
            <div>
              <div className="text-sm font-medium text-slate-900">
                {assignedTeacherUser?.name || "Teacher"}
              </div>
              <div className="text-xs text-slate-500">Subject Teacher</div>
            </div>
          </div>
        </div>
      )}

      {/* Credits/Hours */}
      {(subject.credits || subject.periodsPerWeek) && (
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
          {subject.credits && (
            <span className="flex items-center gap-1">
              <ClockCircleOutlined />
              {subject.credits} credits
            </span>
          )}
          {subject.periodsPerWeek && (
            <span className="flex items-center gap-1">
              <CalendarOutlined />
              {subject.periodsPerWeek} periods/week
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentClassesPage;
