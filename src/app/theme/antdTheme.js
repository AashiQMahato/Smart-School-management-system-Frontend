/**
 * Ant Design themes, mirroring the design tokens in styles/tokens.css.
 * The public pages always use `lightTheme`; the dashboards switch
 * between the two with the user's theme preference.
 */

import { theme } from "antd";

const FONT =
  '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const shared = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#2563eb",
    colorSuccess: "#059669",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorLink: "#2563eb",
    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusSM: 8,
    controlHeight: 38,
    fontFamily: FONT,
    motionDurationMid: "0.22s",
    motionEaseOut: "cubic-bezier(0.22, 0.7, 0.18, 1)",
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "0 6px 16px -8px rgb(37 99 235 / 0.6)",
      defaultShadow: "none",
    },
    Card: { headerFontSize: 15, paddingLG: 22 },
    Table: {
      headerSplitColor: "transparent",
      cellPaddingBlock: 14,
      headerBorderRadius: 12,
    },
    Tabs: { titleFontSize: 14 },
    Modal: { borderRadiusLG: 18, titleFontSize: 17 },
    Tag: { borderRadiusSM: 999 },
    Menu: { itemBorderRadius: 10 },
    Drawer: { paddingLG: 22 },
    Pagination: { itemActiveBg: "transparent" },
  },
};

const merge = (base, extra) => ({
  ...base,
  ...extra,
  token: { ...base.token, ...extra.token },
  components: Object.fromEntries(
    [
      ...new Set([
        ...Object.keys(base.components),
        ...Object.keys(extra.components || {}),
      ]),
    ].map((k) => [
      k,
      { ...base.components[k], ...(extra.components?.[k] || {}) },
    ]),
  ),
});

export const lightTheme = merge(shared, {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorText: "#0e1a2b",
    colorTextSecondary: "#5f6b7c",
    colorTextTertiary: "#7c8696",
    colorBorder: "#d9d5cd",
    colorBorderSecondary: "#ece9e3",
    colorBgLayout: "#faf9f6",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorFillAlter: "#f7f6f2",
    colorFillSecondary: "#f1efea",
    boxShadow:
      "0 1px 2px rgb(14 26 43 / 0.04), 0 8px 24px -8px rgb(14 26 43 / 0.12)",
    boxShadowSecondary:
      "0 1px 2px rgb(14 26 43 / 0.04), 0 12px 32px -12px rgb(14 26 43 / 0.2)",
  },
  components: {
    Table: {
      headerBg: "#f7f6f2",
      headerColor: "#334155",
      rowHoverBg: "#faf9f6",
      borderColor: "#ece9e3",
    },
    Tabs: { itemSelectedColor: "#0e1a2b", inkBarColor: "#2563eb" },
    Menu: { itemSelectedBg: "#eaf0fe", itemSelectedColor: "#1d4ed8" },
    Segmented: { itemSelectedBg: "#ffffff", trackBg: "#f1efea" },
  },
});

export const darkTheme = merge(shared, {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#4f8cff",
    colorInfo: "#4f8cff",
    colorLink: "#7aa7ff",
    colorSuccess: "#22c38e",
    colorWarning: "#f5b53d",
    colorError: "#f05252",
    colorText: "#e8edf4",
    colorTextSecondary: "#a5b1c4",
    colorTextTertiary: "#8f9cb1",
    colorBorder: "#2d3d5a",
    colorBorderSecondary: "#212e46",
    colorBgLayout: "#0b1220",
    colorBgContainer: "#111a2b",
    colorBgElevated: "#16213a",
    colorFillAlter: "#141f33",
    colorFillSecondary: "#1b2741",
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.3), 0 10px 28px -10px rgb(0 0 0 / 0.6)",
    boxShadowSecondary:
      "0 1px 2px rgb(0 0 0 / 0.3), 0 16px 40px -14px rgb(0 0 0 / 0.7)",
  },
  components: {
    Button: { primaryShadow: "0 6px 16px -8px rgb(79 140 255 / 0.55)" },
    Table: {
      headerBg: "#141f33",
      headerColor: "#c3cdda",
      rowHoverBg: "#16213a",
      borderColor: "#212e46",
    },
    Tabs: { itemSelectedColor: "#e8edf4", inkBarColor: "#4f8cff" },
    Menu: { itemSelectedBg: "#1b2a4a", itemSelectedColor: "#9dbcff" },
    Segmented: { itemSelectedBg: "#22304a", trackBg: "#141f33" },
  },
});
