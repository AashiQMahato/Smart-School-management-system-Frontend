/**
 * Teacher Dashboard — the teaching day at a glance.
 * Every number comes from the API: assigned classes and subjects
 * (/teachers/me/assignments), students per class, today's and this week's
 * timetable (/schedules/teacher), attendance for a chosen class
 * (/attendance/stats), assignment submissions and grading
 * (/assignments/teacher/assignments[/analytics]), exams for the teacher's
 * classes (/exams/teacher/my-exams) and the school calendar.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Select, Skeleton } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  FileCheck,
  FileText,
  GraduationCap,
  Megaphone,
  School,
  Users,
} from "lucide-react";
import {
  ChartTooltip,
  ErrorState,
  HeroBanner,
  Panel,
  PanelEmpty,
  ProgressRing,
  QuickActionCard,
  SchoolIllustration,
  StatCard,
  chartColor,
} from "../../../components/UI";
import { QUICK_ACTIONS } from "../../../components/Sidebar/navigation.config";
import { eventTypeUI, relativeDay } from "../../../components/UI/eventTypes";
import { useAuth } from "../../../hooks/useAuth";
import { greetingFor, useNow } from "../../../hooks/useNow";
import { upcomingEvents, useRoleEvents } from "../../../hooks/useRoleEvents";
import {
  getMyAssignments,
  getMySchedule,
  getStudentsByClass,
} from "../../../services/teacher.service";
import {
  getAssignmentAnalytics,
  getTeacherAssignments,
} from "../../../services/assignment.service";
import { getTeacherExams } from "../../../services/exam.service";
import { getAttendanceStats } from "../../../services/attendance.service";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EXAM_TYPES = {
  "unit-test-1": "Unit test 1",
  "unit-test-2": "Unit test 2",
  midterm: "Mid-term",
  final: "Final",
  assignment: "Assignment",
  practical: "Practical",
};

const isoDay = (d) => d.toISOString().split("T")[0];
const idOf = (x) => String(x?._id || x || "");
const className = (cls) =>
  cls ? `${cls.name || "Class"}${cls.section ? ` ${cls.section}` : ""}` : "";
const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";

/** "HH:MM" → minutes since midnight (NaN when missing). */
const toMinutes = (time) => {
  if (!time) return NaN;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
};

const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

/** Settles every request so one failing API doesn't blank the page. */
const settle = (promise) =>
  promise.then(
    (res) => ({ ok: true, res }),
    (error) => ({ ok: false, error }),
  );

/** Merges and de-dupes the classes and subjects a teacher is assigned. */
const resolveAssignments = (assignmentsRes) => {
  const rawAssignedClasses = assignmentsRes?.data?.assignedClasses || [];
  const rawAssignedSubjects = assignmentsRes?.data?.assignedSubjects || [];

  // Prefer schedule-derived assignment items when available (deduped in teacher.service)
  const assignedFromItems = Array.isArray(assignmentsRes?.items)
    ? assignmentsRes.items.map((x) => x?.classId).filter(Boolean)
    : [];

  const uniqueAssignedClasses = [
    ...new Map(
      [...rawAssignedClasses, ...assignedFromItems]
        .filter(Boolean)
        .map((cls) => [idOf(cls), cls]),
    ).values(),
  ];

  const uniqueAssignedSubjects = [
    ...new Map(
      rawAssignedSubjects.filter(Boolean).map((sub) => [idOf(sub), sub]),
    ).values(),
  ];

  return {
    classes: uniqueAssignedClasses,
    subjects: uniqueAssignedSubjects,
    classTeacherOf: assignmentsRes?.data?.classTeacherOf || [],
  };
};

