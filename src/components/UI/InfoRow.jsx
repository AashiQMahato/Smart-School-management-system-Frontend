/**
 * InfoRow
 * Label/value pair with an icon tile, used in profile and detail views.
 * Empty values show an em dash (or the row is hidden with hideEmpty).
 */

import { isValidElement, createElement } from "react";

/**
 * @param {object} props
 * @param {React.ComponentType|React.ReactElement} props.icon
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {boolean} props.hideEmpty - Render nothing when there is no value
 * @param {boolean} props.divided - Separator line between stacked rows
 */
const InfoRow = ({
  icon,
  label,
  value,
  hideEmpty = false,
  divided = false,
  className = "",
}) => {
  if (hideEmpty && !value) return null;
  return (
    <div
      className={`ssd-info ${divided ? "ssd-info--divided" : ""} ${className}`}
    >
      {icon && (
        <span className="ssd-info__icon" aria-hidden="true">
          {isValidElement(icon) ? icon : createElement(icon, { size: 15 })}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="ssd-info__label">{label}</p>
        <p className="ssd-info__value">
          {value || <span className="ssd-info__none">—</span>}
        </p>
      </div>
    </div>
  );
};

export default InfoRow;
