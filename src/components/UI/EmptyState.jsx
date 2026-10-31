/**
 * EmptyState
 * Consistent "nothing here yet" message with an optional action.
 */

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Inbox } from "lucide-react";

/**
 * @param {object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {string} props.actionLabel - Action button label
 * @param {function} props.onAction - Action button handler
 * @param {React.ReactNode} props.image - Custom image/icon element
 * @param {React.ReactNode} props.icon - Alias for image
 * @param {boolean} props.compact - Tighter padding for use inside cards and tables
 * @param {string} props.tone - Module colour for the icon tile
 */
const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  image,
  icon,
  compact = false,
  tone,
}) => {
  // Fall back to generic copy only when the caller gave neither line.
  const heading = title ?? (description === undefined ? "No data found" : null);
  const body =
    description ??
    (title === undefined ? "There are no items to display." : null);
  return (
    <div
      className={`ssd-empty ${compact ? "ssd-empty--compact" : ""} ${tone ? `ssd-tone--${tone}` : ""}`}
      role="status"
    >
      <span className="ssd-empty__icon" aria-hidden="true">
        {image || icon || <Inbox size={20} />}
      </span>
      {heading && <b>{heading}</b>}
      {body && <p>{body}</p>}
      {actionLabel && onAction && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAction}
          className="mt-3"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
