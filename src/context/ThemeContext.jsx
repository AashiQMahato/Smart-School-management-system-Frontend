/**
 * ThemeContext
 * Light / dark / system preference for the dashboards, remembered per
 * browser. `resolved` is the theme actually shown ("light" | "dark").
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "ssms_theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const PREFERENCES = ["light", "dark", "system"];

const readPreference = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return PREFERENCES.includes(saved) ? saved : "system";
  } catch {
    return "system";
  }
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreferenceState] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.(DARK_QUERY).matches ?? false,
  );

  useEffect(() => {
    const query = window.matchMedia?.(DARK_QUERY);
    if (!query) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setPreference = useCallback((next) => {
    if (!PREFERENCES.includes(next)) return;
    setPreferenceState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable: keep the in-memory choice */
    }
  }, []);

  const resolved =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};

export default ThemeContext;
