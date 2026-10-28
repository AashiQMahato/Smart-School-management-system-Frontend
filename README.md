# Smart School Management System – Frontend

React frontend for **Smart School**, a school management system with a public landing page and role-based dashboards for **administrators, teachers, students and parents**.

🌐 **Live:** [smart-school-management-system-frontend-sieb.onrender.com](https://smart-school-management-system-frontend-sieb.onrender.com) · [smart-school-management-system-frontend.onrender.com](https://smart-school-management-system-frontend.onrender.com)

---

## Features by role

Every account is created by an administrator; there is no public sign-up. After login each user lands on the dashboard for their role and only sees what that role allows.

### Administrator
- User management for teachers, students and parents; student enrollment
- Parent–child linking
- Classes, subjects, and class/subject teacher assignments
- Weekly timetables
- School-wide attendance overview
- Results and report cards
- Fee structures, collection and downloadable PDF bills
- School calendar: exams, holidays, events, deadlines and announcements
- AI analytics: class performance, weak subjects, students who may need support

### Teacher
- Assigned classes, subjects and students
- Mark attendance by class and review records
- Create assignments and grade submissions
- Enter marks and view results
- Teaching schedule and school calendar
- AI analytics for their classes

### Student
- Timetable, classes and subjects
- Submit assignments and track their status
- Attendance, results and fee status
- School calendar and AI analytics

### Parent
- One view per linked child: attendance, timetable and class teacher contact
- Results and grades
- Fee status and payment history
- School calendar and AI analytics

**Planned (not built yet):** in-app messaging and a notification centre. Their routes currently show a placeholder page.

---

## Design

The landing page, sign-in page and dashboards share one design system:

- **Tokens** in `src/styles/tokens.css`: warm off-white surfaces, navy text, and blue/indigo/teal/coral/amber accents, with Inter as the typeface
- **Role colours:** admin red, teacher blue, student green, parent purple, applied through `data-role`
- **Ant Design** themed from the same tokens in `App.jsx`, so every table, form, modal and tab matches
- **Dashboard shell:** collapsible sidebar on desktop, which remembers its state, and a slide-in drawer below 1024px. The header shows the current page title.
- **Accessibility:** keyboard-accessible navigation and tabs, visible focus, skip links, and support for `prefers-reduced-motion`
- **Responsive** from 320px phones to large desktops

---

## Tech stack

- React 19 + Vite (rolldown-vite)
- React Router 7
- Ant Design 6 and Tailwind CSS 4
- Recharts (dashboard charts), lucide-react (icons)
- Axios for API calls
- jsPDF for downloadable fee bills

Backend: Node.js, Express and MongoDB ([Smart-School-management-system-Backend](https://github.com/AashiQMahato/Smart-School-management-system-Backend)).

---

## Getting started

Requires Node.js 20.19+ (or 22.12+) and a running backend.

```bash
git clone https://github.com/AashiQMahato/Smart-School-management-system-Frontend.git
cd Smart-School-management-system-Frontend
npm install
cp .env.example .env   # then set VITE_API_BASE_URL
npm run dev            # http://localhost:5173
```

### Scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |

### Environment variables

| Variable            | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL including `/api`, e.g. `https://your-backend.onrender.com/api`. Defaults to `http://localhost:8080/api`. |

The variable is read at **build time**, so rebuild after changing it.

### Deploying

Build with `npm run build` and serve `dist/` as a static site with a rewrite of all paths to `index.html`, because the app uses client-side routing.

The backend only accepts requests from origins in its CORS allowlist. When you deploy the frontend to a new URL, add that URL to the backend's `CORS_ORIGINS` environment variable, or the browser will block API calls with a CORS error.

---

## Project structure

```text
src/
├── app/
│   ├── layouts/       # AuthLayout, DashboardLayout + dashboard.css
│   ├── providers/     # AuthProvider (session, login, logout)
│   └── routes/        # PublicRoutes, PrivateRoute, RoleRoute guards
├── components/        # Shared UI: Sidebar, Header, UI kit, Schedule,
│                      # Calendar, Attendance, Results, Charts, Analytics
├── config/            # API base URL
├── context/           # SidebarContext
├── features/
│   ├── admin/         # Admin pages
│   ├── teacher/       # Teacher pages
│   ├── student/       # Student pages
│   ├── parent/        # Parent pages
│   ├── fee/           # Fee components and PDF generation
│   └── landing/       # Public landing + sign-in components and styles
├── hooks/             # useAuth
├── pages/             # Landing, sign-in, settings, 404, unauthorized
├── services/          # API clients, one per backend resource
├── styles/            # Design tokens
├── App.jsx            # Routes and Ant Design theme
└── main.jsx
```

Role pages are lazy-loaded per route, so each user only downloads the code for their dashboard.

---

## Contributing

1. Create a branch: `git checkout -b feature-name`
2. Make your change and run `npm run lint` and `npm run build`
3. Open a pull request

---

## License

This project is licensed under the MIT License.
