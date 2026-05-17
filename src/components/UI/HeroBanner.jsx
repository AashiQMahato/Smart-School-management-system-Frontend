/**
 * HeroBanner Component
 * Reusable gradient hero banner for page tops
 * Used across all dashboard pages for welcome/overview banners
 */

import { memo } from "react";

const GRADIENT_PRESETS = {
  indigo: "from-indigo-600 to-indigo-700",
  blue: "from-blue-600 to-blue-700",
  emerald: "from-emerald-600 to-emerald-700",
  violet: "from-violet-600 to-violet-700",
  slate: "from-slate-700 to-slate-800",
  amber: "from-amber-500 to-amber-600",
  rose: "from-rose-500 to-rose-600",
};

const HeroBanner = ({
  title,
  subtitle,
  gradient = "indigo",
  children,
  rightContent,
  className = "",
}) => {
  const gradientClass = GRADIENT_PRESETS[gradient] || gradient;

  return (
    <div
      className={`
        bg-linear-to-r ${gradientClass}
        rounded-3xl p-6 md:p-8 text-white shadow-2xl
        ${className}
      `}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/80 mt-2 text-sm md:text-base max-w-xl">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
};

export default memo(HeroBanner);
