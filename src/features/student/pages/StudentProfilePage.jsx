/**
 * Student Profile Page — Modern redesign
 */

import { useState, useEffect, useCallback } from "react";
import { Spin, Empty, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  TeamOutlined,
  DropboxOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMySubjects,
} from "../../../services/student.service";
import { getMyExamResults } from "../../../services/exam.service";

const SUBJECT_COLORS = [
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-orange-100 text-orange-700 border-orange-200",
];

const StudentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      setStudentProfile(profileRes.data);

      if (profileRes.data) {
        const classId =
          profileRes.data.class?._id || profileRes.data.classId?._id;

        const [attendanceRes, subjectsRes, resultsRes] = await Promise.all([
          getMyAttendance({
            startDate: new Date(new Date().getFullYear(), 0, 1)
              .toISOString()
              .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          }).catch(() => ({ data: [] })),
          classId
            ? getMySubjects(classId).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          getMyExamResults().catch(() => ({ data: [] })),
        ]);

        setAttendance(attendanceRes.data || []);
        setSubjects(subjectsRes.data || []);
        setResults(resultsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const calculateAverageGrade = () => {
    if (!results || results.length === 0) return 0;
    const total = results.reduce((acc, r) => acc + (r.marksObtained || 0), 0);
    const maxTotal = results.reduce(
      (acc, r) => acc + (r.maxMarks ?? r.totalMarks ?? 0),
      0,
    );
    return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        <div className="bg-linear-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-black">My Profile</h1>
          <p className="text-indigo-200">View your profile information</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <Empty
            description="Profile not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const parentInfo = studentProfile.parentId;
  const attendanceRate = calculateAttendanceRate();
  const averageGrade = calculateAverageGrade();
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const lateCount = attendance.filter(
    (a) => a.status !== "present" && a.status !== "absent",
  ).length;

  const rateColor =
    attendanceRate >= 90
      ? "bg-emerald-500"
      : attendanceRate >= 75
        ? "bg-amber-500"
        : "bg-red-500";
  const rateText =
    attendanceRate >= 90
      ? "text-emerald-600"
      : attendanceRate >= 75
        ? "text-amber-600"
        : "text-red-600";
  const gradeColor =
    averageGrade >= 80
      ? "bg-emerald-500"
      : averageGrade >= 60
        ? "bg-amber-500"
        : "bg-red-500";
  const gradeText =
    averageGrade >= 80
      ? "text-emerald-600"
      : averageGrade >= 60
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-indigo-400/20">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-3xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-xl">
            <span className="text-4xl font-black text-white">
              {(studentProfile.userId?.name || "S")[0].toUpperCase()}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">
                {studentProfile.userId?.name}
              </h1>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  (studentProfile.enrollmentStatus || "active") === "active"
                    ? "bg-emerald-400/30 text-emerald-100"
                    : "bg-amber-400/30 text-amber-100"
                }`}>
                {(studentProfile.enrollmentStatus || "active").toUpperCase()}
              </span>
            </div>
            <p className="text-indigo-200 mb-4 flex items-center gap-2">
              <MailOutlined />
              {studentProfile.userId?.email || "No email"}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  icon: <IdcardOutlined />,
                  label: `Roll: ${studentProfile.rollNumber || "N/A"}`,
                },
                {
                  icon: <TeamOutlined />,
                  label: `${classInfo?.name || "—"} ${studentProfile.section ? `· ${studentProfile.section}` : ""}`,
                },
                {
                  icon: <CalendarOutlined />,
                  label: studentProfile.academicYear || "N/A",
                },
                {
                  icon: <IdcardOutlined />,
                  label: `Adm: ${studentProfile.admissionNumber || "N/A"}`,
                },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-semibold px-3 py-1.5 rounded-full">
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
          {/* Quick stat */}
          <div className="hidden md:flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center">
              <p className="text-xs text-indigo-200">Attendance</p>
              <p className="text-3xl font-black">{attendanceRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center">
              <p className="text-xs text-indigo-200">Avg Grade</p>
              <p className="text-3xl font-black">{averageGrade}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: <CheckCircleOutlined className="text-xl" />,
            label: "Attendance",
            value: `${attendanceRate}%`,
            bg: "bg-emerald-500",
            light: "bg-emerald-50",
            text: rateText,
            bar: true,
            pct: attendanceRate,
            barColor: rateColor,
          },
          {
            icon: <TrophyOutlined className="text-xl" />,
            label: "Avg Grade",
            value: `${averageGrade}%`,
            bg: "bg-amber-500",
            light: "bg-amber-50",
            text: gradeText,
            bar: true,
            pct: averageGrade,
            barColor: gradeColor,
          },
          {
            icon: <BookOutlined className="text-xl" />,
            label: "Subjects",
            value: subjects.length,
            bg: "bg-blue-500",
            light: "bg-blue-50",
            text: "text-blue-700",
          },
          {
            icon: <StarOutlined className="text-xl" />,
            label: "Exams Taken",
            value: results.length,
            bg: "bg-purple-500",
            light: "bg-purple-50",
            text: "text-purple-700",
          },
        ].map(({ icon, label, value, bg, light, text, bar, pct, barColor }) => (
          <div
            key={label}
            className={`${light} rounded-2xl p-4 border border-white shadow-sm`}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-white shrink-0`}>
                {icon}
              </div>
              <div>
                <div className={`text-2xl font-black ${text}`}>{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
            {bar && (
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two-column: Personal + Academic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UserOutlined className="text-indigo-600" />
            </div>
            <span className="font-bold text-slate-800">
              Personal Information
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <UserOutlined />,
                label: "Full Name",
                value: studentProfile.userId?.name,
              },
              {
                icon: <MailOutlined />,
                label: "Email",
                value: studentProfile.userId?.email,
              },
              {
                icon: <PhoneOutlined />,
                label: "Phone",
                value: studentProfile.userId?.phone,
              },
              {
                icon: <HomeOutlined />,
                label: "Address",
                value: studentProfile.address,
              },
              {
                icon: <CalendarOutlined />,
                label: "Date of Birth",
                value: studentProfile.dateOfBirth
                  ? new Date(studentProfile.dateOfBirth).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : null,
              },
              {
                icon: <DropboxOutlined />,
                label: "Blood Group",
                value: studentProfile.bloodGroup,
              },
              {
                icon: <CalendarOutlined />,
                label: "Admission Date",
                value: studentProfile.admissionDate
                  ? new Date(studentProfile.admissionDate).toLocaleDateString(
                      "en-US",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : null,
              },
              {
                icon: <IdcardOutlined />,
                label: "Admission No.",
                value: studentProfile.admissionNumber,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                  {icon} {label}
                </div>
                <div className="font-semibold text-slate-800 text-sm truncate">
                  {value || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BookOutlined className="text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800">
              Academic Information
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <TeamOutlined />,
                label: "Class",
                value: classInfo?.name,
              },
              {
                icon: <IdcardOutlined />,
                label: "Section",
                value: studentProfile.section,
              },
              {
                icon: <IdcardOutlined />,
                label: "Roll Number",
                value: studentProfile.rollNumber,
              },
              {
                icon: <CalendarOutlined />,
                label: "Academic Year",
                value: studentProfile.academicYear,
              },
              {
                icon: <BookOutlined />,
                label: "Total Subjects",
                value: subjects.length ? `${subjects.length} subjects` : null,
              },
              {
                icon: <UserOutlined />,
                label: "Class Teacher",
                value:
                  classInfo?.classTeacher?.userId?.name ||
                  classInfo?.classTeacher?.user?.name ||
                  classInfo?.classTeacher?.name,
              },
              {
                icon: <ClockCircleOutlined />,
                label: "Enrollment Status",
                value:
                  (studentProfile.enrollmentStatus || "active")
                    .charAt(0)
                    .toUpperCase() +
                  (studentProfile.enrollmentStatus || "active").slice(1),
              },
              {
                icon: <TrophyOutlined />,
                label: "Exams Taken",
                value: results.length ? `${results.length} exams` : null,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                  {icon} {label}
                </div>
                <div className="font-semibold text-slate-800 text-sm truncate">
                  {value || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      {attendance.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircleOutlined className="text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-slate-800">
                Attendance — This Year
              </span>
              <p className="text-xs text-slate-400">
                {attendance.length} school days tracked
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full ${rateColor} transition-all`}
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <span
                className={`text-xl font-black min-w-14 text-right ${rateText}`}>
                {attendanceRate}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                <div className="text-3xl font-black text-emerald-600">
                  {presentCount}
                </div>
                <div className="text-xs text-slate-500 mt-1">Present</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
                <div className="text-3xl font-black text-red-500">
                  {absentCount}
                </div>
                <div className="text-xs text-slate-500 mt-1">Absent</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
                <div className="text-3xl font-black text-amber-500">
                  {lateCount}
                </div>
                <div className="text-xs text-slate-500 mt-1">Late / Other</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Recent 14 days
            </p>
            <div className="flex flex-wrap gap-1.5">
              {attendance.slice(-14).map((a, i) => (
                <div
                  key={i}
                  title={`${new Date(a.date).toLocaleDateString()} — ${a.status}`}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold cursor-default ${
                    a.status === "present"
                      ? "bg-emerald-100 text-emerald-700"
                      : a.status === "absent"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                  }`}>
                  {new Date(a.date).getDate()}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              {[
                ["bg-emerald-200", "Present"],
                ["bg-red-200", "Absent"],
                ["bg-amber-200", "Late"],
              ].map(([bg, lbl]) => (
                <span key={lbl} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded ${bg} inline-block`}></span>{" "}
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subjects + Parent side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subjects */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-800">My Subjects</span>
            </div>
            {subjects.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                {subjects.length}
              </span>
            )}
          </div>
          <div className="p-5">
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subjects.map((subject, index) => {
                  const colorClass =
                    SUBJECT_COLORS[index % SUBJECT_COLORS.length];
                  return (
                    <div
                      key={subject?._id || index}
                      className={`flex items-center gap-3 p-3 rounded-2xl border ${colorClass} bg-opacity-60`}>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${colorClass}`}>
                        {(subject.name || "S")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 text-sm truncate">
                          {subject.name}
                        </div>
                        {subject.code && (
                          <div className="text-xs text-slate-400">
                            Code: {subject.code}
                          </div>
                        )}
                        {subject.assignedTeacher && (
                          <div className="text-xs text-slate-500 truncate">
                            <UserOutlined className="mr-0.5" />
                            {subject.assignedTeacher.user?.name ||
                              subject.assignedTeacher.name}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOutlined className="text-xl text-blue-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  No subjects assigned yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Parent / Guardian */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TeamOutlined className="text-purple-600" />
            </div>
            <span className="font-bold text-slate-800">Parent / Guardian</span>
          </div>
          <div className="p-5">
            {parentInfo ? (
              <div>
                {/* Parent Hero */}
                <div className="flex items-center gap-4 mb-5 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-white">
                      {(parentInfo.userId?.name ||
                        parentInfo.name ||
                        "P")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900">
                      {parentInfo.userId?.name || parentInfo.name || "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {parentInfo.relationship || "Parent / Guardian"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: <MailOutlined />,
                      label: "Email",
                      value: parentInfo.userId?.email || parentInfo.email,
                    },
                    {
                      icon: <PhoneOutlined />,
                      label: "Phone",
                      value: parentInfo.userId?.phone || parentInfo.phone,
                    },
                    {
                      icon: <UserOutlined />,
                      label: "Relationship",
                      value: parentInfo.relationship || "Parent",
                    },
                    {
                      icon: <IdcardOutlined />,
                      label: "Parent ID",
                      value: parentInfo._id?.slice(-6)?.toUpperCase(),
                    },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-2xl p-3">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                        {icon} {label}
                      </div>
                      <div className="font-semibold text-slate-800 text-sm truncate">
                        {value || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TeamOutlined className="text-xl text-purple-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  No parent information linked
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Exam Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrophyOutlined className="text-amber-600" />
              </div>
              <div>
                <span className="font-bold text-slate-800">
                  Recent Exam Results
                </span>
                <p className="text-xs text-slate-400">
                  {results.length} exam{results.length !== 1 ? "s" : ""}{" "}
                  recorded
                </p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-full">
              Avg {averageGrade}%
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {results.slice(0, 6).map((result, i) => {
              const pct =
                result.maxMarks > 0
                  ? Math.round((result.marksObtained / result.maxMarks) * 100)
                  : 0;
              const color =
                pct >= 80
                  ? "bg-emerald-500"
                  : pct >= 60
                    ? "bg-amber-500"
                    : "bg-red-500";
              const textColor =
                pct >= 80
                  ? "text-emerald-600"
                  : pct >= 60
                    ? "text-amber-600"
                    : "text-red-600";
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {result.subjectId?.name || result.subject || "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {result.examId?.name || result.examName || "Exam"}
                      </p>
                    </div>
                    <span
                      className={`text-lg font-black shrink-0 ${textColor}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {result.marksObtained}/{result.maxMarks}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
