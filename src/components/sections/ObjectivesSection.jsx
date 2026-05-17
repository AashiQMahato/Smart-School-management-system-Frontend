import React, { useEffect, useRef } from "react";
import { Card, Row, Col } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const ObjectivesSection = () => {
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

  const objectives = [
    {
      title: "Automate Academic and Administrative Processes",
      description:
        "Streamline daily operations by automating attendance, grading, scheduling, and administrative tasks",
      icon: "🤖",
      color: "#2563eb",
    },
    {
      title: "Improve Transparency and Efficiency",
      description:
        "Provide clear visibility into all school operations with real-time updates and comprehensive reporting",
      icon: "📊",
      color: "#059669",
    },
    {
      title: "Integrate AI for Performance Prediction",
      description:
        "Leverage artificial intelligence to predict student performance and identify at-risk students early",
      icon: "🧠",
      color: "#8b5cf6",
    },
    {
      title: "Enhance Stakeholder Communication",
      description:
        "Facilitate seamless communication between administrators, teachers, students, and parents",
      icon: "💬",
      color: "#f59e0b",
    },
    {
      title: "Provide Secure and Scalable Platform",
      description:
        "Deliver a secure, reliable, and scalable digital platform that grows with your institution",
      icon: "🔐",
      color: "#ef4444",
    },
  ];

  return (
    <section className="objectives-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="objectives-bg">
        <div className="bg-objectives-pattern"></div>
        <div className="bg-objectives-orb orb-obj-1"></div>
        <div className="bg-objectives-orb orb-obj-2"></div>
      </div>

      <div className="objectives-container">
        {/* Section Header */}
        <div className="objectives-header animate-on-scroll">
          <div className="objectives-badge">
            <span className="badge-pulse"></span>
            <span>Project Objectives</span>
          </div>
          <h2 className="objectives-heading">
            Our Mission & <span className="heading-gradient">Goals</span>
          </h2>
          <p className="objectives-description">
            Clear objectives driving the development of SSMS
          </p>
        </div>

        {/* Objectives List */}
        <div className="objectives-list">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="objective-card animate-on-scroll"
              style={{ animationDelay: `${100 + index * 100}ms` }}>
              <div
                className="objective-glow"
                style={{ background: `${objective.color}20` }}></div>
              <div className="objective-content">
                <div
                  className="objective-number"
                  style={{
                    background: `linear-gradient(135deg, ${objective.color}, ${objective.color}dd)`,
                  }}>
                  {index + 1}
                </div>
                <div className="objective-icon">{objective.icon}</div>
                <div className="objective-text">
                  <h3 className="objective-title">{objective.title}</h3>
                  <p className="objective-desc">{objective.description}</p>
                </div>
                <CheckCircleOutlined className="objective-check" />
              </div>
            </div>
          ))}
        </div>

        {/* Project Scope */}
        <div
          className="scope-section animate-on-scroll"
          style={{ animationDelay: "600ms" }}>
          <div className="scope-card">
            <div className="scope-header">
              <h3 className="scope-title">Project Scope & Target Users</h3>
            </div>
            <Row gutter={[32, 32]} className="scope-grid">
              <Col xs={24} md={12}>
                <div className="scope-column">
                  <div className="scope-column-header">
                    <span className="scope-icon">🎯</span>
                    <h4 className="scope-column-title">Focus Areas</h4>
                  </div>
                  <ul className="scope-list">
                    {[
                      "AI & Machine Learning",
                      "Web Development",
                      "Education Technology",
                      "Data Analytics",
                      "Cloud Computing",
                    ].map((area, idx) => (
                      <li key={idx} className="scope-item">
                        <span className="scope-check">✓</span>
                        <span className="scope-text">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="scope-column">
                  <div className="scope-column-header">
                    <span className="scope-icon">👥</span>
                    <h4 className="scope-column-title">Target Users</h4>
                  </div>
                  <ul className="scope-list">
                    {[
                      "Schools & Educational Institutions",
                      "Teachers & Academic Staff",
                      "Students & Learners",
                      "Parents & Guardians",
                      "Administrative Personnel",
                    ].map((user, idx) => (
                      <li key={idx} className="scope-item">
                        <span className="scope-check">✓</span>
                        <span className="scope-text">{user}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Development Methodology */}
        <div
          className="methodology-section animate-on-scroll"
          style={{ animationDelay: "700ms" }}>
          <div className="methodology-card">
            <div className="methodology-glow"></div>
            <div className="methodology-content">
              <div className="methodology-icon">🔄</div>
              <h3 className="methodology-title">Agile Scrum Methodology</h3>
              <p className="methodology-desc">
                Developed using Agile Scrum principles for iterative
                development, continuous improvement, and rapid delivery of
                features
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Objectives Section */
        .objectives-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc, #ffffff);
          padding: 6rem 1rem;
          overflow: hidden;
        }

        /* Background */
        .objectives-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-objectives-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(139, 92, 246, 0.03) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }

        .bg-objectives-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.08;
          animation: float-objectives-orb 28s ease-in-out infinite;
        }

        .orb-obj-1 {
          width: 650px;
          height: 650px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          top: -15%;
          left: -10%;
        }

        .orb-obj-2 {
          width: 550px;
          height: 550px;
          background: linear-gradient(225deg, #2563eb, #06b6d4);
          bottom: -15%;
          right: -10%;
          animation-delay: -14s;
        }

        @keyframes float-objectives-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -40px) scale(1.12);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.88);
          }
        }

        /* Container */
        .objectives-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .objectives-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .objectives-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5cf6;
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: pulse-objectives 2s ease-in-out infinite;
        }

        @keyframes pulse-objectives {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.85);
          }
        }

        .objectives-heading {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 1rem 0;
        }

        .heading-gradient {
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .objectives-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
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
          animation: slide-up-objectives 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        @keyframes slide-up-objectives {
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

        /* Objectives List */
        .objectives-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .objective-card {
          position: relative;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 24px;
          padding: 2rem;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .objective-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .objective-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .objective-card:hover .objective-glow {
          opacity: 1;
        }

        .objective-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 1;
        }

        .objective-number {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .objective-card:hover .objective-number {
          transform: scale(1.1) rotate(-5deg);
        }

        .objective-icon {
          flex-shrink: 0;
          font-size: 3rem;
          transition: transform 0.3s ease;
        }

        .objective-card:hover .objective-icon {
          transform: scale(1.15);
        }

        .objective-text {
          flex: 1;
        }

        .objective-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .objective-desc {
          font-size: 0.9375rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .objective-check {
          flex-shrink: 0;
          font-size: 2rem;
          color: #10b981;
          transition: transform 0.3s ease;
        }

        .objective-card:hover .objective-check {
          transform: scale(1.2) rotate(360deg);
        }

        /* Scope Section */
        .scope-section {
          margin-bottom: 2rem;
        }

        .scope-card {
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 32px;
          padding: 3rem 2rem;
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
        }

        .scope-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .scope-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .scope-grid {
          max-width: 1000px;
          margin: 0 auto;
        }

        .scope-column {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.03),
            rgba(99, 102, 241, 0.03)
          );
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
        }

        .scope-column-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(139, 92, 246, 0.2);
        }

        .scope-icon {
          font-size: 1.75rem;
        }

        .scope-column-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .scope-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .scope-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .scope-item:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }

        .scope-check {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          border-radius: 6px;
        }

        .scope-text {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #475569;
        }

        /* Methodology Section */
        .methodology-section {
          margin-top: 2rem;
        }

        .methodology-card {
          position: relative;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          border-radius: 32px;
          padding: 3rem 2rem;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
        }

        .methodology-glow {
          position: absolute;
          inset: -100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 70%
          );
          animation: rotate-methodology 20s linear infinite;
        }

        @keyframes rotate-methodology {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .methodology-content {
          position: relative;
          z-index: 1;
        }

        .methodology-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: rotate-icon 4s ease-in-out infinite;
        }

        @keyframes rotate-icon {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        }

        .methodology-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
        }

        .methodology-desc {
          font-size: clamp(1rem, 2vw, 1.125rem);
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .objectives-section {
            padding: 4rem 1rem;
          }

          .objectives-header {
            margin-bottom: 2.5rem;
          }

          .objective-content {
            flex-direction: column;
            text-align: center;
          }

          .objective-number {
            order: -1;
          }

          .scope-card,
          .methodology-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ObjectivesSection;
