import { ArrowRight } from "lucide-react";
import { useAppEntry } from "../hooks";
import { CtaLink, Reveal } from "./primitives";

/* Decorative timetable grid that fills in, cell by cell. */
const CELLS = [
  1, 0, 2, 1, 0, 3, 0, 1, 2, 0, 1, 0, 3, 1, 0, 2, 1, 0, 0, 2, 1, 3, 0, 1,
];

const FinalCta = () => {
  const entry = useAppEntry();
  return (
    <section className="ssl-cta-wrap" aria-labelledby="ssl-cta-title">
      <div className="ssl-container">
        <Reveal className="ssl-cta">
          <div className="ssl-cta__copy">
            <h2 id="ssl-cta-title" className="ssl-h2">
              Make Every School Day Run Smarter.
            </h2>
            <p>
              Bring your school&apos;s everyday workflows into one organized,
              accessible platform.
            </p>
            <div className="ssl-cta__actions">
              <CtaLink to={entry.to} variant="light" size="lg">
                {entry.isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
              <CtaLink to="#features" variant="outline-light" size="lg">
                Explore Features
              </CtaLink>
            </div>
          </div>
          <div className="ssl-cta__art" aria-hidden="true">
            {CELLS.map((c, i) => (
              <span
                key={i}
                className={c ? `is-c${c}` : undefined}
                style={{ "--i": i }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCta;
