/**
 * EmptyState Component
 * Consistent empty state display
 */

import { Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

/**
 * EmptyState
 * @param {object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {string} props.actionLabel - Action button label
 * @param {function} props.onAction - Action button handler
 * @param {React.ReactNode} props.image - Custom image/icon
 */
const EmptyState = ({
  title = "No data found",
  description = "There are no items to display.",
  actionLabel,
  onAction,
  image,
}) => {
  return (
    <div className="py-12">
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        }>
        {actionLabel && onAction && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;
