/**
 * Sidebar
 * Desktop: sticky column under the topbar that collapses to icons.
 * Below 1024px: slide-in drawer (Escape / scrim / navigation closes it).
 * Each item carries its module colour (see navigation.config.js).
 */

import { memo, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { Calendar, X } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { BrandMark } from "../../features/landing/components/primitives";
import {
  SCHEDULE_ROUTES,
  getActiveNavItem,
  getNavigationByRole,
} from "./navigation.config";

const NavItem = ({ item, active, collapsed, onNavigate, index }) => {
  const Icon = item.icon;
  const link = (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`ssd-nav__item ssd-tone--${item.tone}`}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}>
      <span className="ssd-ico" aria-hidden="true">
        <Icon size={16} strokeWidth={active ? 2.3 : 2} />
      </span>
      <span className="ssd-nav__label">{item.label}</span>
    </Link>
  );

  return (
    <li style={{ "--i": index }}>
      {collapsed ? (
        <Tooltip title={item.label} placement="right" mouseEnterDelay={0.05}>
          {link}
        </Tooltip>
      ) : (
        link
      )}
    </li>
  );
};

const NavList = ({ role, collapsed, onNavigate }) => {
  const { pathname } = useLocation();
  const navigation = getNavigationByRole(role);
  const activeKey = getActiveNavItem(role, pathname)?.key;
  let index = 0;

  return (
    <nav className="ssd-nav" aria-label="Dashboard">
      {navigation.map((section) => (
        <div key={section.section} className="ssd-nav__section">
          <p className="ssd-nav__heading">{section.section}</p>
          <ul>
            {section.items.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                index={index++}
                active={item.key === activeKey}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const ScheduleLink = ({ role, collapsed, onNavigate }) => {
  const link = (
    <NavLink
      to={SCHEDULE_ROUTES[role] || "/"}
      onClick={onNavigate}
      className="ssd-side__schedule"
      aria-label={collapsed ? "View schedule" : undefined}>
      <Calendar size={16} aria-hidden="true" />
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
  const { collapsed, mobileOpen, closeMobile } = useSidebar();
  const drawerRef = useRef(null);

  // Drawer: Escape closes, focus moves in, page behind stops scrolling
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector("button, a")?.focus();
    const onKey = (e) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      <aside id="ssd-sidebar" className="ssd-side" data-collapsed={collapsed}>
        <NavList role={userRole} collapsed={collapsed} />
        <div className="ssd-side__foot">
          <ScheduleLink role={userRole} collapsed={collapsed} />
        </div>
      </aside>

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
          <Link
            to={`/${userRole}/dashboard`}
            className="ssd-brand"
            onClick={closeMobile}>
            <BrandMark size={30} />
            <span className="ssd-brand__text">
              <b>
                Smart <span>School</span>
              </b>
            </span>
          </Link>
          <button
            type="button"
            className="ssd-icon-btn"
            onClick={closeMobile}
            aria-label="Close menu">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <NavList role={userRole} collapsed={false} onNavigate={closeMobile} />
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
