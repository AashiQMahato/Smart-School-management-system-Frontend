/**
 * Landing page content.
 * Every capability listed here maps to a page that exists in the app
 * (see App.jsx routes). Anything not yet built is flagged `planned`.
 * All numbers shown in previews are illustrative sample data.
 */

import {
  Backpack,
  BookOpen,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  LayoutGrid,
  Megaphone,
  Network,
  PenLine,
  Presentation,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export const BENEFITS = [
  { icon: LayoutGrid, label: "Centralized school administration" },
  { icon: ClipboardCheck, label: "Easier attendance tracking" },
  { icon: ChartColumn, label: "Better academic visibility" },
  { icon: Network, label: "Connected school communities" },
];

/* span: columns out of 12 on desktop (default 4); accent picks the colour token */
export const FEATURES = [
  {
    key: "students",
    icon: Users,
    title: "Student management & records",
    text: "Enroll students, keep profiles in one place, and link each student to their class and parents.",
    accent: "blue",
    span: 7,
    visual: "records",
  },
  {
    key: "attendance",
    icon: ClipboardCheck,
    title: "Attendance management",
    text: "Teachers mark attendance by class in minutes; students and parents see the history.",
    accent: "teal",
    span: 5,
    visual: "attendance",
  },
  {
    key: "teachers",
    icon: UserCog,
    title: "Teacher & staff management",
    text: "Maintain teacher profiles and assign them to the classes and subjects they teach.",
    accent: "indigo",
  },
  {
    key: "grades",
    icon: ChartColumn,
    title: "Grades & results",
    text: "Enter marks, publish results, and view report cards per student and class.",
    accent: "coral",
  },
  {
    key: "assignments",
    icon: PenLine,
    title: "Assignments & submissions",
    text: "Create assignments, collect student submissions, and grade them with feedback.",
    accent: "amber",
  },
  {
    key: "schedule",
    icon: CalendarDays,
    title: "Classes, subjects & timetable",
    text: "Organize classes and subjects and build weekly timetables everyone can follow.",
    accent: "blue",
  },
  {
    key: "notices",
    icon: Megaphone,
    title: "Calendar & announcements",
    text: "Publish exams, holidays, deadlines, and announcements on a shared school calendar.",
    accent: "indigo",
  },
  {
    key: "portals",
    icon: HeartHandshake,
    title: "Parent & student access",
    text: "Students and parents sign in to see attendance, results, timetables, and fee status.",
    accent: "teal",
  },
  {
    key: "fees",
    icon: Wallet,
    title: "Fee management",
    text: "Track fee status and payment history, and generate downloadable fee bills.",
    accent: "amber",
    span: 5,
  },
  {
    key: "insights",
    icon: Sparkles,
    title: "Insights & analytics",
    text: "Analytics pages summarize class performance, attendance trends, and students who may need support.",
    accent: "coral",
    span: 7,
    visual: "insights",
  },
];

export const PLANNED_FEATURES = ["In-app messaging", "Notification centre"];

export const ROLES = [
  {
    key: "admin",
    label: "Administrator",
    short: "Admin",
    icon: ShieldCheck,
    tagline: "Run the whole school from one place.",
    points: [
      "Manage students, teachers, parents, and user accounts",
      "Set up classes, subjects, timetables, and teacher assignments",
      "Oversee attendance, results, fees, and the school calendar",
      "Review school-wide analytics and insights",
    ],
  },
  {
    key: "teacher",
    label: "Teacher",
    short: "Teacher",
    icon: Presentation,
    tagline: "Spend less time on admin, more on teaching.",
    points: [
      "See assigned classes, students, and teaching schedule",
      "Mark and review class attendance",
      "Create assignments and grade submissions",
      "Enter marks and publish results",
    ],
  },
  {
    key: "student",
    label: "Student",
    short: "Student",
    icon: Backpack,
    tagline: "Everything for the school day, in one view.",
    points: [
      "View timetable, classes, and upcoming events",
      "Submit assignments and track their status",
      "Check attendance, results, and fee status",
    ],
  },
  {
    key: "parent",
    label: "Parent",
    short: "Parent",
    icon: HeartHandshake,
    tagline: "Stay close to your child's school life.",
    points: [
      "Follow each linked child's attendance and results",
      "See your child's schedule and the school calendar",
      "Check fee status and payment history",
    ],
  },
];

export const DEMO_TABS = [
  {
    key: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
    title: "Mark a whole class in one pass",
    text: "Teachers open their class, tick present, absent, or late, and save. Admins see attendance across the school; students and parents see their own history.",
    bullets: [
      "Class-wise marking",
      "Daily and monthly views",
      "Visible to students and parents",
    ],
  },
  {
    key: "students",
    label: "Students",
    icon: Users,
    title: "One record for every student",
    text: "Enrollment, class placement, and parent links live together, so the right people always find the right student.",
    bullets: [
      "Enrollment by class & section",
      "Parent–child linking",
      "Searchable directory",
    ],
  },
  {
    key: "assignments",
    label: "Assignments",
    icon: FileText,
    title: "From assignment to grade",
    text: "Teachers post work with a due date, students submit online, and teachers grade each submission with feedback.",
    bullets: [
      "Due dates on the calendar",
      "Online submissions",
      "Grading with feedback",
    ],
  },
  {
    key: "notices",
    label: "Notices",
    icon: Megaphone,
    title: "Keep everyone on the same page",
    text: "Exams, holidays, deadlines, and announcements are published to a shared school calendar for every role.",
    bullets: [
      "Exams & holidays",
      "Announcements",
      "Month, week, and list views",
    ],
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Organize your school",
    text: "Administrators set up classes, subjects, and timetables, then add teachers and enroll students.",
    icon: BookOpen,
  },
  {
    n: "02",
    title: "Connect your school community",
    text: "Accounts are created for teachers, students, and parents, and each parent is linked to their child.",
    icon: Network,
  },
  {
    n: "03",
    title: "Manage everyday activities",
    text: "Attendance, assignments, results, fees, and announcements flow through one shared system.",
    icon: Sparkles,
  },
];

export const WHY = [
  {
    title: "Less fragmented administration",
    text: "Records, schedules, and fees live in one system instead of scattered spreadsheets.",
  },
  {
    title: "Easier access to information",
    text: "Each person signs in and finds what is relevant to them, without asking around.",
  },
  {
    title: "More organized academic workflows",
    text: "Assignments, grading, and results follow the same clear path every term.",
  },
  {
    title: "Better visibility across activities",
    text: "Attendance, results, and events are visible to the people who need them.",
  },
  {
    title: "Role-appropriate access",
    text: "Admins, teachers, students, and parents each see only what their role allows.",
  },
];
