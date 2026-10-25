import { STEPS } from "../data";
import { Reveal, SectionHeader } from "./primitives";

const StepArt = ({ n }) => {
  if (n === "01")
    return (
      <div className="ssl-art ssl-art--org" aria-hidden="true">
        {["Grade 6", "Grade 7", "Grade 8"].map((g, i) => (
          <span key={g} style={{ "--i": i }}>
            {g}
          </span>
        ))}
      </div>
    );
  if (n === "02")
    return (
      <div className="ssl-art ssl-art--net" aria-hidden="true">
        <i data-role="teacher" />
        <i data-role="student" />
        <i data-role="parent" />
        <i data-role="admin" className="is-hub" />
      </div>
    );
  return (
    <div className="ssl-art ssl-art--flow" aria-hidden="true">
      {[70, 45, 85].map((w, i) => (
        <span key={i} style={{ "--w": `${w}%`, "--i": i }} />
      ))}
    </div>
  );
};

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="ssl-section ssl-how"
    aria-labelledby="ssl-how-title">
    <div className="ssl-container">
      <SectionHeader
        id="ssl-how-title"
        eyebrow="How it works"
        title="Up and running in three steps."
        text="Your school's administrator sets things up once; after that, everyone works from the same system."
      />

      <Reveal as="ol" className="ssl-steps">
        {STEPS.map(({ n, title, text, icon }, i) => {
          const Icon = icon;
          return (
            <li key={n} className="ssl-step" style={{ "--i": i }}>
              <div className="ssl-step__marker">
                <span className="ssl-step__num">{n}</span>
              </div>
              <div className="ssl-step__card">
                <StepArt n={n} />
                <h3 className="ssl-step__title">
                  <Icon size={18} aria-hidden="true" />
                  {title}
                </h3>
                <p>{text}</p>
              </div>
            </li>
          );
        })}
      </Reveal>
    </div>
  </section>
);

export default HowItWorks;
