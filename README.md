<div align="center">

<img src="docs/assets/hero-banner.svg" alt="Smart School Management System — Every School. One Smarter System." width="100%" />

# Smart School Management System

**A role-based school management platform for administrators, teachers, students and parents.**<br />
Attendance, assignments, results, fees, timetables and the school calendar, in one place.

<br />

<a href="https://smart-school-management-system-frontend-sieb.onrender.com"><img src="docs/assets/badges/live.svg" alt="Live: open the app" /></a>
<img src="docs/assets/badges/roles.svg" alt="Roles: Admin, Teacher, Student, Parent" />
<br />
<img src="docs/assets/badges/react.svg" alt="React 19" />
<img src="docs/assets/badges/vite.svg" alt="Vite 7 (rolldown)" />
<img src="docs/assets/badges/router.svg" alt="React Router 7" />
<img src="docs/assets/badges/antd.svg" alt="Ant Design 6" />
<img src="docs/assets/badges/tailwind.svg" alt="Tailwind CSS 4" />
<img src="docs/assets/badges/recharts.svg" alt="Recharts 3" />
<img src="docs/assets/badges/node.svg" alt="Node.js 20.19+ or 22.12+" />
<a href="#-license"><img src="docs/assets/badges/license.svg" alt="License: MIT" /></a>

<br /><br />

