/**
 * StatCard Component
 * Reusable statistics card for dashboard displays
 */

import { Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

/**
 * StatCard
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {React.ComponentType} props.icon - Icon component
 * @param {string} props.iconColor - Icon background color class
 * @param {number} props.change - Percentage change (optional)
 * @param {string} props.changeLabel - Label for change (optional)
 * @param {boolean} props.loading - Loading state
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "bg-indigo-100 text-indigo-600",
  change,
  changeLabel = "vs last month",
  loading = false,
}) => {
  const isPositive = change >= 0;

  return (
    <Card
      className="border-0 shadow-sm hover:shadow-md transition-shadow"
      loading={loading}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {typeof change === "number" && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`flex items-center text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}>
                {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500">{changeLabel}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${iconColor}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
