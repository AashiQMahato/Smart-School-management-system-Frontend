/**
 * QuickActionCard
 * Link/button card with icon, label and sublabel for quick-action grids.
 */

import { memo } from "react";
import { Link } from "react-router-dom";

const TONES = [
  "blue",
  "indigo",
  "teal",
  "green",
  "coral",
  "amber",
  "red",
  "violet",
  "slate",
];

/* Older call sites pass a Tailwind gradient; map its first hue to a tone. */
const TONE_ALIASES = {
  emerald: "green",
  purple: "violet",
  orange: "amber",
  rose: "coral",
  pink: "coral",
  cyan: "teal",
  sky: "blue",
  gray: "slate",
};

const toneFrom = (tone, gradient) => {
  if (TONES.includes(tone)) return tone;
  const hue = gradient?.match(/from-([a-z]+)/)?.[1];
  return TONE_ALIASES[hue] || (TONES.includes(hue) ? hue : "blue");
};

const QuickActionCard = ({
  to,
  icon: Icon,
  label,
  sublabel,
  tone,
  gradient,
  className = "",
  onClick,
}) => {
  const classes = `ssd-action ssd-tone--${toneFrom(tone, gradient)} ${className}`;
  const content = (
    <>
      {Icon && (
        <span className="ssd-action__icon">
          <Icon size={19} aria-hidden="true" />
        </span>
      )}
      <span>
        <b>{label}</b>
        {sublabel && <small>{sublabel}</small>}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
};

export default memo(QuickActionCard);
