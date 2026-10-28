/**
 * LoadingScreen
 * Loading indicator. Inside the dashboard it fills the content area so
 * the sidebar and header stay usable; pass fullScreen for a page overlay.
 */

import { Spin } from "antd";
import { BrandMark } from "../../features/landing/components/primitives";

/**
 * @param {object} props
 * @param {string} props.message - Loading message
 * @param {boolean} props.fullScreen - Cover the whole viewport
 */
const LoadingScreen = ({ message = "Loading…", fullScreen = false }) => {
  const content = (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite">
      <BrandMark size={44} />
      <Spin />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ssl-bg)]">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-12">
      {content}
    </div>
  );
};

export default LoadingScreen;
