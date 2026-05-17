import React from 'react';
import { Link } from "react-router-dom";
import { FaGraduationCap, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail, MdSchool, MdCode } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      {/* Decorative Top Border */}
      <div className="footer-border">
        <div className="border-glow"></div>
      </div>

      {/* Background Elements */}
      <div className="footer-bg">
        <div className="footer-pattern"></div>
        <div className="footer-orb orb-footer-1"></div>
        <div className="footer-orb orb-footer-2"></div>
      </div>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-column">
            <div className="brand-section">
              <div className="brand-header">
                <div className="brand-icon-box">
                  <FaGraduationCap className="brand-icon" />
                </div>
                <div className="brand-text">
                  <div className="brand-name">SSMS</div>
                  <div className="brand-tagline">Smart School System</div>
                </div>
              </div>
              <p className="brand-description">
                AI-Powered School Administration & Academic Automation Platform
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="GitHub">
                  <FaGithub />
                  <span className="social-ripple"></span>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                  <span className="social-ripple"></span>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin />
                  <span className="social-ripple"></span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#about" className="footer-link">
                  <span className="link-icon">→</span>
                  About Project
                </a>
              </li>
              <li>
                <a href="#features" className="footer-link">
                  <span className="link-icon">→</span>
                  Features
                </a>
              </li>
              <li>
                <a href="#userroles" className="footer-link">
                  <span className="link-icon">→</span>
                  User Roles
                </a>
              </li>
              <li>
                <a href="#workflow" className="footer-link">
                  <span className="link-icon">→</span>
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div className="footer-column">
            <h3 className="footer-heading">User Roles</h3>
            <ul className="footer-links">
              <li>
                <div className="footer-link">
                  <span className="link-icon">👤</span>
                  Administrators
                </div>
              </li>
              <li>
                <div className="footer-link">
                  <span className="link-icon">👨‍🏫</span>
                  Teachers
                </div>
              </li>
              <li>
                <div className="footer-link">
                  <span className="link-icon">👨‍🎓</span>
                  Students
                </div>
              </li>
              <li>
                <div className="footer-link">
                  <span className="link-icon">👪</span>
                  Parents
                </div>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="footer-column">
            <h3 className="footer-heading">Project Info</h3>
            <ul className="footer-info-list">
              <li className="info-item">
                <div className="info-icon-box">
                  <MdSchool className="info-icon" />
                </div>
                <span className="info-text">Final Year Academic Project</span>
              </li>
              <li className="info-item">
                <div className="info-icon-box">
                  <MdEmail className="info-icon" />
                </div>
                <span className="info-text">Educational Use Only</span>
              </li>
              <li className="info-item">
                <div className="info-icon-box">
                  <MdCode className="info-icon" />
                </div>
                <span className="info-text">Agile Scrum Methodology</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Smart School Management System (SSMS) - All rights reserved
            </p>
            <div className="legal-links">
              <Link to="/privacy" className="legal-link">
                Privacy Policy
              </Link>
              <span className="legal-divider">•</span>
              <Link to="/terms" className="legal-link">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Footer Section */
        .footer-section {
          position: relative;
          width: 100%;
          background: linear-gradient(to bottom, #0f172a, #1e293b);
          color: #cbd5e1;
          overflow: hidden;
        }

        /* Decorative Border */
        .footer-border {
          position: relative;
          height: 4px;
          background: linear-gradient(to right, transparent, #2563eb, #8b5cf6, transparent);
          overflow: hidden;
        }

        .border-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.6), transparent);
          animation: slide-glow 3s ease-in-out infinite;
        }

        @keyframes slide-glow {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        /* Background */
        .footer-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .footer-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.06;
          animation: float-footer-orb 25s ease-in-out infinite;
        }

        .orb-footer-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #2563eb, #8b5cf6);
          top: -20%;
          right: -10%;
        }

        .orb-footer-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(225deg, #06b6d4, #2563eb);
          bottom: -20%;
          left: -10%;
          animation-delay: -12s;
        }

        @keyframes float-footer-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Container */
        .footer-container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 1rem 2rem;
          z-index: 1;
        }

        /* Grid Layout */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Brand Section */
        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-icon-box {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
          transition: all 0.3s ease;
        }

        .brand-icon-box:hover {
          transform: translateY(-2px) rotate(5deg);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        .brand-icon {
          font-size: 1.5rem;
          color: white;
        }

        .brand-text {
          flex: 1;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .brand-tagline {
          font-size: 0.75rem;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .brand-description {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #94a3b8;
          margin: 0;
        }

        /* Social Links */
        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 10px;
          color: #94a3b8;
          font-size: 1.125rem;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }

        .social-ripple {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
          transform: scale(0);
          opacity: 0;
          transition: all 0.4s ease;
        }

        .social-link:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(139, 92, 246, 0.15));
          border-color: rgba(37, 99, 235, 0.3);
          color: #60a5fa;
          transform: translateY(-2px);
        }

        .social-link:hover .social-ripple {
          transform: scale(2);
          opacity: 1;
        }

        /* Footer Headings */
        .footer-heading {
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          margin: 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid rgba(37, 99, 235, 0.3);
          position: relative;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(to right, #2563eb, #8b5cf6);
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .link-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .footer-link:hover {
          color: #60a5fa;
          padding-left: 0.5rem;
        }

        .footer-link:hover .link-icon {
          transform: translateX(4px);
        }

        /* Footer Info List */
        .footer-info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(148, 163, 184, 0.04);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: rgba(37, 99, 235, 0.08);
          transform: translateX(4px);
        }

        .info-icon-box {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(139, 92, 246, 0.15));
          border-radius: 8px;
          color: #60a5fa;
        }

        .info-icon {
          font-size: 1.125rem;
        }

        .info-text {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Footer Bottom */
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .copyright {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .legal-link {
          font-size: 0.875rem;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #60a5fa;
        }

        .legal-divider {
          color: #475569;
          font-size: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer-container {
            padding: 3rem 1rem 1.5rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .brand-section {
            text-align: center;
          }

          .brand-header {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .footer-links {
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .social-link {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;