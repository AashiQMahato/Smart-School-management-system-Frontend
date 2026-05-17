/**
 * DashboardLayout Component
 * Unified dashboard layout with SidebarContext-driven sidebar
 * Provides consistent structure for all role-based dashboards
 */

import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../hooks/useAuth";

const { Content } = Layout;

/**
 * Inner layout that consumes SidebarContext
 */
const DashboardContent = () => {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();
  const { userRole, userName } = useAuth();

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Content Area */}
      <Layout
        className={`
          transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* Header */}
        <DashboardHeader userName={userName} userRole={userRole} />

        {/* Content */}
        <Content
          className="
            p-4 md:p-6 lg:p-8
            bg-slate-50
            min-h-[calc(100vh-64px)]
            mt-16
          "
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </Layout>
  );
};

/**
 * DashboardLayout wrapper - provides SidebarContext
 */
const DashboardLayout = () => (
  <SidebarProvider>
    <DashboardContent />
  </SidebarProvider>
);

export default DashboardLayout;
