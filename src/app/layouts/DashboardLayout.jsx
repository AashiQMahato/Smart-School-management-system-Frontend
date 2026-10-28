/**
 * DashboardLayout
 * Shell for every role's pages: sidebar column + sticky header + content.
 * data-role sets the accent colour (see styles/tokens.css).
 */

import { Outlet } from "react-router-dom";
import "./dashboard.css";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SidebarProvider } from "../../context/SidebarContext";
import { useAuth } from "../../hooks/useAuth";

const DashboardContent = () => {
  const { userRole, userName } = useAuth();

  return (
    <div className="ssd" data-role={userRole}>
      <a href="#ssd-main" className="ssd-skip">
        Skip to content
      </a>
      <Sidebar userRole={userRole} />
      <div className="ssd-body">
        <DashboardHeader userName={userName} userRole={userRole} />
        <main id="ssd-main" className="ssd-content" tabIndex={-1}>
          <div className="ssd-content__inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => (
  <SidebarProvider>
    <DashboardContent />
  </SidebarProvider>
);

export default DashboardLayout;
