import { Link } from "react-router-dom";
import { useReveal } from "../hooks";

/** School crest: a shield with an open book and a rising spark. */
export const BrandMark = ({ size = 34, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    className={className}>
    <rect width="40" height="40" rx="11" fill="var(--ssl-brand)" />
    <path
      d="M20 8.5 30 12v8.2c0 6-4.2 10.2-10 11.8-5.8-1.6-10-5.8-10-11.8V12l10-3.5Z"
      fill="var(--ssl-blue)"
    />
    <path
      d="M13.5 18.2c2.6-.6 4.8-.1 6.5 1.3 1.7-1.4 3.9-1.9 6.5-1.3v7.4c-2.6-.6-4.8-.1-6.5 1.3-1.7-1.4-3.9-1.9-6.5-1.3v-7.4Z"
      fill="#fff"
    />
    <path d="M20 19.5v7.4" stroke="var(--ssl-blue)" strokeWidth="1.2" />
    <circle cx="20" cy="13.6" r="1.9" fill="var(--ssl-amber)" />
  </svg>
);

export const Brand = ({ inverted = false }) => (
  <span className={`ssl-brand ${inverted ? "ssl-brand--inv" : ""}`}>
    <BrandMark />
    <span className="ssl-brand__name">
      Smart <span>School</span>
    </span>
  </span>
);

/**
 * Button-styled link. Hash targets render a plain anchor (in-page
 * scroll); everything else goes through React Router.
 */
export const CtaLink = ({
  to,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}) => {
  const classes = `ssl-btn ssl-btn--${variant} ssl-btn--${size} ${className}`;
  if (to.startsWith("#")) {
    return (
      <a href={to} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={classes} {...rest}>
      {children}
    </Link>
  );
};

/** Fades and lifts its children into place when scrolled into view. */
export const Reveal = ({ as = "div", className = "", children, ...rest }) => {
  const ref = useReveal();
  const Tag = as;
  return (
    <Tag ref={ref} className={`ssl-reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export const SectionHeader = ({
  eyebrow,
  title,
  text,
  id,
  align = "center",
}) => (
  <Reveal className={`ssl-head ssl-head--${align}`}>
    {eyebrow && <p className="ssl-eyebrow">{eyebrow}</p>}
    <h2 id={id} className="ssl-h2">
      {title}
    </h2>
    {text && <p className="ssl-lead">{text}</p>}
  </Reveal>
);

/** Small honesty label used on every marketing preview. */
export const SampleTag = ({ className = "" }) => (
  <span className={`ssl-sample ${className}`}>Sample data</span>
);
