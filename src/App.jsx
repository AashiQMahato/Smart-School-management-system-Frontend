import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider, Spin } from "antd";

// Providers
import { AuthProvider } from "./app/providers/AuthProvider";

// Layouts (loaded eagerly — needed immediately)
import { AuthLayout, DashboardLayout } from "./app/layouts";

// Route Guards (loaded eagerly — needed for auth checks)
import { PublicRoutes, PrivateRoute, RoleRoute } from "./app/routes";

// Public Pages (loaded eagerly — entry points)
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { UnauthorizedPage, NotFoundPage } from "./pages";

/* ================================================
   LAZY-LOADED FEATURE PAGES
   Code-split per role for smaller initial bundles
   ================================================ */

// Admin
const AdminDashboard = lazy(
  () => import("./features/admin/pages/AdminDashboard"),
);
const AdminAssignmentsPage = lazy(
  () => import("./features/admin/pages/AdminAssignmentsPage"),
);
const TeachersPage = lazy(() => import("./features/admin/pages/TeachersPage"));
const StudentsPage = lazy(() => import("./features/admin/pages/StudentsPage"));
const ParentsPage = lazy(() => import("./features/admin/pages/ParentsPage"));
const AdminSettingsPage = lazy(
  () => import("./features/admin/pages/SettingsPage"),
);
const SchedulesPage = lazy(
  () => import("./features/admin/pages/SchedulesPage"),
);
const ClassesPage = lazy(() => import("./features/admin/pages/ClassesPage"));
const SubjectsPage = lazy(() => import("./features/admin/pages/SubjectsPage"));
const AdminAttendancePage = lazy(
  () => import("./features/admin/pages/AdminAttendancePage"),
);
const UserManagementPage = lazy(
  () => import("./features/admin/pages/UserManagementPage"),
);
const StudentEnrollmentPage = lazy(
  () => import("./features/admin/pages/StudentEnrollmentPage"),
);
const ParentChildMappingPage = lazy(
  () => import("./features/admin/pages/ParentChildMappingPage"),
);
const ClassSubjectAssignmentPage = lazy(
  () => import("./features/admin/pages/ClassSubjectAssignmentPage"),
);
const AdminProfilePage = lazy(
  () => import("./features/admin/pages/AdminProfilePage"),
);
const AdminFeeDashboardPage = lazy(
  () => import("./features/admin/pages/AdminFeeDashboardPage"),
);
const AdminResultsPage = lazy(
  () => import("./features/admin/pages/AdminResultsPage"),
);
const AdminCalendarPage = lazy(
  () => import("./features/admin/pages/AdminCalendarPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("./features/admin/pages/AdminAnalyticsPage"),
);

// Teacher
const TeacherDashboard = lazy(
  () => import("./features/teacher/pages/TeacherDashboard"),
);
const TeacherAttendancePage = lazy(
  () => import("./features/teacher/pages/AttendancePage"),
);
const MarkAttendancePage = lazy(
  () => import("./features/teacher/pages/MarkAttendancePage"),
);
const MyStudentsPage = lazy(
  () => import("./features/teacher/pages/MyStudentsPage"),
);
const MyClassesPage = lazy(
  () => import("./features/teacher/pages/MyClassesPage"),
);
const MySchedulePage = lazy(
  () => import("./features/teacher/pages/MySchedulePage"),
);
const TeacherAssignmentsPage = lazy(
  () => import("./features/teacher/pages/TeacherAssignmentsPage"),
);
const TeacherProfilePage = lazy(
  () => import("./features/teacher/pages/TeacherProfilePage"),
);
const TeacherResultsPage = lazy(
  () => import("./features/teacher/pages/TeacherResultsPage"),
);
const TeacherCalendarPage = lazy(
  () => import("./features/teacher/pages/TeacherCalendarPage"),
);
const TeacherAssignmentDetailPage = lazy(
  () => import("./features/teacher/pages/TeacherAssignmentDetailPage"),
);
const TeacherFeePage = lazy(
  () => import("./features/teacher/pages/TeacherFeePage"),
);
const TeacherAnalyticsPage = lazy(
  () => import("./features/teacher/pages/TeacherAnalyticsPage"),
);

// Student
const StudentDashboard = lazy(
  () => import("./features/student/pages/StudentDashboard"),
);
const StudentAttendancePage = lazy(
  () => import("./features/student/pages/StudentAttendancePage"),
);
const TimetablePage = lazy(
  () => import("./features/student/pages/TimetablePage"),
);
const StudentAssignmentsPage = lazy(
  () => import("./features/student/pages/StudentAssignmentsPage"),
);
const StudentClassesPage = lazy(
  () => import("./features/student/pages/StudentClassesPage"),
);
const StudentProfilePage = lazy(
  () => import("./features/student/pages/StudentProfilePage"),
);
const StudentFeePage = lazy(
  () => import("./features/student/pages/StudentFeePage"),
);
const StudentResultsPage = lazy(
  () => import("./features/student/pages/StudentResultsPage"),
);
const StudentCalendarPage = lazy(
  () => import("./features/student/pages/StudentCalendarPage"),
);
const StudentAssignmentDetailPage = lazy(
  () => import("./features/student/pages/StudentAssignmentDetailPage"),
);
const StudentAnalyticsPage = lazy(
  () => import("./features/student/pages/StudentAnalyticsPage"),
);

// Parent
const ParentDashboard = lazy(
  () => import("./features/parent/pages/ParentDashboard"),
);
const MyChildrenPage = lazy(
  () => import("./features/parent/pages/MyChildrenPage"),
);
const FeePaymentPage = lazy(
  () => import("./features/parent/pages/FeePaymentPage"),
);
const ParentChildAttendancePage = lazy(
  () => import("./features/parent/pages/ParentChildAttendancePage"),
);
const ChildSchedulePage = lazy(
  () => import("./features/parent/pages/ChildSchedulePage"),
);
const ChildDetailsPage = lazy(
  () => import("./features/parent/pages/ChildDetailsPage"),
);
const ParentProfilePage = lazy(
  () => import("./features/parent/pages/ParentProfilePage"),
);
const ParentResultsPage = lazy(
  () => import("./features/parent/pages/ParentResultsPage"),
);
const ParentCalendarPage = lazy(
  () => import("./features/parent/pages/ParentCalendarPage"),
);
const ParentAnalyticsPage = lazy(
  () => import("./features/parent/pages/ParentAnalyticsPage"),
);
const UserSettingsPage = lazy(() => import("./pages/UserSettingsPage"));

// Role constants
const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

// Ant Design theme configuration
const themeConfig = {
  token: {
    colorPrimary: "#6366f1",
    borderRadius: 8,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

// Suspense fallback for lazy-loaded routes
const LazyFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              {/* ========== PUBLIC ROUTES ========== */}
              <Route element={<PublicRoutes />}>
                <Route path="/" element={<LandingPage />} />
              </Route>

              {/* Auth Routes - Redirect if already logged in */}
              <Route element={<PublicRoutes restricted />}>
                <Route element={<AuthLayout />}>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                </Route>
              </Route>

              {/* ========== PROTECTED ROUTES ========== */}
              <Route element={<PrivateRoute />}>
                {/* ----- ADMIN ROUTES ----- */}
                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route element={<DashboardLayout />}>
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboard />}
                    />

                    {/* User Management Module */}
                    <Route
                      path="/admin/users"
                      element={<UserManagementPage />}
                    />
                    <Route
                      path="/admin/users/teachers"
                      element={<TeachersPage />}
                    />
                    <Route
                      path="/admin/users/students"
                      element={<StudentEnrollmentPage />}
                    />
                    <Route
                      path="/admin/users/parents"
                      element={<ParentsPage />}
                    />
                    <Route
                      path="/admin/students/enroll"
                      element={<StudentEnrollmentPage />}
                    />
                    <Route
                      path="/admin/parents/mapping"
                      element={<ParentChildMappingPage />}
                    />
                    <Route
                      path="/admin/assignments"
                      element={<AdminAssignmentsPage />}
                    />
                    <Route
                      path="/admin/academics/teacher-assignments"
                      element={<ClassSubjectAssignmentPage />}
                    />

                    {/* Academics */}
                    <Route
                      path="/admin/academics/classes"
                      element={<ClassesPage />}
                    />
                    <Route
                      path="/admin/academics/subjects"
                      element={<SubjectsPage />}
                    />
                    <Route
                      path="/admin/academics/timetable"
                      element={<SchedulesPage />}
                    />

                    {/* Attendance */}
                    <Route
                      path="/admin/attendance"
                      element={<AdminAttendancePage />}
                    />

                    {/* Fee Management */}
                    <Route
                      path="/admin/fees"
                      element={<AdminFeeDashboardPage />}
                    />
                    <Route
                      path="/admin/fees/structure"
                      element={<AdminFeeDashboardPage />}
                    />
                    <Route
                      path="/admin/fees/collection"
                      element={<AdminFeeDashboardPage />}
                    />
                    <Route
                      path="/admin/fees/reports"
                      element={<AdminFeeDashboardPage />}
                    />

                    {/* Reports & Settings */}
                    <Route
                      path="/admin/results"
                      element={<AdminResultsPage />}
                    />
                    <Route
                      path="/admin/reports"
                      element={<PlaceholderPage title="Reports & Analytics" />}
                    />
                    <Route
                      path="/admin/settings"
                      element={<AdminSettingsPage />}
                    />
                    <Route
                      path="/admin/profile"
                      element={<AdminProfilePage />}
                    />
                    <Route
                      path="/admin/calendar"
                      element={<AdminCalendarPage />}
                    />
                    <Route
                      path="/admin/ai-analytics"
                      element={<AdminAnalyticsPage />}
                    />
                  </Route>
                </Route>

                {/* ----- TEACHER ROUTES ----- */}
                <Route element={<RoleRoute allowedRoles={[ROLES.TEACHER]} />}>
                  <Route element={<DashboardLayout />}>
                    <Route
                      path="/teacher/dashboard"
                      element={<TeacherDashboard />}
                    />

                    {/* Attendance */}
                    <Route
                      path="/teacher/attendance"
                      element={<TeacherAttendancePage />}
                    />
                    <Route
                      path="/teacher/attendance/mark"
                      element={<MarkAttendancePage />}
                    />
                    {/* Grades */}
                    <Route
                      path="/teacher/assignments"
                      element={<TeacherAssignmentsPage />}
                    />
                    <Route
                      path="/teacher/assignments/:id"
                      element={<TeacherAssignmentDetailPage />}
                    />
                    <Route
                      path="/teacher/grades/enter"
                      element={<TeacherResultsPage />}
                    />
                    <Route
                      path="/teacher/grades/results"
                      element={<TeacherResultsPage />}
                    />

                    {/* Other */}
                    <Route
                      path="/teacher/students"
                      element={<MyStudentsPage />}
                    />
                    <Route
                      path="/teacher/students/:id"
                      element={<PlaceholderPage title="Student Details" />}
                    />
                    <Route
                      path="/teacher/classes"
                      element={<MyClassesPage />}
                    />
                    <Route
                      path="/teacher/schedule"
                      element={<MySchedulePage />}
                    />
                    <Route
                      path="/teacher/communication"
                      element={<PlaceholderPage title="Communication" />}
                    />
                    <Route
                      path="/teacher/profile"
                      element={<TeacherProfilePage />}
                    />
                    <Route
                      path="/teacher/calendar"
                      element={<TeacherCalendarPage />}
                    />
                    <Route path="/teacher/fees" element={<TeacherFeePage />} />
                    <Route
                      path="/teacher/ai-analytics"
                      element={<TeacherAnalyticsPage />}
                    />
                    <Route
                      path="/teacher/settings"
                      element={<UserSettingsPage />}
                    />
                    <Route
                      path="/teacher/notifications"
                      element={<PlaceholderPage title="Notifications" />}
                    />
                  </Route>
                </Route>

                {/* ----- STUDENT ROUTES ----- */}
                <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]} />}>
                  <Route element={<DashboardLayout />}>
                    <Route
                      path="/student/dashboard"
                      element={<StudentDashboard />}
                    />

                    {/* Academics */}
                    <Route
                      path="/student/attendance"
                      element={<StudentAttendancePage />}
                    />
                    <Route
                      path="/student/academics/grades"
                      element={<PlaceholderPage title="My Grades" />}
                    />
                    <Route
                      path="/student/assignments"
                      element={<StudentAssignmentsPage />}
                    />
                    <Route
                      path="/student/assignments/:id"
                      element={<StudentAssignmentDetailPage />}
                    />
                    <Route
                      path="/student/academics/results"
                      element={<StudentResultsPage />}
                    />

                    {/* Other */}
                    <Route
                      path="/student/timetable"
                      element={<TimetablePage />}
                    />
                    <Route
                      path="/student/classes"
                      element={<StudentClassesPage />}
                    />
                    <Route path="/student/fees" element={<StudentFeePage />} />
                    <Route
                      path="/student/notifications"
                      element={<PlaceholderPage title="Notifications" />}
                    />
                    <Route
                      path="/student/profile"
                      element={<StudentProfilePage />}
                    />
                    <Route
                      path="/student/calendar"
                      element={<StudentCalendarPage />}
                    />
                    <Route
                      path="/student/ai-analytics"
                      element={<StudentAnalyticsPage />}
                    />
                    <Route
                      path="/student/settings"
                      element={<UserSettingsPage />}
                    />
                  </Route>
                </Route>

                {/* ----- PARENT ROUTES ----- */}
                <Route element={<RoleRoute allowedRoles={[ROLES.PARENT]} />}>
                  <Route element={<DashboardLayout />}>
                    <Route
                      path="/parent/dashboard"
                      element={<ParentDashboard />}
                    />
                    {/* Children */}
                    <Route
                      path="/parent/children"
                      element={<MyChildrenPage />}
                    />
                    <Route
                      path="/parent/children/:id"
                      element={<ChildDetailsPage />}
                    />
                    <Route
                      path="/parent/child-schedule"
                      element={<ChildSchedulePage />}
                    />
                    {/* Performance */}
                    {/* Performance */}
                    <Route
                      path="/parent/performance/grades"
                      element={<ParentResultsPage />}
                    />

                    {/* Attendance */}
                    <Route
                      path="/parent/attendance"
                      element={<ParentChildAttendancePage />}
                    />

                    <Route
                      path="/parent/performance/reports"
                      element={<PlaceholderPage title="Performance Reports" />}
                    />

                    {/* Fees */}
                    <Route
                      path="/parent/fees/status"
                      element={<FeePaymentPage />}
                    />
                    <Route
                      path="/parent/fees/history"
                      element={<FeePaymentPage />}
                    />
                    {/* Other */}
                    <Route
                      path="/parent/communication"
                      element={<PlaceholderPage title="Communication" />}
                    />
                    <Route
                      path="/parent/notifications"
                      element={<PlaceholderPage title="Notifications" />}
                    />
                    <Route
                      path="/parent/profile"
                      element={<ParentProfilePage />}
                    />
                    <Route
                      path="/parent/calendar"
                      element={<ParentCalendarPage />}
                    />
                    <Route
                      path="/parent/ai-analytics"
                      element={<ParentAnalyticsPage />}
                    />
                    <Route
                      path="/parent/settings"
                      element={<UserSettingsPage />}
                    />
                  </Route>
                </Route>
              </Route>

              {/* ========== ERROR ROUTES ========== */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

/**
 * Placeholder Page Component
 * Used for routes that haven't been fully implemented yet
 */
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">This page is under development.</p>
    </div>
  </div>
);

export default App;
