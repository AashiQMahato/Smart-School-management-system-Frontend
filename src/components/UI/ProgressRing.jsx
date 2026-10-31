/**
 * ProgressRing
 * Circular percentage indicator that animates to its value.
 */

import { useEffect, useState } from "react";

const ProgressRing = ({
  value = 0,
  size = 120,
  stroke = 11,
  tone = "emerald",
  label,
  sublabel,
}) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);

  // start empty, then animate to the value on the next frame
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  return (
    <div
      className={`ssd-ring ssd-tone--${tone}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? `${Math.round(clamped)}%`} ${sublabel || ""}`.trim()}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ssd-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ssd-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
        />
      </svg>
      <div className="ssd-ring__label" aria-hidden="true">
        <b>{label ?? `${Math.round(clamped)}%`}</b>
        {sublabel && <small>{sublabel}</small>}
      </div>
    </div>
  );
};

export default ProgressRing;
