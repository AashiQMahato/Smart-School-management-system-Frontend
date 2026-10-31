/**
 * Parent Dashboard
 * One view per linked child: attendance this month and the last 14 school
 * days, published exam results, fee status, the weekly timetable, class
 * teacher contact, subjects and the school calendar. Every number comes
 * from the API; sections without data show an honest empty state.
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
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  DoorOpen,
  GraduationCap,
  Mail,
  Megaphone,
  Phone,
  Receipt,
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
import { ScheduleView } from "../../../components/Schedule";
import { useAuth } from "../../../hooks/useAuth";
import { greetingFor, useNow } from "../../../hooks/useNow";
import { upcomingEvents, useRoleEvents } from "../../../hooks/useRoleEvents";
import {
  getChildAttendance,
  getMyChildren,
} from "../../../services/parent.service";
import { getChildExamResults } from "../../../services/exam.service";
import { getFeesByStudent } from "../../../services/fee.service";
import scheduleService from "../../../services/schedule.service";

/* ---------- helpers ---------- */

const EMPTY_GROUPED = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

const inr = (n) =>
  `₹${Math.round(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const pctFormat = (n) => `${Math.round(n)}%`;
const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";
const firstNameOf = (name) => (name || "").split(" ")[0];
const isoDay = (d) => d.toISOString().split("T")[0];
const dayKey = (value) => String(value || "").slice(0, 10);
const shortDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
const classLabel = (child) =>
  [
    child?.classId?.name,
    child?.section || child?.classId?.section
      ? `Section ${child.section || child.classId.section}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

/** Same grade bands the backend uses for results. */
const gradeFor = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C+";
  if (pct >= 40) return "C";
  if (pct >= 33) return "D";
  return "F";
};

const EXAM_TYPE_LABEL = {
  "unit-test-1": "Unit Test 1",
  "unit-test-2": "Unit Test 2",
  midterm: "Mid-term",
  final: "Final exam",
  assignment: "Assignment",
  practical: "Practical",
};

/** Status of a whole school day from its per-class records. */
const DAY_UI = {
  present: { label: "Present", tone: "emerald" },
  late: { label: "Late", tone: "amber" },
  partial: { label: "Missed some classes", tone: "orange" },
  absent: { label: "Absent", tone: "red" },
  excused: { label: "Excused", tone: "sky" },
};

const dayStatus = (statuses) => {
  if (statuses.every((s) => s === "absent")) return "absent";
  if (statuses.includes("absent")) return "partial";
  if (statuses.includes("late")) return "late";
  if (statuses.every((s) => s === "excused")) return "excused";
  return "present";
};

const FEE_STATUS_TONE = {
  paid: "emerald",
  partial: "amber",
  unpaid: "slate",
  overdue: "red",
};

const rateTone = (pct) =>
  pct == null ? "slate" : pct >= 90 ? "emerald" : pct >= 75 ? "amber" : "red";

/** Settles every request so one failing API doesn't blank the page. */
const settle = (promise) =>
  promise.then(
    (res) => ({ ok: true, res }),
    (error) => ({ ok: false, error }),
  );

const EMPTY_DETAIL = {
  childId: null,
  loading: true,
  attendance: { ok: true, data: [] },
  results: { ok: true, data: [] },
  fees: { ok: true, data: [], summary: null },
};

/* ---------- derived data ---------- */

const summariseAttendance = (records) => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const month = records.filter((r) => dayKey(r.date).slice(0, 7) === monthKey);
  const count = (status) => month.filter((r) => r.status === status).length;
  const present = count("present");
  const late = count("late");
  const absent = count("absent");
  const excused = count("excused");
  const total = month.length;

  const byDay = new Map();
  records.forEach((r) => {
    const key = dayKey(r.date);
    if (!key) return;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(r.status);
  });
  const days = [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, statuses]) => ({
      date,
      sessions: statuses.length,
      attended: statuses.filter((s) => s === "present" || s === "late").length,
      status: dayStatus(statuses),
    }));
  const monthDays = days.filter((d) => d.date.slice(0, 7) === monthKey).length;

  return {
    total,
    present,
    late,
    absent,
    excused,
    monthDays,
    // the backend's attendance percentage counts late as attended
    pct: total > 0 ? Math.round(((present + late) / total) * 100) : null,
    recentDays: days.slice(-14),
  };
};

