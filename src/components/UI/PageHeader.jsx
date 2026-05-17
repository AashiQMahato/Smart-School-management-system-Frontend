/**
 * PageHeader Component
 * Consistent page header with title, breadcrumb, and actions
 */

import { Breadcrumb, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

/**
 * PageHeader
 * @param {object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle (optional)
 * @param {Array} props.breadcrumbs - Breadcrumb items [{label, path}]
 * @param {React.ReactNode} props.actions - Action buttons/elements
 * @param {React.ReactNode} props.children - Additional content
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
}) => {
  const breadcrumbItems = [
    {
      title: (
        <Link to="/" className="flex items-center gap-1">
          <HomeOutlined />
          <span>Home</span>
        </Link>
      ),
    },
    ...breadcrumbs.map((item, index) => ({
      title: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    })),
  ];

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
