/**
 * StatCard
 * Headline number with icon, optional trend, on the dashboard surface.
 */

import { Skeleton } from "antd";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/**
 * @param {object} props
 * @param {string} props.title - Label under the value
 * @param {string|number} props.value - Main value to display
 * @param {React.ComponentType} props.icon - Icon component
 * @param {string} props.iconColor - Tailwind classes for the icon chip (optional)
 * @param {string} props.tone - Design-token tone: blue, teal, green, amber, coral, violet, red, indigo
 * @param {number} props.change - Percentage change (optional)
 * @param {string} props.changeLabel - Label for change (optional)
 * @param {boolean} props.loading - Loading state
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  tone = "blue",
  change,
  changeLabel = "vs last month",
  loading = false,
}) => {
  const isPositive = change >= 0;

  return (
    <div className={`ssd-stat ssd-tone--${tone}`}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} title={{ width: "40%" }} />
      ) : (
        <>
          {Icon && (
            <span className={`ssd-stat__icon ${iconColor || ""}`}>
              <Icon size={18} aria-hidden="true" />
            </span>
          )}
          <span className="ssd-stat__value">{value}</span>
          <span className="ssd-stat__label">{title}</span>
          {typeof change === "number" && (
            <span
              className={`ssd-stat__change ${isPositive ? "is-up" : "is-down"}`}>
              {isPositive ? (
                <ArrowUpRight size={14} aria-hidden="true" />
              ) : (
                <ArrowDownRight size={14} aria-hidden="true" />
              )}
              {Math.abs(change)}%<small>{changeLabel}</small>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default StatCard;
