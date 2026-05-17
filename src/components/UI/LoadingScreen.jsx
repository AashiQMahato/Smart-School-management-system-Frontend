/**
 * LoadingScreen Component
 * Full-screen loading indicator
 */

import { Spin } from "antd";
import { FaGraduationCap } from "react-icons/fa";

/**
 * LoadingScreen
 * @param {object} props
 * @param {string} props.message - Loading message
 * @param {boolean} props.fullScreen - Full screen mode
 */
const LoadingScreen = ({ message = "Loading...", fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
        <FaGraduationCap className="text-white text-3xl" />
      </div>
      <Spin size="large" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12 flex items-center justify-center">{content}</div>
  );
};

export default LoadingScreen;
