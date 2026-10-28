/**
 * Student Dashboard
 * Today's timetable, attendance, results, subjects, and the people
 * to contact, from the student's own records.
 */

import { useState, useEffect, useCallback } from "react";
import { Skeleton, message } from "antd";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  Mail,
  Phone,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import {
  HeroBanner,
  Panel,
  PanelEmpty,
  QuickActionCard,
} from "../../../components/UI";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMySubjects,
} from "../../../services/student.service";
import scheduleService from "../../../services/schedule.service";
import { getMyExamResults } from "../../../services/exam.service";
import { getMyFees } from "../../../services/fee.service";

const ATTENDANCE_TONE = { present: "green", absent: "red", late: "amber" };

const Contact = ({ name, email, phone }) => (
  <div className="grid gap-1.5 text-sm">
    <b className="font-semibold text-slate-900">{name || "N/A"}</b>
    {email && (
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600">
        <Mail size={14} aria-hidden="true" />
        {email}
      </a>
    )}
    {phone && (
      <a
        href={`tel:${phone}`}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600">
        <Phone size={14} aria-hidden="true" />
        {phone}
      </a>
    )}
  </div>
);

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState({ data: [], summary: {} });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchAdditionalData = useCallback(async (profile) => {
    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      const classId = profile?.class?._id || profile?.classId?._id;

      const [attendanceRes, resultsRes, feesRes, scheduleRes, subjectsRes] =
        await Promise.all([
          getMyAttendance({
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          }).catch(() => ({ data: [] })),
          getMyExamResults().catch(() => ({ data: [] })),
          getMyFees().catch(() => ({ data: [], summary: {} })),
          scheduleService
            .getStudentSchedules()
            .catch(() => ({ data: { groupedByDay: {} } })),
          classId
            ? getMySubjects(classId).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);

      setAttendance(attendanceRes.data || []);
      setResults(resultsRes.data || []);
      setFees(feesRes);
      setSubjects(subjectsRes.data || []);

      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const grouped = scheduleRes.data?.groupedByDay || {};
      setTodaySchedule(grouped[today] || []);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      const profile = profileRes.data;
      setStudentProfile(profile);
      if (profile?._id) {
        await fetchAdditionalData(profile);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      message.error("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [fetchAdditionalData]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  if (loading) {
    return (
      <div>
        <Skeleton.Node active className="!w-full !h-32 mb-5" />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <Panel title="Student profile" padded>
        <PanelEmpty
          icon={UserRound}
          title="Student profile not found"
          text="Please contact your school administrator."
        />
      </Panel>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const classTeacher = classInfo?.classTeacher;
  const parentInfo = studentProfile.parentId;

  const classTeacherName =
    classTeacher?.userId?.name || classTeacher?.name || null;
  const classTeacherEmail = classTeacher?.userId?.email || null;
  const classTeacherPhone = classTeacher?.userId?.phone || null;
  const hasClassTeacherDetails = !!(
    classTeacherName ||
    classTeacherEmail ||
    classTeacherPhone
  );

  const attendanceRate = calculateAttendanceRate();
  const avgPerformance =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) /
            results.length,
        )
      : null;

  const feeBalance = fees.summary?.totalBalance || 0;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Attendance this month",
      value: `${attendanceRate}%`,
      icon: ClipboardCheck,
      tone: "green",
      to: "/student/attendance",
    },
    {
      label: "Average score",
      value: avgPerformance != null ? `${avgPerformance}%` : "—",
      icon: TrendingUp,
      tone: "blue",
      to: "/student/academics/results",
    },
    {
      label: "Subjects",
      value: subjects.length || 0,
      icon: BookOpen,
      tone: "indigo",
      to: "/student/classes",
    },
    {
      label: "Fee balance",
      value: `₹${Number(feeBalance).toLocaleString("en-IN")}`,
      icon: CreditCard,
      tone: feeBalance > 0 ? "amber" : "teal",
      to: "/student/fees",
    },
  ];

  return (
    <div>
      <HeroBanner
        eyebrow={today}
        title={`Welcome back, ${studentProfile.userId?.name || "Student"}`}
        subtitle={`${classInfo?.name || "Class N/A"} · Section ${studentProfile.section || "N/A"} · Roll ${studentProfile.rollNumber || "N/A"}`}
        rightContent={
          <div className="ssd-hero__chip">
            <small>Academic year</small>
            <b>{studentProfile.academicYear || "N/A"}</b>
          </div>
        }
      />

      <div className="ssd-stats">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`ssd-stat ssd-tone--${item.tone}`}>
              <span className="ssd-stat__icon mb-2">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="ssd-stat__value">{item.value}</span>
              <span className="ssd-stat__label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={CalendarDays}
          tone="green"
          title="Today's classes"
          subtitle={new Date().toLocaleDateString("en-US", { weekday: "long" })}
          link={{ to: "/student/timetable", label: "Timetable" }}>
          {todaySchedule.length ? (
            <ul className="ssd-list">
              {todaySchedule.slice(0, 6).map((s) => (
                <li key={s._id}>
                  <span className="ssd-chip ssd-tone--green tabular-nums">
                    {s.startTime}
                  </span>
                  <div className="ssd-list__main">
                    <b>{s.subjectId?.name || "Untitled"}</b>
                    <small>
                      {s.teacherId?.name || "—"} · Room {s.room || "—"} · until{" "}
                      {s.endTime}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={CalendarDays}
              title="No classes today"
              text="Your weekly timetable is on the timetable page."
            />
          )}
        </Panel>

        <Panel
          icon={Award}
          tone="blue"
          title="Recent results"
          subtitle="Latest exam marks"
          link={{ to: "/student/academics/results", label: "All results" }}>
          {results.length > 0 ? (
            <ul className="ssd-list">
              {results.slice(0, 4).map((r) => (
                <li key={r._id}>
                  <div className="ssd-list__main">
                    <b>{r.examId?.name || "Exam"}</b>
                    <small>{r.subjectId?.name || "—"}</small>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-700">
                    {r.marksObtained}/{r.maxMarks ?? r.totalMarks ?? "—"}
                  </span>
                  <span
                    className={`ssd-chip ssd-tone--${r.isPassed ? "green" : "red"}`}>
                    {r.isPassed ? "Pass" : "Fail"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={Award}
              title="No results published yet"
              text="Exam results appear here once your teachers publish them."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={ClipboardCheck}
          tone="green"
          title="Recent attendance"
          subtitle="This month"
          link={{ to: "/student/attendance", label: "View all" }}>
          {attendanceLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : attendance.length > 0 ? (
            <ul className="ssd-list">
              {attendance.slice(0, 5).map((record, idx) => (
                <li key={record._id || idx}>
                  <div className="ssd-list__main">
                    <b>
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </b>
                  </div>
                  <span
                    className={`ssd-chip ssd-tone--${ATTENDANCE_TONE[record.status] || "slate"} capitalize`}>
                    {record.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={ClipboardCheck}
              title="No attendance recorded this month"
            />
          )}
        </Panel>

        <Panel
          icon={BookOpen}
          tone="indigo"
          title="My subjects"
          subtitle={`${subjects.length} total`}>
          {subjects.length > 0 ? (
            <ul className="ssd-list">
              {subjects.map((subject) => {
                const teacherName =
                  subject?.assignedTeacher?.userId?.name || null;
                return (
                  <li key={subject._id}>
                    <div className="ssd-list__main">
                      <b>{subject?.name || "Untitled"}</b>
                      {teacherName && <small>{teacherName}</small>}
                    </div>
                    {subject?.code && (
                      <span className="ssd-chip ssd-tone--indigo">
                        {subject.code}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty icon={BookOpen} title="No subjects assigned yet" />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel title="Quick links" padded>
          <div className="ssd-actions">
            <QuickActionCard
              to="/student/assignments"
              icon={FileText}
              tone="blue"
              label="Assignments"
              sublabel="Submit and track work"
            />
            <QuickActionCard
              to="/student/attendance"
              icon={ClipboardCheck}
              tone="green"
              label="Attendance"
              sublabel="Your full record"
            />
            <QuickActionCard
              to="/student/timetable"
              icon={CalendarDays}
              tone="indigo"
              label="Timetable"
              sublabel="Weekly schedule"
            />
            <QuickActionCard
              to="/student/fees"
              icon={CreditCard}
              tone="amber"
              label="Fee status"
              sublabel="Balance and history"
            />
          </div>
        </Panel>

        <Panel icon={Users} tone="violet" title="Contacts" padded>
          <div className="grid gap-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class teacher
              </p>
              {classTeacher && hasClassTeacherDetails ? (
                <Contact
                  name={classTeacherName}
                  email={classTeacherEmail}
                  phone={classTeacherPhone}
                />
              ) : (
                <p className="text-sm text-slate-500">Not assigned yet</p>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Parent / guardian
              </p>
              {parentInfo ? (
                <Contact
                  name={parentInfo.userId?.name || parentInfo.name}
                  email={parentInfo.userId?.email || parentInfo.email}
                  phone={parentInfo.userId?.phone || parentInfo.phone}
                />
              ) : (
                <p className="text-sm text-slate-500">Not linked yet</p>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default StudentDashboard;
