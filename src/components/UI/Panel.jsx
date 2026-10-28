/**
 * Panel
 * Titled dashboard card with an optional "view all" link, plus the
 * matching empty state.
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * @param {object} props
 * @param {React.ComponentType} props.icon - Icon for the title chip
 * @param {string} props.tone - Design-token tone for the chip
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {{to: string, label: string}} props.link - Header link (optional)
 * @param {React.ReactNode} props.actions - Header actions (optional)
 * @param {boolean} props.padded - Wrap children in the padded body
 */
const Panel = ({
  icon,
  tone = "slate",
  title,
  subtitle,
  link,
  actions,
  padded = false,
  className = "",
  children,
}) => {
  const Icon = icon;
  return (
    <section className={`ssd-panel ${className}`}>
      <header className="ssd-panel__head">
        <div className={`ssd-panel__title ssd-tone--${tone}`}>
          {Icon && (
            <span className="ssd-panel__icon">
              <Icon size={16} aria-hidden="true" />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        {actions}
        {link && (
          <Link to={link.to} className="ssd-panel__link">
            {link.label}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </header>
      {padded ? <div className="ssd-panel__body">{children}</div> : children}
    </section>
  );
};

export const PanelEmpty = ({ icon, title, text, action }) => {
  const Icon = icon;
  return (
    <div className="ssd-empty">
      {Icon && (
        <span className="ssd-empty__icon">
          <Icon size={20} aria-hidden="true" />
        </span>
      )}
      <b>{title}</b>
      {text && <p>{text}</p>}
      {action && (
        <Link to={action.to} className="ssd-panel__link mt-2">
          {action.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};

export default Panel;
