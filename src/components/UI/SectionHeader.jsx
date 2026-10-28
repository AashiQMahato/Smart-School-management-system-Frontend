/**
 * SectionHeader
 * Section heading with icon, title, subtitle, and optional action.
 */

import { memo } from "react";

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  iconBg = "bg-slate-100",
  iconColor = "text-slate-700",
  iconSize = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: { box: "w-8 h-8 rounded-lg", icon: 16 },
    md: { box: "w-9 h-9 rounded-[10px]", icon: 18 },
    lg: { box: "w-11 h-11 rounded-xl", icon: 22 },
  };

  const size = sizeMap[iconSize] || sizeMap.md;

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div
            className={`${size.box} ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon size={size.icon} strokeWidth={2} aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default memo(SectionHeader);
