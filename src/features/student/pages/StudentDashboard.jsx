/**
 * Student Dashboard — the student's day at a glance.
 * Everything comes from the student's own records: profile, this month's
 * attendance, published exam results, assignments and submissions, today's
 * timetable, subjects, fees and the school calendar.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
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
  Award,
  BarChart3,
  BookOpen,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  Megaphone,
  Phone,
  Target,
  Trophy,
  UserRound,
  Users,
  Wallet,
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
import { greetingFor, useNow } from "../../../hooks/useNow";
import { upcomingEvents, useRoleEvents } from "../../../hooks/useRoleEvents";
import {
  getMyAttendance,
  getMyStudentProfile,
  getMySubjects,
} from "../../../services/student.service";
import scheduleService from "../../../services/schedule.service";
import { getMyExamResults } from "../../../services/exam.service";
import { getMyFees } from "../../../services/fee.service";
import { getStudentAssignments } from "../../../services/assignment.service";

const inr = (n) =>
  `₹${Math.round(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";
const isoDay = (d) => d.toISOString().split("T")[0];
const toMinutes = (t = "") => {
  const [h, m] = String(t).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
const resultPct = (r) =>
  r.percentage != null
    ? Number(r.percentage)
    : r.maxMarks > 0
      ? (r.marksObtained / r.maxMarks) * 100
      : null;

const ATTENDANCE_TONE = {
  present: "emerald",
  absent: "red",
  late: "amber",
  excused: "sky",
};
const DONE = ["submitted", "graded", "late"];

/** Settles every request so one failing API doesn't blank the page. */
const settle = (promise) =>
  promise.then(
    (res) => ({ ok: true, res }),
    (error) => ({ ok: false, error }),
  );

const ContactRow = ({ label, tone, name, email, phone }) => (
  <li>
    <span className={`ssd-initials ssd-tone--${tone}`}>{initials(name)}</span>
    <div className="ssd-list__main">
      <b>{name}</b>
      <small>{label}</small>
    </div>
    <div className="flex gap-1.5">
      {email && (
        <a
          href={`mailto:${email}`}
          className={`ssd-chip ssd-tone--${tone}`}
          aria-label={`Email ${name}`}
          title={email}>
          <Mail size={13} aria-hidden="true" />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          className={`ssd-chip ssd-tone--${tone}`}
          aria-label={`Call ${name}`}
          title={phone}>
          <Phone size={13} aria-hidden="true" />
        </a>
      )}
    </div>
  </li>
);

const PanelSkeleton = ({ rows = 3 }) => (
  <div className="p-5">
    <Skeleton active paragraph={{ rows }} />
  </div>
);

