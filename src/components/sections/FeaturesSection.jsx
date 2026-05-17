import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  BookOutlined,
  RobotOutlined,
  BellOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const FeaturesSection = () => {
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

  const features = [
    {
      icon: <UserOutlined />,
      title: "Administrative Management",
      items: [
        "Student and staff record management",
        "Role-Based Access Control (RBAC)",
        "Secure authentication and authorization",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb, #1e40af)",
    },
    {
      icon: <BookOutlined />,
      title: "Academic Management",
      items: [
        "Attendance tracking system",
        "Assignment and grading management",
        "Timetable and course management",
      ],
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #047857)",
    },
    {
      icon: <RobotOutlined />,
      title: "AI-Powered Intelligence",
      items: [
        "Student performance prediction",
        "Early identification of at-risk students",
        "AI academic assistant (chatbot support)",
      ],
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
    {
      icon: <BellOutlined />,
      title: "Communication & Notifications",
      items: [
        "Real-time announcements",
        "Parent-teacher communication",
        "Automated alerts and reminders",
      ],
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      icon: <DollarOutlined />,
      title: "Financial Management",
      items: [
        "Fee structure and invoice generation",
        "Payment tracking and reminders",
        "Financial analytics dashboard",
      ],
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      icon: <SafetyOutlined />,
      title: "Security & Compliance",
      items: [
        "Role-based access control",
        "Encrypted data storage",
        "Audit logs and compliance tracking",
      ],
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
  ];

  return (
    <section id="features" className="features-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="features-bg">
        <div className="bg-grid-pattern"></div>
        <div className="bg-feature-orb orb-feature-1"></div>
        <div className="bg-feature-orb orb-feature-2"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="features-container">
        {/* Section Header */}
        <div className="features-header animate-on-scroll">
          <div className="header-badge-features">
            <span className="badge-icon">✨</span>
            <span>Platform Features</span>
          </div>
          <h2 className="features-heading">Key Features of SSMS</h2>
          <p className="features-description">
            Comprehensive features designed to streamline every aspect of school
            management
          </p>
        </div>

        {/* Features Grid */}
        <Row gutter={[32, 32]} className="features-grid">
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <div
                className="feature-card-modern animate-on-scroll"
                style={{ animationDelay: `${100 + index * 80}ms` }}>
                <div
                  className="card-glow"
                  style={{ background: feature.gradient }}></div>
                <div className="card-content">
                  <div
                    className="feature-icon-box"
                    style={{
                      background: `${feature.color}15`,
                      color: feature.color,
                    }}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <ul className="feature-list">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="feature-list-item">
                        <span
                          className="feature-check"
                          style={{ color: feature.color }}>
                          ✓
                        </span>
                        <span className="feature-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-shine"></div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Bottom Highlight */}
        <div
          className="platform-highlight animate-on-scroll"
          style={{ animationDelay: "600ms" }}>
          <div className="highlight-glow"></div>
          <div className="highlight-content">
            <div className="highlight-header">
              <h3 className="highlight-title">All-in-One Platform</h3>
              <p className="highlight-desc">
                SSMS integrates all essential school management features into a
                single, user-friendly platform, ensuring seamless operations and
                improved efficiency.
              </p>
            </div>
            <div className="platform-stats">
              <div className="stat-item">
                <BarChartOutlined className="stat-icon" />
                <div className="stat-label">Analytics</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <TeamOutlined className="stat-icon" />
                <div className="stat-label">Multi-User</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <CalendarOutlined className="stat-icon" />
                <div className="stat-label">Scheduling</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <RobotOutlined className="stat-icon" />
                <div className="stat-label">AI-Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Features Section */
        .features-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: white;
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .features-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.04) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }

        .bg-feature-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.08;
          animation: float-feature-orb 30s ease-in-out infinite;
        }

        .orb-feature-1 {
          width: 700px;
          height: 700px;
          background: linear-gradient(135deg, #8b5cf6, #2563eb);
          top: -20%;
          right: -15%;
        }

        .orb-feature-2 {
          width: 600px;
          height: 600px;
          background: linear-gradient(225deg, #10b981, #06b6d4);
          bottom: -20%;
          left: -15%;
          animation-delay: -15s;
        }

        @keyframes float-feature-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.15);
          }
          66% {
            transform: translate(-40px, 40px) scale(0.85);
          }
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
        }

        .shape {
          position: absolute;
          border-radius: 12px;
          opacity: 0.03;
          animation: float-shape 20s ease-in-out infinite;
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          background: #2563eb;
          top: 20%;
          left: 10%;
          transform: rotate(45deg);
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          background: #8b5cf6;
          top: 60%;
          right: 15%;
          transform: rotate(-30deg);
          animation-delay: -8s;
        }

        .shape-3 {
          width: 180px;
          height: 180px;
          background: #10b981;
          bottom: 25%;
          left: 20%;
          transform: rotate(60deg);
          animation-delay: -14s;
        }

        @keyframes float-shape {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
          }
          50% {
            transform: translateY(-30px) rotate(65deg);
          }
        }

        /* Container */
        .features-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .features-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .header-badge-features {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08),
            rgba(37, 99, 235, 0.08)
          );
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 1rem;
        }

        .badge-icon {
          font-size: 1rem;
        }

        .features-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .features-description {
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
          animation: slide-up-features 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        @keyframes slide-up-features {
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

        /* Feature Cards */
        .features-grid {
          margin-bottom: 3rem;
        }

        .feature-card-modern {
          position: relative;
          height: 100%;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 24px;
          padding: 2rem;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .feature-card-modern:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
          border-color: rgba(37, 99, 235, 0.3);
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card-modern:hover .card-glow {
          opacity: 1;
        }

        .card-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .feature-card-modern:hover .card-shine {
          transform: translateX(100%);
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .feature-icon-box {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .feature-card-modern:hover .feature-icon-box {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.25rem 0;
          line-height: 1.3;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-list-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .feature-check {
          flex-shrink: 0;
          font-size: 1.125rem;
          font-weight: 700;
          margin-top: 0.125rem;
        }

        .feature-text {
          font-size: 0.9375rem;
          color: #475569;
          line-height: 1.6;
        }

        /* Platform Highlight */
        .platform-highlight {
          position: relative;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-radius: 32px;
          padding: 3rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.25);
        }

        .highlight-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          animation: rotate-highlight 15s linear infinite;
        }

        @keyframes rotate-highlight {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .highlight-content {
          position: relative;
          z-index: 1;
        }

        .highlight-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .highlight-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
        }

        .highlight-desc {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: rgba(255, 255, 255, 0.9);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .platform-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          min-width: 120px;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .stat-icon {
          font-size: 2.5rem;
          color: white;
        }

        .stat-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .stat-divider {
          width: 1px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .features-section {
            padding: 4rem 1rem;
          }

          .features-header {
            margin-bottom: 2.5rem;
          }

          .platform-highlight {
            padding: 2rem 1.5rem;
          }

          .platform-stats {
            gap: 1rem;
          }

          .stat-divider {
            display: none;
          }

          .stat-item {
            min-width: 100px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
