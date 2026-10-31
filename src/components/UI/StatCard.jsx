/**
 * StatCard
 * Headline number with a module-coloured icon, animated count-up, and
 * optional trend, sparkline and link.
 */

import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import Sparkline from "./Sparkline";

/**
 * @param {object} props
 * @param {string} props.title - Label under the value
 * @param {number|string} props.value - Numbers animate; strings show as-is
 * @param {(n: number) => string} props.format - Formats numeric values
 * @param {React.ComponentType} props.icon - Lucide icon
 * @param {string} props.tone - Module colour (blue, violet, emerald, teal…)
 * @param {number} props.change - Percentage change (only when real data supports it)
 * @param {string} props.changeLabel
 * @param {number[]} props.spark - Series for a background sparkline
 * @param {string} props.hint - Small text under the label
 * @param {string} props.badge - Chip in the top-right corner
 * @param {string} props.to - Makes the card a link
 * @param {boolean} props.loading
 * @param {string} props.iconColor - Deprecated; kept for older call sites
 */
const StatCard = ({
  title,
  value,
  format = (n) => Math.round(n).toLocaleString("en-IN"),
  icon: Icon,
  tone = "blue",
  change,
  changeLabel = "vs last month",
  spark,
  hint,
  badge,
  to,
  loading = false,
}) => {
  const animated = useCountUp(typeof value === "number" ? value : undefined);
  const display = typeof value === "number" ? format(animated) : (value ?? "—");
  const isUp = change >= 0;
  const Tag = to ? Link : "div";

  return (
    <Tag
      {...(to ? { to } : {})}
      className={`ssd-stat ssd-stat--hover ssd-tone--${tone}`}>
      <div className="ssd-stat__top">
        {Icon && (
          <span className="ssd-stat__icon">
            <Icon size={19} aria-hidden="true" />
          </span>
        )}
        {badge ? (
          <span className="ssd-stat__badge">{badge}</span>
        ) : to ? (
          <ArrowRight size={16} className="text-slate-400" aria-hidden="true" />
        ) : null}
      </div>
      {loading ? (
        <Skeleton.Input active size="small" style={{ width: 90 }} />
      ) : (
        <span className="ssd-stat__value">{display}</span>
      )}
      <span className="ssd-stat__label">{title}</span>
      {hint && !loading && (
        <span className="text-xs text-slate-500">{hint}</span>
      )}
      {typeof change === "number" && Number.isFinite(change) && !loading && (
        <span className={`ssd-stat__change ${isUp ? "is-up" : "is-down"}`}>
          {isUp ? (
            <ArrowUpRight size={14} aria-hidden="true" />
          ) : (
            <ArrowDownRight size={14} aria-hidden="true" />
          )}
          {Math.abs(change)}%<small>{changeLabel}</small>
        </span>
      )}
      {spark?.length > 1 && !loading && (
        <Sparkline values={spark} className="ssd-stat__spark" />
      )}
    </Tag>
  );
};

export default StatCard;
