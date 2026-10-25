/**
 * Lightweight SVG/CSS charts for the marketing previews.
 * The app's dashboards use Recharts; these stay dependency-free so the
 * public page loads fast. They animate in when an ancestor gets `is-in`.
 */

export const MiniBars = ({
  data,
  color = "var(--ssl-blue)",
  height = 88,
  label,
}) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <figure className="ssl-bars" style={{ "--h": `${height}px` }}>
      <div className="ssl-bars__plot" role="img" aria-label={label}>
        {data.map((d, i) => (
          <div key={d.label} className="ssl-bars__col">
            <span
              className="ssl-bars__bar"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: d.highlight ? color : undefined,
                "--i": i,
              }}
            />
          </div>
        ))}
      </div>
      <div className="ssl-bars__labels" aria-hidden="true">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </figure>
  );
};

export const MiniLine = ({
  values,
  color = "var(--ssl-indigo)",
  width = 260,
  height = 90,
  label,
}) => {
  const pad = 6;
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const step = (width - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => [
    pad + i * step,
    height - pad - ((v - min) / (max - min)) * (height - pad * 2),
  ]);
  const line = points
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${points.at(-1)[0]} ${height} L${points[0][0]} ${height} Z`;
  const [lx, ly] = points.at(-1);

  return (
    <svg
      className="ssl-line"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={width}
          y1={height * f}
          y2={height * f}
          className="ssl-line__grid"
        />
      ))}
      <path d={area} fill={color} opacity="0.08" />
      <path
        d={line}
        className="ssl-line__path"
        stroke={color}
        pathLength="1"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={lx}
        cy={ly}
        r="3.5"
        fill="#fff"
        stroke={color}
        strokeWidth="2"
        className="ssl-line__dot"
      />
    </svg>
  );
};

export const Donut = ({
  value,
  color = "var(--ssl-teal)",
  size = 72,
  stroke = 8,
  children,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ssl-donut" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ssl-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          className="ssl-donut__arc"
          style={{ "--off": `${c * (1 - value / 100)}px`, "--c": `${c}px` }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ssl-donut__label">{children}</div>
    </div>
  );
};
