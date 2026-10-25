import {
  Eye,
  FolderKanban,
  KeyRound,
  LayoutGrid,
  Workflow,
} from "lucide-react";
import { WHY } from "../data";
import { Reveal } from "./primitives";

const ICONS = [LayoutGrid, Eye, Workflow, FolderKanban, KeyRound];

/* Illustration: one record, four role-scoped views of it. */
const AccessArt = () => (
  <div className="ssl-access" aria-hidden="true">
    <div className="ssl-access__core">
      <span className="ssl-avatar">AK</span>
      <b>Aarav Kumar</b>
      <small>Class 8-B</small>
    </div>
    {[
      ["admin", "Full record"],
      ["teacher", "Attendance · Marks"],
      ["parent", "Results · Fees"],
      ["student", "Timetable · Work"],
    ].map(([role, text]) => (
      <span key={role} className="ssl-access__tag" data-role={role}>
        {text}
      </span>
    ))}
  </div>
);

const WhyChoose = () => (
  <section
    id="about"
    className="ssl-section ssl-why"
    aria-labelledby="ssl-why-title">
    <div className="ssl-container ssl-why__grid">
      <Reveal className="ssl-why__intro">
        <p className="ssl-eyebrow">Why Smart School</p>
        <h2 id="ssl-why-title" className="ssl-h2">
          Built around how schools actually work.
        </h2>
        <p className="ssl-lead">
          Smart School is a school management system with dedicated dashboards
          for administrators, teachers, students, and parents. The same record
          serves everyone, and each role sees the part that matters to them.
        </p>
        <AccessArt />
      </Reveal>

      <Reveal as="ul" className="ssl-why__list">
        {WHY.map(({ title, text }, i) => {
          const Icon = ICONS[i];
          return (
            <li key={title} style={{ "--i": i }}>
              <span className="ssl-why__icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          );
        })}
      </Reveal>
    </div>
  </section>
);

export default WhyChoose;
