/**
 * Presentation for school-calendar event types (icon + module colour).
 * Used by the notification centre and the dashboards' event lists.
 */

import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Megaphone,
  PartyPopper,
  Wallet,
} from "lucide-react";

export const EVENT_TYPE_UI = {
  exam: { label: "Exams", single: "Exam", icon: GraduationCap, tone: "orange" },
  announcement: {
    label: "Announcements",
    single: "Announcement",
    icon: Megaphone,
    tone: "amber",
  },
  assignment_deadline: {
    label: "Deadlines",
    single: "Deadline",
    icon: ClipboardList,
    tone: "purple",
  },
  school_event: {
    label: "Events",
    single: "Event",
    icon: CalendarDays,
    tone: "sky",
  },
  holiday: {
    label: "Holidays",
    single: "Holiday",
    icon: PartyPopper,
    tone: "green",
  },
  fee_due: { label: "Fees", single: "Fee due", icon: Wallet, tone: "teal" },
};

export const eventTypeUI = (type) =>
  EVENT_TYPE_UI[type] || EVENT_TYPE_UI.school_event;

/** "Today", "Tomorrow", "In 3 days", "2 days ago", or a short date. */
export const relativeDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < -1 && diff >= -7) return `${-diff} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
