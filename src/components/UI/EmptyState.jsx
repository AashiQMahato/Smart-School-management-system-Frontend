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
 */
const EmptyState = ({
  title = "No data found",
  description = "There are no items to display.",
  actionLabel,
  onAction,
  image,
  icon,
}) => (
  <div className="ssd-empty" role="status">
    <span className="ssd-empty__icon" aria-hidden="true">
      {image || icon || <Inbox size={20} />}
    </span>
    <b>{title}</b>
    {description && <p>{description}</p>}
    {actionLabel && onAction && (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAction}
        className="mt-3">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