const StudentDashboard = () => {
  const now = useNow();
  const [profileState, setProfileState] = useState({
    loading: true,
    error: false,
    profile: null,
  });
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({
    ok: true,
    data: [],
    stats: null,
  });
  const [results, setResults] = useState({ ok: true, data: [] });
  const [fees, setFees] = useState({ ok: true, data: [], summary: {} });
  const [schedule, setSchedule] = useState({ ok: true, today: [] });
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState({ ok: true, data: [] });
  const { events, loading: eventsLoading } = useRoleEvents("student");

  const loadData = useCallback(async (profile) => {
    setLoading(true);
    const start = new Date();
    start.setDate(1);
    const classId = profile?.class?._id || profile?.classId?._id;

    const [attR, resR, feeR, schR, subR, asgR] = await Promise.all([
      settle(
        getMyAttendance({
          startDate: isoDay(start),
          endDate: isoDay(new Date()),
        }),
      ),
      settle(getMyExamResults()),
      settle(getMyFees()),
      settle(scheduleService.getStudentSchedules()),
      classId ? settle(getMySubjects(classId)) : Promise.resolve(null),
      settle(getStudentAssignments({ limit: 100 })),
    ]);

    setAttendance(
      attR.ok
        ? {
            ok: true,
            data: attR.res?.data || [],
            stats: attR.res?.statistics || null,
          }
        : { ok: false, data: [], stats: null },
    );
    setResults({ ok: resR.ok, data: resR.ok ? resR.res?.data || [] : [] });
    setFees(
      feeR.ok
        ? {
            ok: true,
            data: feeR.res?.data || [],
            summary: feeR.res?.summary || {},
          }
        : { ok: false, data: [], summary: {} },
    );
    const weekday = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    setSchedule({
      ok: schR.ok,
      today: schR.ok ? schR.res?.data?.groupedByDay?.[weekday] || [] : [],
    });
    setSubjects(subR?.ok ? subR.res?.data || [] : []);
    setAssignments({
      ok: asgR.ok,
      data: asgR.ok ? asgR.res?.data || [] : [],
    });
    setLoading(false);
  }, []);

  const load = useCallback(async () => {
    setProfileState({ loading: true, error: false, profile: null });
    const profR = await settle(getMyStudentProfile());
    const profile = profR.ok ? profR.res?.data || null : null;
    setProfileState({ loading: false, error: !profR.ok, profile });
    if (profile?._id) await loadData(profile);
    else setLoading(false);
  }, [loadData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, [load]);

  /* ---------- derived data ---------- */
  const att = useMemo(() => {
    const list = attendance.data;
    const count = (s) => list.filter((a) => a.status === s).length;
    const s = attendance.stats;
    const total = s?.totalClasses ?? list.length;
    const present = s?.present ?? count("present");
    const late = s?.late ?? count("late");
    const absent = s?.absent ?? count("absent");
    const excused = s?.excused ?? count("excused");
    // the backend counts late arrivals as attended
    const pct =
      s?.attendancePercentage != null
        ? Number(s.attendancePercentage)
        : total > 0
          ? ((present + late) / total) * 100
          : null;
    const recent = [...list]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14);
    return {
      total,
      present,
      late,
      absent,
      excused,
      pct: total > 0 ? pct : null,
      recent,
    };
  }, [attendance]);

  const performance = useMemo(() => {
    // results arrive newest first; keep the latest published mark per subject
    const seen = new Map();
    results.data.forEach((r) => {
      const key = r.subjectId?._id || r.subjectId?.name;
      const pct = resultPct(r);
      if (!key || pct == null || seen.has(key)) return;
      seen.set(key, {
        subject: r.subjectId?.name || "Subject",
        score: Math.round(pct),
        passed: r.isPassed !== false,
        exam: r.examId?.name || r.examName || "",
      });
    });
    return [...seen.values()];
  }, [results.data]);

  const avgScore = useMemo(() => {
    const pcts = results.data.map(resultPct).filter((p) => p != null);
    return pcts.length
      ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
      : null;
  }, [results.data]);

  const work = useMemo(() => {
    const list = assignments.data;
    const done = list.filter((a) => DONE.includes(a.submissionStatus));
    const todo = list
      .filter((a) => !DONE.includes(a.submissionStatus))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const overdue = todo.filter((a) => a.submissionStatus === "overdue");
    const graded = list.filter(
      (a) =>
        a.mySubmission?.status === "graded" &&
        a.mySubmission?.marksObtained != null &&
        a.totalMarks > 0,
    );
    const gradedPct = graded.length
      ? Math.round(
          (graded.reduce((s, a) => s + a.mySubmission.marksObtained, 0) /
            graded.reduce((s, a) => s + a.totalMarks, 0)) *
            100,
        )
      : null;
    const bySubject = new Map();
    list.forEach((a) => {
      const name = a.subject?.name || "Other";
      const row = bySubject.get(name) || { name, total: 0, done: 0 };
      row.total += 1;
      if (DONE.includes(a.submissionStatus)) row.done += 1;
      bySubject.set(name, row);
    });
    return {
      total: list.length,
      done: done.length,
      todo,
      overdue: overdue.length,
      gradedCount: graded.length,
      gradedPct,
      bySubject: [...bySubject.values()]
        .sort((a, b) => b.total - a.total)
        .slice(0, 4),
    };
  }, [assignments.data]);

  const exams = upcomingEvents(events, { types: ["exam"], limit: 4 });
  const notices = upcomingEvents(events, {
    types: [
      "announcement",
      "school_event",
      "holiday",
      "fee_due",
      "assignment_deadline",
    ],
    limit: 5,
  });

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = schedule.today;

  /* ---------- page states ---------- */
  if (profileState.error) {
    return (
      <Panel title="Dashboard" padded>
        <ErrorState
          title="Couldn't load your dashboard"
          description="Your student profile didn't load. Check your connection and try again."
          onRetry={load}
        />
      </Panel>
    );
  }

  if (!profileState.loading && !profileState.profile) {
    return (
      <Panel icon={UserRound} title="Student profile" padded>
        <PanelEmpty
          icon={UserRound}
          title="Student profile not found"
          text="Please contact your school administrator."
        />
      </Panel>
    );
  }

  const profile = profileState.profile;
  const classInfo = profile?.class || profile?.classId;
  const classTeacher = classInfo?.classTeacher;
  const parentInfo = profile?.parentId;
  const teacherName = classTeacher?.userId?.name || classTeacher?.name;
  const parentName = parentInfo?.userId?.name || parentInfo?.name;
  const firstName = (profile?.userId?.name || "").split(" ")[0];
  const busy = profileState.loading || loading;

  const feeBalance = fees.summary?.totalBalance || 0;
  const attTone =
    att.pct == null
      ? "slate"
      : att.pct >= 90
        ? "emerald"
        : att.pct >= 75
          ? "amber"
          : "red";
  const nextDue = work.todo.find((a) => a.submissionStatus !== "overdue");

  const classLine = [
    classInfo?.name,
    profile?.section && `Section ${profile.section}`,
    profile?.rollNumber && `Roll ${profile.rollNumber}`,
    profile?.academicYear,
  ]
    .filter(Boolean)
    .join(" · ");

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
          profileState.loading
            ? "Loading your day…"
            : classLine || "Your class details will appear once assigned."
        }
        rightContent={<SchoolIllustration />}>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/student/assignments" className="ssd-btn ssd-btn--light">
            <FileText size={16} aria-hidden="true" />
            My assignments
          </Link>
          <Link to="/student/timetable" className="ssd-btn ssd-btn--glass">
            <CalendarClock size={16} aria-hidden="true" />
            Timetable
          </Link>
        </div>
      </HeroBanner>

      <div className="ssd-stats ssd-stats--6">
        <StatCard
          title="Attendance this month"
          value={att.pct != null ? att.pct : busy ? undefined : "—"}
          format={(n) => `${Math.round(n)}%`}
          icon={ClipboardCheck}
          tone="emerald"
          hint={
            att.total
              ? `${att.total} days marked`
              : attendance.ok
                ? "Nothing marked yet"
                : undefined
          }
          to="/student/attendance"
          loading={busy}
        />
        <StatCard
          title="Average score"
          value={avgScore ?? "—"}
          format={(n) => `${Math.round(n)}%`}
          icon={Trophy}
          tone="orange"
          hint={
            results.data.length
              ? `${results.data.length} published marks`
              : results.ok
                ? "No results yet"
                : undefined
          }
          to="/student/academics/results"
          loading={busy}
        />
        <StatCard
          title="Pending assignments"
          value={assignments.ok ? work.todo.length : "—"}
          icon={FileText}
          tone="purple"
          hint={
            work.overdue
              ? `${work.overdue} overdue`
              : nextDue
                ? `Next due ${relativeDay(nextDue.dueDate).toLowerCase()}`
                : undefined
          }
          to="/student/assignments"
          loading={busy}
        />
        <StatCard
          title="Classes today"
          value={schedule.ok ? today.length : "—"}
          icon={CalendarClock}
          tone="sky"
          hint={
            today.length
              ? `${today[0].startTime} – ${today[today.length - 1].endTime}`
              : undefined
          }
          to="/student/timetable"
          loading={busy}
        />
        <StatCard
          title="Subjects"
          value={subjects.length}
          icon={BookOpen}
          tone="indigo"
          to="/student/classes"
          loading={busy}
        />
        <StatCard
          title="Fee balance"
          value={fees.ok && fees.data.length ? feeBalance : "—"}
          format={inr}
          icon={Wallet}
          tone="teal"
          hint={
            fees.ok && fees.data.length
              ? fees.summary?.overdueCount
                ? `${fees.summary.overdueCount} overdue`
                : feeBalance > 0
                  ? `${inr(fees.summary.totalPaid)} paid so far`
                  : "All fees paid"
              : fees.ok
                ? "No fees billed"
                : undefined
          }
          to="/student/fees"
          loading={busy}
        />
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={BarChart3}
          tone="orange"
          title="Academic performance"
          subtitle="Latest published score per subject"
          link={{ to: "/student/academics/results", label: "Results" }}
          padded>
          {busy ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : performance.length ? (
            <div
              className="ssd-chart"
              style={{ height: Math.max(180, performance.length * 42 + 30) }}>
              <ResponsiveContainer>
                <BarChart
                  data={performance}
                  layout="vertical"
                  margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 4" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    width={124}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v.length > 16 ? `${v.slice(0, 15)}…` : v
                    }
                  />
                  <Tooltip
                    content={<ChartTooltip format={(v) => `${v}%`} />}
                    cursor={{ fill: "var(--ssl-sunken)" }}
                  />
                  <Bar
                    dataKey="score"
                    name="Score"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={22}
                    animationDuration={900}>
                    {performance.map((p) => (
                      <Cell
                        key={p.subject}
                        fill={chartColor(p.passed ? "orange" : "red")}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={BarChart3}
              title={
                results.ok ? "No results published yet" : "Results unavailable"
              }
              text="Your subject scores will chart here once results are published."
            />
          )}
        </Panel>

        <Panel
          icon={ClipboardCheck}
          tone="emerald"
          title="Attendance"
          subtitle={now.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
          link={{ to: "/student/attendance", label: "Record" }}
          padded>
          {busy ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : !attendance.ok ? (
            <PanelEmpty
              icon={ClipboardCheck}
              title="Attendance data unavailable"
            />
          ) : att.total > 0 ? (
            <div className="grid gap-4">
              <div className="flex justify-center">
                <ProgressRing
                  value={att.pct}
                  tone={attTone}
                  sublabel="attended"
                />
              </div>
              <dl className="grid grid-cols-3 gap-2">
                {[
                  ["Present", att.present, "emerald"],
                  ["Late", att.late, "amber"],
                  ["Absent", att.absent, "red"],
                ].map(([label, value, t]) => (
                  <div
                    key={label}
                    className={`rounded-xl bg-slate-50 p-2.5 text-center ssd-tone--${t}`}>
                    <dt className="ssd-chip ssd-chip--dot mb-1">{label}</dt>
                    <dd className="m-0 text-lg font-bold tabular-nums">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="mb-1.5 text-xs text-slate-500">Recent days</p>
                <div className="flex flex-wrap gap-1.5">
                  {att.recent.map((a, i) => (
                    <span
                      key={a._id || i}
                      className={`ssd-tone--${ATTENDANCE_TONE[a.status] || "slate"} inline-block h-3.5 w-3.5 rounded`}
                      style={{ background: "var(--tone)" }}
                      title={`${new Date(a.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}: ${a.status}`}
                    />
                  ))}
                </div>
                {att.excused > 0 && (
                  <p className="mt-2 mb-0 text-xs text-slate-500">
                    {att.excused} excused{" "}
                    {att.excused === 1 ? "absence" : "absences"}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <PanelEmpty
              icon={ClipboardCheck}
              title="No attendance marked this month"
              text="Your teachers mark attendance each school day."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <div className="grid content-start gap-5">
          <Panel
            icon={CalendarClock}
            tone="sky"
            title="Today's classes"
            subtitle={now.toLocaleDateString("en-US", { weekday: "long" })}
            link={{ to: "/student/timetable", label: "Timetable" }}>
            {busy ? (
              <PanelSkeleton rows={4} />
            ) : today.length ? (
              <ol className="m-0 list-none px-5 py-4">
                {today.map((s, i) => {
                  const startM = toMinutes(s.startTime);
                  const endM = toMinutes(s.endTime);
                  const state =
                    nowMin >= endM ? "done" : nowMin >= startM ? "now" : "next";
                  const last = i === today.length - 1;
                  return (
                    <li
                      key={s._id || i}
                      className={`relative flex gap-3 ${last ? "" : "pb-4"} ssd-tone--${state === "done" ? "slate" : "sky"}`}>
                      {!last && (
                        <span
                          aria-hidden="true"
                          className="absolute top-5 bottom-0 left-[5px] w-px bg-slate-200"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className="relative mt-1.5 h-[11px] w-[11px] flex-none rounded-full"
                        style={{
                          background:
                            state === "next" ? "var(--tone-bg)" : "var(--tone)",
                          boxShadow: "0 0 0 2px var(--tone-line)",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <b
                            className={`text-sm font-semibold ${state === "done" ? "text-slate-500" : "text-slate-900"}`}>
                            {s.subjectId?.name || "Class"}
                          </b>
                          {state === "now" && (
                            <span className="ssd-chip ssd-chip--dot ssd-tone--emerald">
                              Now
                            </span>
                          )}
                        </div>
                        <small className="block text-xs text-slate-500">
                          <span className="tabular-nums">
                            {s.startTime} – {s.endTime}
                          </span>
                          {s.teacherId?.name && ` · ${s.teacherId.name}`}
                          {s.room && ` · Room ${s.room}`}
                        </small>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <PanelEmpty
                icon={CalendarDays}
                title={
                  schedule.ok ? "No classes today" : "Timetable unavailable"
                }
                text="Your full weekly timetable is on the timetable page."
              />
            )}
          </Panel>
          <Panel
            icon={GraduationCap}
            tone="orange"
            title="Upcoming exams"
            subtitle="From the school calendar"
            link={{ to: "/student/calendar", label: "Calendar" }}>
            {eventsLoading ? (
              <PanelSkeleton />
            ) : exams.length ? (
              <ul className="ssd-list">
                {exams.map((e) => {
                  const date = new Date(e.startDate);
                  const end = e.endDate ? new Date(e.endDate) : null;
                  const multi =
                    end && end.toDateString() !== date.toDateString();
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
                          {multi
                            ? `Until ${end.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}`
                            : "One day"}
                        </small>
                      </div>
                      <span className="ssd-chip ssd-tone--orange">
                        {relativeDay(e.startDate)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <PanelEmpty
                icon={GraduationCap}
                title="No exams scheduled"
                text="Exam dates appear here when the school announces them."
              />
            )}
          </Panel>
          <Panel
            icon={Megaphone}
            tone="amber"
            title="Announcements"
            subtitle="Events and notices"
            link={{ to: "/student/calendar", label: "Calendar" }}>
            {eventsLoading ? (
              <PanelSkeleton />
            ) : notices.length ? (
              <ul className="ssd-list">
                {notices.map((e) => {
                  const ui = eventTypeUI(e.eventType);
                  const Icon = ui.icon;
                  return (
                    <li key={e._id}>
                      <span className={`ssd-initials ssd-tone--${ui.tone}`}>
                        <Icon size={16} aria-hidden="true" />
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
                title="No announcements"
                text="School notices and events will show up here."
              />
            )}
          </Panel>
        </div>
        <div className="grid content-start gap-5">
          <Panel
            icon={FileText}
            tone="purple"
            title="Assignment deadlines"
            subtitle="Not yet submitted, soonest first"
            link={{ to: "/student/assignments", label: "All" }}>
            {busy ? (
              <PanelSkeleton rows={4} />
            ) : !assignments.ok ? (
              <PanelEmpty icon={FileText} title="Assignments unavailable" />
            ) : work.todo.length ? (
              <ul className="ssd-list">
                {work.todo.slice(0, 5).map((a) => {
                  const due = new Date(a.dueDate);
                  const overdue = a.submissionStatus === "overdue";
                  const rel = relativeDay(a.dueDate);
                  const tone = overdue
                    ? "red"
                    : rel === "Today" || rel === "Tomorrow"
                      ? "amber"
                      : "purple";
                  return (
                    <li key={a._id}>
                      <span className={`ssd-date-tile ssd-tone--${tone}`}>
                        <small>
                          {due.toLocaleDateString("en-US", { month: "short" })}
                        </small>
                        <b>{due.getDate()}</b>
                      </span>
                      <div className="ssd-list__main">
                        <Link
                          to={`/student/assignments/${a._id}`}
                          className="truncate font-semibold text-slate-900 hover:underline">
                          {a.title}
                        </Link>
                        <small>
                          {a.subject?.name || "Subject"}
                          {a.totalMarks ? ` · ${a.totalMarks} marks` : ""}
                        </small>
                      </div>
                      <span className={`ssd-chip ssd-tone--${tone}`}>
                        {overdue ? "Overdue" : rel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <PanelEmpty
                icon={FileText}
                title={work.total ? "All caught up" : "No assignments yet"}
                text={
                  work.total
                    ? "You've submitted every assignment set for your class."
                    : "Assignments from your teachers will appear here."
                }
              />
            )}
          </Panel>
          <Panel
            icon={Target}
            tone="purple"
            title="Learning progress"
            subtitle="Assignments submitted"
            link={{ to: "/student/assignments", label: "Assignments" }}
            padded>
            {busy ? (
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            ) : work.total > 0 ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <ProgressRing
                    value={(work.done / work.total) * 100}
                    tone="purple"
                    size={104}
                    stroke={10}
                    label={`${work.done}/${work.total}`}
                    sublabel="submitted"
                  />
                  <dl className="m-0 grid flex-1 gap-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">To do</dt>
                      <dd className="m-0 font-semibold tabular-nums">
                        {work.todo.length}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Graded</dt>
                      <dd className="m-0 font-semibold tabular-nums">
                        {work.gradedCount}
                      </dd>
                    </div>
                    {work.gradedPct != null && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-500">Avg. grade</dt>
                        <dd className="m-0 font-semibold tabular-nums">
                          {work.gradedPct}%
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div className="grid gap-3">
                  {work.bySubject.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1 flex justify-between gap-2 text-xs">
                        <span className="truncate text-slate-600">
                          {s.name}
                        </span>
                        <b className="tabular-nums">
                          {s.done}/{s.total}
                        </b>
                      </div>
                      <div className="ssd-meter ssd-tone--purple">
                        <i style={{ "--w": `${(s.done / s.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <PanelEmpty
                icon={Target}
                title={
                  assignments.ok
                    ? "No assignments yet"
                    : "Assignment data unavailable"
                }
                text="Your progress fills in as you submit work."
              />
            )}
          </Panel>
        </div>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={Award}
          tone="orange"
          title="Recent results"
          subtitle="Published exam marks"
          link={{ to: "/student/academics/results", label: "All results" }}>
          {busy ? (
            <PanelSkeleton rows={4} />
          ) : results.data.length ? (
            <ul className="ssd-list">
              {results.data.slice(0, 5).map((r) => {
                const pct = resultPct(r);
                return (
                  <li key={r._id}>
                    <span
                      className={`ssd-initials ssd-tone--${r.isPassed === false ? "red" : "orange"}`}>
                      {r.grade || (pct != null ? Math.round(pct) : "—")}
                    </span>
                    <div className="ssd-list__main">
                      <b>{r.subjectId?.name || "Subject"}</b>
                      <small>{r.examId?.name || r.examName || "Exam"}</small>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {r.marksObtained}/{r.maxMarks ?? "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={Award}
              title={
                results.ok ? "No results published yet" : "Results unavailable"
              }
              text="Exam marks appear here once your school publishes them."
            />
          )}
        </Panel>
        <Panel
          icon={BookOpen}
          tone="indigo"
          title="My subjects"
          subtitle={
            subjects.length ? `${subjects.length} this year` : undefined
          }
          link={{ to: "/student/classes", label: "My class" }}>
          {busy ? (
            <PanelSkeleton rows={4} />
          ) : subjects.length ? (
            <ul className="ssd-list">
              {subjects.slice(0, 6).map((s) => (
                <li key={s._id}>
                  <span className="ssd-initials ssd-tone--indigo">
                    {initials(s.name)}
                  </span>
                  <div className="ssd-list__main">
                    <b>{s.name || "Subject"}</b>
                    {s.assignedTeacher?.userId?.name && (
                      <small>{s.assignedTeacher.userId.name}</small>
                    )}
                  </div>
                  {s.code && (
                    <span className="ssd-chip ssd-tone--indigo">{s.code}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty icon={BookOpen} title="No subjects assigned yet" />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel title="Quick actions" subtitle="Jump to your pages" padded>
          <div className="ssd-actions">
            {QUICK_ACTIONS.student.map((a) => (
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

        <Panel
          icon={Users}
          tone="pink"
          title="Contacts"
          subtitle="Your class teacher and family">
          {profileState.loading ? (
            <PanelSkeleton rows={2} />
          ) : (
            <ul className="ssd-list">
              {teacherName ? (
                <ContactRow
                  label="Class teacher"
                  tone="violet"
                  name={teacherName}
                  email={classTeacher?.userId?.email}
                  phone={classTeacher?.userId?.phone}
                />
              ) : (
                <li>
                  <span className="ssd-initials ssd-tone--slate">
                    <Clock size={15} aria-hidden="true" />
                  </span>
                  <div className="ssd-list__main">
                    <b>Class teacher</b>
                    <small>Not assigned yet</small>
                  </div>
                </li>
              )}
              {parentName ? (
                <ContactRow
                  label="Parent / guardian"
                  tone="pink"
                  name={parentName}
                  email={parentInfo?.userId?.email || parentInfo?.email}
                  phone={parentInfo?.userId?.phone || parentInfo?.phone}
                />
              ) : (
                <li>
                  <span className="ssd-initials ssd-tone--slate">
                    <Users size={15} aria-hidden="true" />
                  </span>
                  <div className="ssd-list__main">
                    <b>Parent / guardian</b>
                    <small>Not linked yet</small>
                  </div>
                </li>
              )}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default StudentDashboard;
