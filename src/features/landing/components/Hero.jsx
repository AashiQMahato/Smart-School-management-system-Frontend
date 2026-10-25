import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChartColumn,
  CircleCheck,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Megaphone,
  Users,
  Wallet,
} from "lucide-react";
import { useAppEntry, prefersReducedMotion } from "../hooks";
import { CtaLink, SampleTag } from "./primitives";
import { Donut, MiniBars, MiniLine } from "./MiniCharts";

const WEEK = [
  { label: "Mon", value: 92 },
  { label: "Tue", value: 95 },
  { label: "Wed", value: 89 },
  { label: "Thu", value: 96, highlight: true },
  { label: "Fri", value: 93 },
];

const TERM_AVG = [68, 71, 70, 74, 73, 77, 79, 78, 82];

const KPIS = [
  { icon: Users, label: "Students", value: "1,248", tone: "blue" },
  { icon: LayoutDashboard, label: "Teachers", value: "86", tone: "indigo" },
  {
    icon: ClipboardCheck,
    label: "Present today",
    value: "94.6%",
    tone: "teal",
  },
  { icon: FileText, label: "Assignments due", value: "12", tone: "amber" },
];

const NOTICES = [
  {
    tag: "Exam",
    tone: "coral",
    title: "Mid-term exams begin",
    when: "Mon, 9:00",
  },
  {
    tag: "Event",
    tone: "blue",
    title: "Annual science fair",
    when: "Fri, 11:00",
  },
  {
    tag: "Holiday",
    tone: "teal",
    title: "Founders' Day holiday",
    when: "Nov 1",
  },
];

const TODAY = [
  { time: "08:30", subject: "Mathematics", room: "8-B" },
  { time: "09:20", subject: "Physics", room: "Lab 2" },
  { time: "10:30", subject: "English", room: "8-B" },
];

const SIDEBAR = [
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ChartColumn,
  CalendarDays,
  Wallet,
];

/** Restrained pointer parallax: writes CSS variables, never React state. */
const useParallax = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      prefersReducedMotion() ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return undefined;

    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty(
          "--px",
          ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
        );
        el.style.setProperty(
          "--py",
          ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
        );
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", 0);
      el.style.setProperty("--py", 0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
};

const HeroShowcase = () => {
  const ref = useParallax();

  return (
    <div className="ssl-show" ref={ref}>
      <div
        className="ssl-show__window"
        role="img"
        aria-label="Preview of the Smart School admin dashboard with sample data: student and teacher counts, weekly attendance, academic performance trend, notices, and today's timetable.">
        <div className="ssl-show__chrome" aria-hidden="true">
          <span className="ssl-show__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="ssl-show__url">Admin dashboard</span>
          <SampleTag />
        </div>

        <div className="ssl-show__body" aria-hidden="true">
          <aside className="ssl-show__side">
            {SIDEBAR.map((Icon, i) => (
              <span key={i} className={i === 0 ? "is-active" : ""}>
                <Icon size={16} />
              </span>
            ))}
          </aside>

          <div className="ssl-show__main">
            <div className="ssl-show__greet">
              <div>
                <p className="ssl-show__muted">Thursday, 24 October</p>
                <p className="ssl-show__title">Good morning, Principal</p>
              </div>
              <span className="ssl-show__bell">
                <Bell size={15} />
              </span>
            </div>

            <div className="ssl-show__kpis">
              {KPIS.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.label}
                    className={`ssl-kpi ssl-tone--${kpi.tone}`}>
                    <span className="ssl-kpi__icon">
                      <Icon size={14} />
                    </span>
                    <span className="ssl-kpi__value">{kpi.value}</span>
                    <span className="ssl-kpi__label">{kpi.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="ssl-show__grid">
              <div className="ssl-card ssl-show__att">
                <div className="ssl-card__head">
                  <span>Attendance this week</span>
                  <b>93.0%</b>
                </div>
                <MiniBars data={WEEK} color="var(--ssl-teal)" height={78} />
              </div>

              <div className="ssl-card ssl-show__perf">
                <div className="ssl-card__head">
                  <span>Average score · Term 1</span>
                  <b className="ssl-up">+14 pts</b>
                </div>
                <MiniLine values={TERM_AVG} height={84} />
              </div>

              <div className="ssl-card ssl-show__notices">
                <div className="ssl-card__head">
                  <span>Notices</span>
                  <Megaphone size={13} />
                </div>
                <ul>
                  {NOTICES.map((n) => (
                    <li key={n.title}>
                      <em className={`ssl-chip ssl-tone--${n.tone}`}>
                        {n.tag}
                      </em>
                      <span>{n.title}</span>
                      <small>{n.when}</small>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ssl-card ssl-show__today">
                <div className="ssl-card__head">
                  <span>Today</span>
                  <CalendarDays size={13} />
                </div>
                <ol>
                  {TODAY.map((t, i) => (
                    <li key={t.time} className={i === 1 ? "is-now" : ""}>
                      <time>{t.time}</time>
                      <span>{t.subject}</span>
                      <small>{t.room}</small>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ssl-float ssl-float--a" aria-hidden="true">
        <span className="ssl-float__icon ssl-tone--teal">
          <CircleCheck size={16} />
        </span>
        <div>
          <b>Attendance saved</b>
          <small>Class 8-B · 32 of 34 present</small>
        </div>
      </div>

      <div className="ssl-float ssl-float--b" aria-hidden="true">
        <Donut value={82} size={46} stroke={6} color="var(--ssl-indigo)">
          82
        </Donut>
        <div>
          <b>Results published</b>
          <small>Grade 8 · Term 1</small>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const entry = useAppEntry();

  return (
    <section id="home" className="ssl-hero" aria-labelledby="ssl-hero-title">
      <div className="ssl-hero__bg" aria-hidden="true" />
      <div className="ssl-container ssl-hero__inner">
        <div className="ssl-hero__copy">
          <p className="ssl-eyebrow ssl-enter" style={{ "--d": 0 }}>
            <span className="ssl-eyebrow__dot" />A smarter way to manage
            education
          </p>
          <h1
            id="ssl-hero-title"
            className="ssl-h1 ssl-enter"
            style={{ "--d": 1 }}>
            Every School.
            <br />
            <span>One Smarter System.</span>
          </h1>
          <p className="ssl-hero__lead ssl-enter" style={{ "--d": 2 }}>
            Bring students, teachers, parents, and school administration
            together with one intuitive platform for everyday school operations.
          </p>
          <div className="ssl-hero__ctas ssl-enter" style={{ "--d": 3 }}>
            <CtaLink to={entry.to} size="lg">
              {entry.isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight size={18} aria-hidden="true" />
            </CtaLink>
            <CtaLink to="#features" variant="secondary" size="lg">
              Explore Features
            </CtaLink>
          </div>
          <ul
            className="ssl-hero__roles ssl-enter"
            style={{ "--d": 4 }}
            aria-label="Built for">
            <li data-role="admin">Admins</li>
            <li data-role="teacher">Teachers</li>
            <li data-role="student">Students</li>
            <li data-role="parent">Parents</li>
          </ul>
        </div>

        <div
          className="ssl-hero__visual ssl-enter ssl-enter--visual is-in"
          style={{ "--d": 2 }}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
};

export default Hero;
