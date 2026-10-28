/**
 * Admin Dashboard
 * School-wide overview: headline counts, classes and their teachers,
 * recent enrolments, and shortcuts to the main admin tasks.
 */

import { useState, useEffect } from "react";
import { Skeleton, message } from "antd";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Link2,
  School,
  UserCog,
  UserPlus,
  Users,
  Book,
} from "lucide-react";
import {
  HeroBanner,
  Panel,
  PanelEmpty,
  QuickActionCard,
} from "../../../components/UI";
import {
  getAllStudents,
  getAllTeachers,
  getDashboardStats,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "?";

const STATUS_TONE = {
  enrolled: "green",
  active: "green",
  graduated: "blue",
  transferred: "amber",
  suspended: "red",
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [classesWithTeachers, setClassesWithTeachers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Try to get dashboard stats from API
      try {
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setStats({
            totalStudents: statsRes.data.totalStudents || 0,
            totalTeachers: statsRes.data.totalTeachers || 0,
            totalClasses: statsRes.data.totalClasses || 0,
            totalParents: statsRes.data.totalParents || 0,
          });
        }
      } catch {
        console.warn(
          "Dashboard stats API not available, fetching individually",
        );

        // Fallback: Fetch counts individually
        const [studentsRes, teachersRes, classesRes] = await Promise.all([
          getAllStudents().catch(() => ({ data: [] })),
          getAllTeachers().catch(() => ({ data: [] })),
          getAllClasses().catch(() => ({ data: [] })),
        ]);

        setStats({
          totalStudents: studentsRes.data?.length || 0,
          totalTeachers: teachersRes.data?.length || 0,
          totalClasses: classesRes.data?.length || 0,
          totalParents: 0,
        });
      }

      // Fetch recent students for display
      const studentsRes = await getAllStudents().catch(() => ({ data: [] }));
      const students = studentsRes.data || [];
      setRecentStudents(students.slice(0, 5));

      // Fetch classes
      const classesRes = await getAllClasses().catch(() => ({ data: [] }));
      setClassesWithTeachers(classesRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const ratio =
    stats.totalTeachers > 0
      ? `${Math.round(stats.totalStudents / stats.totalTeachers)}:1`
      : "—";
  const perClass =
    stats.totalClasses > 0
      ? Math.round(stats.totalStudents / stats.totalClasses)
      : "—";
  const parentCoverage =
    stats.totalStudents > 0
      ? Math.min(
          100,
          Math.round((stats.totalParents / stats.totalStudents) * 100),
        )
      : 0;

  const headline = [
    {
      label: "Students",
      value: stats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      tone: "blue",
      to: "/admin/users/students",
    },
    {
      label: "Teachers",
      value: stats.totalTeachers.toLocaleString(),
      icon: UserCog,
      tone: "teal",
      to: "/admin/users/teachers",
    },
    {
      label: "Classes",
      value: stats.totalClasses.toLocaleString(),
      icon: School,
      tone: "indigo",
      to: "/admin/academics/classes",
    },
    {
      label: "Parents",
      value: stats.totalParents.toLocaleString(),
      icon: Users,
      tone: "violet",
      to: "/admin/users/parents",
    },
  ];

  return (
    <div>
      <HeroBanner
        eyebrow={currentDate}
        title="School overview"
        subtitle="Enrolment, staffing and classes at a glance, with shortcuts to everyday admin work."
        rightContent={
          <>
            <Link
              to="/admin/students/enroll"
              className="ssd-btn ssd-btn--light">
              <UserPlus size={16} aria-hidden="true" />
              Enroll student
            </Link>
          </>
        }
      />

      <div className="ssd-stats">
        {headline.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`ssd-stat ssd-tone--${item.tone}`}>
              <div className="ssd-stat__top">
                <span className="ssd-stat__icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              </div>
              {loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <span className="ssd-stat__value">{item.value}</span>
              )}
              <span className="ssd-stat__label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="ssd-stats">
        <div className="ssd-stat">
          <span className="ssd-stat__label">Student–teacher ratio</span>
          <span className="ssd-stat__value">{loading ? "…" : ratio}</span>
        </div>
        <div className="ssd-stat">
          <span className="ssd-stat__label">Average students per class</span>
          <span className="ssd-stat__value">{loading ? "…" : perClass}</span>
        </div>
        <div className="ssd-stat ssd-tone--violet">
          <span className="ssd-stat__label">Parent accounts per student</span>
          <span className="ssd-stat__value">
            {loading ? "…" : `${parentCoverage}%`}
          </span>
          <div
            className="ssd-meter mt-2"
            role="progressbar"
            aria-valuenow={parentCoverage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Parent accounts per student">
            <i style={{ "--w": `${parentCoverage}%` }} />
          </div>
        </div>
      </div>

      <div className="ssd-grid ssd-grid--2">
        <Panel
          icon={School}
          tone="indigo"
          title="Classes"
          subtitle="Class teacher and enrolment"
          link={{
            to: "/admin/academics/teacher-assignments",
            label: "Manage",
          }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : classesWithTeachers.length > 0 ? (
            <ul className="ssd-list">
              {classesWithTeachers.map((cls) => {
                const teacher =
                  cls.classTeacher?.userId?.name || cls.classTeacher?.name;
                return (
                  <li key={cls._id || cls.name}>
                    <span className="ssd-initials ssd-tone--indigo">
                      {initials(cls.name)}
                    </span>
                    <div className="ssd-list__main">
                      <b>{cls.name}</b>
                      <small>
                        {cls.students?.length || 0} students enrolled
                      </small>
                    </div>
                    {teacher ? (
                      <span className="ssd-chip ssd-tone--green">
                        {teacher}
                      </span>
                    ) : (
                      <span className="ssd-chip ssd-tone--amber">
                        No class teacher
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={School}
              title="No classes yet"
              text="Create classes to start assigning teachers and enrolling students."
              action={{
                to: "/admin/academics/classes",
                label: "Create a class",
              }}
            />
          )}
        </Panel>

        <Panel
          icon={GraduationCap}
          tone="blue"
          title="Recent students"
          subtitle="Latest enrolments"
          link={{ to: "/admin/users/students", label: "View all" }}>
          {loading ? (
            <div className="p-5">
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          ) : recentStudents.length > 0 ? (
            <ul className="ssd-list">
              {recentStudents.map((student) => {
                const status = student.enrollmentStatus || "enrolled";
                return (
                  <li key={student._id}>
                    <span className="ssd-initials ssd-tone--blue">
                      {initials(student.userId?.name)}
                    </span>
                    <div className="ssd-list__main">
                      <b>{student.userId?.name || "N/A"}</b>
                      <small>
                        {student.classId?.name || "No class"} · Roll{" "}
                        {student.rollNumber || "N/A"}
                      </small>
                    </div>
                    <span
                      className={`ssd-chip ssd-tone--${STATUS_TONE[status] || "slate"}`}>
                      {status}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <PanelEmpty
              icon={GraduationCap}
              title="No students enrolled"
              text="Enrolled students will appear here."
              action={{
                to: "/admin/students/enroll",
                label: "Enroll a student",
              }}
            />
          )}
        </Panel>
      </div>

      <section className="ssd-panel">
        <header className="ssd-panel__head">
          <div className="ssd-panel__title">
            <div>
              <h2>Quick actions</h2>
              <p>Common administration tasks</p>
            </div>
          </div>
        </header>
        <div className="ssd-panel__body">
          <div className="ssd-actions">
            <QuickActionCard
              to="/admin/students/enroll"
              icon={UserPlus}
              tone="blue"
              label="Enroll student"
              sublabel="Add a new student"
            />
            <QuickActionCard
              to="/admin/users/teachers"
              icon={UserCog}
              tone="teal"
              label="Teachers"
              sublabel="Manage teaching staff"
            />
            <QuickActionCard
              to="/admin/parents/mapping"
              icon={Link2}
              tone="violet"
              label="Link parents"
              sublabel="Connect parents to children"
            />
            <QuickActionCard
              to="/admin/academics/teacher-assignments"
              icon={Users}
              tone="indigo"
              label="Assign teachers"
              sublabel="Classes and subjects"
            />
            <QuickActionCard
              to="/admin/academics/classes"
              icon={BookOpen}
              tone="amber"
              label="Classes"
              sublabel="Manage classes"
            />
            <QuickActionCard
              to="/admin/academics/subjects"
              icon={Book}
              tone="coral"
              label="Subjects"
              sublabel="Manage subjects"
            />
            <QuickActionCard
              to="/admin/academics/timetable"
              icon={CalendarDays}
              tone="green"
              label="Timetable"
              sublabel="Build weekly schedules"
            />
            <QuickActionCard
              to="/admin/attendance"
              icon={ClipboardCheck}
              tone="slate"
              label="Attendance"
              sublabel="View reports"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
