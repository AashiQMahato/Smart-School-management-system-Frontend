/**
 * QuickActionCard Component
 * Link card with icon, label, sublabel, and hover-lift animation
 * Used in dashboard quick-action grids
 */

import { memo } from "react";
import { Link } from "react-router-dom";

const QuickActionCard = ({
  to,
  icon: Icon,
  label,
  sublabel,
  gradient = "from-indigo-500 to-indigo-600",
  iconBg = "bg-white/20",
  className = "",
  onClick,
}) => {
  const content = (
    <div
      className={`
        group p-5 bg-linear-to-br ${gradient}
        rounded-2xl text-center text-white
        shadow-lg hover:shadow-xl
        transform hover:-translate-y-1 active:scale-[0.98]
        transition-all duration-300 ease-out cursor-pointer
        ${className}
      `}>
      {Icon && (
        <div
          className={`
            w-12 h-12 ${iconBg} rounded-xl mx-auto mb-3
            flex items-center justify-center
            group-hover:scale-110 transition-transform duration-300
          `}>
          <Icon size={24} strokeWidth={2} className="text-white" />
        </div>
      )}
      <div className="font-semibold text-sm">{label}</div>
      {sublabel && <div className="text-xs text-white/70 mt-1">{sublabel}</div>}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  if (onClick) {
    return (
      <button onClick={onClick} type="button" className="w-full text-left">
        {content}
      </button>
    );
  }
  return content;
};

export default memo(QuickActionCard);
