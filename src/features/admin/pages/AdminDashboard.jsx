/**
 * Admin Dashboard — the school's command centre.
 * Every number comes from the API: headline counts, fee collection and
 * status, students per class, enrolment by month, attendance for a chosen
 * class, exam workflow, recent activity and the school calendar.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Select, Skeleton } from "antd";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Book,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  PieChart as PieIcon,
  Receipt,
  School,
  TrendingUp,
  Trophy,
  UserCog,
  UserPlus,
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
import { useAuth } from "../../../hooks/useAuth";
import { greetingFor, useNow } from "../../../hooks/useNow";
import { upcomingEvents, useRoleEvents } from "../../../hooks/useRoleEvents";
import {
  getAllStudents,
  getDashboardStats,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";
import { getFeeStats } from "../../../services/fee.service";
import { getAdminOverview } from "../../../services/exam.service";
import { getAttendanceStats } from "../../../services/attendance.service";

const inr = (n) =>
  `₹${Math.round(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const inrShort = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}k`;
  return `₹${v}`;
};
const monthLabel = (ym) =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
  });
const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";
const isoDay = (d) => d.toISOString().split("T")[0];

const FEE_STATUS = [
  { key: "paidCount", label: "Paid", tone: "emerald" },
  { key: "partialCount", label: "Partial", tone: "amber" },
  { key: "unpaidCount", label: "Unpaid", tone: "slate" },
  { key: "overdueCount", label: "Overdue", tone: "red" },
];

/** Settles every request so one failing API doesn't blank the page. */
const settle = (promise) =>
  promise.then(
    (res) => ({ ok: true, res }),
    (error) => ({ ok: false, error }),
  );

