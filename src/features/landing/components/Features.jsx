import { Clock } from "lucide-react";
import { BENEFITS, FEATURES, PLANNED_FEATURES } from "../data";
import { Reveal, SectionHeader } from "./primitives";
import { MiniBars } from "./MiniCharts";

export const BenefitsStrip = () => (
  <section className="ssl-strip" aria-label="Platform benefits">
    <Reveal as="ul" className="ssl-container ssl-strip__list">
      {BENEFITS.map((benefit, i) => {
        const Icon = benefit.icon;
        return (
          <li key={benefit.label} style={{ "--i": i }}>
            <Icon size={18} aria-hidden="true" />
            {benefit.label}
          </li>
        );
      })}
    </Reveal>
  </section>
);

const RECORDS = [
  { initials: "AK", name: "Aarav Kumar", cls: "8-B", roll: "08", parent: true },
  { initials: "SM", name: "Sara Mehta", cls: "8-B", roll: "21", parent: true },
  {
    initials: "RJ",
    name: "Rohan Joshi",
    cls: "9-A",
    roll: "14",
    parent: false,
  },
];

/* p = present, a = absent, l = late */
const ATTENDANCE_GRID = "pppppppaplpppppppppppappppplpppp".split("");

const SUBJECTS = [
  { label: "Math", value: 78 },
  { label: "Sci", value: 84, highlight: true },
  { label: "Eng", value: 81 },
  { label: "Hist", value: 69 },
  { label: "Geo", value: 74 },
  { label: "Art", value: 88 },
];

const FeatureVisual = ({ type }) => {
  if (type === "records")
    return (
      <div className="ssl-fv ssl-fv--records" aria-hidden="true">
        {RECORDS.map((r) => (
          <div key={r.name} className="ssl-fv__row">
            <span className="ssl-avatar">{r.initials}</span>
            <span className="ssl-fv__name">{r.name}</span>
            <span className="ssl-fv__meta">
              Class {r.cls} · Roll {r.roll}
            </span>
            <span
              className={`ssl-chip ${r.parent ? "ssl-tone--teal" : "ssl-tone--amber"}`}>
              {r.parent ? "Parent linked" : "Link parent"}
            </span>
          </div>
        ))}
      </div>
    );

  if (type === "attendance")
    return (
      <div className="ssl-fv ssl-fv--att" aria-hidden="true">
        <div className="ssl-dots">
          {ATTENDANCE_GRID.map((s, i) => (
            <span
              key={i}
              className={`ssl-dot ssl-dot--${s}`}
              style={{ "--i": i }}
            />
          ))}
        </div>
        <div className="ssl-legend">
          <span>
            <i className="ssl-dot ssl-dot--p" />
            Present
          </span>
          <span>
            <i className="ssl-dot ssl-dot--l" />
            Late
          </span>
          <span>
            <i className="ssl-dot ssl-dot--a" />
            Absent
          </span>
        </div>
      </div>
    );

  if (type === "insights")
    return (
      <div className="ssl-fv ssl-fv--insights" aria-hidden="true">
        <MiniBars data={SUBJECTS} color="var(--ssl-coral)" height={70} />
      </div>
    );

  return null;
};

const FeatureCard = ({ feature, index }) => {
  const { title, text, accent, span = 4, visual } = feature;
  const Icon = feature.icon;
  return (
    <li
      className={`ssl-feature ssl-tone--${accent} ${visual ? "has-visual" : ""}`}
      data-wide={span >= 7}
      style={{ "--span": span, "--i": index }}>
      <span className="ssl-feature__icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h3 className="ssl-feature__title">{title}</h3>
      <p className="ssl-feature__text">{text}</p>
      {visual && <FeatureVisual type={visual} />}
    </li>
  );
};

const Features = () => (
  <section
    id="features"
    className="ssl-section"
    aria-labelledby="ssl-features-title">
    <div className="ssl-container">
      <SectionHeader
        id="ssl-features-title"
        eyebrow="Features"
        title={
          <>
            Everything Your School Needs.
            <br className="ssl-br-md" /> All in One Place.
          </>
        }
        text="The tools your school uses every day, built into one system with a dedicated view for every role."
      />

      <Reveal as="ul" className="ssl-features">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.key} feature={feature} index={i} />
        ))}
      </Reveal>

      <Reveal as="p" className="ssl-planned">
        <Clock size={15} aria-hidden="true" />
        <span>
          <b>On the roadmap:</b> {PLANNED_FEATURES.join(" and ").toLowerCase()}{" "}
          are planned and not yet available.
        </span>
      </Reveal>
    </div>
  </section>
);

export default Features;
