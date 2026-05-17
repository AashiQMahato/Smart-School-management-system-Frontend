import { Tag } from "antd";

const gradeColors = {
  "A+": { color: "#15803d", bg: "#dcfce7", border: "#86efac" },
  A: { color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  "B+": { color: "#2563eb", bg: "#dbeafe", border: "#93c5fd" },
  B: { color: "#3b82f6", bg: "#dbeafe", border: "#93c5fd" },
  "C+": { color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  C: { color: "#f59e0b", bg: "#fef3c7", border: "#fcd34d" },
  D: { color: "#ea580c", bg: "#ffedd5", border: "#fdba74" },
  F: { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
};

const GradeBadge = ({ grade, size = "default" }) => {
  if (!grade) return <span className="text-slate-400">—</span>;
  const cfg = gradeColors[grade] || {
    color: "#6b7280",
    bg: "#f3f4f6",
    border: "#d1d5db",
  };
  return (
    <Tag
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontWeight: 700,
        fontSize: size === "large" ? 16 : 13,
        padding: size === "large" ? "4px 16px" : "2px 10px",
        borderRadius: 6,
        lineHeight: size === "large" ? "24px" : "20px",
      }}>
      {grade}
    </Tag>
  );
};

export default GradeBadge;
