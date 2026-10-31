/**
 * DashboardHeader — the global topbar
 * Brand, sidebar toggle, search (command palette), quick actions, theme,
 * notifications and the account menu.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Tooltip } from "antd";
import {
  Check,
  LogOut,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu as MenuIcon,
  Plus,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../../context/ThemeContext";
import { BrandMark } from "../../features/landing/components/primitives";
import { QUICK_ACTIONS } from "../Sidebar/navigation.config";
import CommandPalette from "./CommandPalette";
import NotificationCenter from "./NotificationCenter";

const ROLE_LABELS = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const THEMES = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return (
    parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
  ).toUpperCase();
};

const isTyping = (el) =>
  el &&
  (el.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

const DashboardHeader = ({ userName, userRole }) => {
  const { logout, userEmail, user } = useAuth();
  const { collapsed, mobileOpen, isMobile, toggleSidebar } = useSidebar();
  const { preference, resolved, setPreference } = useTheme();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const roleLabel = ROLE_LABELS[userRole] || "User";

  // Ctrl/⌘ K and "/" open search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "/" && !isTyping(document.activeElement)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const quickItems = (QUICK_ACTIONS[userRole] || []).map((a) => {
    const Icon = a.icon;
    return {
      key: a.key,
      label: (
        <span className="flex items-center gap-3 py-0.5">
          <span className={`ssd-ico ssd-ico--sm ssd-tone--${a.tone}`}>
            <Icon size={15} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <b className="block text-[0.87rem] font-semibold">{a.label}</b>
            <small className="block text-xs text-slate-500">{a.hint}</small>
          </span>
        </span>
      ),
      onClick: () => navigate(a.path),
    };
  });

  const themeItems = THEMES.map((t) => {
    const Icon = t.icon;
    return {
      key: t.key,
      icon: <Icon size={16} aria-hidden="true" />,
      label: (
        <span className="flex items-center justify-between gap-6">
          {t.label}
          {preference === t.key && <Check size={15} aria-hidden="true" />}
        </span>
      ),
      onClick: () => setPreference(t.key),
    };
  });

  const userItems = [
    {
      key: "who",
      type: "group",
      label: (
        <div className="flex items-center gap-3 py-1.5 pr-2">
          <span className="ssd-avatar ssd-avatar--lg" aria-hidden="true">
            {getInitials(userName)}
          </span>
          <span className="min-w-0 leading-tight">
            <b className="block truncate text-[0.92rem] font-semibold text-[var(--ssl-ink)]">
              {userName || "User"}
            </b>
            <small className="block truncate text-xs text-slate-500">
              {userEmail || user?.email}
            </small>
            <span className="ssd-chip mt-1.5 bg-[var(--role-bg)] text-[var(--role-ink)]">
              {roleLabel}
            </span>
          </span>
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
      label: <Link to={`/${userRole}/settings`}>Account settings</Link>,
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

  const ThemeIcon = resolved === "dark" ? Moon : Sun;
  const SideIcon = isMobile
    ? MenuIcon
    : collapsed
      ? PanelLeftOpen
      : PanelLeftClose;

  return (
    <header className="ssd-top">
      <div className="ssd-top__left">
        <Tooltip
          title={
            isMobile
              ? "Menu"
              : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }>
          <button
            type="button"
            className="ssd-icon-btn"
            onClick={toggleSidebar}
            aria-label={
              isMobile
                ? "Open menu"
                : collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
            }
            aria-controls={isMobile ? "ssd-drawer" : "ssd-sidebar"}
            aria-expanded={isMobile ? mobileOpen : !collapsed}>
            <SideIcon size={18} aria-hidden="true" />
          </button>
        </Tooltip>
        <Link
          to={`/${userRole}/dashboard`}
          className="ssd-brand ssd-top__brand"
          aria-label="Smart School dashboard">
          <BrandMark size={30} />
          <span className="ssd-brand__text">
            <b>
              Smart <span>School</span>
            </b>
            <small>{roleLabel} portal</small>
          </span>
        </Link>
      </div>

      <button
        type="button"
        className="ssd-search"
        onClick={() => setPaletteOpen(true)}
        aria-label="Search pages and actions">
        <Search size={16} aria-hidden="true" />
        <span>Search pages and actions…</span>
        <span className="ssd-kbd" aria-hidden="true">
          Ctrl K
        </span>
      </button>

      <div className="ssd-top__right">
        <button
          type="button"
          className="ssd-icon-btn ssd-search-mobile"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search pages and actions">
          <Search size={18} aria-hidden="true" />
        </button>

        <Dropdown
          menu={{ items: quickItems }}
          trigger={["click"]}
          placement="bottomRight">
          <button
            type="button"
            className="ssd-icon-btn"
            aria-label="Quick actions"
            title="Quick actions">
            <Plus size={19} aria-hidden="true" />
          </button>
        </Dropdown>

        <Dropdown
          menu={{
            items: themeItems,
            selectable: true,
            selectedKeys: [preference],
          }}
          trigger={["click"]}
          placement="bottomRight">
          <button
            type="button"
            className="ssd-icon-btn"
            aria-label={`Theme: ${preference}`}
            title="Theme">
            <ThemeIcon size={18} aria-hidden="true" />
          </button>
        </Dropdown>

        <NotificationCenter role={userRole} userId={user?._id || user?.id} />

        <span className="ssd-top__divider" aria-hidden="true" />

        <Dropdown
          menu={{ items: userItems }}
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{ minWidth: 260 }}>
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
          </button>
        </Dropdown>
      </div>

      <CommandPalette
        role={userRole}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </header>
  );
};

export default DashboardHeader;
