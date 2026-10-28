/**
 * Dashboard navigation, per role.
 * Single source for the sidebar and the header's page title.
 */

import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  ClipboardCheck,
  FileText,
  Calendar,
  CalendarDays,
  Award,
  UserCircle,
  CreditCard,
  UserPlus,
  Link2,
  Book,
  Pencil,
  Eye,
  BrainCircuit,
} from "lucide-react";

export const NAVIGATION_CONFIG = {
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

/** Where each role's "View schedule" shortcut goes. */
export const SCHEDULE_ROUTES = {
  admin: "/admin/academics/timetable",
  teacher: "/teacher/schedule",
  student: "/student/timetable",
  parent: "/parent/child-schedule",
};

/* Pages reachable from the user menu rather than the sidebar */
const EXTRA_TITLES = {
  profile: "My Profile",
  settings: "Settings",
  calendar: "Calendar",
};

export const getNavigationByRole = (role) =>
  NAVIGATION_CONFIG[role?.toLowerCase()] || [];

/**
 * The nav item for `pathname`: the one with the longest matching path,
 * so "/teacher/assignments/42" resolves to Assignments and
 * "/teacher/attendance/mark" to Mark Attendance (not View Records).
 */
export const getActiveNavItem = (role, pathname) => {
  let best = null;
  for (const section of getNavigationByRole(role)) {
    for (const item of section.items) {
      const matches =
        pathname === item.path || pathname.startsWith(`${item.path}/`);
      if (matches && (!best || item.path.length > best.path.length))
        best = item;
    }
  }
  return best;
};

export const getPageTitle = (role, pathname) => {
  const item = getActiveNavItem(role, pathname);
  if (item) return item.label;
  const last = pathname.split("/").filter(Boolean).pop();
  return EXTRA_TITLES[last] || "Dashboard";
};
