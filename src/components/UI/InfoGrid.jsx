/**
 * InfoGrid Component
 * Renders label-value pairs in a responsive grid
 * Supports tile and row display modes
 */

import { memo } from "react";

const InfoGrid = ({
  items = [],
  columns = 2,
  mode = "tile",
  className = "",
}) => {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  if (mode === "row") {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-sm font-semibold text-slate-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid ${colsClass[columns] || colsClass[2]} gap-3 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">{item.label}</div>
          <div className="text-sm font-semibold text-slate-800">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(InfoGrid);
