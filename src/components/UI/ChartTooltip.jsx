/**
 * Themed tooltip for Recharts (see chartTheme.js for series colours).
 */

const ChartTooltip = ({ active, payload, label, format = (v) => v }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ssd-chart-tip">
      {label != null && <b>{label}</b>}
      {payload.map((p) => (
        <span key={p.dataKey ?? p.name}>
          <i style={{ background: p.color || p.payload?.fill }} />
          {p.name}: <strong>{format(p.value, p)}</strong>
        </span>
      ))}
    </div>
  );
};

export default ChartTooltip;
