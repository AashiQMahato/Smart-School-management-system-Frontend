import { Check } from "lucide-react";
import { ROLES } from "../data";
import { useTabs } from "../hooks";
import { Reveal, SampleTag, SectionHeader } from "./primitives";
import { Donut } from "./MiniCharts";

const AdminPreview = () => (
  <>
    <p className="ssl-pv__title">School overview</p>
    <div className="ssl-pv__users">
      {[
        ["Students", 1248, 70],
        ["Parents", 1102, 62],
        ["Teachers", 86, 18],
        ["Classes", 32, 12],
      ].map(([label, n, w]) => (
        <div key={label} className="ssl-pv__meter">
          <span>{label}</span>
          <i style={{ "--w": `${w}%` }} />
          <b>{n.toLocaleString("en-US")}</b>
        </div>
      ))}
    </div>
    <ul className="ssl-pv__tasks">
      <li>
        <span className="ssl-chip ssl-tone--amber">To do</span>3 teachers
        without a class assignment
      </li>
      <li>
        <span className="ssl-chip ssl-tone--blue">Timetable</span>Grade 9
        schedule ready to publish
      </li>
    </ul>
  </>
);

const TEACHER_ROWS = [
  ["Aarav K.", "p"],
  ["Diya S.", "p"],
  ["Kabir M.", "l"],
  ["Sara M.", "a"],
];

const TeacherPreview = () => (
  <>
    <p className="ssl-pv__title">
      Mark attendance <small>Class 8-B · Period 1</small>
    </p>
    <ul className="ssl-pv__att">
      {TEACHER_ROWS.map(([name, s]) => (
        <li key={name}>
          <span className="ssl-avatar ssl-avatar--sm">{name.slice(0, 1)}</span>
          {name}
          <span className="ssl-seg">
            {["p", "l", "a"].map((v) => (
              <i key={v} className={v === s ? `is-on ssl-seg--${v}` : ""}>
                {v.toUpperCase()}
              </i>
            ))}
          </span>
        </li>
      ))}
    </ul>
    <div className="ssl-pv__foot">
      <span>9 submissions to grade</span>
      <span className="ssl-pv__btn">Save attendance</span>
    </div>
  </>
);

const StudentPreview = () => (
  <>
    <p className="ssl-pv__title">My day</p>
    <ol className="ssl-pv__tt">
      <li>
        <time>08:30</time>Mathematics
      </li>
      <li className="is-now">
        <time>09:20</time>Physics <small>now</small>
      </li>
      <li>
        <time>10:30</time>English
      </li>
    </ol>
    <div className="ssl-pv__assign">
      <div>
        <b>Physics · Lab report</b>
        <small>Due Friday</small>
      </div>
      <span className="ssl-chip ssl-tone--teal">Submitted</span>
    </div>
    <div className="ssl-pv__assign">
      <div>
        <b>English · Essay draft</b>
        <small>Due Monday</small>
      </div>
      <span className="ssl-chip ssl-tone--amber">Pending</span>
    </div>
  </>
);

const ParentPreview = () => (
  <>
    <p className="ssl-pv__title">My children</p>
    <div className="ssl-pv__kids">
      <span className="is-on">Ananya · 8-B</span>
      <span>Vihaan · 5-A</span>
    </div>
    <div className="ssl-pv__parent">
      <Donut value={96} size={78} stroke={8} color="var(--role)">
        <b>96%</b>
        <small>attendance</small>
      </Donut>
      <ul>
        <li>
          <span>Latest result</span>
          <b>Science · A</b>
        </li>
        <li>
          <span>Next event</span>
          <b>Parent–teacher meet</b>
        </li>
        <li>
          <span>Fee status</span>
          <b className="ssl-ok">Paid</b>
        </li>
      </ul>
    </div>
  </>
);

const PREVIEWS = {
  admin: AdminPreview,
  teacher: TeacherPreview,
  student: StudentPreview,
  parent: ParentPreview,
};

const ROLE_KEYS = ROLES.map((r) => r.key);

const Roles = () => {
  const { active, setActive, onKeyDown, registerTab } = useTabs(ROLE_KEYS);

  return (
    <section
      id="solutions"
      className="ssl-section ssl-roles"
      aria-labelledby="ssl-roles-title">
      <div className="ssl-container">
        <SectionHeader
          id="ssl-roles-title"
          eyebrow="Solutions"
          title={
            <>
              One Platform. Every Role.
              <br className="ssl-br-md" /> A Better School Experience.
            </>
          }
          text="Each person signs in to a dashboard built around what they need, and sees only what their role allows."
        />

        <Reveal className="ssl-roles__box" data-role={active}>
          <div
            className="ssl-roles__tabs"
            role="tablist"
            aria-label="Choose a role"
            onKeyDown={onKeyDown}>
            {ROLES.map(({ key, label, short, icon, tagline }) => {
              const Icon = icon;
              return (
                <button
                  key={key}
                  ref={registerTab(key)}
                  type="button"
                  role="tab"
                  id={`ssl-role-tab-${key}`}
                  aria-selected={active === key}
                  aria-controls={`ssl-role-panel-${key}`}
                  tabIndex={active === key ? 0 : -1}
                  data-role={key}
                  className="ssl-roletab"
                  onClick={() => setActive(key)}>
                  <span className="ssl-roletab__icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="ssl-roletab__text">
                    <b>
                      <span className="ssl-roletab__full">{label}</span>
                      <span className="ssl-roletab__short">{short}</span>
                    </b>
                    <small>{tagline}</small>
                  </span>
                </button>
              );
            })}
          </div>

          {ROLES.map(({ key, label, icon, tagline, points }) => {
            const Icon = icon;
            const Preview = PREVIEWS[key];
            return (
              <div
                key={key}
                role="tabpanel"
                id={`ssl-role-panel-${key}`}
                aria-labelledby={`ssl-role-tab-${key}`}
                hidden={active !== key}
                data-role={key}
                className="ssl-roles__panel">
                <div className="ssl-roles__copy">
                  <span className="ssl-roles__badge">
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </span>
                  <h3 className="ssl-h3">{tagline}</h3>
                  <ul className="ssl-checks">
                    {points.map((p) => (
                      <li key={p}>
                        <Check size={16} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ssl-pv" aria-hidden="true">
                  <div className="ssl-pv__chrome">
                    <span>{label} dashboard</span>
                    <SampleTag />
                  </div>
                  <div className="ssl-pv__body">
                    <Preview />
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default Roles;
