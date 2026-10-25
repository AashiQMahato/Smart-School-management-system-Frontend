import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { DEMO_TABS } from "../data";
import { useTabs } from "../hooks";
import { Reveal, SampleTag, SectionHeader } from "./primitives";

/* Everything below is local sample state — no API calls. */

const STATUS = ["present", "late", "absent"];
const START_ROSTER = [
  { name: "Aarav Kumar", status: "present" },
  { name: "Diya Sharma", status: "present" },
  { name: "Kabir Malhotra", status: "late" },
  { name: "Meera Iyer", status: "present" },
  { name: "Sara Mehta", status: "absent" },
  { name: "Vivaan Rao", status: "present" },
];

const AttendanceView = () => {
  const [roster, setRoster] = useState(START_ROSTER);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        STATUS.map((s) => [s, roster.filter((r) => r.status === s).length]),
      ),
    [roster],
  );

  const cycle = (name) =>
    setRoster((list) =>
      list.map((r) =>
        r.name === name
          ? { ...r, status: STATUS[(STATUS.indexOf(r.status) + 1) % 3] }
          : r,
      ),
    );

  return (
    <div className="ssl-dv">
      <div className="ssl-dv__summary" aria-live="polite">
        {STATUS.map((s) => (
          <span key={s} className={`ssl-dv__stat ssl-dv__stat--${s}`}>
            <b>{counts[s]}</b> {s}
          </span>
        ))}
      </div>
      <p className="ssl-dv__hint">
        Class 8-B · tap a student to change their status
      </p>
      <ul className="ssl-dv__roster">
        {roster.map((r) => (
          <li key={r.name}>
            <button
              type="button"
              onClick={() => cycle(r.name)}
              aria-label={`${r.name}: ${r.status}. Change status`}>
              <span className="ssl-avatar ssl-avatar--sm">
                {r.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <span className="ssl-dv__name">{r.name}</span>
              <span className={`ssl-pill ssl-pill--${r.status}`}>
                {r.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DIRECTORY = [
  { name: "Aarav Kumar", cls: "8-B", parent: "Rajesh Kumar" },
  { name: "Ananya Gupta", cls: "8-B", parent: "Neha Gupta" },
  { name: "Ishaan Verma", cls: "9-A", parent: "Amit Verma" },
  { name: "Meera Iyer", cls: "7-C", parent: "Lakshmi Iyer" },
  { name: "Rohan Joshi", cls: "9-A", parent: "—" },
  { name: "Zara Khan", cls: "6-A", parent: "Imran Khan" },
];

const StudentsView = () => {
  const [query, setQuery] = useState("");
  const results = DIRECTORY.filter((s) =>
    `${s.name} ${s.cls}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="ssl-dv">
      <label className="ssl-dv__search">
        <Search size={15} aria-hidden="true" />
        <span className="ssl-sr">Search sample students</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or class…"
        />
      </label>
      <table className="ssl-dv__table">
        <thead>
          <tr>
            <th scope="col">Student</th>
            <th scope="col">Class</th>
            <th scope="col">Parent</th>
          </tr>
        </thead>
        <tbody>
          {results.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>
                <span className="ssl-chip ssl-tone--blue">{s.cls}</span>
              </td>
              <td className={s.parent === "—" ? "ssl-muted" : ""}>
                {s.parent}
              </td>
            </tr>
          ))}
          {!results.length && (
            <tr>
              <td colSpan={3} className="ssl-muted">
                No students match “{query}”.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const PIPELINE = [
  { stage: "Assigned", n: 34, tone: "blue" },
  { stage: "Submitted", n: 27, tone: "amber" },
  { stage: "Graded", n: 18, tone: "teal" },
];

const AssignmentsView = () => {
  const [graded, setGraded] = useState(false);
  return (
    <div className="ssl-dv">
      <div className="ssl-dv__assign-head">
        <div>
          <b>Physics · Light & Reflection</b>
          <small>Class 8-B · due Friday</small>
        </div>
        <span className="ssl-chip ssl-tone--indigo">Lab report</span>
      </div>
      <div className="ssl-dv__pipeline">
        {PIPELINE.map((p) => (
          <div key={p.stage} className={`ssl-tone--${p.tone}`}>
            <b>{p.stage === "Graded" && graded ? p.n + 1 : p.n}</b>
            <span>{p.stage}</span>
            <i
              style={{
                "--w": `${((p.stage === "Graded" && graded ? p.n + 1 : p.n) / 34) * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="ssl-dv__submission">
        <span className="ssl-avatar ssl-avatar--sm">DS</span>
        <div>
          <b>Diya Sharma</b>
          <small>Submitted · lab-report.pdf</small>
        </div>
        <button
          type="button"
          className={`ssl-dv__grade ${graded ? "is-done" : ""}`}
          onClick={() => setGraded((g) => !g)}
          aria-pressed={graded}>
          {graded ? (
            <>
              <Check size={14} aria-hidden="true" /> Graded · A
            </>
          ) : (
            "Grade submission"
          )}
        </button>
      </div>
    </div>
  );
};

const NOTICES = [
  {
    type: "exam",
    title: "Mid-term examinations",
    date: "28 Oct",
    meta: "Grades 6–10",
  },
  {
    type: "announcement",
    title: "Library open on Saturdays",
    date: "30 Oct",
    meta: "All students",
  },
  {
    type: "holiday",
    title: "Founders' Day holiday",
    date: "1 Nov",
    meta: "School closed",
  },
  {
    type: "event",
    title: "Annual science fair",
    date: "8 Nov",
    meta: "Main hall",
  },
  {
    type: "announcement",
    title: "Parent–teacher meeting",
    date: "15 Nov",
    meta: "Grades 6–8",
  },
];
const NOTICE_FILTERS = [
  ["all", "All"],
  ["exam", "Exams"],
  ["announcement", "Announcements"],
  ["holiday", "Holidays"],
  ["event", "Events"],
];
const NOTICE_TONE = {
  exam: "coral",
  announcement: "indigo",
  holiday: "teal",
  event: "blue",
};

const NoticesView = () => {
  const [filter, setFilter] = useState("all");
  const shown = NOTICES.filter((n) => filter === "all" || n.type === filter);

  return (
    <div className="ssl-dv">
      <div
        className="ssl-dv__filters"
        role="group"
        aria-label="Filter sample notices">
        {NOTICE_FILTERS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>
      <ul className="ssl-dv__notices">
        {shown.map((n) => (
          <li key={n.title}>
            <span className={`ssl-dv__date ssl-tone--${NOTICE_TONE[n.type]}`}>
              <b>{n.date.split(" ")[0]}</b>
              {n.date.split(" ")[1]}
            </span>
            <div>
              <b>{n.title}</b>
              <small>{n.meta}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const VIEWS = {
  attendance: AttendanceView,
  students: StudentsView,
  assignments: AssignmentsView,
  notices: NoticesView,
};

const TAB_KEYS = DEMO_TABS.map((t) => t.key);

const ProductDemo = () => {
  const { active, setActive, onKeyDown, registerTab } = useTabs(TAB_KEYS);
  const tab = DEMO_TABS.find((t) => t.key === active);
  const View = VIEWS[active];

  return (
    <section
      id="demo"
      className="ssl-section ssl-demo"
      aria-labelledby="ssl-demo-title">
      <div className="ssl-container">
        <SectionHeader
          id="ssl-demo-title"
          eyebrow="See it in action"
          title="From Daily Tasks to a Smoother School Day."
          text="Try a simplified preview of everyday workflows. It runs on sample data in your browser and isn't connected to any school."
        />

        <Reveal className="ssl-demo__box">
          <div
            className="ssl-demo__tabs"
            role="tablist"
            aria-label="Product areas"
            onKeyDown={onKeyDown}>
            {DEMO_TABS.map(({ key, label, icon }) => {
              const Icon = icon;
              return (
                <button
                  key={key}
                  ref={registerTab(key)}
                  type="button"
                  role="tab"
                  id={`ssl-demo-tab-${key}`}
                  aria-selected={active === key}
                  aria-controls="ssl-demo-panel"
                  tabIndex={active === key ? 0 : -1}
                  onClick={() => setActive(key)}>
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>

          <div
            id="ssl-demo-panel"
            role="tabpanel"
            aria-labelledby={`ssl-demo-tab-${active}`}
            className="ssl-demo__panel">
            <div className="ssl-demo__copy" key={`copy-${active}`}>
              <h3 className="ssl-h3">{tab.title}</h3>
              <p>{tab.text}</p>
              <ul className="ssl-checks">
                {tab.bullets.map((b) => (
                  <li key={b}>
                    <Check size={16} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ssl-demo__screen">
              <div className="ssl-pv__chrome">
                <span>{tab.label}</span>
                <SampleTag />
              </div>
              <div className="ssl-demo__view" key={`view-${active}`}>
                <View />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ProductDemo;
