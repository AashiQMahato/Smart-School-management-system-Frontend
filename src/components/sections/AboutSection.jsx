import React, { useEffect, useRef } from "react";
import { Card, Timeline } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { FaRegLightbulb, FaRocket } from "react-icons/fa";

const AboutSection = () => {
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

  const highlights = [
    "Replaces manual and paper-based workflows",
    "Centralized digital solution for all operations",
    "AI-powered predictive analysis",
    "Real-time communication among stakeholders",
    "Secure data handling and management",
    "Intelligent insights for better outcomes",
  ];

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="about-bg">
        <div className="bg-pattern"></div>
        <div className="bg-orb orb-about-1"></div>
        <div className="bg-orb orb-about-2"></div>
      </div>

      <div className="about-container">
        {/* Section Header */}
        <div className="section-header animate-on-scroll">
          <div className="header-badge">
            <span className="badge-dot"></span>
            <span>About SSMS</span>
          </div>
          <h2 className="section-heading">About the Project</h2>
          <p className="section-description">
            A comprehensive solution for modern educational institutions
          </p>
        </div>

        <div className="about-grid">
          {/* Left - Content */}
          <div className="about-content">
            <div
              className="content-card animate-on-scroll"
              style={{ animationDelay: "100ms" }}>
              <div className="card-icon-header">
                <div className="feature-icon-large">
                  <FaRegLightbulb />
                </div>
                <div>
                  <h3 className="content-title">
                    About the Smart School Management System
                  </h3>
                </div>
              </div>
              <p className="content-text">
                The Smart School Management System (SSMS) is a final year
                academic project developed to address the challenges faced by
                educational institutions that rely on manual or fragmented
                digital systems. The platform integrates academic management,
                administration, communication, and financial operations into a
                single, intelligent web-based system.
              </p>
            </div>

            <div
              className="ai-highlight-card animate-on-scroll"
              style={{ animationDelay: "200ms" }}>
              <div className="ai-glow"></div>
              <p className="ai-text">
                By leveraging <strong>Artificial Intelligence (AI)</strong>,
                SSMS enables predictive analysis of student performance,
                automated workflows, and real-time communication among all
                stakeholders, helping schools operate efficiently in a modern
                educational environment.
              </p>
            </div>

            <div
              className="highlights-section animate-on-scroll"
              style={{ animationDelay: "300ms" }}>
              <h4 className="highlights-title">Key Highlights</h4>
              <div className="highlights-grid">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="highlight-item"
                    style={{ animationDelay: `${400 + index * 50}ms` }}>
                    <CheckCircleOutlined className="highlight-icon" />
                    <span className="highlight-text">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="about-visual">
            <div
              className="timeline-card animate-on-scroll"
              style={{ animationDelay: "200ms" }}>
              <div className="timeline-header">
                <h4 className="timeline-title">System Components</h4>
                <div className="timeline-badge">5 Modules</div>
              </div>
              <Timeline
                items={[
                  {
                    color: "#2563eb",
                    dot: <div className="custom-timeline-dot">📚</div>,
                    children: (
                      <div className="timeline-content">
                        <div className="timeline-item-title">
                          Academic Management
                        </div>
                        <div className="timeline-item-desc">
                          Student records, attendance, grading
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "#2563eb",
                    dot: <div className="custom-timeline-dot">⚙️</div>,
                    children: (
                      <div className="timeline-content">
                        <div className="timeline-item-title">
                          Administrative Operations
                        </div>
                        <div className="timeline-item-desc">
                          Staff management, role-based access
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "#2563eb",
                    dot: <div className="custom-timeline-dot">🤖</div>,
                    children: (
                      <div className="timeline-content">
                        <div className="timeline-item-title">
                          AI Intelligence
                        </div>
                        <div className="timeline-item-desc">
                          Performance prediction, insights
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "#2563eb",
                    dot: <div className="custom-timeline-dot">💬</div>,
                    children: (
                      <div className="timeline-content">
                        <div className="timeline-item-title">
                          Communication Hub
                        </div>
                        <div className="timeline-item-desc">
                          Real-time notifications, announcements
                        </div>
                      </div>
                    ),
                  },
                  {
                    color: "#2563eb",
                    dot: <div className="custom-timeline-dot">💰</div>,
                    children: (
                      <div className="timeline-content">
                        <div className="timeline-item-title">
                          Financial Management
                        </div>
                        <div className="timeline-item-desc">
                          Fee tracking, invoicing, analytics
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div
              className="vision-card animate-on-scroll"
              style={{ animationDelay: "300ms" }}>
              <div className="vision-glow"></div>
              <div className="vision-content">
                <FaRocket className="vision-icon" />
                <div className="vision-text">
                  <div className="vision-title">Project Vision</div>
                  <div className="vision-desc">
                    Transforming education through smart technology and
                    AI-driven insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* About Section */
        .about-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .about-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.02) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.02) 1px,
              transparent 1px
            );
          background-size: 32px 32px;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.1;
          animation: float-orb 25s ease-in-out infinite;
        }

        .orb-about-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #2563eb, #8b5cf6);
          top: 10%;
          left: -15%;
        }

        .orb-about-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(225deg, #06b6d4, #2563eb);
          bottom: 10%;
          right: -10%;
          animation-delay: -12s;
        }

        @keyframes float-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -40px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }

        /* Container */
        .about-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1rem;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #2563eb;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        .section-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .section-description {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: #475569;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-on-scroll.animate-in {
          animation: slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes slide-up {
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

        /* Grid Layout */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* Left Content */
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-card {
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .content-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
        }

        .card-icon-header {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .feature-icon-large {
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.1),
            rgba(139, 92, 246, 0.1)
          );
          border-radius: 16px;
          color: #2563eb;
          font-size: 1.75rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin: 0;
        }

        .content-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #475569;
          margin: 0;
        }

        /* AI Highlight Card */
        .ai-highlight-card {
          position: relative;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-radius: 24px;
          padding: 2rem;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
        }

        .ai-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          transform: translate(-50%, -50%);
          animation: pulse-glow 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.7;
          }
        }

        .ai-text {
          position: relative;
          font-size: 1rem;
          line-height: 1.7;
          color: white;
          margin: 0;
          z-index: 1;
        }

        .ai-text strong {
          font-weight: 700;
          color: #fbbf24;
        }

        /* Highlights Section */
        .highlights-section {
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .highlights-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
        }

        .highlights-grid {
          display: grid;
          gap: 1rem;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.03),
            rgba(139, 92, 246, 0.03)
          );
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .highlight-item:hover {
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.08),
            rgba(139, 92, 246, 0.08)
          );
          transform: translateX(4px);
        }

        .highlight-icon {
          color: #10b981;
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .highlight-text {
          font-size: 0.9375rem;
          color: #0f172a;
          line-height: 1.5;
        }

        /* Right Visual */
        .about-visual {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 2rem;
        }

        .timeline-card {
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .timeline-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .timeline-badge {
          padding: 0.375rem 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.1),
            rgba(139, 92, 246, 0.1)
          );
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 9999px;
        }

        .custom-timeline-dot {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.1),
            rgba(139, 92, 246, 0.1)
          );
          border-radius: 50%;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
        }

        .timeline-content {
          padding-left: 0.5rem;
        }

        .timeline-item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .timeline-item-desc {
          font-size: 0.875rem;
          color: #64748b;
        }

        /* Vision Card */
        .vision-card {
          position: relative;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 24px;
          padding: 2rem;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
        }

        .vision-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 70%
          );
          animation: rotate-glow 10s linear infinite;
        }

        @keyframes rotate-glow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .vision-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 1;
        }

        .vision-icon {
          font-size: 3rem;
          color: white;
          flex-shrink: 0;
        }

        .vision-text {
          flex: 1;
        }

        .vision-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .vision-desc {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .about-visual {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 4rem 1rem;
          }

          .section-header {
            margin-bottom: 2.5rem;
          }

          .card-icon-header {
            flex-direction: column;
            gap: 1rem;
          }

          .vision-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