const AdminDashboard = () => {
  const { userName } = useAuth();
  const now = useNow();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState({ ok: true, data: null });
  const [exams, setExams] = useState(null);
  const [failed, setFailed] = useState(false);
  const { events, loading: eventsLoading } = useRoleEvents("admin");

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    const [statsR, studentsR, classesR, feesR, examsR] = await Promise.all([
      settle(getDashboardStats()),
      settle(getAllStudents()),
      settle(getAllClasses()),
      settle(getFeeStats()),
      settle(getAdminOverview()),
    ]);
    if (statsR.ok) setStats(statsR.res?.data || null);
    setStudents(studentsR.ok ? studentsR.res?.data || [] : []);
    setClasses(classesR.ok ? classesR.res?.data || [] : []);
    setFees(
      feesR.ok
        ? { ok: true, data: feesR.res?.data || null }
        : { ok: false, data: null },
    );
    setExams(examsR.ok ? examsR.res?.data || null : null);
    setFailed(!statsR.ok && !studentsR.ok && !classesR.ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load();
  }, [load]);

  /* ---------- derived data ---------- */
  const counts = useMemo(() => {
    const byClass = new Map();
    students.forEach((s) => {
      const id = s.classId?._id || s.classId;
      if (id) byClass.set(String(id), (byClass.get(String(id)) || 0) + 1);
    });
    return byClass;
  }, [students]);

  const classDistribution = useMemo(
    () =>
      classes
        .map((c) => ({
          name: `${c.name}${c.section ? ` ${c.section}` : ""}`,
          students: counts.get(String(c._id)) || 0,
        }))
        .sort((a, b) => b.students - a.students)
        .slice(0, 10),
    [classes, counts],
  );

  const enrolment = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - 5 + i);
      return d.toISOString().slice(0, 7);
    });
    const tally = Object.fromEntries(months.map((m) => [m, 0]));
    students.forEach((s) => {
      const when = (s.admissionDate || s.createdAt || "").slice(0, 7);
      if (when in tally) tally[when] += 1;
    });
    return months.map((m) => ({ month: monthLabel(m), students: tally[m] }));
  }, [students]);

  const overall = fees.data?.overall;
  const trend = (fees.data?.collectionTrend || []).map((t) => ({
    month: monthLabel(t._id),
    collected: t.totalCollected,
  }));
  const collectedPct =
    overall?.totalAmount > 0
      ? Math.round((overall.totalCollected / overall.totalAmount) * 100)
      : null;
  const feeStatus = FEE_STATUS.map((s) => ({
    ...s,
    value: overall?.[s.key] || 0,
  })).filter((s) => s.value > 0);

  const announcements = upcomingEvents(events, { limit: 5 });
  const recentStudents = students.slice(0, 5);
  const recentPayments = (fees.data?.recentPayments || []).slice(0, 5);

  const firstName = (userName || "").split(" ")[0];
  const totalStudents = stats?.totalStudents ?? students.length;

  if (failed) {
    return (
      <Panel title="Dashboard" padded>
        <ErrorState
          title="Couldn't load the dashboard"
          description="The school data service didn't respond."
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
            ? "Loading today's school overview…"
            : `${totalStudents.toLocaleString("en-IN")} students across ${stats?.totalClasses ?? classes.length} classes, taught by ${stats?.totalTeachers ?? 0} teachers.`
        }
        rightContent={<SchoolIllustration />}>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/students/enroll" className="ssd-btn ssd-btn--light">
            <UserPlus size={16} aria-hidden="true" />
            Enroll student
          </Link>
          <Link to="/admin/calendar" className="ssd-btn ssd-btn--glass">
            <Megaphone size={16} aria-hidden="true" />
            New announcement
          </Link>
        </div>
      </HeroBanner>

      <div className="ssd-stats ssd-stats--6">
        <StatCard
          title="Students"
          value={stats?.totalStudents}
          icon={GraduationCap}
          tone="blue"
          hint={stats ? `${stats.activeStudents} active` : undefined}
          to="/admin/users/students"
          loading={loading}
        />
        <StatCard
          title="Teachers"
          value={stats?.totalTeachers}
          icon={UserCog}
          tone="violet"
          hint={stats ? `${stats.activeTeachers} active` : undefined}
          to="/admin/users/teachers"
          loading={loading}
        />
        <StatCard
          title="Parents"
          value={stats?.totalParents}
          icon={HeartHandshake}
          tone="pink"
          to="/admin/users/parents"
          loading={loading}
        />
        <StatCard
          title="Classes"
          value={stats?.totalClasses}
          icon={School}
          tone="sky"
          to="/admin/academics/classes"
          loading={loading}
        />
        <StatCard
          title="Subjects"
          value={stats?.totalSubjects}
          icon={Book}
          tone="indigo"
          to="/admin/academics/subjects"
          loading={loading}
        />
        <StatCard
          title="Fees collected"
          value={overall ? overall.totalCollected : fees.ok ? undefined : "—"}
          format={inr}
          icon={Wallet}
          tone="teal"
          hint={
            collectedPct != null
              ? `${collectedPct}% of ${inrShort(overall.totalAmount)} billed`
              : undefined
          }
          spark={trend.map((t) => t.collected)}
          to="/admin/fees"
          loading={loading}
        />
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={TrendingUp}
          tone="teal"
          title="Fee collection"
          subtitle="Payments received, last 6 months"
          link={{ to: "/admin/fees", label: "Finance" }}
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : trend.length ? (
            <div className="ssd-chart" style={{ height: 240 }}>
              <ResponsiveContainer>
                <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="feeFill" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chartColor("teal")}
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColor("teal")}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 4" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    tickFormatter={inrShort}
                  />
                  <Tooltip
                    content={<ChartTooltip format={(v) => inr(v)} />}
                    cursor={{ stroke: chartColor("teal"), strokeOpacity: 0.3 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    name="Collected"
                    stroke={chartColor("teal")}
                    strokeWidth={2.4}
                    fill="url(#feeFill)"
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={Receipt}
              title={
                fees.ok
                  ? "No payments in the last 6 months"
                  : "Fee data unavailable"
              }
              text="Recorded fee payments will chart here."
            />
          )}
        </Panel>

        <Panel
          icon={PieIcon}
          tone="teal"
          title="Fee status"
          subtitle="All fee records"
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : feeStatus.length ? (
            <div className="grid gap-4">
              <div className="ssd-chart relative" style={{ height: 170 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={feeStatus}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke="none"
                      animationDuration={900}>
                      {feeStatus.map((s) => (
                        <Cell key={s.key} fill={chartColor(s.tone)} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
                  <b className="text-xl font-bold tabular-nums">
                    {collectedPct ?? 0}%
                  </b>
                  <small className="text-xs text-slate-500">collected</small>
                </div>
              </div>
              <ul className="ssd-legend justify-center">
                {feeStatus.map((s) => (
                  <li key={s.key} className={`ssd-tone--${s.tone}`}>
                    <i /> {s.label} <b>{s.value}</b>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <PanelEmpty icon={Wallet} title="No fee records yet" />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={School}
          tone="sky"
          title="Students per class"
          subtitle="Enrolled students by class"
          link={{ to: "/admin/academics/classes", label: "Classes" }}
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : classDistribution.length ? (
            <div className="ssd-chart" style={{ height: 240 }}>
              <ResponsiveContainer>
                <BarChart
                  data={classDistribution}
                  margin={{ left: -18, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 4" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
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
                    dataKey="students"
                    name="Students"
                    fill={chartColor("sky")}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={School}
              title="No classes yet"
              text="Create classes to start enrolling students."
              action={{
                to: "/admin/academics/classes",
                label: "Create a class",
              }}
            />
          )}
        </Panel>

        <AttendanceOverview classes={classes} loading={loading} />
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={UserPlus}
          tone="blue"
          title="New enrolments"
          subtitle="Students admitted per month"
          link={{ to: "/admin/students/enroll", label: "Enroll" }}
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : enrolment.some((m) => m.students > 0) ? (
            <div className="ssd-chart" style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart
                  data={enrolment}
                  margin={{ left: -18, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 4" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
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
                    dataKey="students"
                    name="Admitted"
                    fill={chartColor("blue")}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={34}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <PanelEmpty
              icon={UserPlus}
              title="No admissions in the last 6 months"
            />
          )}
        </Panel>

        <Panel
          icon={Trophy}
          tone="orange"
          title="Exams & results"
          subtitle="Marks entry and publishing"
          link={{ to: "/admin/results", label: "Results" }}
          padded>
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : exams ? (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Exams", exams.totalExams, "orange"],
                  ["Published", exams.publishedExams, "emerald"],
                  ["Awaiting approval", exams.pendingApproval, "amber"],
                  ["Marks in progress", exams.draftExamSubjects, "sky"],
                ].map(([label, value, tone]) => (
                  <div
                    key={label}
                    className={`rounded-xl bg-slate-50 p-3 ssd-tone--${tone}`}>
                    <span className="ssd-chip ssd-chip--dot mb-1.5">
                      {label}
                    </span>
                    <b className="block text-2xl font-bold tabular-nums">
                      {value ?? 0}
                    </b>
                  </div>
                ))}
              </div>
              {exams.totalExams > 0 && (
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-500">Results published</span>
                    <b className="tabular-nums">
                      {Math.round(
                        (exams.publishedExams / exams.totalExams) * 100,
                      )}
                      %
                    </b>
                  </div>
                  <div className="ssd-meter ssd-tone--orange">
                    <i
                      style={{
                        "--w": `${(exams.publishedExams / exams.totalExams) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PanelEmpty icon={Trophy} title="Exam data unavailable" />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3">
        <Panel
          icon={GraduationCap}
          tone="blue"
          title="Recent students"
          link={{ to: "/admin/users/students", label: "All" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </div>
          ) : recentStudents.length ? (
            <ul className="ssd-list">
              {recentStudents.map((s) => (
                <li key={s._id}>
                  <span className="ssd-initials ssd-tone--blue">
                    {initials(s.userId?.name)}
                  </span>
                  <div className="ssd-list__main">
                    <b>{s.userId?.name || "N/A"}</b>
                    <small>
                      {s.classId?.name || "No class"} · Roll{" "}
                      {s.rollNumber || "—"}
                    </small>
                  </div>
                  <span
                    className={`ssd-chip ssd-tone--${(s.enrollmentStatus || "active") === "active" ? "emerald" : "amber"} capitalize`}>
                    {s.enrollmentStatus || "active"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={GraduationCap}
              title="No students enrolled"
              action={{
                to: "/admin/students/enroll",
                label: "Enroll a student",
              }}
            />
          )}
        </Panel>

        <Panel
          icon={Receipt}
          tone="teal"
          title="Recent payments"
          link={{ to: "/admin/fees", label: "All" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : recentPayments.length ? (
            <ul className="ssd-list">
              {recentPayments.map((p) => (
                <li key={p._id}>
                  <span className="ssd-initials ssd-tone--teal">
                    {initials(p.studentId?.userId?.name)}
                  </span>
                  <div className="ssd-list__main">
                    <b>{p.studentId?.userId?.name || "Student"}</b>
                    <small>
                      <span className="capitalize">
                        {p.feeId?.feeType || "Fee"}
                      </span>{" "}
                      · {relativeDay(p.createdAt)}
                    </small>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {inr(p.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty icon={Receipt} title="No payments yet" />
          )}
        </Panel>

        <Panel
          icon={Megaphone}
          tone="amber"
          title="Coming up"
          subtitle="School calendar"
          link={{ to: "/admin/calendar", label: "Calendar" }}>
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
              icon={CalendarDays}
              title="Nothing scheduled"
              action={{ to: "/admin/calendar", label: "Add an event" }}
            />
          )}
        </Panel>
      </div>

      <Panel
        title="Quick actions"
        subtitle="Common administration tasks"
        padded>
        <div className="ssd-actions">
          {QUICK_ACTIONS.admin.map((a) => (
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

/** Attendance for one class over the last 30 days (real stats endpoint). */
const AttendanceOverview = ({ classes, loading: classesLoading }) => {
  const [classId, setClassId] = useState(null);
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const selected = classId || classes[0]?._id;

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
            style={{ minWidth: 130 }}
            aria-label="Class"
            options={classes.map((c) => ({
              value: c._id,
              label: `${c.name}${c.section ? ` ${c.section}` : ""}`,
            }))}
          />
        )
      }
      link={{ to: "/admin/attendance", label: "Records" }}
      padded>
      {classesLoading || state.loading ? (
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      ) : !classes.length ? (
        <PanelEmpty icon={ClipboardCheck} title="No classes yet" />
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
          text="Teachers mark attendance from their dashboard."
        />
      )}
    </Panel>
  );
};

export default AdminDashboard;
