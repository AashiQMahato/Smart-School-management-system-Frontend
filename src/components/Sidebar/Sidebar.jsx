/**
 * Sidebar Component
 * Modern, responsive sidebar with role-based navigation
 * Features: Collapsible, mobile-friendly, smooth CSS-transform animations
 * Uses SidebarContext for shared state
 */

import { memo, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Settings,
  ClipboardCheck,
  FileText,
  Calendar,
  CalendarDays,
  Award,
  UserCircle,
  CreditCard,
  GraduationCap,
  X,
  Book,
  UserPlus,
  Link2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Eye,
  BrainCircuit,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

/* ──────────────────────────────
   Navigation Configuration
   ────────────────────────────── */
const NAVIGATION_CONFIG = {
  admin: [
    {
      section: "Main",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "User Management",
      items: [
        { key: "users", label: "All Users", path: "/admin/users", icon: Users },
        {
          key: "student-enroll",
          label: "Enroll Student",
          path: "/admin/students/enroll",
          icon: UserPlus,
        },
        {
          key: "parent-mapping",
          label: "Parent-Child Link",
          path: "/admin/parents/mapping",
          icon: Link2,
        },
        {
          key: "assignments",
          label: "Teacher Assign",
          path: "/admin/academics/teacher-assignments",
          icon: UserCircle,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "classes",
          label: "Classes",
          path: "/admin/academics/classes",
          icon: BookOpen,
        },
        {
          key: "subjects",
          label: "Subjects",
          path: "/admin/academics/subjects",
          icon: Book,
        },
        {
          key: "timetable",
          label: "Timetable",
          path: "/admin/academics/timetable",
          icon: Calendar,
        },
        {
          key: "attendance",
          label: "Attendance",
          path: "/admin/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "results",
          label: "Results",
          path: "/admin/results",
          icon: Award,
        },
        {
          key: "calendar",
          label: "Calendar",
          path: "/admin/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          key: "fees",
          label: "Fees & Finance",
          path: "/admin/fees",
          icon: DollarSign,
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          key: "ai-analytics",
          label: "AI Analytics",
          path: "/admin/ai-analytics",
          icon: BrainCircuit,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          key: "settings",
          label: "Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
  teacher: [
    {
      section: "Main",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/teacher/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Attendance",
      items: [
        {
          key: "mark-attendance",
          label: "Mark Attendance",
          path: "/teacher/attendance/mark",
          icon: Pencil,
        },
        {
          key: "view-attendance",
          label: "View Records",
          path: "/teacher/attendance",
          icon: Eye,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "classes",
          label: "My Classes",
          path: "/teacher/classes",
          icon: BookOpen,
        },
        {
          key: "students",
          label: "My Students",
          path: "/teacher/students",
          icon: Users,
        },
        {
          key: "assignments",
          label: "Assignments",
          path: "/teacher/assignments",
          icon: FileText,
        },
        {
          key: "schedule",
          label: "My Schedule",
          path: "/teacher/schedule",
          icon: Calendar,
        },
        {
          key: "results",
          label: "Results",
          path: "/teacher/grades/results",
          icon: Award,
        },
        {
          key: "calendar",
          label: "Calendar",
          path: "/teacher/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      section: "Insights",
      items: [
        {
          key: "ai-analytics",
          label: "AI Analytics",
          path: "/teacher/ai-analytics",
          icon: BrainCircuit,
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          key: "settings",
          label: "Settings",
          path: "/teacher/settings",
          icon: Settings,
        },
      ],
    },
  ],
  student: [
    {
      section: "Main",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/student/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "classes",
          label: "My Classes",
          path: "/student/classes",
          icon: BookOpen,
        },
        {
          key: "attendance",
          label: "My Attendance",
          path: "/student/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "assignments",
          label: "Assignments",
          path: "/student/assignments",
          icon: FileText,
        },
        {
          key: "results",
          label: "Results",
          path: "/student/academics/results",
          icon: Award,
        },
        {
          key: "timetable",
          label: "Timetable",
          path: "/student/timetable",
          icon: Calendar,
        },
        {
          key: "calendar",
          label: "Calendar",
          path: "/student/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          key: "fees",
          label: "Fee Status",
          path: "/student/fees",
          icon: CreditCard,
        },
      ],
    },
    {
      section: "Insights",
      items: [
        {
          key: "ai-analytics",
          label: "AI Analytics",
          path: "/student/ai-analytics",
          icon: BrainCircuit,
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          key: "settings",
          label: "Settings",
          path: "/student/settings",
          icon: Settings,
        },
      ],
    },
  ],
  parent: [
    {
      section: "Main",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/parent/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Children",
      items: [
        {
          key: "children",
          label: "My Children",
          path: "/parent/children",
          icon: Users,
        },
        {
          key: "attendance",
          label: "Attendance",
          path: "/parent/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "schedule",
          label: "Schedule",
          path: "/parent/child-schedule",
          icon: Calendar,
        },
      ],
    },
    {
      section: "Performance",
      items: [
        {
          key: "results",
          label: "Results",
          path: "/parent/performance/grades",
          icon: Award,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          key: "fees",
          label: "Fee Payments",
          path: "/parent/fees/status",
          icon: CreditCard,
        },
      ],
    },
    {
      section: "Calendar",
      items: [
        {
          key: "calendar",
          label: "Calendar",
          path: "/parent/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      section: "Insights",
      items: [
        {
          key: "ai-analytics",
          label: "AI Analytics",
          path: "/parent/ai-analytics",
          icon: BrainCircuit,
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          key: "settings",
          label: "Settings",
          path: "/parent/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

/* ──────────────────────────────
   Role Theme Configuration
   ────────────────────────────── */
const ROLE_THEMES = {
  admin: {
    primary: "bg-linear-to-br from-slate-800 to-slate-900",
    primaryHover: "hover:from-slate-700 hover:to-slate-800",
    accent: "bg-linear-to-r from-slate-700 to-slate-800",
    accentText: "text-slate-900",
    lightBg: "bg-linear-to-br from-slate-50 to-slate-100",
    lightText: "text-slate-800",
    border: "border-slate-200",
    glow: "shadow-slate-500/20",
  },
  teacher: {
    primary: "bg-linear-to-br from-blue-600 to-blue-700",
    primaryHover: "hover:from-blue-500 hover:to-blue-600",
    accent: "bg-linear-to-r from-blue-600 to-blue-700",
    accentText: "text-blue-700",
    lightBg: "bg-linear-to-br from-blue-50 to-blue-100",
    lightText: "text-blue-800",
    border: "border-blue-200",
    glow: "shadow-blue-500/20",
  },
  student: {
    primary: "bg-linear-to-br from-emerald-600 to-emerald-700",
    primaryHover: "hover:from-emerald-500 hover:to-emerald-600",
    accent: "bg-linear-to-r from-emerald-600 to-emerald-700",
    accentText: "text-emerald-700",
    lightBg: "bg-linear-to-br from-emerald-50 to-emerald-100",
    lightText: "text-emerald-800",
    border: "border-emerald-200",
    glow: "shadow-emerald-500/20",
  },
  parent: {
    primary: "bg-linear-to-br from-violet-600 to-violet-700",
    primaryHover: "hover:from-violet-500 hover:to-violet-600",
    accent: "bg-linear-to-r from-violet-600 to-violet-700",
    accentText: "text-violet-700",
    lightBg: "bg-linear-to-br from-violet-50 to-violet-100",
    lightText: "text-violet-800",
    border: "border-violet-200",
    glow: "shadow-violet-500/20",
  },
};

/* ──────────────────────────────
   NavItem — single navigation link
   ────────────────────────────── */
const NavItem = memo(({ item, collapsed, theme, onNavigate }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive =
    location.pathname === item.path ||
    (item.path.includes("?") && location.pathname === item.path.split("?")[0]);

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className="group relative block">
      <div
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            isActive
              ? `${theme.lightBg} ${theme.lightText} font-semibold shadow-sm`
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }
          ${collapsed ? "justify-center" : ""}
        `}>
        {/* Active indicator — smooth slide-in */}
        <div
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full ${theme.accent}
            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isActive ? "h-7 opacity-100" : "h-0 opacity-0"}
          `}
        />

        {/* Icon */}
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 1.75}
          className={`shrink-0 transition-transform duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-105"
          }`}
        />

        {/* Label — opacity + transform transition instead of conditional render */}
        <span
          className={`
            text-sm truncate whitespace-nowrap
            transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              collapsed
                ? "w-0 opacity-0 -translate-x-2 overflow-hidden"
                : "w-auto opacity-100 translate-x-0"
            }
          `}>
          {item.label}
        </span>
      </div>

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div
          className="
            absolute left-full ml-4 px-4 py-2.5
            bg-slate-900 text-white text-sm font-semibold
            rounded-xl shadow-2xl
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200 ease-out
            group-hover:translate-x-1
            whitespace-nowrap z-50
            pointer-events-none
            border border-slate-700
          ">
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
        </div>
      )}
    </NavLink>
  );
});

NavItem.displayName = "NavItem";

/* ──────────────────────────────
   NavSection — group of nav items
   ────────────────────────────── */
const NavSection = memo(({ section, collapsed, theme, onNavigate }) => {
  return (
    <div className="space-y-1">
      {/* Section header — fade transition */}
      <div
        className={`
          px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "opacity-0 h-0 overflow-hidden py-0" : "opacity-100 h-auto"}
        `}>
        {section.section}
      </div>

      <div className="space-y-0.5">
        {section.items.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            collapsed={collapsed}
            theme={theme}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
});

NavSection.displayName = "NavSection";

/* ──────────────────────────────
   Schedule route map
   ────────────────────────────── */
const SCHEDULE_ROUTES = {
  admin: "/admin/academics/timetable",
  teacher: "/teacher/schedule",
  student: "/student/timetable",
  parent: "/parent/child-schedule",
};

/* ──────────────────────────────
   Main Sidebar Component
   ────────────────────────────── */
const Sidebar = ({ userRole = "admin" }) => {
  const { collapsed, mobileOpen, closeMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const navigation = useMemo(
    () => NAVIGATION_CONFIG[userRole] || NAVIGATION_CONFIG.admin,
    [userRole],
  );
  const theme = useMemo(
    () => ROLE_THEMES[userRole] || ROLE_THEMES.admin,
    [userRole],
  );

  const handleScheduleClick = () => {
    navigate(SCHEDULE_ROUTES[userRole] || "/");
    closeMobile();
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 h-full
          bg-white border-r border-slate-200 shadow-xl z-40
          transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "w-20" : "w-64"}
        `}>
        {/* Logo */}
        <div
          className={`
            flex items-center h-16 px-4 border-b border-slate-200 bg-linear-to-r from-slate-100 to-white
            ${collapsed ? "justify-center px-2" : "justify-between"}
          `}>
          <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
            <div
              className={`
                flex items-center justify-center shrink-0 w-11 h-11
                rounded-xl ${theme.primary} shadow-lg ${theme.glow}
                transition-transform duration-300 hover:scale-110 hover:rotate-3
              `}>
              <GraduationCap
                size={24}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>

            {/* Brand text — animate opacity + width */}
            <div
              className={`
                overflow-hidden whitespace-nowrap
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
              `}>
              <div className="text-lg font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-slate-500 font-medium">
                School Management
              </div>
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100
              transition-all duration-300 hover:scale-110 active:scale-95
              ${collapsed ? "hidden" : ""}
            `}
            aria-label="Collapse sidebar">
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="mx-auto mt-3 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
            aria-label="Expand sidebar">
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={collapsed}
              theme={theme}
            />
          ))}
        </nav>

        {/* Quick Action */}
        <div className={`px-3 pb-3 ${collapsed ? "px-2" : ""}`}>
          <button
            onClick={handleScheduleClick}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-3.5 rounded-xl font-semibold text-white
              shadow-lg hover:shadow-xl ${theme.glow}
              transition-all duration-300 ease-out
              hover:scale-[1.03] active:scale-95
              ${theme.primary} ${theme.primaryHover}
            `}
            title="View Schedule">
            <Calendar size={19} strokeWidth={2.5} />
            <span
              className={`
                tracking-wide whitespace-nowrap
                transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
              `}>
              View Schedule
            </span>
          </button>
        </div>

        {/* Footer */}
        <div
          className={`px-4 py-3 border-t border-slate-200 ${collapsed ? "text-center px-2" : ""}`}>
          <div className="text-xs text-slate-400">
            {collapsed ? "\u00A9" : `\u00A9 ${new Date().getFullYear()} SSMS`}
          </div>
        </div>
      </aside>

      {/* ── Mobile Overlay ── */}
      <div
        className={`
          lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300 ease-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Mobile Sidebar ── */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-80 bg-white z-50
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          will-change-transform shadow-2xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex items-center justify-center w-11 h-11
                rounded-xl ${theme.primary} shadow-lg ${theme.glow}
                transition-transform duration-300 hover:scale-110 hover:rotate-3
              `}>
              <GraduationCap
                size={24}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>
            <div>
              <div className="text-lg font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-slate-500 font-medium">
                School Management
              </div>
            </div>
          </div>

          <button
            onClick={closeMobile}
            className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Close menu">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-4 space-y-6 overscroll-contain scrollbar-thin">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={false}
              theme={theme}
              onNavigate={closeMobile}
            />
          ))}
        </nav>

        {/* Mobile Quick Action */}
        <div className="px-4 pb-4">
          <button
            onClick={handleScheduleClick}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-3.5 rounded-xl font-semibold text-white
              shadow-lg hover:shadow-xl ${theme.glow}
              transition-all duration-300 ease-out
              hover:scale-[1.03] active:scale-95
              ${theme.primary} ${theme.primaryHover}
            `}>
            <Calendar size={19} strokeWidth={2.5} />
            <span className="tracking-wide">View Schedule</span>
          </button>
        </div>

        {/* Mobile Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-linear-to-r from-slate-50 to-white">
          <div className="text-xs text-slate-500 font-medium text-center">
            &copy; {new Date().getFullYear()} SSMS - Smart School System
          </div>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
