/**
 * PageHeader
 * Page title, optional subtitle and breadcrumb, and actions.
 */

import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
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
  const { getDashboardRoute } = useAuth();

  const breadcrumbItems = [
    { title: <Link to={getDashboardRoute()}>Dashboard</Link> },
    ...breadcrumbs.map((item) => ({
      title: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    })),
  ];

  return (
    <div className="ssd-page-head-wrap">
      {breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbItems} className="mb-3" />
      )}

      <div className="ssd-page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="ssd-page-head__actions">{actions}</div>}
      </div>

      {children && <div className="mb-6">{children}</div>}
    </div>
  );
};

export default PageHeader;
