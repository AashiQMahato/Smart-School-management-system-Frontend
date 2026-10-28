/**
 * Sidebar
 * Desktop: sticky column that collapses to icons.
 * Below 1024px: slide-in drawer (Escape / scrim / navigation closes it).
 * Accent colour comes from the role tokens via data-role.
 */

import { memo, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { Calendar, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { BrandMark } from "../../features/landing/components/primitives";
import {
  SCHEDULE_ROUTES,
  getActiveNavItem,
  getNavigationByRole,
} from "./navigation.config";

const ROLE_LABELS = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const NavItem = ({ item, active, collapsed, onNavigate }) => {
  const Icon = item.icon;
  const link = (
    <Link
      to={item.path}
      onClick={onNavigate}
      className="ssd-nav__item"
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}>
      <Icon size={18} strokeWidth={active ? 2.2 : 1.9} aria-hidden="true" />
      <span className="ssd-nav__label">{item.label}</span>
    </Link>
  );

  return collapsed ? (
    <Tooltip title={item.label} placement="right" mouseEnterDelay={0.05}>
      {link}
    </Tooltip>
  ) : (
    link
  );
};

const NavList = ({ role, collapsed, onNavigate }) => {
  const { pathname } = useLocation();
  const navigation = getNavigationByRole(role);
  const activeKey = getActiveNavItem(role, pathname)?.key;

  return (
  <nav className="ssd-nav" aria-label="Dashboard">
    {navigation.map((section) => (
      <div key={section.section} className="ssd-nav__section">
        <p className="ssd-nav__heading">{section.section}</p>
        <ul>
          {section.items.map((item) => (
            <li key={item.key}>
              <NavItem
                item={item}
                active={item.key === activeKey}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
  );
};

const SidebarBrand = ({ role }) => (
  <div className="ssd-brand">
    <BrandMark size={32} />
    <div className="ssd-brand__text">
      <b>
        Smart <span>School</span>
      </b>
      <small>
        <i aria-hidden="true" />
        {ROLE_LABELS[role] || "Dashboard"}
      </small>
    </div>
  </div>
);

const ScheduleLink = ({ role, collapsed, onNavigate }) => {
  const link = (
    <NavLink
      to={SCHEDULE_ROUTES[role] || "/"}
      onClick={onNavigate}
      className="ssd-side__schedule"
      aria-label={collapsed ? "View schedule" : undefined}>
      <Calendar size={17} aria-hidden="true" />
      <span className="ssd-nav__label">View schedule</span>
    </NavLink>
  );
  return collapsed ? (
    <Tooltip title="View schedule" placement="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
};

const Sidebar = ({ userRole = "admin" }) => {
  const { collapsed, mobileOpen, closeMobile, toggleSidebar } = useSidebar();
  const drawerRef = useRef(null);

  // Drawer: Escape closes, focus moves in, page behind stops scrolling
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector("a, button")?.focus();
    const onKey = (e) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {/* Desktop */}
      <aside className="ssd-side" data-collapsed={collapsed}>
        <SidebarBrand role={userRole} />
        <NavList role={userRole} collapsed={collapsed} />
        <div className="ssd-side__foot">
          <ScheduleLink role={userRole} collapsed={collapsed} />
          <button
            type="button"
            className="ssd-side__collapse"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}>
            {collapsed ? (
              <ChevronsRight size={17} aria-hidden="true" />
            ) : (
              <ChevronsLeft size={17} aria-hidden="true" />
            )}
            <span className="ssd-nav__label">Collapse</span>
          </button>
        </div>
      </aside>

      {/* Drawer */}
      <div
        className="ssd-drawer__scrim"
        data-open={mobileOpen}
        onClick={closeMobile}
        aria-hidden="true"
      />
      <aside
        id="ssd-drawer"
        ref={drawerRef}
        className="ssd-drawer"
        data-open={mobileOpen}
        aria-label="Navigation"
        inert={!mobileOpen}>
        <div className="ssd-drawer__head">
          <SidebarBrand role={userRole} />
          <button
            type="button"
            className="ssd-icon-btn"
            onClick={closeMobile}
            aria-label="Close menu">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <NavList
          role={userRole}
          collapsed={false}
          onNavigate={closeMobile}
        />
        <div className="ssd-side__foot">
          <ScheduleLink
            role={userRole}
            collapsed={false}
            onNavigate={closeMobile}
          />
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
