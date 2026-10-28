/**
 * DashboardHeader
 * Sticky top bar: drawer toggle (below 1024px), current page title,
 * calendar shortcut, and the account menu.
 */

import { Link, useLocation } from "react-router-dom";
import { Dropdown } from "antd";
import {
  CalendarDays,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../context/SidebarContext";
import { getPageTitle } from "../Sidebar/navigation.config";

const ROLE_LABELS = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return (
    parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
  ).toUpperCase();
};

const DashboardHeader = ({ userName, userRole }) => {
  const { logout } = useAuth();
  const { mobileOpen, toggleSidebar } = useSidebar();
  const { pathname } = useLocation();

  const roleLabel = ROLE_LABELS[userRole] || "User";
  const title = getPageTitle(userRole, pathname);

  const userMenuItems = [
    {
      key: "who",
      type: "group",
      label: (
        <div className="ssd-menu__who">
          <b>{userName || "User"}</b>
          <small>{roleLabel}</small>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserRound size={16} aria-hidden="true" />,
      label: <Link to={`/${userRole}/profile`}>My profile</Link>,
    },
    {
      key: "settings",
      icon: <Settings size={16} aria-hidden="true" />,
      label: <Link to={`/${userRole}/settings`}>Settings</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      icon: <LogOut size={16} aria-hidden="true" />,
      label: "Log out",
      onClick: logout,
    },
  ];

  return (
    <header className="ssd-header">
      <button
        type="button"
        className="ssd-icon-btn ssd-header__menu"
        onClick={toggleSidebar}
        aria-label="Open menu"
        aria-controls="ssd-drawer"
        aria-expanded={mobileOpen}>
        <Menu size={18} aria-hidden="true" />
      </button>

      <div className="ssd-header__title">
        <p>{roleLabel}</p>
        <h1>{title}</h1>
      </div>

      <div className="ssd-header__actions">
        <Link
          to={`/${userRole}/calendar`}
          className="ssd-icon-btn"
          aria-label="Academic calendar"
          title="Academic calendar">
          <CalendarDays size={18} aria-hidden="true" />
        </Link>

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="ssd-menu">
          <button
            type="button"
            className="ssd-user"
            aria-label={`Account menu for ${userName || "user"}`}>
            <span className="ssd-avatar" aria-hidden="true">
              {getInitials(userName)}
            </span>
            <span className="ssd-user__text">
              <b>{userName || "User"}</b>
              <small>{roleLabel}</small>
            </span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default DashboardHeader;