const groupResults = (results) => {
  const groups = new Map();
  results.forEach((r) => {
    const key =
      r.examId?._id ||
      `${r.examType || "exam"}-${r.examName || ""}-${r.academicYear || ""}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        name:
          r.examId?.name ||
          r.examName ||
          EXAM_TYPE_LABEL[r.examType] ||
          "Examination",
        date: r.examId?.startDate || r.publishedAt || r.createdAt,
        publishedAt: r.publishedAt || r.updatedAt || r.createdAt,
        subjects: [],
      });
    }
    const max = Number(r.maxMarks) || 0;
    const marks = Number(r.marksObtained) || 0;
    const pct =
      r.percentage != null
        ? Number(r.percentage)
        : max > 0
          ? (marks / max) * 100
          : 0;
    const passed =
      r.isPassed != null
        ? r.isPassed
        : r.status
          ? r.status === "Pass"
          : marks >= (r.passingMarks || 0);
    groups.get(key).subjects.push({
      id: r._id,
      subject: r.subjectId?.name || "Subject",
      code: r.subjectId?.code,
      marks,
      max,
      pct: Math.round(pct),
      grade: r.grade || gradeFor(pct),
      passed,
    });
  });

  return [...groups.values()]
    .map((g) => {
      const marks = g.subjects.reduce((s, x) => s + x.marks, 0);
      const max = g.subjects.reduce((s, x) => s + x.max, 0);
      const pct = max > 0 ? Math.round((marks / max) * 100) : 0;
      return {
        ...g,
        marks,
        max,
        pct,
        grade: gradeFor(pct),
        failed: g.subjects.filter((s) => !s.passed).length,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/* ---------- page ---------- */

const ParentDashboard = () => {
  const { userName } = useAuth();
  const now = useNow();
  const { events, loading: eventsLoading } = useRoleEvents("parent");

  const [base, setBase] = useState({
    loading: true,
    failed: false,
    children: [],
    schedules: { ok: true, list: [] },
  });
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(EMPTY_DETAIL);
  const [examPick, setExamPick] = useState(null);

  const loadChildren = useCallback(async () => {
    setBase((b) => ({ ...b, loading: true, failed: false }));
    const [childrenR, schedulesR] = await Promise.all([
      settle(getMyChildren()),
      settle(scheduleService.getParentSchedules()),
    ]);
    setBase({
      loading: false,
      failed: !childrenR.ok,
      children: childrenR.ok ? childrenR.res?.data || [] : [],
      schedules: schedulesR.ok
        ? { ok: true, list: schedulesR.res?.data?.children || [] }
        : { ok: false, list: [] },
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    loadChildren();
  }, [loadChildren]);

  const { children } = base;
  const child = children.find((c) => c._id === selectedId) || children[0];
  const childId = child?._id;

  // per-child data: reloads whenever the selected child changes
  useEffect(() => {
    if (!childId) return undefined;
    let alive = true;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 27);
    const monthStart = new Date(end.getFullYear(), end.getMonth(), 1);
    const from = monthStart < start ? monthStart : start;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    setDetail((d) => ({ ...d, childId, loading: true }));
    Promise.all([
      settle(
        getChildAttendance(childId, {
          startDate: isoDay(from),
          endDate: isoDay(end),
        }),
      ),
      settle(getChildExamResults(childId)),
      settle(getFeesByStudent(childId)),
    ]).then(([attendanceR, resultsR, feesR]) => {
      if (!alive) return;
      setDetail({
        childId,
        loading: false,
        attendance: {
          ok: attendanceR.ok,
          data: attendanceR.ok ? attendanceR.res?.data || [] : [],
        },
        results: {
          ok: resultsR.ok,
          data: resultsR.ok ? resultsR.res?.data || [] : [],
        },
        fees: {
          ok: feesR.ok,
          data: feesR.ok ? feesR.res?.data || [] : [],
          summary: feesR.ok ? feesR.res?.summary || null : null,
        },
      });
    });
    return () => {
      alive = false;
    };
  }, [childId]);

  const detailLoading = detail.loading || detail.childId !== childId;

  const attendance = useMemo(
    () => summariseAttendance(detail.attendance.data),
    [detail.attendance.data],
  );
  const exams = useMemo(
    () => groupResults(detail.results.data),
    [detail.results.data],
  );

  const fees = useMemo(() => {
    const list = detail.fees.data;
    const s = detail.fees.summary;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalAmount =
      s?.totalAmount ?? list.reduce((a, f) => a + (f.totalAmount || 0), 0);
    const totalPaid =
      s?.totalPaid ?? list.reduce((a, f) => a + (f.amountPaid || 0), 0);
    const totalBalance =
      s?.totalBalance ?? list.reduce((a, f) => a + (f.balanceDue || 0), 0);
    const outstanding = list
      .filter((f) => f.paymentStatus !== "paid" && (f.balanceDue || 0) > 0)
      .map((f) => ({
        ...f,
        isOverdue:
          f.paymentStatus === "overdue" ||
          (f.dueDate && new Date(f.dueDate) < today),
      }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return {
      count: list.length,
      totalAmount,
      totalPaid,
      totalBalance,
      paidPct:
        totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : null,
      outstanding,
      overdue: outstanding.filter((f) => f.isOverdue).length,
      payments: list.filter((f) => f.paidDate && f.amountPaid > 0),
    };
  }, [detail.fees]);

  const activity = useMemo(() => {
    const items = [];
    attendance.recentDays.slice(-4).forEach((d) => {
      const ui = DAY_UI[d.status];
      items.push({
        key: `att-${d.date}`,
        date: d.date,
        icon: ClipboardCheck,
        tone: ui.tone,
        title: `Attendance: ${ui.label.toLowerCase()}`,
        meta: `${d.attended} of ${d.sessions} ${d.sessions === 1 ? "class" : "classes"} attended`,
      });
    });
    exams.slice(0, 3).forEach((e) => {
      items.push({
        key: `exam-${e.id}`,
        date: e.publishedAt,
        icon: Trophy,
        tone: "orange",
        title: `Results published: ${e.name}`,
        meta: `${e.pct}% overall · Grade ${e.grade}`,
      });
    });
    fees.payments.slice(0, 3).forEach((f) => {
      items.push({
        key: `fee-${f._id}`,
        date: f.paidDate,
        icon: Receipt,
        tone: "teal",
        title: `Fee payment: ${f.feeType || "fee"}`,
        meta: `${inr(f.amountPaid)} paid`,
      });
    });
    return items
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [attendance.recentDays, exams, fees.payments]);

  const announcements = upcomingEvents(events, { limit: 5 });

  /* ---------- page states ---------- */

  const parentFirst = firstNameOf(userName);
  const hero = (subtitle, actions) => (
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
      title={`${greetingFor(now)}${parentFirst ? `, ${parentFirst}` : ""}`}
      subtitle={subtitle}
      rightContent={<SchoolIllustration />}>
      {actions}
    </HeroBanner>
  );

  if (base.loading) {
    return (
      <div>
        {hero("Loading your children's school overview…")}
        <div className="ssd-panel mb-5 p-5">
          <Skeleton active avatar paragraph={{ rows: 1 }} />
        </div>
        <div className="ssd-stats ssd-stats--4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ssd-stat">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (base.failed) {
    return (
      <div>
        {hero("We couldn't reach the school data service.")}
        <Panel title="My children" padded>
          <ErrorState
            title="Couldn't load your children"
            description="The school data service didn't respond."
            onRetry={loadChildren}
          />
        </Panel>
      </div>
    );
  }

  if (!child) {
    return (
      <div>
        {hero("No children are linked to your account yet.")}
        <Panel icon={Users} tone="pink" title="My children" padded>
          <PanelEmpty
            icon={Users}
            title="No children linked yet"
            text="Your school administrator links your account to your children. Once they do, attendance, results, fees and the timetable appear here."
          />
        </Panel>
      </div>
    );
  }

  /* ---------- selected child ---------- */

  const childName = child.userId?.name || "Your child";
  const childFirst = firstNameOf(childName) || "your child";
  const classTeacher = child.classId?.classTeacher;
  const teacherUser = classTeacher?.userId;
  const teacherName = teacherUser?.name || classTeacher?.name;
  const teacherEmail = teacherUser?.email || classTeacher?.email;
  const teacherPhone = teacherUser?.phone || classTeacher?.phone;
  const subjects = child.classId?.subjects || [];
  const status = child.enrollmentStatus || child.userId?.status || "active";
  const scheduleMatch = base.schedules.list.find(
    (c) => c?.student?._id === child._id,
  );
  const groupedByDay = scheduleMatch?.groupedByDay || EMPTY_GROUPED;
  const periodCount =
    scheduleMatch?.items?.length ??
    Object.values(groupedByDay).reduce((n, d) => n + (d?.length || 0), 0);

  const latest = exams[0];
  const exam = exams.find((e) => e.id === examPick) || latest;
  const examChoices = exams.slice(0, 4);
  const chartData = (exam?.subjects || []).map((s) => ({
    name: s.code || s.subject,
    subject: s.subject,
    score: s.pct,
    passed: s.passed,
  }));

  const ring = attendance.pct;
  const feeValue = !detail.fees.ok
    ? "—"
    : fees.count > 0
      ? fees.totalBalance
      : "—";
  const feeHint = !detail.fees.ok
    ? "Fee data unavailable"
    : fees.count === 0
      ? "No fee records"
      : fees.overdue > 0
        ? `${fees.overdue} overdue`
        : fees.outstanding.length > 0
          ? `Next due ${shortDate(fees.outstanding[0].dueDate)}`
          : "All fees paid";

  return (
    <div>
      {hero(
        children.length > 1
          ? `${children.length} children are linked to your account. You're viewing ${childFirst}'s school day, results and fees.`
          : `Here's how ${childFirst} is doing${child.classId?.name ? ` in ${child.classId.name}` : ""}: attendance, results, fees and the week ahead.`,
        <div className="flex flex-wrap gap-2.5">
          <Link
            to={`/parent/children/${child._id}`}
            className="ssd-btn ssd-btn--light">
            <UserRound size={16} aria-hidden="true" />
            {childFirst}&apos;s profile
          </Link>
          <Link to="/parent/fees/status" className="ssd-btn ssd-btn--glass">
            <CreditCard size={16} aria-hidden="true" />
            Pay fees
          </Link>
        </div>,
      )}

      {/* child selector + identity */}
      <section className="ssd-panel mb-5" aria-label="Selected child">
        {children.length > 1 && (
          <header className="ssd-panel__head">
            <div className="ssd-panel__title ssd-tone--pink">
              <span className="ssd-panel__icon">
                <Users size={16} aria-hidden="true" />
              </span>
              <div>
                <h2>Your children</h2>
                <p>{children.length} linked · choose whose details to see</p>
              </div>
            </div>
            <div
              className="ssd-seg max-w-full flex-wrap"
              role="group"
              aria-label="Choose a child">
              {children.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => {
                    setSelectedId(c._id);
                    setExamPick(null);
                  }}
                  aria-pressed={c._id === child._id}>
                  {firstNameOf(c.userId?.name) || "Child"}
                  {c.classId?.name && (
                    <span className="ml-1 font-normal text-slate-500">
                      · {c.classId.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </header>
        )}
        <div className="ssd-panel__body flex flex-wrap items-center gap-4">
          <span
            className="ssd-initials ssd-tone--pink"
            style={{ width: 52, height: 52, fontSize: "1rem" }}
            aria-hidden="true">
            {initials(childName)}
          </span>
          <div className="min-w-0 flex-1 basis-56">
            <b className="block text-lg font-semibold">{childName}</b>
            <p className="m-0 text-sm text-slate-500">
              {[
                classLabel(child) || "Class not assigned",
                `Roll ${child.rollNumber || "—"}`,
                child.admissionNumber && `Adm. ${child.admissionNumber}`,
                child.academicYear,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`ssd-chip ssd-chip--dot capitalize ssd-tone--${status === "active" ? "emerald" : "amber"}`}>
              {status}
            </span>
            <Link
              to={`/parent/children/${child._id}`}
              className="ssd-panel__link">
              Full profile
            </Link>
          </div>
        </div>
      </section>

      <div className="ssd-stats ssd-stats--4">
        <StatCard
          title="Attendance this month"
          value={attendance.pct ?? "—"}
          format={pctFormat}
          icon={ClipboardCheck}
          tone="emerald"
          hint={
            attendance.total > 0
              ? `${attendance.present + attendance.late} of ${attendance.total} classes attended`
              : !detail.attendance.ok
                ? "Attendance unavailable"
                : "No classes marked this month"
          }
          to="/parent/attendance"
          loading={detailLoading}
        />
        <StatCard
          title="Latest result"
          value={latest ? latest.pct : "—"}
          format={pctFormat}
          icon={Trophy}
          tone="orange"
          badge={latest ? `Grade ${latest.grade}` : undefined}
          hint={
            latest
              ? latest.name
              : detail.results.ok
                ? "No published results"
                : "Results unavailable"
          }
          to="/parent/performance/grades"
          loading={detailLoading}
        />
        <StatCard
          title="Fee balance"
          value={feeValue}
          format={inr}
          icon={Wallet}
          tone="teal"
          badge={fees.overdue > 0 ? "Overdue" : undefined}
          hint={feeHint}
          to="/parent/fees/status"
          loading={detailLoading}
        />
        <StatCard
          title="Subjects"
          value={subjects.length}
          icon={BookOpen}
          tone="sky"
          hint={teacherName ? `Class teacher: ${teacherName}` : undefined}
          to={`/parent/child-schedule?child=${child._id}`}
        />
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={GraduationCap}
          tone="orange"
          title="Academic performance"
          subtitle={
            exam
              ? `${exam.name} · score by subject`
              : "Published exam results by subject"
          }
          actions={
            examChoices.length > 1 && (
              <div
                className="ssd-seg max-w-full flex-wrap"
                role="group"
                aria-label="Choose an exam">
                {examChoices.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={e.id === exam?.id}
                    onClick={() => setExamPick(e.id)}>
                    {e.name}
                  </button>
                ))}
              </div>
            )
          }
          link={{ to: "/parent/performance/grades", label: "Results" }}
          padded>
          {detailLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : chartData.length ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                <span>
                  <b className="text-2xl font-bold tabular-nums">{exam.pct}%</b>{" "}
                  <span className="text-slate-500">overall</span>
                </span>
                <span className="text-slate-500">
                  {exam.marks} / {exam.max} marks
                </span>
                <span
                  className={`ssd-chip ssd-chip--dot ssd-tone--${exam.failed ? "red" : "emerald"}`}>
                  {exam.failed
                    ? `${exam.failed} subject${exam.failed > 1 ? "s" : ""} below pass`
                    : "Passed all subjects"}
                </span>
              </div>
              <div className="ssd-chart" style={{ height: 240 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
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
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      tickFormatter={pctFormat}
                    />
                    <Tooltip
                      content={<ChartTooltip format={(v) => `${v}%`} />}
                      labelFormatter={(_, p) => p?.[0]?.payload?.subject}
                      cursor={{ fill: "var(--ssl-sunken)" }}
                    />
                    <Bar
                      dataKey="score"
                      name="Score"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={44}
                      animationDuration={900}>
                      {chartData.map((d) => (
                        <Cell
                          key={d.subject}
                          fill={chartColor(d.passed ? "orange" : "red")}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <PanelEmpty
              icon={GraduationCap}
              title={
                detail.results.ok
                  ? "No published results yet"
                  : "Results unavailable"
              }
              text={`${childFirst}'s marks appear here once the school publishes an exam.`}
            />
          )}
        </Panel>

        <Panel
          icon={ClipboardCheck}
          tone="emerald"
          title="Attendance"
          subtitle={
            attendance.monthDays
              ? `This month · ${attendance.monthDays} school day${attendance.monthDays === 1 ? "" : "s"} recorded`
              : "This month"
          }
          link={{ to: "/parent/attendance", label: "Full record" }}
          padded>
          {detailLoading ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : !detail.attendance.ok ? (
            <PanelEmpty
              icon={ClipboardCheck}
              title="Attendance unavailable"
              text="The attendance service didn't respond."
            />
          ) : attendance.recentDays.length ? (
            <div className="grid gap-5">
              {attendance.total > 0 ? (
                <div className="flex flex-wrap items-center gap-5">
                  <ProgressRing
                    value={ring}
                    tone={rateTone(ring)}
                    sublabel="attended"
                    size={112}
                  />
                  <dl className="m-0 grid min-w-[150px] flex-1 grid-cols-2 gap-2">
                    {[
                      ["Present", attendance.present, "emerald"],
                      ["Late", attendance.late, "amber"],
                      ["Absent", attendance.absent, "red"],
                      ["Excused", attendance.excused, "sky"],
                    ].map(([label, value, t]) => (
                      <div
                        key={label}
                        className={`rounded-xl bg-slate-50 px-3 py-2 ssd-tone--${t}`}>
                        <dt className="ssd-chip ssd-chip--dot mb-1">{label}</dt>
                        <dd className="m-0 text-lg font-bold tabular-nums">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="m-0 text-sm text-slate-500">
                  No attendance marked yet this month.
                </p>
              )}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last {attendance.recentDays.length} school day
                  {attendance.recentDays.length === 1 ? "" : "s"}
                </p>
                <ol className="m-0 grid list-none grid-cols-7 gap-1.5 p-0">
                  {attendance.recentDays.map((d) => {
                    const ui = DAY_UI[d.status];
                    const date = new Date(`${d.date}T00:00:00`);
                    const label = `${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}: ${ui.label}, ${d.attended} of ${d.sessions} classes`;
                    return (
                      <li
                        key={d.date}
                        title={label}
                        className={`grid h-11 place-items-center rounded-lg border border-[var(--tone-line)] bg-[var(--tone-bg)] text-[var(--tone-ink)] ssd-tone--${ui.tone}`}>
                        <span className="sr-only">{label}</span>
                        <span
                          aria-hidden="true"
                          className="grid text-center leading-tight">
                          <small className="text-[0.6rem] font-semibold uppercase opacity-80">
                            {date.toLocaleDateString("en-US", {
                              weekday: "narrow",
                            })}
                          </small>
                          <b className="text-sm tabular-nums">
                            {date.getDate()}
                          </b>
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <ul className="ssd-legend mt-3">
                  {Object.entries(DAY_UI)
                    .filter(([key]) =>
                      attendance.recentDays.some((d) => d.status === key),
                    )
                    .map(([key, ui]) => (
                      <li key={key} className={`ssd-tone--${ui.tone}`}>
                        <i /> {ui.label}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ) : (
            <PanelEmpty
              icon={ClipboardCheck}
              title="No attendance recorded yet"
              text="Teachers mark attendance for each class."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3">
        <Panel
          icon={Trophy}
          tone="orange"
          title="Examination results"
          subtitle="Published results"
          link={{ to: "/parent/performance/grades", label: "All results" }}>
          {detailLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : exams.length ? (
            <ul className="ssd-list">
              {exams.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <span
                    className={`ssd-initials ssd-tone--${e.failed ? "red" : "orange"}`}>
                    {e.grade}
                  </span>
                  <div className="ssd-list__main">
                    <b>{e.name}</b>
                    <small>
                      {e.subjects.length} subject
                      {e.subjects.length === 1 ? "" : "s"} · {e.marks}/{e.max}{" "}
                      marks
                    </small>
                  </div>
                  <span className="text-right">
                    <b className="block text-sm tabular-nums">{e.pct}%</b>
                    <span
                      className={`ssd-chip ssd-tone--${e.failed ? "red" : "emerald"}`}>
                      {e.failed ? `${e.failed} failed` : "Passed"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={Trophy}
              title={
                detail.results.ok
                  ? "No published results yet"
                  : "Results unavailable"
              }
            />
          )}
        </Panel>

        <Panel
          icon={Wallet}
          tone="teal"
          title="Fee status"
          subtitle={
            fees.count
              ? `${fees.count} fee record${fees.count === 1 ? "" : "s"}`
              : undefined
          }
          link={{ to: "/parent/fees/status", label: "Pay fees" }}>
          {detailLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : !detail.fees.ok ? (
            <PanelEmpty icon={Wallet} title="Fee data unavailable" />
          ) : fees.count ? (
            <>
              <div
                className="ssd-panel__body grid content-start gap-3"
                style={{ flex: "none" }}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-slate-500">
                    {inr(fees.totalPaid)} of {inr(fees.totalAmount)} paid
                  </span>
                  <b className="tabular-nums">{fees.paidPct ?? 0}%</b>
                </div>
                <div
                  className={`ssd-meter ssd-tone--${fees.overdue ? "red" : fees.totalBalance > 0 ? "amber" : "emerald"}`}
                  role="progressbar"
                  aria-valuenow={fees.paidPct ?? 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Fees paid">
                  <i style={{ "--w": `${fees.paidPct ?? 0}%` }} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-500">Balance due</span>
                  <b
                    className={`text-lg tabular-nums ${fees.totalBalance > 0 ? "text-[var(--tone-ink)] ssd-tone--" + (fees.overdue ? "red" : "amber") : ""}`}>
                    {inr(fees.totalBalance)}
                  </b>
                </div>
              </div>
              {fees.outstanding.length ? (
                <ul className="ssd-list border-t border-[var(--ssl-line)]">
                  {fees.outstanding.slice(0, 3).map((f) => (
                    <li key={f._id}>
                      <span
                        className={`ssd-date-tile ssd-tone--${f.isOverdue ? "red" : "teal"}`}>
                        <small>
                          {new Date(f.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </small>
                        <b>{new Date(f.dueDate).getDate()}</b>
                      </span>
                      <div className="ssd-list__main">
                        <b className="capitalize">
                          {f.description || `${f.feeType} fee`}
                        </b>
                        <small>
                          {inr(f.balanceDue)} left · due {shortDate(f.dueDate)}
                        </small>
                      </div>
                      <span
                        className={`ssd-chip capitalize ssd-tone--${f.isOverdue ? "red" : FEE_STATUS_TONE[f.paymentStatus] || "slate"}`}>
                        {f.isOverdue ? "overdue" : f.paymentStatus}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 border-t border-[var(--ssl-line)] px-5 py-4 text-sm text-slate-500">
                  Nothing outstanding — all fees are paid.
                </p>
              )}
            </>
          ) : (
            <PanelEmpty
              icon={Wallet}
              title="No fee records"
              text={`The school hasn't issued any fees for ${childFirst} yet.`}
            />
          )}
        </Panel>

        <Panel
          icon={Megaphone}
          tone="amber"
          title="Coming up"
          subtitle="Events and announcements"
          link={{ to: "/parent/calendar", label: "Calendar" }}>
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
              text="School events, exams and holidays will show here."
            />
          )}
        </Panel>
      </div>

      <div className="mb-5">
        <Panel
          icon={CalendarDays}
          tone="sky"
          title="Weekly timetable"
          subtitle={
            periodCount
              ? `${periodCount} periods a week · ${classLabel(child)}`
              : classLabel(child) || undefined
          }
          link={{
            to: `/parent/child-schedule?child=${child._id}`,
            label: "Open schedule",
          }}
          padded>
          {!base.schedules.ok ? (
            <PanelEmpty icon={CalendarDays} title="Timetable unavailable" />
          ) : periodCount ? (
            <ScheduleView
              groupedByDay={groupedByDay}
              showTeacher={true}
              showClass={false}
            />
          ) : (
            <PanelEmpty
              icon={CalendarDays}
              title="No timetable published yet"
              text={`${childFirst}'s weekly classes will appear here once the school publishes them.`}
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3">
        <Panel icon={Activity} tone="indigo" title="Recent activity">
          {detailLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : activity.length ? (
            <ul className="ssd-list">
              {activity.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.key}>
                    <span className={`ssd-initials ssd-tone--${a.tone}`}>
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <div className="ssd-list__main">
                      <b>{a.title}</b>
                      <small>
                        {a.meta} · {relativeDay(a.date)}
                      </small>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={Activity}
              title="No recent activity"
              text="Attendance, results and payments will show here."
            />
          )}
        </Panel>

        <Panel icon={UserRound} tone="violet" title="Class teacher" padded>
          {classTeacher ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <span className="ssd-initials ssd-tone--violet">
                  {initials(teacherName)}
                </span>
                <div className="min-w-0">
                  <b className="block truncate font-semibold">
                    {teacherName || "Class teacher"}
                  </b>
                  <small className="text-slate-500">
                    {classLabel(child) || "Class teacher"}
                  </small>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                {teacherEmail && (
                  <a
                    href={`mailto:${teacherEmail}`}
                    className="inline-flex min-w-0 items-center gap-2 text-slate-600 hover:text-[var(--role)]">
                    <Mail size={15} aria-hidden="true" className="flex-none" />
                    <span className="truncate">{teacherEmail}</span>
                  </a>
                )}
                {teacherPhone && (
                  <a
                    href={`tel:${teacherPhone}`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-[var(--role)]">
                    <Phone size={15} aria-hidden="true" />
                    {teacherPhone}
                  </a>
                )}
                {child.classId?.roomNumber && (
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <DoorOpen size={15} aria-hidden="true" />
                    Room {child.classId.roomNumber}
                  </span>
                )}
              </div>
              {teacherEmail && (
                <a
                  href={`mailto:${teacherEmail}`}
                  className="ssd-btn ssd-btn--ghost w-full">
                  <Mail size={16} aria-hidden="true" />
                  Email {firstNameOf(teacherName) || "teacher"}
                </a>
              )}
            </div>
          ) : (
            <PanelEmpty
              icon={UserRound}
              title="Not assigned yet"
              text="The school hasn't assigned a class teacher."
            />
          )}
        </Panel>

        <Panel
          icon={BookOpen}
          tone="sky"
          title="Subjects"
          subtitle={
            subjects.length ? `${subjects.length} this year` : undefined
          }>
          {subjects.length > 0 ? (
            <ul className="ssd-list">
              {subjects.map((subject, index) => {
                const name = subject?.name || String(subject);
                const score = exam?.subjects.find((s) => s.subject === name);
                return (
                  <li key={subject?._id || index}>
                    <span className="ssd-initials ssd-tone--sky">
                      {initials(name)}
                    </span>
                    <div className="ssd-list__main">
                      <b>{name}</b>
                      {subject?.code && <small>{subject.code}</small>}
                    </div>
                    {score && (
                      <span
                        className={`ssd-chip ssd-tone--${score.passed ? "orange" : "red"}`}
                        title={`${exam.name}: ${score.marks}/${score.max}`}>
                        {score.pct}%
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty icon={BookOpen} title="No subjects listed" />
          )}
        </Panel>
      </div>

      <Panel
        title="Quick actions"
        subtitle={`Keep up with ${childFirst}'s schooling`}
        padded>
        <div className="ssd-actions">
          {QUICK_ACTIONS.parent.map((a) => (
            <QuickActionCard
              key={a.key}
              to={
                a.key === "schedule" ? `${a.path}?child=${child._id}` : a.path
              }
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

export default ParentDashboard;
