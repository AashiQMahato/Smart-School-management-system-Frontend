/**
 * SectionHeader Component
 * Reusable section heading with icon, title, subtitle, and optional action
 */

import { memo } from "react";

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  iconBg = "bg-indigo-100",
  iconColor = "text-indigo-600",
  iconSize = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: { box: "w-8 h-8 rounded-lg", icon: 16 },
    md: { box: "w-10 h-10 rounded-xl", icon: 20 },
    lg: { box: "w-12 h-12 rounded-xl", icon: 24 },
  };

  const size = sizeMap[iconSize] || sizeMap.md;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={`${size.box} ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon size={size.icon} strokeWidth={2} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default memo(SectionHeader);
