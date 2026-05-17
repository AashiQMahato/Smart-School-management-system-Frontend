/**
 * ChildDetailsPage — Modern redesign
 * Parent view of a single child's full profile with quick links.
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  RightOutlined,
  DropboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getMyChildren } from "../../../services/parent.service";

const QUICK_ACTIONS = (id) => [
  {
    icon: <CalendarOutlined className="text-xl" />,
    label: "Schedule",
    desc: "View timetable",
    to: `/parent/child-schedule?child=${id}`,
    bg: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
  },
  {
    icon: <CheckCircleOutlined className="text-xl" />,
    label: "Attendance",
    desc: "Track attendance",
    to: `/parent/attendance?child=${id}`,
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
  },
  {
    icon: <TrophyOutlined className="text-xl" />,
    label: "Grades",
    desc: "Exam results",
    to: `/parent/performance/grades?child=${id}`,
    bg: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-700",
  },
  {
    icon: <BookOutlined className="text-xl" />,
    label: "Assignments",
    desc: "Homework & tasks",
    to: `/parent/assignments?child=${id}`,
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
  },
];

const AVATAR_COLORS = [
  "from-purple-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

const ChildDetailsPage = () => {
  const { id } = useParams();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyChildren();
        setChildren(res.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load child details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const child = useMemo(
    () => children.find((c) => c?._id === id) || null,
    [children, id],
  );

  const childName = child?.userId?.name || child?.name || "Student";
  const className = child?.classId?.name || "—";
  const section = child?.section || "—";
  const rollNumber = child?.rollNumber || "—";
  const email = child?.userId?.email || "—";
  const phone = child?.userId?.phone || "—";
  const admissionNumber = child?.admissionNumber || "—";
  const academicYear = child?.academicYear || "—";
  const admissionDate = child?.admissionDate
    ? new Date(child.admissionDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const bloodGroup = child?.bloodGroup || "—";
  const address = child?.address || "—";
  const status = child?.enrollmentStatus || child?.userId?.status || "active";
  const classTeacher =
    child?.classId?.classTeacher?.userId?.name || "Not assigned";
  const classTeacherEmail = child?.classId?.classTeacher?.userId?.email || null;

  const avatarGradient =
    AVATAR_COLORS[(childName.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const actions = QUICK_ACTIONS(id);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen animate-pulse">
        <div className="h-52 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 rounded-3xl" />
          <div className="h-64 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen">
      {/* Back nav */}
      <div>
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors">
          <ArrowLeftOutlined /> Back to My Children
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <div>
            <p className="font-bold text-red-700">Could not load child</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Not found */}
      {!error && !child && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TeamOutlined className="text-2xl text-amber-500" />
          </div>
          <p className="font-bold text-amber-700">Child not found</p>
          <p className="text-sm text-amber-600 mt-1">
            This child is not linked to your account.
          </p>
        </div>
      )}

      {child && (
        <>
          {/* Hero Header */}
          <div
            className={`bg-linear-to-r ${avatarGradient} rounded-3xl p-8 text-white shadow-2xl border border-white/20`}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-3xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-xl">
                <span className="text-4xl font-black text-white">
                  {childName[0].toUpperCase()}
                </span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black">{childName}</h1>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      status === "active"
                        ? "bg-emerald-400/30 text-emerald-100"
                        : "bg-amber-400/30 text-amber-100"
                    }`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                {email !== "—" && (
                  <p className="text-white/70 mb-4 flex items-center gap-2 text-sm">
                    <MailOutlined /> {email}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      icon: <TeamOutlined />,
                      label: `${className}${section !== "—" ? ` · ${section}` : ""}`,
                    },
                    { icon: <IdcardOutlined />, label: `Roll: ${rollNumber}` },
                    { icon: <CalendarOutlined />, label: academicYear },
                    {
                      icon: <IdcardOutlined />,
                      label: `Adm: ${admissionNumber}`,
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
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map(
              ({ icon, label, desc, to, bg, light, border, text }) => (
                <Link key={label} to={to}>
                  <div
                    className={`${light} border ${border} rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all group`}>
                    <div
                      className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform`}>
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold text-sm ${text}`}>{label}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {desc}
                      </div>
                    </div>
                    <RightOutlined className={`text-xs ${text} opacity-60`} />
                  </div>
                </Link>
              ),
            )}
          </div>

          {/* Two-column info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
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
                    value: childName,
                  },
                  { icon: <MailOutlined />, label: "Email", value: email },
                  { icon: <PhoneOutlined />, label: "Phone", value: phone },
                  { icon: <HomeOutlined />, label: "Address", value: address },
                  {
                    icon: <DropboxOutlined />,
                    label: "Blood Group",
                    value: bloodGroup,
                  },
                  {
                    icon: <CalendarOutlined />,
                    label: "Admission Date",
                    value: admissionDate,
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                      {icon} {label}
                    </div>
                    <div className="font-semibold text-slate-800 text-sm truncate">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Info */}
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
                  { icon: <TeamOutlined />, label: "Class", value: className },
                  {
                    icon: <IdcardOutlined />,
                    label: "Section",
                    value: section,
                  },
                  {
                    icon: <IdcardOutlined />,
                    label: "Roll Number",
                    value: rollNumber,
                  },
                  {
                    icon: <IdcardOutlined />,
                    label: "Admission No.",
                    value: admissionNumber,
                  },
                  {
                    icon: <CalendarOutlined />,
                    label: "Academic Year",
                    value: academicYear,
                  },
                  {
                    icon: <ClockCircleOutlined />,
                    label: "Enrollment Status",
                    value: status.charAt(0).toUpperCase() + status.slice(1),
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                      {icon} {label}
                    </div>
                    <div className="font-semibold text-slate-800 text-sm truncate">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class Teacher */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-purple-600" />
              </div>
              <span className="font-bold text-slate-800">Class Teacher</span>
            </div>
            <div className="p-5">
              {child?.classId?.classTeacher ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-purple-600">
                      {classTeacher[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900">{classTeacher}</p>
                    {classTeacherEmail && (
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <MailOutlined className="text-xs" /> {classTeacherEmail}
                      </p>
                    )}
                    {child.classId.classTeacher.userId?.phone && (
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <PhoneOutlined className="text-xs" />{" "}
                        {child.classId.classTeacher.userId.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TeamOutlined className="text-xl text-purple-300" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    No class teacher assigned yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Subjects */}
          {child?.classId?.subjects?.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOutlined className="text-blue-600" />
                  </div>
                  <span className="font-bold text-slate-800">
                    Class Subjects
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  {child.classId.subjects.length}
                </span>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {child.classId.subjects.map((subject, index) => {
                  const name = subject?.name || String(subject);
                  const code = subject?.code || null;
                  const colors = [
                    "bg-purple-100 text-purple-700",
                    "bg-blue-100 text-blue-700",
                    "bg-emerald-100 text-emerald-700",
                    "bg-amber-100 text-amber-700",
                    "bg-rose-100 text-rose-700",
                    "bg-indigo-100 text-indigo-700",
                    "bg-cyan-100 text-cyan-700",
                    "bg-orange-100 text-orange-700",
                  ];
                  const color = colors[index % colors.length];
                  return (
                    <div
                      key={subject?._id || index}
                      className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl ${color} border border-current/10`}>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${color}`}>
                        {name[0].toUpperCase()}
                      </div>
                      <div className="font-semibold text-sm">{name}</div>
                      {code && (
                        <div className="text-xs opacity-70">Code: {code}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChildDetailsPage;
