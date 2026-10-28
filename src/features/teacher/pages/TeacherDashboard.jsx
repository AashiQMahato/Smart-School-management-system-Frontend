/**
 * Teacher Dashboard
 * Today's teaching schedule, assigned classes and subjects, and
 * shortcuts to attendance and assignments. Data comes from the API.
 */

import { useState, useEffect } from "react";
import { Skeleton, message } from "antd";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Layers,
  School,
  Users,
} from "lucide-react";
import {
  HeroBanner,
  Panel,
  PanelEmpty,
  QuickActionCard,
} from "../../../components/UI";
import {
  getMyAssignments,
  getMySchedule,
  getMyClasses,
  getStudentsByClass,
} from "../../../services/teacher.service";

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    assignedClasses: [],
    assignedSubjects: [],
    classTeacherOf: [],
    schedule: [],
    totalStudents: 0,
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch assignments (classes and subjects assigned)
      const assignmentsRes = await getMyAssignments().catch(() => ({
        data: { assignedClasses: [], assignedSubjects: [] },
      }));

      // Fetch classes where user is class teacher
      const classTeacherRes = await getMyClasses().catch(() => ({ data: [] }));

      // Fetch schedule
      setScheduleLoading(true);
      const scheduleRes = await getMySchedule().catch(() => ({ data: [] }));
      setScheduleLoading(false);

      const rawAssignedClasses = assignmentsRes.data?.assignedClasses || [];
      const rawAssignedSubjects = assignmentsRes.data?.assignedSubjects || [];

      // Prefer schedule-derived assignment items when available (deduped in teacher.service)
      const assignedFromItems = Array.isArray(assignmentsRes.items)
        ? assignmentsRes.items.map((x) => x?.classId).filter(Boolean)
        : [];

      const mergedAssignedClasses = [
        ...rawAssignedClasses,
        ...assignedFromItems,
      ];

      const uniqueAssignedClasses = [
        ...new Map(
          mergedAssignedClasses.filter(Boolean).map((cls) => {
            const id = cls?._id || cls;
            return [String(id), cls];
          }),
        ).values(),
      ];

      const uniqueAssignedSubjects = [
        ...new Map(
          rawAssignedSubjects.filter(Boolean).map((sub) => {
            const id = sub?._id || sub;
            return [String(id), sub];
          }),
        ).values(),
      ];

      // Fetch per-class student counts (assignedClasses doesn't include a students array)
      const classIds = uniqueAssignedClasses
        .map((cls) => cls?._id || cls)
        .filter(Boolean)
        .map((id) => String(id));

      const countsEntries = await Promise.all(
        classIds.map(async (id) => {
          try {
            const studentsRes = await getStudentsByClass(id);
            return [id, studentsRes?.data?.length || 0];
          } catch {
            return [id, 0];
          }
        }),
      );

      const classStudentCounts = Object.fromEntries(countsEntries);

      const enhancedAssignedClasses = uniqueAssignedClasses.map((cls) => {
        const id = String(cls?._id || cls);
        const totalStudents = classStudentCounts[id] || 0;

        if (typeof cls === "object" && cls !== null) {
          return { ...cls, totalStudents };
        }

        return { _id: id, name: String(cls), totalStudents };
      });

      const totalStudents = enhancedAssignedClasses.reduce(
        (sum, cls) => sum + (cls?.totalStudents || 0),
        0,
      );

      setTeacherData({
        assignedClasses: enhancedAssignedClasses,
        assignedSubjects: uniqueAssignedSubjects,
        classTeacherOf: classTeacherRes.data || [],
        schedule: scheduleRes.data || [],
        totalStudents,
      });
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return teacherData.schedule.filter(
      (s) => s.dayOfWeek?.toLowerCase() === today,
    );
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const todaySchedule = getTodaySchedule();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "My students",
      value: teacherData.totalStudents,
      icon: Users,
      tone: "blue",
    },
    {
      label: "Classes today",
      value: todaySchedule.length,
      icon: CalendarClock,
      tone: "teal",
    },
    {
      label: "Assigned classes",
      value: teacherData.assignedClasses.length,
      icon: School,
      tone: "indigo",
    },
    {
      label: "Subjects",
      value: teacherData.assignedSubjects.length,
      icon: BookOpen,
      tone: "amber",
    },
  ];

  return (
    <div>
      <HeroBanner
        eyebrow={today}
        title="Your teaching day"
        subtitle={
          todaySchedule.length
            ? `You have ${todaySchedule.length} ${todaySchedule.length === 1 ? "class" : "classes"} scheduled today.`
            : "No classes are scheduled for you today."
        }
        rightContent={
          <Link
            to="/teacher/attendance/mark"
            className="ssd-btn ssd-btn--light">
            <ClipboardCheck size={16} aria-hidden="true" />
            Mark attendance
          </Link>
        }
      />

      <div className="ssd-stats">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`ssd-stat ssd-tone--${item.tone}`}>
              <span className="ssd-stat__icon mb-2">
                <Icon size={18} aria-hidden="true" />
              </span>
              {loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <span className="ssd-stat__value">{item.value}</span>
              )}
              <span className="ssd-stat__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={CalendarDays}
          tone="teal"
          title="Today's schedule"
          subtitle="Your periods for today"
          link={{ to: "/teacher/schedule", label: "Full schedule" }}>
          {loading || scheduleLoading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : todaySchedule.length > 0 ? (
            <ul className="ssd-list">
              {todaySchedule.map((item, index) => (
                <li key={item._id || index}>
                  <span className="ssd-chip ssd-tone--teal tabular-nums">
                    {formatTime(item.startTime)}
                  </span>
                  <div className="ssd-list__main">
                    <b>
                      {item.classId?.name || "Class"} ·{" "}
                      {item.subjectId?.name || "Subject"}
                    </b>
                    <small>
                      {formatTime(item.startTime)} – {formatTime(item.endTime)}
                    </small>
                  </div>
                  <span className="ssd-chip">{item.room || "Room TBA"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmpty
              icon={CalendarDays}
              title="Nothing scheduled today"
              text="Your timetable for the week is on the schedule page."
            />
          )}
        </Panel>

        <Panel
          icon={School}
          tone="indigo"
          title="My classes"
          subtitle="Classes you teach"
          link={{ to: "/teacher/classes", label: "View all" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : teacherData.assignedClasses.length > 0 ? (
            <ul className="ssd-list">
              {teacherData.assignedClasses.slice(0, 6).map((cls) => {
                const name = cls?.name || "Class";
                const section = cls?.section ? ` · ${cls.section}` : "";
                const count = cls?.totalStudents ?? 0;
                return (
                  <li key={cls?._id || `${name}${section}`}>
                    <span className="ssd-initials ssd-tone--indigo">
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="ssd-list__main">
                      <b>
                        {name}
                        {section}
                      </b>
                      <small>{cls?.academicYear || "Current year"}</small>
                    </div>
                    <span className="ssd-chip ssd-tone--blue">
                      {count} students
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={School}
              title="No classes assigned yet"
              text="Your administrator assigns classes and subjects to you."
            />
          )}
        </Panel>
      </div>

      <div className="ssd-grid ssd-grid--3-1">
        <Panel
          icon={Layers}
          tone="amber"
          title="Quick actions"
          subtitle="Everyday teaching tasks"
          padded>
          <div className="ssd-actions">
            <QuickActionCard
              to="/teacher/attendance/mark"
              icon={ClipboardCheck}
              tone="teal"
              label="Mark attendance"
              sublabel="Record today's class"
            />
            <QuickActionCard
              to="/teacher/assignments"
              icon={FileText}
              tone="blue"
              label="Assignments"
              sublabel="Create and grade work"
            />
            <QuickActionCard
              to="/teacher/schedule"
              icon={CalendarDays}
              tone="indigo"
              label="My schedule"
              sublabel="Weekly timetable"
            />
            <QuickActionCard
              to="/teacher/students"
              icon={Users}
              tone="violet"
              label="My students"
              sublabel="Profiles and progress"
            />
          </div>
        </Panel>

        <Panel icon={BookOpen} tone="amber" title="My subjects">
          {loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ) : teacherData.assignedSubjects.length > 0 ? (
            <ul className="ssd-list">
              {teacherData.assignedSubjects.map((subject, index) => {
                const name = subject?.name || String(subject);
                const code = subject?.code || null;
                return (
                  <li key={subject?._id || index}>
                    <div className="ssd-list__main">
                      <b>{name}</b>
                    </div>
                    {code && (
                      <span className="ssd-chip ssd-tone--amber">{code}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty icon={BookOpen} title="No subjects assigned yet" />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default TeacherDashboard;
