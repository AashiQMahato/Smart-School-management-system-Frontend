/**
 * Dashboard navigation, per role.
 * Single source for the sidebar and the header's page title.
 */

import {
  Award as AwardIcon,
  ClipboardCheck as ClipboardCheckIcon,
  Megaphone,
  PlusCircle,
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
          tone: "indigo",
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "User Management",
      items: [
        {
          key: "users",
          tone: "blue",
          label: "All Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          key: "student-enroll",
          tone: "blue",
          label: "Enroll Student",
          path: "/admin/students/enroll",
          icon: UserPlus,
        },
        {
          key: "parent-mapping",
          tone: "pink",
          label: "Parent-Child Link",
          path: "/admin/parents/mapping",
          icon: Link2,
        },
        {
          key: "assignments",
          tone: "violet",
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
          tone: "sky",
          label: "Classes",
          path: "/admin/academics/classes",
          icon: BookOpen,
        },
        {
          key: "subjects",
          tone: "sky",
          label: "Subjects",
          path: "/admin/academics/subjects",
          icon: Book,
        },
        {
          key: "timetable",
          tone: "sky",
          label: "Timetable",
          path: "/admin/academics/timetable",
          icon: Calendar,
        },
        {
          key: "attendance",
          tone: "emerald",
          label: "Attendance",
          path: "/admin/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "results",
          tone: "orange",
          label: "Results",
          path: "/admin/results",
          icon: Award,
        },
        {
          key: "calendar",
          tone: "amber",
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
          tone: "teal",
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
          tone: "fuchsia",
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
          tone: "slate",
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
          tone: "indigo",
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
          tone: "emerald",
          label: "Mark Attendance",
          path: "/teacher/attendance/mark",
          icon: Pencil,
        },
        {
          key: "view-attendance",
          tone: "emerald",
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
          tone: "sky",
          label: "My Classes",
          path: "/teacher/classes",
          icon: BookOpen,
        },
        {
          key: "students",
          tone: "blue",
          label: "My Students",
          path: "/teacher/students",
          icon: Users,
        },
        {
          key: "assignments",
          tone: "purple",
          label: "Assignments",
          path: "/teacher/assignments",
          icon: FileText,
        },
        {
          key: "schedule",
          tone: "sky",
          label: "My Schedule",
          path: "/teacher/schedule",
          icon: Calendar,
        },
        {
          key: "results",
          tone: "orange",
          label: "Results",
          path: "/teacher/grades/results",
          icon: Award,
        },
        {
          key: "calendar",
          tone: "amber",
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
          tone: "fuchsia",
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
          tone: "slate",
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
          tone: "indigo",
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
          tone: "sky",
          label: "My Classes",
          path: "/student/classes",
          icon: BookOpen,
        },
        {
          key: "attendance",
          tone: "emerald",
          label: "My Attendance",
          path: "/student/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "assignments",
          tone: "purple",
          label: "Assignments",
          path: "/student/assignments",
          icon: FileText,
        },
        {
          key: "results",
          tone: "orange",
          label: "Results",
          path: "/student/academics/results",
          icon: Award,
        },
        {
          key: "timetable",
          tone: "sky",
          label: "Timetable",
          path: "/student/timetable",
          icon: Calendar,
        },
        {
          key: "calendar",
          tone: "amber",
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
          tone: "teal",
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
          tone: "fuchsia",
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
          tone: "slate",
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
          tone: "indigo",
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
          tone: "pink",
          label: "My Children",
          path: "/parent/children",
          icon: Users,
        },
        {
          key: "attendance",
          tone: "emerald",
          label: "Attendance",
          path: "/parent/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "schedule",
          tone: "sky",
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
          tone: "orange",
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
          tone: "teal",
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
          tone: "amber",
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
          tone: "fuchsia",
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
          tone: "slate",
          label: "Settings",
          path: "/parent/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

/**
 * Frequent tasks per role, shown in the topbar's quick-action menu and the
 * command palette. Each opens the page where that task is done.
 */
export const QUICK_ACTIONS = {
  admin: [
    {
      key: "enroll",
      label: "Enroll student",
      hint: "Add a student to a class",
      path: "/admin/students/enroll",
      icon: UserPlus,
      tone: "blue",
    },
    {
      key: "add-user",
      label: "Add user",
      hint: "Teacher, parent or admin account",
      path: "/admin/users",
      icon: PlusCircle,
      tone: "violet",
    },
    {
      key: "create-class",
      label: "Create class",
      hint: "Classes and sections",
      path: "/admin/academics/classes",
      icon: BookOpen,
      tone: "sky",
    },
    {
      key: "add-subject",
      label: "Add subject",
      hint: "Subjects and codes",
      path: "/admin/academics/subjects",
      icon: Book,
      tone: "sky",
    },
    {
      key: "attendance",
      label: "Manage attendance",
      hint: "School-wide records",
      path: "/admin/attendance",
      icon: ClipboardCheckIcon,
      tone: "emerald",
    },
    {
      key: "announcement",
      label: "Create announcement",
      hint: "Publish on the school calendar",
      path: "/admin/calendar",
      icon: Megaphone,
      tone: "amber",
    },
  ],
  teacher: [
    {
      key: "attendance",
      label: "Take attendance",
      hint: "Mark today's class",
      path: "/teacher/attendance/mark",
      icon: ClipboardCheckIcon,
      tone: "emerald",
    },
    {
      key: "assignment",
      label: "Add assignment",
      hint: "Create and grade work",
      path: "/teacher/assignments",
      icon: FileText,
      tone: "purple",
    },
    {
      key: "marks",
      label: "Enter marks",
      hint: "Exam results",
      path: "/teacher/grades/enter",
      icon: AwardIcon,
      tone: "orange",
    },
    {
      key: "timetable",
      label: "View timetable",
      hint: "Your weekly schedule",
      path: "/teacher/schedule",
      icon: Calendar,
      tone: "sky",
    },
    {
      key: "students",
      label: "Manage students",
      hint: "Profiles and progress",
      path: "/teacher/students",
      icon: Users,
      tone: "blue",
    },
  ],
  student: [
    {
      key: "assignments",
      label: "My assignments",
      hint: "Submit and track work",
      path: "/student/assignments",
      icon: FileText,
      tone: "purple",
    },
    {
      key: "timetable",
      label: "Timetable",
      hint: "This week's classes",
      path: "/student/timetable",
      icon: Calendar,
      tone: "sky",
    },
    {
      key: "results",
      label: "Results",
      hint: "Exam marks and grades",
      path: "/student/academics/results",
      icon: AwardIcon,
      tone: "orange",
    },
    {
      key: "fees",
      label: "Fee status",
      hint: "Balance and history",
      path: "/student/fees",
      icon: CreditCard,
      tone: "teal",
    },
  ],
  parent: [
    {
      key: "attendance",
      label: "Child's attendance",
      hint: "Day-by-day record",
      path: "/parent/attendance",
      icon: ClipboardCheckIcon,
      tone: "emerald",
    },
    {
      key: "results",
      label: "Results",
      hint: "Exam marks and grades",
      path: "/parent/performance/grades",
      icon: AwardIcon,
      tone: "orange",
    },
    {
      key: "fees",
      label: "Pay fees",
      hint: "Status and history",
      path: "/parent/fees/status",
      icon: CreditCard,
      tone: "teal",
    },
    {
      key: "schedule",
      label: "Child's timetable",
      hint: "Weekly schedule",
      path: "/parent/child-schedule",
      icon: Calendar,
      tone: "sky",
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
