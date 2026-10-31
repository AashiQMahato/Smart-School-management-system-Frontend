/**
 * PageHeader
 * Shared page-level header shown under the topbar: icon, title,
 * subtitle and actions, with an optional summary band (e.g. stat tiles).
 *
 * When no icon/tone is passed, both come from the page's sidebar entry
 * (navigation.config.js), so every page gets a consistent identity.
 */

import { createElement, isValidElement } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getActiveNavItem } from "../Sidebar/navigation.config";

/**
 * @param {object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Short description (optional)
 * @param {React.ComponentType|React.ReactNode} props.icon - Lucide/antd icon component or element (defaults to the page's nav icon)
 * @param {string} props.tone - Module colour (blue, violet, emerald, teal…); defaults to the page's nav colour
 * @param {React.ReactNode} props.actions - Buttons, right-aligned (wrap below on small screens)
 * @param {Array} props.breadcrumbs - Breadcrumb items [{label, path}]
 * @param {React.ReactNode} props.summary - Content for the dark band at the bottom of the header (stat tiles)
 * @param {React.ReactNode} props.children - Extra content rendered below the header
 */
const PageHeader = ({
  title,
  subtitle,
  icon,
  tone,
  actions,
  breadcrumbs = [],
  summary,
  children,
  className = "",
}) => {
  const { getDashboardRoute, userRole } = useAuth();
  const { pathname } = useLocation();
  const navItem = getActiveNavItem(userRole, pathname);

  const resolvedTone = tone || navItem?.tone || "indigo";
  const iconSource = icon ?? navItem?.icon;
  const iconNode = isValidElement(iconSource)
    ? iconSource
    : iconSource
      ? createElement(iconSource, {
          size: 21,
          strokeWidth: 2,
          "aria-hidden": true,
        })
      : null;

  const breadcrumbItems = [
    { title: <Link to={getDashboardRoute()}>Dashboard</Link> },
    ...breadcrumbs.map((item) => ({
      title: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    })),
  ];

  return (
    <>
      <header
        className={`ssd-ph ssd-tone--${resolvedTone} ${summary ? "ssd-ph--summary" : ""} ${className}`}
      >
        <div className="ssd-ph__main">
          <div className="ssd-ph__lead">
            {iconNode && (
              <span className="ssd-ph__icon" aria-hidden="true">
                {iconNode}
              </span>
            )}
            <div className="ssd-ph__text">
              {breadcrumbs.length > 0 && (
                <Breadcrumb
                  items={breadcrumbItems}
                  className="ssd-ph__crumbs"
                />
              )}
              <h1 className="ssd-ph__title">{title}</h1>
              {subtitle && <p className="ssd-ph__subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="ssd-ph__actions">{actions}</div>}
        </div>
        {summary && (
          <div className="ssd-ph__summary ssd-always-dark">{summary}</div>
        )}
      </header>

      {children && <div className="mb-6">{children}</div>}
    </>
  );
};

export default PageHeader;