const TeacherDashboard = () => {
  const { userName } = useAuth();
  const now = useNow();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [teacherData, setTeacherData] = useState({
    assignedClasses: [],
    assignedSubjects: [],
    classTeacherOf: [],
    schedule: [],
    totalStudents: 0,
  });
  const [work, setWork] = useState({
    loading: true,
    ok: true,
    assignments: [],
    total: 0,
    analytics: null,
  });
  const [exams, setExams] = useState({ loading: true, ok: true, data: [] });
  const { events, loading: eventsLoading } = useRoleEvents("teacher");

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);

    // Assignment and exam panels load on their own so the core view isn't held up
    setWork((w) => ({ ...w, loading: true }));
    Promise.all([
      settle(getTeacherAssignments({ limit: 100 })),
      settle(getAssignmentAnalytics()),
    ]).then(([listR, analyticsR]) =>
      setWork({
        loading: false,
        ok: listR.ok,
        assignments: listR.ok ? listR.res?.data || [] : [],
        total: listR.ok ? (listR.res?.pagination?.total ?? 0) : 0,
        analytics:
          analyticsR.ok &&
          typeof analyticsR.res?.data?.totalAssignments === "number"
            ? analyticsR.res.data
            : null,
      }),
    );
    setExams((e) => ({ ...e, loading: true }));
    settle(getTeacherExams()).then((r) =>
      setExams({
        loading: false,
        ok: r.ok,
        data: r.ok && Array.isArray(r.res?.data) ? r.res.data : [],
      }),
    );

    const [assignmentsR, scheduleR] = await Promise.all([
      settle(getMyAssignments()),
      settle(getMySchedule()),
    ]);

    const { classes, subjects, classTeacherOf } = resolveAssignments(
      assignmentsR.ok ? assignmentsR.res : null,
    );

    // Per-class student counts (assignedClasses doesn't include a students array)
    const countsEntries = await Promise.all(
      classes
        .map(idOf)
        .filter(Boolean)
        .map(async (id) => {
          try {
            const studentsRes = await getStudentsByClass(id);
            return [id, studentsRes?.data?.length || 0];
          } catch {
            return [id, 0];
          }
        }),
    );
    const classStudentCounts = Object.fromEntries(countsEntries);

    const enhancedAssignedClasses = classes.map((cls) => {
      const id = idOf(cls);
      const totalStudents = classStudentCounts[id] || 0;
      if (typeof cls === "object" && cls !== null) {
        return { ...cls, totalStudents };
      }
      return { _id: id, name: String(cls), totalStudents };
    });

    setTeacherData({
      assignedClasses: enhancedAssignedClasses,
      assignedSubjects: subjects,
      classTeacherOf,
      schedule: scheduleR.ok ? scheduleR.res?.data || [] : [],
      totalStudents: enhancedAssignedClasses.reduce(
        (sum, cls) => sum + (cls?.totalStudents || 0),
        0,
      ),
    });
    setFailed(!assignmentsR.ok && !scheduleR.ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, [load]);

  /* ---------- derived data ---------- */
  const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = useMemo(
    () =>
      teacherData.schedule
        .filter((s) => s.dayOfWeek?.toLowerCase() === todayName.toLowerCase())
        .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)),
    [teacherData.schedule, todayName],
  );

  const periodState = (item) => {
    const start = toMinutes(item.startTime);
    const end = toMinutes(item.endTime);
    if (nowMinutes >= end) return "done";
    if (nowMinutes >= start) return "now";
    return "later";
  };
  const nextPeriod = todaySchedule.find((s) => periodState(s) !== "done");

  const weeklyLoad = useMemo(() => {
    const tally = Object.fromEntries(DAYS.map((d) => [d, 0]));
    teacherData.schedule.forEach((s) => {
      const day = DAYS.find(
        (d) => d.toLowerCase() === s.dayOfWeek?.toLowerCase(),
      );
      if (day) tally[day] += 1;
    });
    return DAYS.filter((d) => d !== "Sunday" || tally[d] > 0).map((d) => ({
      day: d.slice(0, 3),
      full: d,
      periods: tally[d],
    }));
  }, [teacherData.schedule]);
  const weeklyTotal = weeklyLoad.reduce((s, d) => s + d.periods, 0);

  const classTeacherIds = useMemo(
    () => new Set(teacherData.classTeacherOf.map(idOf)),
    [teacherData.classTeacherOf],
  );

  // Grading: submission counts per assignment (submitted/late = not yet graded)
  const grading = useMemo(() => {
    let submitted = 0;
    let graded = 0;
    work.assignments.forEach((a) => {
      submitted += a.submissionStats?.total || 0;
      graded += a.submissionStats?.graded || 0;
    });
    const needsGrading = work.assignments
      .filter((a) => (a.submissionStats?.pending || 0) > 0)
      .sort((a, b) => b.submissionStats.pending - a.submissionStats.pending);
    const chart = work.assignments
      .filter((a) => (a.submissionStats?.total || 0) > 0)
      .slice(0, 6)
      .map((a) => ({
        name: a.title?.length > 22 ? `${a.title.slice(0, 21)}…` : a.title,
        graded: a.submissionStats.graded || 0,
        pending: a.submissionStats.pending || 0,
      }));
    return {
      submitted,
      graded,
      pending: submitted - graded,
      needsGrading,
      chart,
    };
  }, [work.assignments]);

  const dueSoon = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return work.assignments
      .filter((a) => a.status === "published" && a.dueDate)
      .filter((a) => new Date(a.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [work.assignments]);

  const upcomingExams = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mine = new Set(teacherData.assignedClasses.map(idOf));
    const fromExams = exams.data
      .filter((e) => e.status !== "cancelled" && e.status !== "completed")
      .filter((e) => new Date(e.endDate || e.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5)
      .map((e) => ({
        _id: e._id,
        title: e.name,
        startDate: e.startDate,
        endDate: e.endDate,
        tag: EXAM_TYPES[e.examType] || "Exam",
        ongoing: e.status === "ongoing",
        classes: (e.classes || [])
          .filter((c) => !mine.size || mine.has(idOf(c)))
          .map(className)
          .join(", "),
      }));
    if (fromExams.length) return fromExams;
    // fall back to exam entries on the school calendar
    return upcomingEvents(events, { types: ["exam"], limit: 5 }).map((e) => ({
      _id: e._id,
      title: e.title,
      startDate: e.startDate,
      endDate: e.endDate,
      tag: "Calendar",
      ongoing: false,
      classes: "",
    }));
  }, [exams.data, events, teacherData.assignedClasses]);

  const announcements = upcomingEvents(events)
    .filter((e) => e.eventType !== "exam")
    .slice(0, 5);

  const analytics = work.analytics;
  const avgScore =
    analytics && analytics.gradedSubmissions > 0
      ? Math.round(Number(analytics.averageMarksPercentage) || 0)
      : null;
  const gradedPct =
    grading.submitted > 0
      ? Math.round((grading.graded / grading.submitted) * 100)
      : null;
  const totalAssignments = analytics?.totalAssignments ?? work.total;

  const firstName = (userName || "").split(" ")[0];
  const todayCount = todaySchedule.length;

  if (failed) {
    return (
      <Panel title="Dashboard" padded>
        <ErrorState
          title="Couldn't load your dashboard"
          description="Your classes and timetable didn't load."
          onRetry={load}
        />
      </Panel>
    );
  }

  return (
    <div>
      <HeroBanner
        eyebrow={
          <>
            <CalendarDays size={14} aria-hidden="true" />
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            ·{" "}
            {now.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </>
        }
        title={`${greetingFor(now)}${firstName ? `, ${firstName}` : ""}`}
        subtitle={
          loading
            ? "Loading your teaching day…"
            : todayCount
              ? `You have ${todayCount} ${todayCount === 1 ? "class" : "classes"} today${
                  nextPeriod
                    ? ` — ${periodState(nextPeriod) === "now" ? "now teaching" : "next up"} ${className(nextPeriod.classId)} ${nextPeriod.subjectId?.name || ""} at ${formatTime(nextPeriod.startTime)}.`
                    : ", all done for the day."
                }`
              : "No classes are scheduled for you today."
        }
        rightContent={<SchoolIllustration />}>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/teacher/attendance/mark"
            className="ssd-btn ssd-btn--light">
            <ClipboardCheck size={16} aria-hidden="true" />
            Mark attendance
          </Link>
          <Link to="/teacher/assignments" className="ssd-btn ssd-btn--glass">
            <FileText size={16} aria-hidden="true" />
            Assignments
          </Link>
        </div>
      </HeroBanner>

      <div className="ssd-stats ssd-stats--6">
        <StatCard
          title="Classes today"
          value={todayCount}
          icon={CalendarClock}
          tone="sky"
          hint={
            nextPeriod ? `Next ${formatTime(nextPeriod.startTime)}` : undefined
          }
          to="/teacher/schedule"
          loading={loading}
        />
        <StatCard
          title="Assigned classes"
          value={teacherData.assignedClasses.length}
          icon={School}
          tone="indigo"
          hint={
            teacherData.classTeacherOf.length
              ? `Class teacher of ${teacherData.classTeacherOf.length}`
              : undefined
          }
          to="/teacher/classes"
          loading={loading}
        />
        <StatCard
          title="My students"
          value={teacherData.totalStudents}
          icon={Users}
          tone="blue"
          to="/teacher/students"
          loading={loading}
        />
        <StatCard
          title="Subjects"
          value={teacherData.assignedSubjects.length}
          icon={BookOpen}
          tone="violet"
          loading={loading}
        />
        <StatCard
          title="Assignments"
          value={work.ok || analytics ? totalAssignments : "—"}
          icon={FileText}
          tone="purple"
          hint={
            analytics
              ? `${analytics.publishedAssignments} published · ${analytics.draftAssignments} ${analytics.draftAssignments === 1 ? "draft" : "drafts"}`
              : undefined
          }
          to="/teacher/assignments"
          loading={work.loading}
        />
        <StatCard
          title="To grade"
          value={work.ok ? grading.pending : "—"}
          icon={FileCheck}
          tone="amber"
          hint={
            work.ok && grading.submitted
              ? `of ${grading.submitted} submissions`
              : undefined
          }
          to="/teacher/assignments"
          loading={work.loading}
        />
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={CalendarClock}
          tone="sky"
          title="Today's schedule"
          subtitle={todayName}
          link={{ to: "/teacher/schedule", label: "Full schedule" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : todaySchedule.length > 0 ? (
            <ul className="ssd-list">
              {todaySchedule.map((item, index) => {
                const state = periodState(item);
                return (
                  <li
                    key={item._id || index}
                    className={state === "done" ? "opacity-60" : undefined}>
                    <span className="ssd-date-tile ssd-tone--sky">
                      <small>{formatTime(item.startTime).split(" ")[1]}</small>
                      <b className="text-base">
                        {formatTime(item.startTime).split(" ")[0]}
                      </b>
                    </span>
                    <div className="ssd-list__main">
                      <b>
                        {item.subjectId?.name || "Subject"} ·{" "}
                        {className(item.classId) || "Class"}
                      </b>
                      <small>
                        {formatTime(item.startTime)} –{" "}
                        {formatTime(item.endTime)}
                        {item.room ? ` · ${item.room}` : ""}
                      </small>
                    </div>
                    {state === "now" ? (
                      <span className="ssd-chip ssd-chip--dot ssd-tone--emerald">
                        Now
                      </span>
                    ) : state === "done" ? (
                      <span className="ssd-chip">Done</span>
                    ) : item === nextPeriod ? (
                      <span className="ssd-chip ssd-tone--blue">Next</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={CalendarDays}
              title="Nothing scheduled today"
              text="Your timetable for the week is on the schedule page."
              action={{ to: "/teacher/schedule", label: "Weekly schedule" }}
            />
          )}
        </Panel>

        <AttendanceOverview
          classes={teacherData.assignedClasses}
          preferredId={idOf(nextPeriod?.classId || todaySchedule[0]?.classId)}
          loading={loading}
        />
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={FileCheck}
          tone="purple"
          title="Submissions"
          subtitle="Graded and waiting, latest assignments"
          link={{ to: "/teacher/assignments", label: "Assignments" }}
          padded>
          {work.loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : grading.chart.length ? (
            <div
              className="ssd-chart"
              style={{ height: Math.max(180, grading.chart.length * 44 + 40) }}>
              <ResponsiveContainer>
                <BarChart
                  data={grading.chart}
                  layout="vertical"
                  margin={{ left: 0, right: 12, top: 4 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 4" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={128}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "var(--ssl-sunken)" }}
                  />
                  <Bar
                    dataKey="graded"
                    name="Graded"
                    stackId="s"
                    fill={chartColor("emerald")}
                    maxBarSize={22}
                    animationDuration={900}
                  />
                  <Bar
                    dataKey="pending"
                    name="To grade"
                    stackId="s"
                    fill={chartColor("amber")}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={22}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={FileText}
              title={
                work.ok ? "No submissions yet" : "Assignment data unavailable"
              }
              text="Student submissions for your assignments will chart here."
              action={
                work.ok
                  ? { to: "/teacher/assignments", label: "Create assignment" }
                  : undefined
              }
            />
          )}
          {!work.loading && grading.chart.length > 0 && (
            <ul className="ssd-legend mt-3 justify-center">
              <li className="ssd-tone--emerald">
                <i /> Graded <b>{grading.graded}</b>
              </li>
              <li className="ssd-tone--amber">
                <i /> To grade <b>{grading.pending}</b>
              </li>
            </ul>
          )}
        </Panel>

        <Panel
          icon={ClipboardCheck}
          tone="purple"
          title="Grading progress"
          subtitle="All your assignments"
          padded>
          {work.loading ? (
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          ) : gradedPct != null ? (
            <div className="grid justify-items-center gap-4">
              <ProgressRing
                value={gradedPct}
                tone={gradedPct >= 80 ? "emerald" : "purple"}
                sublabel="graded"
              />
              <dl className="grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 ssd-tone--amber">
                  <dt className="ssd-chip ssd-chip--dot mb-1">To grade</dt>
                  <dd className="m-0 text-xl font-bold tabular-nums">
                    {grading.pending}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 ssd-tone--orange">
                  <dt className="ssd-chip ssd-chip--dot mb-1">Avg score</dt>
                  <dd className="m-0 text-xl font-bold tabular-nums">
                    {avgScore != null ? `${avgScore}%` : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <PanelEmpty
              icon={ClipboardCheck}
              title="Nothing to grade"
              text="Grading progress appears once students submit work."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={FileText}
          tone="purple"
          title="Needs attention"
          subtitle="Work to grade and upcoming due dates"
          link={{ to: "/teacher/assignments", label: "All" }}>
          {work.loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : grading.needsGrading.length || dueSoon.length ? (
            <ul className="ssd-list">
              {grading.needsGrading.slice(0, 3).map((a) => (
                <li key={`g${a._id}`}>
                  <span className="ssd-initials ssd-tone--amber">
                    <FileCheck size={16} aria-hidden="true" />
                  </span>
                  <div className="ssd-list__main">
                    <Link to={`/teacher/assignments/${a._id}`}>
                      <b>{a.title}</b>
                    </Link>
                    <small>
                      {[a.subject?.name, className(a.class)]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  </div>
                  <span className="ssd-chip ssd-tone--amber">
                    {a.submissionStats.pending} to grade
                  </span>
                </li>
              ))}
              {dueSoon
                .filter((a) => !grading.needsGrading.slice(0, 3).includes(a))
                .slice(0, 5 - Math.min(3, grading.needsGrading.length))
                .map((a) => {
                  const due = new Date(a.dueDate);
                  return (
                    <li key={`d${a._id}`}>
                      <span className="ssd-date-tile ssd-tone--purple">
                        <small>
                          {due.toLocaleDateString("en-US", { month: "short" })}
                        </small>
                        <b>{due.getDate()}</b>
                      </span>
                      <div className="ssd-list__main">
                        <Link to={`/teacher/assignments/${a._id}`}>
                          <b>{a.title}</b>
                        </Link>
                        <small>
                          {[a.subject?.name, className(a.class)]
                            .filter(Boolean)
                            .join(" · ")}
                        </small>
                      </div>
                      <span className="ssd-chip ssd-tone--purple">
                        Due {relativeDay(a.dueDate).toLowerCase()}
                      </span>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <PanelEmpty
              icon={FileCheck}
              title={work.ok ? "All caught up" : "Assignment data unavailable"}
              text={
                work.ok
                  ? "No ungraded submissions or upcoming due dates."
                  : undefined
              }
            />
          )}
        </Panel>

        <Panel
          icon={CalendarDays}
          tone="sky"
          title="Weekly teaching load"
          subtitle={
            weeklyTotal
              ? `${weeklyTotal} periods a week`
              : "Periods per day from your timetable"
          }
          link={{ to: "/teacher/schedule", label: "Timetable" }}
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : weeklyTotal > 0 ? (
            <div className="ssd-chart" style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart
                  data={weeklyLoad}
                  margin={{ left: -18, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 4" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "var(--ssl-sunken)" }}
                  />
                  <Bar
                    dataKey="periods"
                    name="Periods"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                    animationDuration={900}>
                    {weeklyLoad.map((d) => (
                      <Cell
                        key={d.day}
                        fill={chartColor(d.full === todayName ? "blue" : "sky")}
                        fillOpacity={d.full === todayName ? 1 : 0.75}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={CalendarDays}
              title="No timetable yet"
              text="Your administrator schedules your periods."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3">
        <Panel
          icon={School}
          tone="indigo"
          title="My classes"
          subtitle="Classes you teach"
          link={{ to: "/teacher/classes", label: "View all" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          ) : teacherData.assignedClasses.length > 0 ? (
            <ul className="ssd-list">
              {teacherData.assignedClasses.slice(0, 6).map((cls) => {
                const name = cls?.name || "Class";
                const isClassTeacher = classTeacherIds.has(idOf(cls));
                return (
                  <li key={idOf(cls) || className(cls)}>
                    <span className="ssd-initials ssd-tone--indigo">
                      {name.replace(/^grade\s*/i, "").slice(0, 2) ||
                        initials(name)}
                    </span>
                    <div className="ssd-list__main">
                      <b>{className(cls)}</b>
                      <small>
                        {cls?.academicYear || "Current year"}
                        {isClassTeacher ? " · Class teacher" : ""}
                      </small>
                    </div>
                    <span className="ssd-chip ssd-tone--blue">
                      {cls?.totalStudents ?? 0} students
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={School}
              title="No classes assigned yet"
              text="Your administrator assigns classes and subjects to you."
            />
          )}
          {!loading && teacherData.assignedSubjects.length > 0 && (
            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid var(--ssl-line)" }}>
              <p className="m-0 mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <BookOpen size={13} aria-hidden="true" />
                Subjects you teach
              </p>
              <div className="flex flex-wrap gap-2">
                {teacherData.assignedSubjects.map((subject, index) => (
                  <span
                    key={subject?._id || index}
                    className="ssd-chip ssd-chip--dot ssd-tone--violet">
                    {subject?.name || String(subject)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <Panel
          icon={GraduationCap}
          tone="orange"
          title="Upcoming exams"
          subtitle="Exams for your classes"
          link={{ to: "/teacher/grades/enter", label: "Enter marks" }}>
          {exams.loading || (eventsLoading && !exams.data.length) ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : upcomingExams.length ? (
            <ul className="ssd-list">
              {upcomingExams.map((e) => {
                const date = new Date(e.startDate);
                return (
                  <li key={e._id}>
                    <span className="ssd-date-tile ssd-tone--orange">
                      <small>
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </small>
                      <b>{date.getDate()}</b>
                    </span>
                    <div className="ssd-list__main">
                      <b>{e.title}</b>
                      <small>
                        {e.ongoing ? "In progress" : relativeDay(e.startDate)}
                        {e.classes ? ` · ${e.classes}` : ""}
                      </small>
                    </div>
                    <span className="ssd-chip ssd-tone--orange">{e.tag}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={GraduationCap}
              title="No upcoming exams"
              text="Exams scheduled for your classes appear here."
            />
          )}
        </Panel>

        <Panel
          icon={Megaphone}
          tone="amber"
          title="Announcements & events"
          subtitle="School calendar"
          link={{ to: "/teacher/calendar", label: "Calendar" }}>
          {eventsLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : announcements.length ? (
            <ul className="ssd-list">
              {announcements.map((e) => {
                const ui = eventTypeUI(e.eventType);
                const date = new Date(e.startDate);
                return (
                  <li key={e._id}>
                    <span className={`ssd-date-tile ssd-tone--${ui.tone}`}>
                      <small>
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </small>
                      <b>{date.getDate()}</b>
                    </span>
                    <div className="ssd-list__main">
                      <b>{e.title}</b>
                      <small>
                        {ui.single} · {relativeDay(e.startDate)}
                      </small>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={Megaphone}
              title="Nothing on the calendar"
              text="Announcements and school events will show here."
            />
          )}
        </Panel>
      </div>

      <Panel title="Quick actions" subtitle="Everyday teaching tasks" padded>
        <div className="ssd-actions">
          {QUICK_ACTIONS.teacher.map((a) => (
            <QuickActionCard
              key={a.key}
              to={a.path}
              icon={a.icon}
              tone={a.tone}
              label={a.label}
              sublabel={a.hint}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
};

/** Attendance for one of the teacher's classes over the last 30 days. */
const AttendanceOverview = ({
  classes,
  preferredId,
  loading: classesLoading,
}) => {
  const [classId, setClassId] = useState(null);
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const ids = classes.map(idOf);
  const selected =
    classId ||
    (preferredId && ids.includes(preferredId) ? preferredId : ids[0]);

  useEffect(() => {
    if (!selected) return undefined;
    let alive = true;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    setState((s) => ({ ...s, loading: true, error: false }));
    getAttendanceStats({
      classId: selected,
      startDate: isoDay(start),
      endDate: isoDay(end),
    })
      .then(
        (res) =>
          alive && setState({ loading: false, data: res?.data, error: false }),
      )
      .catch(
        () => alive && setState({ loading: false, data: null, error: true }),
      );
    return () => {
      alive = false;
    };
  }, [selected]);

  const d = state.data;
  const pct = d ? Number(d.attendancePercentage) || 0 : 0;
  const tone = pct >= 90 ? "emerald" : pct >= 75 ? "amber" : "red";

  return (
    <Panel
      icon={ClipboardCheck}
      tone="emerald"
      title="Attendance"
      subtitle="Last 30 days"
      actions={
        classes.length > 0 && (
          <Select
            size="small"
            value={selected}
            onChange={setClassId}
            style={{ minWidth: 120 }}
            aria-label="Class"
            options={classes.map((c) => ({
              value: idOf(c),
              label: className(c),
            }))}
          />
        )
      }
      link={{ to: "/teacher/attendance", label: "Records" }}
      padded>
      {classesLoading || state.loading ? (
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      ) : !classes.length ? (
        <PanelEmpty
          icon={ClipboardCheck}
          title="No classes assigned yet"
          text="Attendance appears once you're assigned a class."
        />
      ) : state.error ? (
        <PanelEmpty icon={ClipboardCheck} title="Attendance data unavailable" />
      ) : d && d.total > 0 ? (
        <div className="flex flex-wrap items-center gap-6">
          <ProgressRing value={pct} tone={tone} sublabel="attendance" />
          <dl className="grid flex-1 grid-cols-2 gap-3">
            {[
              ["Present", d.present, "emerald"],
              ["Late", d.late, "amber"],
              ["Absent", d.absent, "red"],
              ["Excused", d.excused, "sky"],
            ].map(([label, value, t]) => (
              <div
                key={label}
                className={`rounded-xl bg-slate-50 p-3 ssd-tone--${t}`}>
                <dt className="ssd-chip ssd-chip--dot mb-1">{label}</dt>
                <dd className="m-0 text-xl font-bold tabular-nums">
                  {value || 0}
                </dd>
              </div>
            ))}
          </dl>
          <p className="m-0 w-full text-xs text-slate-500">
            {d.total} attendance records for {d.totalStudents} active students.
          </p>
        </div>
      ) : (
        <PanelEmpty
          icon={ClipboardCheck}
          title="No attendance marked in the last 30 days"
          action={{ to: "/teacher/attendance/mark", label: "Mark attendance" }}
        />
      )}
    </Panel>
  );
};

export default TeacherDashboard;
