/**
 * SidebarContext
 * Desktop (>= 1024px): the sidebar is always shown and can be collapsed
 * to icons; the choice is remembered. Below that it becomes a drawer.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext(null);

const DESKTOP_QUERY = "(min-width: 1024px)";
const STORAGE_KEY = "ssms_sidebar_collapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => !window.matchMedia(DESKTOP_QUERY).matches,
  );
  const location = useLocation();

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => {
      setIsMobile(!e.matches);
      if (e.matches) setMobileOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Close the drawer after navigating (adjusting state during render,
  // as React recommends, rather than in an effect)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
      return;
    }
    setCollapsed((prev) => {
      try {
        localStorage.setItem(STORAGE_KEY, prev ? "0" : "1");
      } catch {
        /* storage unavailable: keep the in-memory state */
      }
      return !prev;
    });
  }, [isMobile]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        isMobile,
        toggleSidebar,
        closeMobile,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
};

export default SidebarContext;
