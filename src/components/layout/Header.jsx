import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  StarOutlined,
  UserOutlined,
  PhoneOutlined,
  LoginOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", path: "#home", icon: HomeOutlined },
    { name: "About", path: "#about", icon: InfoCircleOutlined },
    { name: "Features", path: "#features", icon: StarOutlined },
    { name: "User Roles", path: "#userroles", icon: UserOutlined },
  ];

  const getDashboardPath = () => {
    if (!userRole) return "/auth";
    const roleMap = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/student/dashboard",
      parent: "/parent/dashboard",
    };
    return roleMap[userRole] || "/auth";
  };

  const actionItems = [
    { name: "Contact", path: "#contact", icon: PhoneOutlined },
    isAuthenticated
      ? {
          name: "Dashboard",
          path: getDashboardPath(),
          icon: DashboardOutlined,
          primary: true,
        }
      : { name: "Login", path: "/auth", icon: LoginOutlined, primary: true },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          isMenuOpen ? "bg-white border-b border-gray-200" : "glass-navbar"
        }`}>
        <nav className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-bold text-gray-900">SSMS</div>
                <div className="text-xs text-gray-500">Smart School System</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition">
                    <Icon />
                    {item.name}
                  </a>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {actionItems.map((item) => {
                const Icon = item.icon;
                const Component = item.path.startsWith("#") ? "a" : Link;
                const linkProps = item.path.startsWith("#")
                  ? { href: item.path }
                  : { to: item.path };

                return (
                  <Component
                    key={item.name}
                    {...linkProps}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      item.primary
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}>
                    <Icon />
                    {item.name}
                  </Component>
                );
              })}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <CloseOutlined className="text-xl" />
              ) : (
                <MenuOutlined className="text-xl" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE OVERLAY + MENU */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}>
          <aside
            className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-60"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                    <Icon />
                    {item.name}
                  </a>
                );
              })}

              <div className="my-2 h-px bg-gray-200" />

              {actionItems.map((item) => {
                const Icon = item.icon;
                const Component = item.path.startsWith("#") ? "a" : Link;
                const linkProps = item.path.startsWith("#")
                  ? { href: item.path }
                  : { to: item.path };

                return (
                  <Component
                    key={item.name}
                    {...linkProps}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      item.primary
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}>
                    <Icon />
                    {item.name}
                  </Component>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
