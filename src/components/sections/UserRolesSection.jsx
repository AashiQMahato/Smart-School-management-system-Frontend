import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const UserRolesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReducedMotion && sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        },
        { threshold: 0.1 },
      );

      const elements =
        sectionRef.current.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, []);

  const roles = [
    {
      icon: <UserOutlined className="role-icon" />,
      title: "Administrators",
      description: "Manage users, reports, finance, and system settings",
      features: [
        "Complete system access",
        "User management",
        "Financial reports",
        "System configuration",
        "Analytics dashboard",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb, #1e40af)",
      illustration: "👨‍💼",
    },
    {
      icon: <TeamOutlined className="role-icon" />,
      title: "Teachers",
      description: "Record attendance, enter marks, monitor performance",
      features: [
        "Attendance management",
        "Grade entry and reporting",
        "Student performance tracking",
        "Assignment management",
        "Parent communication",
      ],
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #047857)",
      illustration: "👨‍🏫",
    },
    {
      icon: <BookOutlined className="role-icon" />,
      title: "Students",
      description: "View academic progress, attendance, and notifications",
      features: [
        "View grades and progress",
        "Check attendance records",
        "Access assignments",
        "Receive notifications",
        "AI academic assistant",
      ],
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      illustration: "👨‍🎓",
    },
    {
      icon: <UserSwitchOutlined className="role-icon" />,
      title: "Parents",
      description: "Track student performance, attendance, and fee status",
      features: [
        "Monitor child progress",
        "View attendance records",
        "Fee payment tracking",
        "Receive alerts",
        "Teacher communication",
      ],
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      illustration: "👪",
    },
  ];

  return (
    <section id="userroles" className="user-roles-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="roles-bg">
        <div className="roles-pattern"></div>
        <div className="roles-orb roles-orb-1"></div>
        <div className="roles-orb roles-orb-2"></div>
      </div>

      <div className="roles-container">
        {/* Section Header */}
        <div className="roles-header animate-on-scroll">
          <div className="roles-badge">
            <span className="badge-users">👥</span>
            <span>User Roles</span>
          </div>
          <h2 className="roles-heading">Who Can Use SSMS?</h2>
          <p className="roles-description">
            Tailored experiences for every stakeholder in the education
            ecosystem
          </p>
        </div>

        {/* Roles Grid */}
        <Row gutter={[24, 24]} className="roles-grid">
          {roles.map((role, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <div
                className="role-card animate-on-scroll"
                style={{ animationDelay: `${100 + index * 80}ms` }}>
                <div
                  className="role-card-glow"
                  style={{ background: role.gradient }}></div>

                {/* Character Illustration */}
                <div className="role-illustration-container">
                  <div
                    className="role-illustration"
                    style={{
                      background: role.gradient,
                    }}>
                    <span className="illustration-emoji">
                      {role.illustration}
                    </span>
                    <div className="illustration-glow"></div>
                  </div>
                </div>

                {/* Icon Badge */}
                <div
                  className="role-icon-badge"
                  style={{
                    background: `${role.color}15`,
                    color: role.color,
                  }}>
                  {role.icon}
                </div>

                {/* Content */}
                <div className="role-content">
                  <h3 className="role-title">{role.title}</h3>
                  <p className="role-description">{role.description}</p>

                  <div className="role-features">
                    <div className="features-header">Key Features:</div>
                    <ul className="features-list">
                      {role.features.map((feature, idx) => (
                        <li key={idx} className="feature-item">
                          <span
                            className="feature-dot"
                            style={{ background: role.color }}></span>
                          <span className="feature-text">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <style jsx>{`
        /* User Roles Section */
        .user-roles-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc, #ffffff);
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .roles-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .roles-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.02) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .roles-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.08;
          animation: float-roles-orb 24s ease-in-out infinite;
        }

        .roles-orb-1 {
          width: 550px;
          height: 550px;
          background: linear-gradient(135deg, #2563eb, #8b5cf6);
          top: -12%;
          left: -10%;
        }

        .roles-orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(225deg, #f59e0b, #ef4444);
          bottom: -12%;
          right: -10%;
          animation-delay: -12s;
        }

        @keyframes float-roles-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.08);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.92);
          }
        }

        /* Container */
        .roles-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .roles-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .roles-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
        }

        .badge-users {
          font-size: 1rem;
        }

        .roles-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .roles-description {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: #475569;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-on-scroll.animate-in {
          animation: slide-up-roles 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes slide-up-roles {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll {
            opacity: 1;
            transform: none;
          }
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

        /* Role Cards */
        .roles-grid {
          margin-bottom: 3rem;
        }

        .role-card {
          position: relative;
          height: 100%;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 24px;
          padding: 2rem 1.5rem;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .role-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 24px 56px rgba(15, 23, 42, 0.12);
        }

        .role-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .role-card:hover .role-card-glow {
          opacity: 1;
        }

        /* Character Illustration */
        .role-illustration-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .role-illustration {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          transition: transform 0.4s ease;
        }

        .role-card:hover .role-illustration {
          transform: scale(1.08) rotate(-5deg);
        }

        .illustration-emoji {
          font-size: 4rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          z-index: 1;
        }

        .illustration-glow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          animation: pulse-illustration 3s ease-in-out infinite;
        }

        @keyframes pulse-illustration {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.7;
          }
        }

        /* Icon Badge */
        .role-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: -24px auto 1.5rem;
          position: relative;
          z-index: 2;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .role-card:hover .role-icon-badge {
          transform: translateY(-4px) rotate(5deg);
        }

        /* Content */
        .role-content {
          text-align: center;
        }

        .role-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .role-description {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }

        /* Features */
        .role-features {
          background: linear-gradient(
            135deg,
            rgba(248, 250, 252, 0.9),
            rgba(241, 245, 249, 0.9)
          );
          border-radius: 16px;
          padding: 1rem;
          text-align: left;
        }

        .features-header {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #475569;
          line-height: 1.5;
        }

        .feature-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }

        .feature-text {
          flex: 1;
        }

        /* RBAC Section */
        .rbac-section {
          margin-top: 2rem;
        }

        .rbac-card {
          position: relative;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-radius: 32px;
          padding: 3rem 2rem;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.3);
          max-width: 900px;
          margin: 0 auto;
        }

        .rbac-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          animation: rotate-rbac 16s linear infinite;
        }

        @keyframes rotate-rbac {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .rbac-content {
          position: relative;
          z-index: 1;
        }

        .rbac-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .rbac-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
        }

        .rbac-desc {
          font-size: clamp(0.9375rem, 2vw, 1.0625rem);
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .user-roles-section {
            padding: 4rem 1rem;
          }

          .roles-header {
            margin-bottom: 2.5rem;
          }

          .role-card {
            padding: 1.5rem 1.25rem;
          }

          .role-illustration {
            width: 100px;
            height: 100px;
          }

          .illustration-emoji {
            font-size: 3.5rem;
          }

          .rbac-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default UserRolesSection;
