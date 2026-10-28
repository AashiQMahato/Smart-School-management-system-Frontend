/**
 * Parent Dashboard
 * One view per linked child: attendance this month, weekly timetable,
 * class teacher contact and subjects. Data comes from the API.
 */

import { useState, useEffect } from "react";
import { Skeleton, message } from "antd";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Mail,
  Phone,
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
  getMyChildren,
  getChildAttendance,
} from "../../../services/parent.service";
import scheduleService from "../../../services/schedule.service";
import { ScheduleView } from "../../../components/Schedule";

const DAY_TONE = { present: "bg-emerald-500", absent: "bg-red-500" };

const ParentDashboard = () => {
  const EMPTY_GROUPED = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childAttendance, setChildAttendance] = useState([]);
  const [childScheduleData, setChildScheduleData] = useState({
    items: [],
    groupedByDay: EMPTY_GROUPED,
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDetails();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      message.error("Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async () => {
    if (!selectedChild) return;

    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const [attendanceRes, timetableRes] = await Promise.all([
        getChildAttendance(selectedChild._id, {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }).catch(() => ({ data: [] })),
        scheduleService
          .getParentSchedules()
          .catch(() => ({ data: { children: [] } })),
      ]);

      setChildAttendance(attendanceRes.data || []);
      const childrenSchedules = timetableRes.data?.children || [];
      const match = childrenSchedules.find(
        (c) => c?.student?._id === selectedChild._id,
      );
      if (match) {
        setChildScheduleData({
          items: match.items || [],
          groupedByDay: match.groupedByDay || EMPTY_GROUPED,
        });
      } else {
        setChildScheduleData({ items: [], groupedByDay: EMPTY_GROUPED });
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (!childAttendance || childAttendance.length === 0) return 0;
    const presentDays = childAttendance.filter(
      (a) => a.status === "present",
    ).length;
    return Math.round((presentDays / childAttendance.length) * 100);
  };

  if (loading) {
    return (
      <div>
        <Skeleton.Node active className="!w-full !h-32 mb-5" />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div>
        <HeroBanner
          title="Parent dashboard"
          subtitle="Follow your children's attendance, timetable and results."
        />
        <Panel title="My children" padded>
          <PanelEmpty
            icon={Users}
            title="No children linked yet"
            text="Your school administrator links your account to your children. Please contact them."
          />
        </Panel>
      </div>
    );
  }

  const child =
    children.find((c) => c._id === selectedChild?._id) || children[0];
  const rate = calculateAttendanceRate();
  const presentCount = childAttendance.filter(
    (a) => a.status === "present",
  ).length;
  const absentCount = childAttendance.filter(
    (a) => a.status === "absent",
  ).length;
  const lateCount = childAttendance.length - presentCount - absentCount;
  const classTeacher = child.classId?.classTeacher;
  const teacherUser = classTeacher?.userId;
  const subjects = child.classId?.subjects || [];
  const status = child.userId?.status || "active";

  const stats = [
    {
      label: "Attendance this month",
      value: `${rate}%`,
      icon: ClipboardCheck,
      tone: rate >= 90 ? "green" : rate >= 75 ? "amber" : "red",
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      tone: "blue",
    },
    {
      label: "Class teacher",
      value: teacherUser?.name || classTeacher?.name || "Not assigned",
      icon: UserRound,
      tone: "violet",
      small: true,
    },
    {
      label: "Admitted",
      value: child.admissionDate
        ? new Date(child.admissionDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "—",
      icon: CalendarDays,
      tone: "amber",
      small: true,
    },
  ];

  return (
    <div>
      {children.length > 1 && (
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Choose a child">
          {children.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => setSelectedChild(c)}
              aria-pressed={c._id === child._id}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                c._id === child._id
                  ? "border-transparent bg-[var(--role-bg)] text-[var(--role-ink)]"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
              }`}>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--role)] text-xs text-white">
                {(c.userId?.name || "?")[0].toUpperCase()}
              </span>
              {c.userId?.name?.split(" ")[0] || "Child"}
            </button>
          ))}
        </div>
      )}

      <HeroBanner
        eyebrow={`${children.length} ${children.length === 1 ? "child" : "children"} linked`}
        title={child.userId?.name || "Your child"}
        subtitle={`${child.classId?.name || "Class N/A"}${child.section ? ` · Section ${child.section}` : ""} · Roll ${child.rollNumber || "—"} · ${child.academicYear || ""}`}
        rightContent={
          <>
            <span className="ssd-hero__chip">
              <small>Status</small>
              <b className="capitalize">{status}</b>
            </span>
            <Link
              to={`/parent/children/${child._id}`}
              className="ssd-btn ssd-btn--light">
              View profile
            </Link>
          </>
        }
      />

      <div className="ssd-stats">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`ssd-stat ssd-tone--${item.tone}`}>
              <span className="ssd-stat__icon mb-2">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span
                className="ssd-stat__value"
                style={item.small ? { fontSize: "1.1rem" } : undefined}>
                {item.value}
              </span>
              <span className="ssd-stat__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={ClipboardCheck}
          tone="green"
          title="Attendance this month"
          subtitle={`${childAttendance.length} school days recorded`}
          link={{ to: "/parent/attendance", label: "Full record" }}
          padded>
          {attendanceLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : childAttendance.length > 0 ? (
            <div className="grid gap-5">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold tracking-tight tabular-nums">
                    {rate}%
                  </span>
                  <span className="text-sm text-slate-500">present</span>
                </div>
                <div
                  className={`ssd-meter ssd-tone--${rate >= 90 ? "green" : rate >= 75 ? "amber" : "red"}`}
                  role="progressbar"
                  aria-valuenow={rate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Attendance rate">
                  <i style={{ "--w": `${rate}%` }} />
                </div>
              </div>
              <dl className="grid grid-cols-3 gap-3 text-center">
                {[
                  ["Present", presentCount, "text-emerald-700"],
                  ["Absent", absentCount, "text-red-700"],
                  ["Late / other", lateCount, "text-amber-700"],
                ].map(([label, n, color]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <dd className={`text-xl font-bold tabular-nums ${color}`}>
                      {n}
                    </dd>
                    <dt className="text-xs text-slate-500">{label}</dt>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last {Math.min(14, childAttendance.length)} school days
                </p>
                <ol className="flex flex-wrap gap-1.5">
                  {childAttendance.slice(-14).map((a, i) => (
                    <li
                      key={a._id || i}
                      title={`${new Date(a.date).toLocaleDateString()} — ${a.status}`}
                      className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold text-white ${DAY_TONE[a.status] || "bg-amber-500"}`}>
                      <span className="sr-only">
                        {new Date(a.date).toLocaleDateString()}: {a.status}
                      </span>
                      <span aria-hidden="true">
                        {new Date(a.date).getDate()}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <PanelEmpty
              icon={ClipboardCheck}
              title="No attendance recorded this month"
            />
          )}
        </Panel>

        <Panel icon={UserRound} tone="violet" title="Class teacher" padded>
          {classTeacher ? (
            <div className="grid gap-2 text-sm">
              <b className="text-base font-semibold text-slate-900">
                {teacherUser?.name || classTeacher.name || "N/A"}
              </b>
              {(teacherUser?.email || classTeacher.email) && (
                <a
                  href={`mailto:${teacherUser?.email || classTeacher.email}`}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600">
                  <Mail size={14} aria-hidden="true" />
                  {teacherUser?.email || classTeacher.email}
                </a>
              )}
              {teacherUser?.phone && (
                <a
                  href={`tel:${teacherUser.phone}`}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600">
                  <Phone size={14} aria-hidden="true" />
                  {teacherUser.phone}
                </a>
              )}
            </div>
          ) : (
            <PanelEmpty icon={UserRound} title="Not assigned yet" />
          )}
        </Panel>
      </div>

      <div className="mb-5">
        <Panel
          icon={CalendarDays}
          tone="blue"
          title="Weekly timetable"
          link={{
            to: `/parent/child-schedule?child=${child._id}`,
            label: "Open schedule",
          }}
          padded>
          <ScheduleView
            groupedByDay={childScheduleData.groupedByDay}
            showTeacher={true}
            showClass={false}
          />
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel title="Quick links" padded>
          <div className="ssd-actions">
            <QuickActionCard
              to="/parent/attendance"
              icon={ClipboardCheck}
              tone="green"
              label="Attendance"
              sublabel="Day-by-day record"
            />
            <QuickActionCard
              to="/parent/performance/grades"
              icon={Award}
              tone="blue"
              label="Results"
              sublabel="Exam marks and grades"
            />
            <QuickActionCard
              to="/parent/fees/status"
              icon={CreditCard}
              tone="amber"
              label="Fees"
              sublabel="Status and history"
            />
            <QuickActionCard
              to="/parent/calendar"
              icon={CalendarDays}
              tone="violet"
              label="School calendar"
              sublabel="Exams, holidays, events"
            />
          </div>
        </Panel>

        <Panel
          icon={BookOpen}
          tone="indigo"
          title="Subjects"
          subtitle={`${subjects.length} this year`}>
          {subjects.length > 0 ? (
            <ul className="ssd-list">
              {subjects.map((subject, index) => (
                <li key={subject?._id || index}>
                  <div className="ssd-list__main">
                    <b>{subject?.name || String(subject)}</b>
                  </div>
                  {subject?.code && (
                    <span className="ssd-chip ssd-tone--indigo">
                      {subject.code}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty icon={BookOpen} title="No subjects listed" />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default ParentDashboard;