**[Live app](https://smart-school-management-system-frontend-sieb.onrender.com)** ·
**[Backend repository](https://github.com/AashiQMahato/Smart-School-management-system-Backend)** ·
**[Screenshots](#-screenshots)** ·
**[Getting started](#-getting-started)** ·
**[Architecture](#-architecture)**

</div>

<br />

## 📑 Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Key features](#-key-features)
- [Role-based access](#-role-based-access)
- [UI and UX highlights](#-ui-and-ux-highlights)
- [Technology stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting started](#-getting-started)
- [Environment variables](#-environment-variables)
- [Project structure](#-project-structure)
- [Deployment](#-deployment)
- [Future improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Developer](#-developer)

<br />

## 🎯 Overview

Smart School is the React frontend of a MERN-stack school management system. It has a public landing page, a sign-in page, and four role-based dashboards. Every account is created by a school administrator; there is no public sign-up.

After signing in, each person lands on the dashboard for their role and sees only what that role allows. The same student record serves everyone: administrators manage it, teachers mark attendance and grades against it, students follow their own progress, and parents see their linked children.

<table>
  <tr>
    <td align="center" width="25%"><img src="docs/assets/icons/role-admin.svg" width="44" alt="" /><br /><b>Administrator</b><br /><sub>Runs the school: people, classes, timetables, fees, results</sub></td>
    <td align="center" width="25%"><img src="docs/assets/icons/role-teacher.svg" width="44" alt="" /><br /><b>Teacher</b><br /><sub>Attendance, assignments, grading and marks entry</sub></td>
    <td align="center" width="25%"><img src="docs/assets/icons/role-student.svg" width="44" alt="" /><br /><b>Student</b><br /><sub>Timetable, assignments, attendance, results, fees</sub></td>
    <td align="center" width="25%"><img src="docs/assets/icons/role-parent.svg" width="44" alt="" /><br /><b>Parent</b><br /><sub>Each child's attendance, results, fees and timetable</sub></td>
  </tr>
</table>

<br />

## 📸 Screenshots

> Captured from the application itself (built from this repository) running against demo data, so no real school's records are shown.

<p align="center">
  <img src="docs/screenshots/admin-dashboard.webp" alt="Admin dashboard: school overview with stats, fee collection chart and fee status" width="100%" />
  <br />
  <sub><b>Admin dashboard</b>: headline counts, fee collection over six months, fee status, students per class and attendance by class</sub>
</p>

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/teacher-dashboard.webp" alt="Teacher dashboard" width="100%" /><br />
      <sub><b>Teacher</b>: today's classes, attendance for a chosen class, grading progress</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/student-dashboard.webp" alt="Student dashboard" width="100%" /><br />
      <sub><b>Student</b>: attendance, performance by subject, deadlines and timetable</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/parent-dashboard.webp" alt="Parent dashboard" width="100%" /><br />
      <sub><b>Parent</b>: child selector, results, attendance and fees for each child</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/admin-dashboard-dark.webp" alt="Admin dashboard in dark mode" width="100%" /><br />
      <sub><b>Dark mode</b>: every dashboard supports light, dark and system themes</sub>
    </td>
  </tr>
</table>

<details>
<summary><b>Management pages</b>: students, attendance, results, fees</summary>
<br />
<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/student-management.webp" alt="Student enrollment and management" width="100%" /><br />
      <sub><b>Student management</b>: enrollment, class placement and parent links</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/attendance-marking.webp" alt="Marking attendance for a class" width="100%" /><br />
      <sub><b>Attendance</b>: mark a whole class as present, absent or late</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/results-management.webp" alt="Exam and results management" width="100%" /><br />
      <sub><b>Results</b>: exams, marks approval and publishing</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/fee-management.webp" alt="Fee management overview" width="100%" /><br />
      <sub><b>Fees</b>: billed vs collected, fee types and payment status</sub>
    </td>
  </tr>
</table>
</details>

<details>
<summary><b>Public pages and mobile</b>: landing, sign-in, phone layouts</summary>
<br />
<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/screenshots/landing-page.webp" alt="Public landing page" width="100%" /><br />
      <sub><b>Landing page</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/screenshots/login-page.webp" alt="Sign-in page" width="100%" /><br />
      <sub><b>Sign in</b>: one sign-in for every role</sub>
    </td>
  </tr>
</table>
<p align="center">
  <img src="docs/screenshots/student-dashboard-mobile.webp" alt="Student dashboard on a phone" width="260" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/parent-dashboard-mobile-dark.webp" alt="Parent dashboard on a phone in dark mode" width="260" />
  <br />
  <sub>Phone layouts: the sidebar becomes a slide-out drawer and cards stack</sub>
</p>
</details>

<br />

## ✨ Key features

### <img src="docs/assets/icons/role-admin.svg" width="28" alt="" align="top" /> Administration

<table>
  <tr>
    <td width="33%" valign="top"><img src="docs/assets/icons/users.svg" width="32" alt="" /><br /><b>User management</b><br /><sub>Teacher, student, parent and admin accounts</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/enroll.svg" width="32" alt="" /><br /><b>Student enrollment</b><br /><sub>Enroll into a class and section</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/link.svg" width="32" alt="" /><br /><b>Parent–child linking</b><br /><sub>Connect parents to their children</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/classes.svg" width="32" alt="" /><br /><b>Classes and subjects</b><br /><sub>Classes, sections and subject codes</sub></td>
    <td valign="top"><img src="docs/assets/icons/teacher-assign.svg" width="32" alt="" /><br /><b>Teacher assignments</b><br /><sub>Class teachers and subject teachers</sub></td>
    <td valign="top"><img src="docs/assets/icons/timetable.svg" width="32" alt="" /><br /><b>Timetables</b><br /><sub>Weekly schedules per class</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/attendance.svg" width="32" alt="" /><br /><b>Attendance</b><br /><sub>School-wide records and class statistics</sub></td>
    <td valign="top"><img src="docs/assets/icons/results.svg" width="32" alt="" /><br /><b>Results and report cards</b><br /><sub>Exams, marks approval, publishing</sub></td>
    <td valign="top"><img src="docs/assets/icons/fees.svg" width="32" alt="" /><br /><b>Fee management</b><br /><sub>Structures, records, payments, PDF bills</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/calendar.svg" width="32" alt="" /><br /><b>School calendar</b><br /><sub>Exams, holidays, events, announcements</sub></td>
    <td valign="top"><img src="docs/assets/icons/ai.svg" width="32" alt="" /><br /><b>AI analytics</b><br /><sub>Class performance and students needing support</sub></td>
    <td valign="top"></td>
  </tr>
</table>

### <img src="docs/assets/icons/role-teacher.svg" width="28" alt="" align="top" /> Teacher

<table>
  <tr>
    <td width="33%" valign="top"><img src="docs/assets/icons/users.svg" width="32" alt="" /><br /><b>Classes and students</b><br /><sub>Assigned classes and their students</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/attendance.svg" width="32" alt="" /><br /><b>Attendance</b><br /><sub>Mark a class and review records</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/assignments.svg" width="32" alt="" /><br /><b>Assignments</b><br /><sub>Create, collect and grade submissions</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/marks.svg" width="32" alt="" /><br /><b>Marks entry</b><br /><sub>Enter exam marks and submit for approval</sub></td>
    <td valign="top"><img src="docs/assets/icons/schedule.svg" width="32" alt="" /><br /><b>Teaching schedule</b><br /><sub>Today's periods and the weekly timetable</sub></td>
    <td valign="top"><img src="docs/assets/icons/ai.svg" width="32" alt="" /><br /><b>AI class analytics</b><br /><sub>Insights for the classes you teach</sub></td>
  </tr>
</table>

### <img src="docs/assets/icons/role-student.svg" width="28" alt="" align="top" /> Student

<table>
  <tr>
    <td width="33%" valign="top"><img src="docs/assets/icons/timetable.svg" width="32" alt="" /><br /><b>Timetable</b><br /><sub>Today's classes and the week</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/assignments.svg" width="32" alt="" /><br /><b>Assignments</b><br /><sub>Deadlines, submissions and grades</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/attendance.svg" width="32" alt="" /><br /><b>Attendance</b><br /><sub>Monthly rate and daily history</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/results.svg" width="32" alt="" /><br /><b>Results</b><br /><sub>Published marks and report cards</sub></td>
    <td valign="top"><img src="docs/assets/icons/fees.svg" width="32" alt="" /><br /><b>Fee status</b><br /><sub>Balance, history and bills</sub></td>
    <td valign="top"><img src="docs/assets/icons/calendar.svg" width="32" alt="" /><br /><b>Calendar and AI insights</b><br /><sub>School events and personal analytics</sub></td>
  </tr>
</table>

### <img src="docs/assets/icons/role-parent.svg" width="28" alt="" align="top" /> Parent

<table>
  <tr>
    <td width="33%" valign="top"><img src="docs/assets/icons/child.svg" width="32" alt="" /><br /><b>Child information</b><br /><sub>Every linked child, one at a time</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/attendance.svg" width="32" alt="" /><br /><b>Attendance</b><br /><sub>This month and recent school days</sub></td>
    <td width="33%" valign="top"><img src="docs/assets/icons/results.svg" width="32" alt="" /><br /><b>Academic results</b><br /><sub>Published results and report cards</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/fees.svg" width="32" alt="" /><br /><b>Fees</b><br /><sub>Status, payment history and bills</sub></td>
    <td valign="top"><img src="docs/assets/icons/timetable.svg" width="32" alt="" /><br /><b>Timetable</b><br /><sub>Your child's weekly schedule</sub></td>
    <td valign="top"><img src="docs/assets/icons/calendar.svg" width="32" alt="" /><br /><b>Calendar and AI insights</b><br /><sub>School events and child analytics</sub></td>
  </tr>
</table>

> **Planned, not yet available:** in-app messaging and a full notification centre. Their pages currently show a placeholder; see [Future improvements](#-future-improvements).

<br />

## 🔐 Role-based access

| Role | Colour | Lands on | Can access |
| --- | --- | --- | --- |
| Administrator | 🔴 Red | `/admin/dashboard` | Everything: users, academics, attendance, results, fees, calendar, analytics |
| Teacher | 🔵 Blue | `/teacher/dashboard` | Their classes, students, attendance, assignments, marks entry, schedule |
| Student | 🟢 Green | `/student/dashboard` | Their own timetable, assignments, attendance, results and fees |
| Parent | 🟣 Purple | `/parent/dashboard` | Their linked children's attendance, results, fees and timetable |

The frontend guards every route (`PrivateRoute` for signed-in users, `RoleRoute` for the allowed roles), and the backend enforces the same rules on every API call, including record-level checks such as a parent only seeing their own children.

<br />

## 🎨 UI and UX highlights

<table>
  <tr>
    <td width="50%" valign="top"><img src="docs/assets/icons/theme.svg" width="32" alt="" /><br /><b>Light, dark and system themes</b><br /><sub>Every dashboard follows the chosen theme; the choice is remembered</sub></td>
    <td width="50%" valign="top"><img src="docs/assets/icons/search.svg" width="32" alt="" /><br /><b>Command palette</b><br /><sub>Ctrl/⌘ K or <code>/</code> jumps to any page or action for your role</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/bell.svg" width="32" alt="" /><br /><b>Calendar alerts</b><br /><sub>The topbar bell lists upcoming exams, deadlines and announcements</sub></td>
    <td valign="top"><img src="docs/assets/icons/palette.svg" width="32" alt="" /><br /><b>Colour-coded modules</b><br /><sub>Students blue, attendance emerald, exams orange, finance teal and more</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/charts.svg" width="32" alt="" /><br /><b>Interactive charts</b><br /><sub>Recharts visualisations of real data, with animated counters</sub></td>
    <td valign="top"><img src="docs/assets/icons/responsive.svg" width="32" alt="" /><br /><b>Responsive to 320px</b><br /><sub>Collapsible sidebar on desktop, slide-out drawer on phones</sub></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/assets/icons/a11y.svg" width="32" alt="" /><br /><b>Accessible</b><br /><sub>Keyboard navigation, skip links, ARIA labels, reduced-motion support</sub></td>
    <td valign="top"><img src="docs/assets/icons/motion.svg" width="32" alt="" /><br /><b>Purposeful motion</b><br /><sub>Page transitions, staggered cards and chart animations, kept subtle</sub></td>
  </tr>
</table>

**Design system:** warm off-white surfaces, navy text, blue, indigo, teal, coral and amber accents, and the Inter typeface. Tokens live in `src/styles/tokens.css` and are shared by the landing page, the sign-in page and the dashboards. Ant Design is themed from the same tokens.

<br />

## 🧰 Technology stack

<p align="center">
  <img src="docs/assets/tech/react.svg" width="52" alt="React" title="React" />
  <img src="docs/assets/tech/vite.svg" width="52" alt="Vite" title="Vite" />
  <img src="docs/assets/tech/javascript.svg" width="52" alt="JavaScript" title="JavaScript" />
  <img src="docs/assets/tech/react-router.svg" width="52" alt="React Router" title="React Router" />
  <img src="docs/assets/tech/antdesign.svg" width="52" alt="Ant Design" title="Ant Design" />
  <img src="docs/assets/tech/tailwindcss.svg" width="52" alt="Tailwind CSS" title="Tailwind CSS" />
  <img src="docs/assets/tech/recharts.svg" width="52" alt="Recharts" title="Recharts" />
  <img src="docs/assets/tech/lucide.svg" width="52" alt="Lucide" title="Lucide" />
  <img src="docs/assets/tech/axios.svg" width="52" alt="Axios" title="Axios" />
  <br />
  <img src="docs/assets/tech/nodejs.svg" width="52" alt="Node.js" title="Node.js" />
  <img src="docs/assets/tech/express.svg" width="52" alt="Express" title="Express" />
  <img src="docs/assets/tech/mongodb.svg" width="52" alt="MongoDB" title="MongoDB" />
  <img src="docs/assets/tech/git.svg" width="52" alt="Git" title="Git" />
  <img src="docs/assets/tech/github.svg" width="52" alt="GitHub" title="GitHub" />
  <img src="docs/assets/tech/render.svg" width="52" alt="Render" title="Render" />
</p>

| Layer | Technology | Used for |
| --- | --- | --- |
| UI framework | **React 19** | Components and state (React Context for auth, sidebar and theme) |
| Build tool | **Vite 7** (rolldown) | Dev server, production build, per-role code splitting |
| Routing | **React Router 7** | Public, private and role-guarded routes |
| Components | **Ant Design 6** | Tables, forms, modals, date pickers, themed light and dark |
| Styling | **Tailwind CSS 4** | Utility styling, mapped onto the design tokens |
| Charts | **Recharts 3** | Dashboard charts |
| Icons | **Lucide React** | Navigation and module icons |
| HTTP | **Axios** | API clients in `src/services/` |
| Documents | **jsPDF** + jspdf-autotable | Downloadable fee bills and fee reports |
| Dates | **Day.js** | Date formatting and calculations |
| Backend | **Node.js, Express, MongoDB** | REST API with JWT auth ([backend repository](https://github.com/AashiQMahato/Smart-School-management-system-Backend)) |

<br />

## 🏗 Architecture

### System overview

```mermaid
flowchart LR
  subgraph Browser["Browser"]
    UI["React 19 SPA<br/>Ant Design + Tailwind"]
    Router["React Router 7<br/>route guards"]
    Auth["AuthProvider<br/>(React Context)"]
    Services["src/services/*<br/>Axios API clients"]
    Store[("localStorage<br/>token, user, theme")]
    UI --> Router --> Auth
    UI --> Services
    Auth <--> Store
    Services -->|"Bearer JWT"| API
  end

  subgraph Server["Backend (Node.js + Express)"]
    API["/api/* routes"]
    MW["Security, auth and<br/>role middleware"]
    Logic["Controllers<br/>and services"]
    API --> MW --> Logic
  end

  Logic --> DB[("MongoDB<br/>(Mongoose)")]
  Logic -.->|"AI analytics"| AI["Groq API"]
```

### Sign-in and authentication

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant App as React app
  participant API as Express API
  participant DB as MongoDB

  User->>App: Email and password on /login
  App->>API: POST /api/auth/login
  API->>DB: Find user, verify bcrypt hash
  DB-->>API: User and role profile
  API-->>App: JWT + user (role)
  App->>App: Save token and user to localStorage
  App->>User: Redirect to /{role}/dashboard
  Note over App,API: Every later request sends "Authorization: Bearer <token>"
  App->>API: GET /api/auth/me (on reload)
  API-->>App: Current user, or 401 so the app signs out
```

### Role-based routing

```mermaid
flowchart TD
  Visit(["User opens a URL"]) --> Public{"Public page?<br/>/ , /login"}
  Public -->|Yes| Landing["Landing or sign-in<br/>(signed-in users skip sign-in)"]
  Public -->|No| Private{"PrivateRoute:<br/>signed in?"}
  Private -->|No| Login["Redirect to /auth"]
  Private -->|Yes| Role{"RoleRoute:<br/>role allowed?"}
  Role -->|No| Denied["/unauthorized"]
  Role -->|Yes| Layout["DashboardLayout<br/>topbar + sidebar"]
  Layout --> Admin["Admin pages"]
  Layout --> Teacher["Teacher pages"]
  Layout --> Student["Student pages"]
  Layout --> Parent["Parent pages"]
```

### How the roles work together

```mermaid
flowchart TB
  subgraph Setup["1 · The administrator sets up the school"]
    direction LR
    A1["Classes and<br/>subjects"] --> A2["Teacher and<br/>student accounts"] --> A3["Parent links and<br/>teacher assignments"] --> A4["Timetables<br/>and fees"]
  end
  subgraph Day["2 · Teachers and students run the school day"]
    direction LR
    T1["Teacher marks<br/>attendance"] ~~~ T2["Teacher posts<br/>an assignment"] --> T3["Student<br/>submits it"] --> T4["Teacher<br/>grades it"]
  end
  subgraph Exams["3 · Exam results are approved"]
    direction LR
    R1["Teacher enters<br/>marks"] --> R2["Submits for<br/>approval"] --> R3["Admin approves<br/>and publishes"]
  end
  subgraph Follow["4 · Students and parents follow progress"]
    direction LR
    S1["Students: timetable, attendance,<br/>results and fees"] ~~~ P1["Parents: each child's attendance,<br/>results, fees and timetable"]
  end
  Setup --> Day --> Exams --> Follow
```

<br />

## 🚀 Getting started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- **npm** (comes with Node.js)
- A running instance of the **[backend API](https://github.com/AashiQMahato/Smart-School-management-system-Backend)**

### Install and run

```bash
# 1. Clone the repository
git clone https://github.com/AashiQMahato/Smart-School-management-system-Frontend.git
cd Smart-School-management-system-Frontend

# 2. Install dependencies
npm install

# 3. Configure the API URL
cp .env.example .env        # then set VITE_API_BASE_URL

# 4. Start the development server
npm run dev                 # http://localhost:5173
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run gen:dark-palette` | Regenerate `src/styles/dark-palette.css` after a Tailwind upgrade |

<br />

## 🔑 Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes, outside local development | Backend API base URL **including `/api`**, for example `https://your-backend.onrender.com/api`. Defaults to `http://localhost:8080/api`. |

The variable is read at **build time**, so rebuild after changing it. Never commit your `.env` file; the frontend holds no secrets, and the API's own secrets (database URI, JWT secret) belong to the backend's environment only.

<br />

## 📂 Project structure

```text
src/
├── app/
│   ├── layouts/        # AuthLayout, DashboardLayout + dashboard.css (shell styles)
│   ├── providers/      # AuthProvider: session, login, logout
│   ├── routes/         # PublicRoutes, PrivateRoute, RoleRoute guards
│   └── theme/          # Ant Design light and dark themes
├── components/
│   ├── Header/         # Topbar: command palette, notifications, account menu
│   ├── Sidebar/        # Sidebar + navigation config (single source per role)
│   ├── UI/             # Shared kit: StatCard, Panel, ProgressRing, charts, states
│   └── …               # Attendance, Assignment, Calendar, Results, Schedule, Analytics
├── config/             # API base URL
├── context/            # SidebarContext, ThemeContext
├── features/
│   ├── admin/          # Administrator pages
│   ├── teacher/        # Teacher pages
│   ├── student/        # Student pages
│   ├── parent/         # Parent pages
│   ├── fee/            # Fee components and PDF generation
│   └── landing/        # Public landing and sign-in components
├── hooks/              # useAuth, useCountUp, useNow, useRoleEvents
├── pages/              # Landing, sign-in, settings, 404, unauthorized
├── services/           # One API client per backend resource
├── styles/             # Design tokens and the generated dark palette
├── utils/              # Small helpers (safe text from rich content)
├── App.jsx             # Routes
└── main.jsx
```

| Folder | Role in the app |
| --- | --- |
| `src/app/` | The application shell: layouts, the auth provider, route guards and the Ant Design themes. |
| `src/components/` | Reusable building blocks. `UI/` is the shared kit every dashboard uses; `Header/` and `Sidebar/` form the dashboard shell. |
| `src/features/` | One folder per role (`admin`, `teacher`, `student`, `parent`) holding that role's pages, plus shared domains like `fee` and the public `landing`. |
| `src/services/` | API clients, one per backend resource (`attendance.service.js`, `fee.service.js` …). Pages never call the API directly. |
| `src/styles/` | Design tokens (`tokens.css`) and the generated dark-mode palette. |
| `src/hooks/` | Shared hooks: auth, live clock, number count-up, role calendar events. |
| `src/pages/` | Pages outside the role dashboards: landing, sign-in, user settings and error pages. |

Role pages are **lazy-loaded per route**, so each user only downloads the code for their own dashboard.

<br />

## 🌐 Deployment

The app is a static single-page application:

1. Set `VITE_API_BASE_URL` to your backend's URL (including `/api`).
2. Run `npm run build`.
3. Serve the `dist/` folder as a static site, with **every path rewritten to `index.html`** because the app uses client-side routing.

The live app runs on [Render](https://render.com) as a static site, alongside the backend as a Render web service.

> **CORS:** the backend only accepts requests from origins in its allowlist. When you deploy the frontend to a new URL, add that URL to the backend's `CORS_ORIGINS` environment variable, or the browser will block API calls.

<br />

## 🔭 Future improvements

These are planned; their routes exist today but show a placeholder page:

- [ ] In-app messaging between teachers and parents
- [ ] A full notification centre (the topbar already shows calendar alerts)
- [ ] An admin reports and analytics page
- [ ] A detailed student view for teachers
- [ ] A dedicated grades page for students and performance reports for parents

<br />

## 🤝 Contributing

1. Fork the repository and create a branch: `git checkout -b feature-name`
2. Make your change, then run `npm run lint` and `npm run build`
3. Open a pull request describing what changed and why

<br />

## 📄 License

This project is licensed under the MIT License.

<br />

## 👨‍💻 Developer

<table>
  <tr>
    <td><img src="docs/assets/logo.svg" width="56" alt="" /></td>
    <td>
      <b>Smart School Management System</b><br />
      Built and maintained by <a href="https://github.com/AashiQMahato">AashiQMahato</a><br />
      <sub>Frontend: this repository · Backend: <a href="https://github.com/AashiQMahato/Smart-School-management-system-Backend">Smart-School-management-system-Backend</a></sub>
    </td>
  </tr>
</table>

<div align="center">
<br />
<sub>Every School. One Smarter System.</sub>
</div>
