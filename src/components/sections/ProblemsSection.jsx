import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  DollarOutlined,
  BarChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const ProblemsSection = () => {
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

  const problems = [
    {
      icon: <FileTextOutlined />,
      title: "Paper-Based Records",
      description:
        "Heavy reliance on paper-based records leading to inefficiency and data loss",
      emoji: "📄",
      color: "#ef4444",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Time-Consuming Processes",
      description:
        "Manual administrative processes consuming valuable time and resources",
      emoji: "⏰",
      color: "#f59e0b",
    },
    {
      icon: <MessageOutlined />,
      title: "Poor Communication",
      description:
        "Difficulty in maintaining effective communication between school, parents, and students",
      emoji: "💬",
      color: "#ec4899",
    },
    {
      icon: <BarChartOutlined />,
      title: "Performance Tracking",
      description:
        "Challenges in tracking and analyzing student performance effectively",
      emoji: "📊",
      color: "#8b5cf6",
    },
    {
      icon: <DollarOutlined />,
      title: "Manual Fee Management",
      description:
        "Error-prone manual fee management leading to delays and discrepancies",
      emoji: "💰",
      color: "#06b6d4",
    },
    {
      icon: <WarningOutlined />,
      title: "Lack of Data Insights",
      description:
        "Absence of data-driven decision-making capabilities for better outcomes",
      emoji: "⚠️",
      color: "#f97316",
    },
  ];

  return (
    <section className="problems-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="problems-bg">
        <div className="problems-pattern"></div>
        <div className="problems-orb problems-orb-1"></div>
        <div className="problems-orb problems-orb-2"></div>
      </div>

      <div className="problems-container">
        {/* Section Header */}
        <div className="problems-header animate-on-scroll">
          <div className="problems-badge">
            <span className="badge-warning">⚠️</span>
            <span>Current Challenges</span>
          </div>
          <h2 className="problems-heading">
            Problems in Traditional <br />
            School Management
          </h2>
          <p className="problems-description">
            Challenges faced by educational institutions using manual or
            fragmented systems
          </p>
        </div>

        {/* Problems Grid */}
        <Row gutter={[24, 24]} className="problems-grid">
          {problems.map((problem, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <div
                className="problem-card animate-on-scroll"
                style={{ animationDelay: `${100 + index * 80}ms` }}>
                <div
                  className="problem-glow"
                  style={{ background: `${problem.color}30` }}></div>
                <div className="problem-content">
                  <div className="problem-emoji">{problem.emoji}</div>
                  <div
                    className="problem-icon-box"
                    style={{
                      background: `${problem.color}15`,
                      color: problem.color,
                    }}>
                    {problem.icon}
                  </div>
                  <h3 className="problem-title">{problem.title}</h3>
                  <p className="problem-desc">{problem.description}</p>
                </div>
                <div
                  className="problem-accent"
                  style={{ background: problem.color }}></div>
              </div>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <div
          className="solution-cta animate-on-scroll"
          style={{ animationDelay: "600ms" }}>
          <div className="solution-card">
            <div className="solution-glow"></div>
            <div className="solution-content">
              <div className="solution-icon">✅</div>
              <h3 className="solution-title">Ready for a Modern Solution?</h3>
              <p className="solution-desc">
                SSMS addresses all these challenges with an intelligent,
                integrated platform that transforms how educational institutions
                operate.
              </p>
              <div className="solution-features">
                <div className="solution-feature">
                  <span className="solution-check">✓</span>
                  <span>Automated Workflows</span>
                </div>
                <div className="solution-feature">
                  <span className="solution-check">✓</span>
                  <span>AI-Powered Insights</span>
                </div>
                <div className="solution-feature">
                  <span className="solution-check">✓</span>
                  <span>Real-Time Communication</span>
                </div>
                <div className="solution-feature">
                  <span className="solution-check">✓</span>
                  <span>Secure & Scalable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Problems Section */
        .problems-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc, #ffffff);
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .problems-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .problems-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(239, 68, 68, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.02) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .problems-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.06;
          animation: float-problems-orb 25s ease-in-out infinite;
        }

        .problems-orb-1 {
          width: 550px;
          height: 550px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          top: -12%;
          right: -10%;
        }

        .problems-orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(225deg, #ec4899, #8b5cf6);
          bottom: -12%;
          left: -10%;
          animation-delay: -12.5s;
        }

        @keyframes float-problems-orb {
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
        .problems-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .problems-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .problems-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #ef4444;
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
        }

        .badge-warning {
          font-size: 1rem;
          animation: pulse-warning 2s ease-in-out infinite;
        }

        @keyframes pulse-warning {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .problems-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .problems-description {
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
          animation: slide-up-problems 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        @keyframes slide-up-problems {
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

        /* Problem Cards */
        .problems-grid {
          margin-bottom: 3rem;
        }

        .problem-card {
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

        .problem-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
        }

        .problem-glow {
          position: absolute;
          inset: -50%;
          opacity: 0;
          transition: opacity 0.4s ease;
          filter: blur(40px);
        }

        .problem-card:hover .problem-glow {
          opacity: 0.6;
        }

        .problem-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .problem-emoji {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          transition: transform 0.4s ease;
        }

        .problem-card:hover .problem-emoji {
          transform: scale(1.15) rotate(-10deg);
        }

        .problem-icon-box {
          width: 56px;
          height: 56px;
          margin: 0 auto 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .problem-card:hover .problem-icon-box {
          transform: scale(1.08);
        }

        .problem-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }

        .problem-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        .problem-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .problem-card:hover .problem-accent {
          opacity: 1;
        }

        /* Solution CTA */
        .solution-cta {
          margin-top: 2rem;
        }

        .solution-card {
          position: relative;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 32px;
          padding: 3rem 2rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);
          max-width: 900px;
          margin: 0 auto;
        }

        .solution-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          animation: rotate-solution 16s linear infinite;
        }

        @keyframes rotate-solution {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .solution-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .solution-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .solution-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
        }

        .solution-desc {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.7;
          margin: 0 0 2rem 0;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .solution-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .solution-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
        }

        .solution-feature:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(4px);
        }

        .solution-check {
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .problems-section {
            padding: 4rem 1rem;
          }

          .problems-header {
            margin-bottom: 2.5rem;
          }

          .problem-card {
            padding: 1.5rem 1.25rem;
          }

          .solution-card {
            padding: 2rem 1.5rem;
          }

          .solution-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ProblemsSection;
