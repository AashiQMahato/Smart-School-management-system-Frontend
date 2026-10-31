/**
 * DashboardLayout
 * Shell for every role's pages: global topbar, sidebar, and content.
 * Applies the user's light/dark theme to the dashboards only (the public
 * pages stay light) and sets the role accent via data-role.
 */

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./dashboard.css";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SidebarProvider } from "../../context/SidebarContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { darkTheme, lightTheme } from "../theme/antdTheme";

const useDocumentTheme = (resolved, role) => {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    if (role) root.dataset.role = role;
    // Static antd APIs (message, notification, Modal.confirm) render
    // outside the React tree; give them the same theme.
    ConfigProvider.config({
      holderRender: (children) => (
        <ConfigProvider theme={resolved === "dark" ? darkTheme : lightTheme}>
          {children}
        </ConfigProvider>
      ),
    });
    return () => {
      delete root.dataset.theme;
      delete root.dataset.role;
      ConfigProvider.config({ holderRender: undefined });
    };
  }, [resolved, role]);
};

const DashboardContent = () => {
  const { userRole, userName } = useAuth();
  const { resolved } = useTheme();
  const { pathname } = useLocation();
  useDocumentTheme(resolved, userRole);

  return (
    <ConfigProvider theme={resolved === "dark" ? darkTheme : lightTheme}>
      <div className="ssd" data-role={userRole}>
        <a href="#ssd-main" className="ssd-skip">
          Skip to content
        </a>
        <DashboardHeader userName={userName} userRole={userRole} />
        <div className="ssd-frame">
          <Sidebar userRole={userRole} />
          <div className="ssd-body">
            <main id="ssd-main" className="ssd-content" tabIndex={-1}>
              <div key={pathname} className="ssd-content__inner ssd-page">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

const DashboardLayout = () => (
  <SidebarProvider>
    <DashboardContent />
  </SidebarProvider>
);

export default DashboardLayout;
