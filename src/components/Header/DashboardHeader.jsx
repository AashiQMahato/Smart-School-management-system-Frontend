/**
 * DashboardHeader Component
 * Modern, clean header with user menu
 * Features: User avatar, role badge, dropdown menu, responsive design
 * Design: Solid colors only, minimal and professional
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";

/**
 * Role display names and styling - Solid colors only
 */
const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    avatarBg: "bg-slate-900",
  },
  teacher: {
    label: "Teacher",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    avatarBg: "bg-blue-600",
  },
  student: {
    label: "Student",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    avatarBg: "bg-emerald-600",
  },
  parent: {
    label: "Parent",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    avatarBg: "bg-violet-600",
  },
};

/**
 * DashboardHeader Component
 */
const DashboardHeader = ({ userName, userRole }) => {
  const { logout } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const roleConfig = ROLE_CONFIG[userRole] || ROLE_CONFIG.admin;

  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "header",
      type: "group",
      label: (
        <div className="px-1 py-2">
          <div className="font-semibold text-slate-900">
            {userName || "User"}
          </div>
          <div className="text-xs text-slate-500">{roleConfig.label}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined className="text-slate-500" />,
      label: <Link to={`/${userRole}/profile`}>My Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined className="text-slate-500" />,
      label: <Link to={`/${userRole}/settings`}>Settings</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="text-red-600">Logout</span>,
      onClick: logout,
    },
  ];

  return (
    <header
      className={`
        fixed top-0 right-0 z-50 h-16
        bg-white border-b border-slate-200
        transition-all duration-300 ease-out
        ${isScrolled ? "shadow-md" : "shadow-sm"}
        ${collapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"}
      `}>
      <div className="h-full flex items-center justify-between px-4 lg:px-6 max-w-full">
        {/* Left Section */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="
              w-10 h-10 flex items-center justify-center
              rounded-lg text-slate-600 bg-slate-50
              hover:bg-slate-100 hover:text-slate-900
              active:scale-95
              transition-all duration-200
              border border-slate-200
            "
            aria-label="Toggle sidebar">
            <MenuOutlined className="text-lg" />
          </button>

          {/* Page Title - Hidden on mobile */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-slate-900">
              {roleConfig.label} Dashboard
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Calendar Button */}
          <button
            onClick={() => navigate(`/${userRole}/calendar`)}
            className="
              relative w-10 h-10 flex items-center justify-center
              rounded-lg text-indigo-600 bg-indigo-50
              hover:bg-indigo-100 hover:text-indigo-700
              hover:shadow-md hover:shadow-indigo-100
              hover:scale-105 active:scale-95
              transition-all duration-300 ease-out
              border border-indigo-200
            "
            aria-label="Academic Calendar"
            title="Academic Calendar">
            <CalendarOutlined className="text-lg" />
          </button>

          {/* Notifications */}
          <button
            className="
              relative w-10 h-10 flex items-center justify-center
              rounded-lg text-slate-600 bg-slate-50
              hover:bg-slate-100 hover:text-slate-900
              transition-all duration-200
              border border-slate-200
            "
            aria-label="Notifications">
            <BellOutlined className="text-lg" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Role Badge - Hidden on mobile */}
          <div
            className={`
              hidden sm:flex items-center px-3 py-1.5 rounded-lg
              ${roleConfig.badgeBg} ${roleConfig.badgeText}
              text-xs font-medium
            `}>
            {roleConfig.label}
          </div>

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            classNames="w-56">
            <button
              className="
                flex items-center gap-3 p-1.5 pr-3
                rounded-lg hover:bg-slate-50
                transition-all duration-200
                border border-transparent hover:border-slate-200
              ">
              {/* Avatar */}
              <div
                className={`
                  w-9 h-9 rounded-lg ${roleConfig.avatarBg}
                  flex items-center justify-center
                  text-white text-sm font-semibold
                  shadow-sm
                `}>
                {getUserInitials(userName)}
              </div>

              {/* User Info - Hidden on small screens */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-slate-900 truncate max-w-30">
                  {userName || "User"}
                </div>
                <div className="text-xs text-slate-500">{roleConfig.label}</div>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
