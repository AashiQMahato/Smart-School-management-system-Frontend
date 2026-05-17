/**
 * Sidebar Navigation Configuration
 * Defines navigation items for each role
 */

import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  BarChartOutlined,
  BellOutlined,
  MessageOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ReadOutlined,
  CreditCardOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

/**
 * Navigation items for Admin role
 */
export const adminNavigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardOutlined,
    path: "/admin/dashboard",
  },
  {
    key: "users",
    label: "User Management",
    icon: TeamOutlined,
    children: [
      { key: "teachers", label: "Teachers", path: "/admin/users/teachers" },
      { key: "students", label: "Students", path: "/admin/users/students" },
      { key: "parents", label: "Parents", path: "/admin/users/parents" },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    icon: BookOutlined,
    children: [
      { key: "classes", label: "Classes", path: "/admin/academics/classes" },
      { key: "subjects", label: "Subjects", path: "/admin/academics/subjects" },
      {
        key: "timetable",
        label: "Timetable",
        path: "/admin/academics/timetable",
      },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: CheckCircleOutlined,
    path: "/admin/attendance",
  },
  {
    key: "results",
    label: "Results",
    icon: TrophyOutlined,
    path: "/admin/results",
  },
  {
    key: "fees",
    label: "Fee Management",
    icon: DollarOutlined,
    path: "/admin/fees",
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    icon: BarChartOutlined,
    path: "/admin/reports",
  },
  {
    key: "settings",
    label: "Settings",
    icon: SettingOutlined,
    path: "/admin/settings",
  },
];

/**
 * Navigation items for Teacher role
 */
export const teacherNavigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardOutlined,
    path: "/teacher/dashboard",
  },
  {
    key: "attendance",
    label: "Attendance",
    icon: CheckCircleOutlined,
    path: "/teacher/attendance",
  },
  {
    key: "grades",
    label: "Grades & Assignments",
    icon: FileTextOutlined,
    children: [
      {
        key: "assignments",
        label: "Assignments",
        path: "/teacher/assignments",
      },
      { key: "grades", label: "Enter Grades", path: "/teacher/grades/enter" },
      { key: "results", label: "Results", path: "/teacher/grades/results" },
    ],
  },
  {
    key: "students",
    label: "My Students",
    icon: SolutionOutlined,
    path: "/teacher/students",
  },
  {
    key: "schedule",
    label: "My Schedule",
    icon: CalendarOutlined,
    path: "/teacher/schedule",
  },
  {
    key: "fees",
    label: "Fee Overview",
    icon: CreditCardOutlined,
    path: "/teacher/fees",
  },
  {
    key: "communication",
    label: "Communication",
    icon: MessageOutlined,
    path: "/teacher/communication",
  },
  {
    key: "profile",
    label: "Profile",
    icon: UserOutlined,
    path: "/teacher/profile",
  },
];

/**
 * Navigation items for Student role
 */
export const studentNavigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardOutlined,
    path: "/student/dashboard",
  },
  {
    key: "attendance",
    label: "My Attendance",
    icon: CheckCircleOutlined,
    path: "/student/attendance",
  },
  {
    key: "academics",
    label: "Academics",
    icon: ReadOutlined,
    children: [
      { key: "grades", label: "My Grades", path: "/student/academics/grades" },
      {
        key: "assignments",
        label: "Assignments",
        path: "/student/assignments",
      },
      { key: "results", label: "Results", path: "/student/academics/results" },
    ],
  },
  {
    key: "timetable",
    label: "Timetable",
    icon: ScheduleOutlined,
    path: "/student/timetable",
  },
  {
    key: "fees",
    label: "Fee Status",
    icon: CreditCardOutlined,
    path: "/student/fees",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: BellOutlined,
    path: "/student/notifications",
  },
  {
    key: "profile",
    label: "Profile",
    icon: UserOutlined,
    path: "/student/profile",
  },
];

/**
 * Navigation items for Parent role
 */
export const parentNavigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardOutlined,
    path: "/parent/dashboard",
  },
  {
    key: "children",
    label: "My Children",
    icon: TeamOutlined,
    path: "/parent/children",
  },
  {
    key: "attendance",
    label: "Child's Attendance",
    icon: CheckCircleOutlined,
    path: "/parent/attendance",
  },
  {
    key: "performance",
    label: "Academic Performance",
    icon: TrophyOutlined,
    children: [
      { key: "grades", label: "Grades", path: "/parent/performance/grades" },
    ],
  },
  {
    key: "fees",
    label: "Fee & Payments",
    icon: DollarOutlined,
    path: "/parent/fees/status",
  },
  {
    key: "communication",
    label: "Communication",
    icon: MessageOutlined,
    path: "/parent/communication",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: BellOutlined,
    path: "/parent/notifications",
  },
  {
    key: "profile",
    label: "Profile",
    icon: UserOutlined,
    path: "/parent/profile",
  },
];

/**
 * Get navigation items by role
 * @param {string} role - User role
 * @returns {Array} Navigation items
 */
export const getNavigationByRole = (role) => {
  const navigationMap = {
    admin: adminNavigation,
    teacher: teacherNavigation,
    student: studentNavigation,
    parent: parentNavigation,
  };

  return navigationMap[role?.toLowerCase()] || [];
};

export default {
  adminNavigation,
  teacherNavigation,
  studentNavigation,
  parentNavigation,
  getNavigationByRole,
};
