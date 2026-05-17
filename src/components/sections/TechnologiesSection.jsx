import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import {
  Html5Outlined,
  ApiOutlined,
  DatabaseOutlined,
  RobotOutlined,
  BgColorsOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const TechnologiesSection = () => {
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

  const techStack = [
    {
      category: "Frontend",
      icon: <Html5Outlined />,
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb, #1e40af)",
      technologies: [
        { name: "HTML", logo: "🌐" },
        { name: "CSS", logo: "🎨" },
        { name: "JavaScript", logo: "⚡" },
        { name: "React.js", logo: "⚛️" },
      ],
    },
    {
      category: "Backend",
      icon: <ApiOutlined />,
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #047857)",
      technologies: [
        { name: "Django", logo: "🐍" },
        { name: "Flask", logo: "🔥" },
        { name: "Node.js", logo: "🟢" },
      ],
    },
    {
      category: "Database",
      icon: <DatabaseOutlined />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      technologies: [
        { name: "MySQL", logo: "🐬" },
        { name: "PostgreSQL", logo: "🐘" },
      ],
    },
    {
      category: "AI & ML",
      icon: <RobotOutlined />,
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      technologies: [
        { name: "Python", logo: "🐍" },
        { name: "Scikit-Learn", logo: "🤖" },
        { name: "TensorFlow", logo: "🧠" },
      ],
    },
    {
      category: "Design",
      icon: <BgColorsOutlined />,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899, #db2777)",
      technologies: [
        { name: "Figma", logo: "🎨" },
        { name: "Adobe XD", logo: "✨" },
      ],
    },
    {
      category: "Version Control",
      icon: <GithubOutlined />,
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      technologies: [
        { name: "Git", logo: "📦" },
        { name: "GitHub", logo: "🐙" },
      ],
    },
  ];

  return (
    <section
      id="technologies"
      className="technologies-section"
      ref={sectionRef}>
      {/* Background Elements */}
      <div className="tech-bg">
        <div className="tech-pattern"></div>
        <div className="tech-orb tech-orb-1"></div>
        <div className="tech-orb tech-orb-2"></div>
        <div className="tech-shapes">
          <div className="tech-shape tech-shape-1"></div>
          <div className="tech-shape tech-shape-2"></div>
        </div>
      </div>

      <div className="tech-container">
        {/* Section Header */}
        <div className="tech-header animate-on-scroll">
          <div className="tech-badge">
            <span className="badge-sparkle">✨</span>
            <span>Tech Stack</span>
          </div>
          <h2 className="tech-heading">
            Technologies <span className="tech-gradient">Used</span>
          </h2>
          <p className="tech-description">
            Built with modern, industry-standard technologies for optimal
            performance
          </p>
        </div>

        {/* Tech Stack Grid */}
        <Row gutter={[24, 24]} className="tech-grid">
          {techStack.map((stack, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <div
                className="tech-stack-card animate-on-scroll"
                style={{ animationDelay: `${100 + index * 80}ms` }}>
                <div
                  className="tech-card-glow"
                  style={{ background: stack.gradient }}></div>
                <div className="tech-card-content">
                  <div className="tech-card-header">
                    <div
                      className="tech-icon-box"
                      style={{
                        background: `${stack.color}15`,
                        color: stack.color,
                      }}>
                      {stack.icon}
                    </div>
                    <h3 className="tech-card-title">{stack.category}</h3>
                  </div>
                  <div className="tech-list">
                    {stack.technologies.map((tech, idx) => (
                      <div key={idx} className="tech-item">
                        <span className="tech-logo">{tech.logo}</span>
                        <span className="tech-name">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Architecture Highlight */}
        <div
          className="architecture-section animate-on-scroll"
          style={{ animationDelay: "600ms" }}>
          <div className="architecture-card">
            <div className="architecture-glow"></div>
            <div className="architecture-content">
              <div className="architecture-header">
                <h3 className="architecture-title">Modern Architecture</h3>
                <p className="architecture-desc">
                  SSMS is built using a modern, scalable architecture that
                  ensures high performance, security, and maintainability.
                </p>
              </div>
              <div className="architecture-features">
                <div className="arch-feature">
                  <div className="arch-feature-icon">🚀</div>
                  <div className="arch-feature-title">Fast</div>
                  <div className="arch-feature-desc">Optimized Performance</div>
                </div>
                <div className="arch-feature">
                  <div className="arch-feature-icon">🔒</div>
                  <div className="arch-feature-title">Secure</div>
                  <div className="arch-feature-desc">
                    Enterprise-Grade Security
                  </div>
                </div>
                <div className="arch-feature">
                  <div className="arch-feature-icon">📱</div>
                  <div className="arch-feature-title">Responsive</div>
                  <div className="arch-feature-desc">
                    Mobile-Friendly Design
                  </div>
                </div>
                <div className="arch-feature">
                  <div className="arch-feature-icon">⚡</div>
                  <div className="arch-feature-title">Scalable</div>
                  <div className="arch-feature-desc">Grows With Your Needs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Technologies Section */
        .technologies-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to bottom, #ffffff, #f8fafc);
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .tech-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .tech-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.03) 2px,
            transparent 2px
          );
          background-size: 30px 30px;
        }

        .tech-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.09;
          animation: float-tech-orb 26s ease-in-out infinite;
        }

        .tech-orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: -10%;
          right: -15%;
        }

        .tech-orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(225deg, #2563eb, #06b6d4);
          bottom: -10%;
          left: -15%;
          animation-delay: -13s;
        }

        @keyframes float-tech-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(35px, -35px) scale(1.08);
          }
          66% {
            transform: translate(-25px, 25px) scale(0.92);
          }
        }

        .tech-shapes {
          position: absolute;
          inset: 0;
        }

        .tech-shape {
          position: absolute;
          opacity: 0.04;
          animation: float-tech-shape 18s ease-in-out infinite;
        }

        .tech-shape-1 {
          width: 150px;
          height: 150px;
          background: #2563eb;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          top: 25%;
          left: 8%;
        }

        .tech-shape-2 {
          width: 120px;
          height: 120px;
          background: #8b5cf6;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          bottom: 30%;
          right: 10%;
          animation-delay: -9s;
        }

        @keyframes float-tech-shape {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(180deg);
          }
        }

        /* Container */
        .tech-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .tech-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
        }

        .badge-sparkle {
          font-size: 1rem;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
        }

        .tech-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .tech-gradient {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tech-description {
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
          animation: slide-up-tech 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes slide-up-tech {
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

        /* Tech Stack Cards */
        .tech-grid {
          margin-bottom: 3rem;
        }

        .tech-stack-card {
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

        .tech-stack-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12);
        }

        .tech-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .tech-stack-card:hover .tech-card-glow {
          opacity: 1;
        }

        .tech-card-content {
          position: relative;
          z-index: 1;
        }

        .tech-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .tech-icon-box {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 1.75rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .tech-stack-card:hover .tech-icon-box {
          transform: scale(1.1) rotate(-5deg);
        }

        .tech-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .tech-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tech-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(248, 250, 252, 0.8),
            rgba(241, 245, 249, 0.8)
          );
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .tech-item:hover {
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.08),
            rgba(139, 92, 246, 0.08)
          );
          transform: translateX(4px);
        }

        .tech-logo {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .tech-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #475569;
        }

        /* Architecture Section */
        .architecture-section {
          margin-top: 2rem;
        }

        .architecture-card {
          position: relative;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 32px;
          padding: 3rem 2rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);
        }

        .architecture-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          animation: rotate-architecture 18s linear infinite;
        }

        @keyframes rotate-architecture {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .architecture-content {
          position: relative;
          z-index: 1;
        }

        .architecture-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .architecture-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
        }

        .architecture-desc {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }

        .architecture-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .arch-feature {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .arch-feature:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .arch-feature-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .arch-feature-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .arch-feature-desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .technologies-section {
            padding: 4rem 1rem;
          }

          .tech-header {
            margin-bottom: 2.5rem;
          }

          .tech-stack-card {
            padding: 1.5rem;
          }

          .architecture-card {
            padding: 2rem 1.5rem;
          }

          .architecture-features {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default TechnologiesSection;
