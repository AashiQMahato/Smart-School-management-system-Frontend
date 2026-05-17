import React, { useEffect, useRef } from "react";
import { Button } from "antd";
import {
  RocketOutlined,
  SafetyOutlined,
  LineChartOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const HeroSection = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReducedMotion && heroRef.current) {
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

      const elements = heroRef.current.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="hero-section" ref={heroRef}>
      {/* Background Elements */}
      <div className="hero-bg">
        <div className="bg-grid"></div>
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}></div>
          ))}
        </div>
      </div>

      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div
            className="badge animate-on-scroll"
            style={{ animationDelay: "0ms" }}>
            <span className="badge-icon">✨</span>
            <span className="badge-text">AI-Powered Platform</span>
          </div>

          <h1
            className="hero-title animate-on-scroll"
            style={{ animationDelay: "100ms" }}>
            Smart School
            <br />
            <span className="title-gradient">Management System</span>
          </h1>

          <p
            className="hero-subtitle animate-on-scroll"
            style={{ animationDelay: "200ms" }}>
            An intelligent, AI-powered platform to manage academic,
            administrative, financial, and communication processes in
            educational institutions.
          </p>

          <div
            className="feature-grid animate-on-scroll"
            style={{ animationDelay: "300ms" }}>
            <div className="feature-item">
              <div className="feature-icon">
                <RocketOutlined />
              </div>
              <span>AI-Powered</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <SafetyOutlined />
              </div>
              <span>Secure & Scalable</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <LineChartOutlined />
              </div>
              <span>Real-Time Analytics</span>
            </div>
          </div>

          <div
            className="cta-buttons animate-on-scroll"
            style={{ animationDelay: "400ms" }}>
            <Button
              type="primary"
              size="large"
              className="btn-primary"
              icon={<RocketOutlined />}>
              Get Started
            </Button>
            <Button
              size="large"
              className="btn-secondary"
              icon={<PlayCircleOutlined />}>
              Request Demo
            </Button>
          </div>

          <div
            className="trust-badge animate-on-scroll"
            style={{ animationDelay: "500ms" }}>
            <div className="trust-item">
              <strong>500+</strong> Schools
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <strong>50K+</strong> Students
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <strong>99.9%</strong> Uptime
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div
          className="hero-visual animate-on-scroll"
          style={{ animationDelay: "300ms" }}
          ref={imageRef}>
          <div className="scene-container floating">
            {/* 3D School Playground Scene */}
            <div className="school-scene">
              {/* Sky and Background */}
              <div className="sky-gradient"></div>

              {/* Clouds */}
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>

              {/* Sun */}
              <div className="sun">
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
              </div>

              {/* School Building */}
              <div className="school-building">
                <div className="building-main">
                  <div className="building-roof"></div>
                  <div className="building-front">
                    <div className="window-row">
                      <div className="window"></div>
                      <div className="window"></div>
                      <div className="window"></div>
                    </div>
                    <div className="window-row">
                      <div className="window"></div>
                      <div className="window"></div>
                      <div className="window"></div>
                    </div>
                    <div className="entrance">
                      <div className="door"></div>
                    </div>
                  </div>
                </div>
                <div className="flag-pole">
                  <div className="flag"></div>
                </div>
              </div>

              {/* Playground Elements */}
              <div className="playground">
                {/* Swing Set */}
                <div className="swing-set">
                  <div className="swing-frame-left"></div>
                  <div className="swing-frame-right"></div>
                  <div className="swing-top"></div>
                  <div className="swing swing-1">
                    <div className="swing-chain"></div>
                    <div className="swing-seat"></div>
                  </div>
                  <div className="swing swing-2">
                    <div className="swing-chain"></div>
                    <div className="swing-seat"></div>
                  </div>
                </div>

                {/* Slide */}
                <div className="slide">
                  <div className="slide-ladder"></div>
                  <div className="slide-platform"></div>
                  <div className="slide-ramp"></div>
                </div>

                {/* Seesaw */}
                <div className="seesaw">
                  <div className="seesaw-base"></div>
                  <div className="seesaw-plank"></div>
                </div>

                {/* Trees */}
                <div className="tree tree-1">
                  <div className="tree-trunk"></div>
                  <div className="tree-crown"></div>
                </div>
                <div className="tree tree-2">
                  <div className="tree-trunk"></div>
                  <div className="tree-crown"></div>
                </div>

                {/* Basketball Hoop */}
                <div className="basketball-hoop">
                  <div className="hoop-pole"></div>
                  <div className="hoop-backboard"></div>
                  <div className="hoop-ring"></div>
                </div>

                {/* Benches */}
                <div className="bench bench-1">
                  <div className="bench-seat"></div>
                  <div className="bench-leg bench-leg-left"></div>
                  <div className="bench-leg bench-leg-right"></div>
                </div>
              </div>

              {/* Ground/Grass */}
              <div className="ground"></div>
              <div className="path"></div>
            </div>

            {/* Floating Info Cards */}
            <div className="info-card card-1">
              <div className="card-icon">🎓</div>
              <div className="card-text">Smart Learning</div>
            </div>
            <div className="info-card card-2">
              <div className="card-icon">🏫</div>
              <div className="card-text">Modern Campus</div>
            </div>
            <div className="info-card card-3">
              <div className="card-icon">📊</div>
              <div className="card-text">Real-time Data</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Root Variables */
        :root {
          --hero-primary: #2563eb;
          --hero-primary-dark: #1e40af;
          --hero-secondary: #8b5cf6;
          --hero-accent: #06b6d4;
          --hero-text-primary: #0f172a;
          --hero-text-secondary: #475569;
          --hero-bg: #ffffff;
          --hero-glass: rgba(255, 255, 255, 0.7);
          --hero-border: rgba(148, 163, 184, 0.1);
          --hero-shadow: rgba(15, 23, 42, 0.08);
          --easing: cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--hero-bg);
          padding: 2rem 1rem;
        }

        /* Background Elements */
        .hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.03) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: radial-gradient(
            ellipse 80% 50% at 50% 50%,
            black 40%,
            transparent 100%
          );
        }

        .bg-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float-orb 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(
            135deg,
            var(--hero-primary),
            var(--hero-secondary)
          );
          top: -10%;
          right: -10%;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(
            225deg,
            var(--hero-accent),
            var(--hero-primary)
          );
          bottom: -10%;
          left: -10%;
          animation-delay: -10s;
        }

        @keyframes float-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .floating-particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--hero-primary);
          border-radius: 50%;
          opacity: 0.2;
          animation: float-particle linear infinite;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        /* Container */
        .hero-container {
          position: relative;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          z-index: 1;
        }

        /* Content Animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-on-scroll.animate-in {
          animation: slide-up 0.8s var(--easing) forwards;
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
            transition-duration: 0.01ms !important;
          }
        }

        /* Left Content */
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          width: fit-content;
          padding: 0.5rem 1rem;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.08),
            rgba(139, 92, 246, 0.08)
          );
          border: 1px solid var(--hero-border);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--hero-primary);
          backdrop-filter: blur(12px);
        }

        .badge-icon {
          font-size: 1rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--hero-text-primary);
          letter-spacing: -0.03em;
          margin: 0;
        }

        .title-gradient {
          background: linear-gradient(
            135deg,
            var(--hero-primary),
            var(--hero-secondary)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
          color: var(--hero-text-secondary);
          max-width: 540px;
          margin: 0;
        }

        .feature-grid {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--hero-text-primary);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.1),
            rgba(139, 92, 246, 0.1)
          );
          border-radius: 12px;
          color: var(--hero-primary);
          font-size: 1.25rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          height: 52px;
          padding: 0 2rem;
          background: var(--hero-primary);
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.24);
          transition: all 0.3s var(--easing);
        }

        .btn-primary:hover {
          background: var(--hero-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.32);
        }

        .btn-secondary {
          height: 52px;
          padding: 0 2rem;
          background: white;
          border: 2px solid var(--hero-border);
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--hero-text-primary);
          transition: all 0.3s var(--easing);
        }

        .btn-secondary:hover {
          border-color: var(--hero-primary);
          color: var(--hero-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px var(--hero-shadow);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
          padding: 1rem 0;
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--hero-text-secondary);
        }

        .trust-item strong {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--hero-text-primary);
        }

        .trust-divider {
          width: 1px;
          height: 32px;
          background: var(--hero-border);
        }

        /* Right Visual */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .scene-container {
          position: relative;
          width: 100%;
          max-width: 650px;
          height: 600px;
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .floating {
          animation: float-visual 6s ease-in-out infinite;
        }

        @keyframes float-visual {
          0%,
          100% {
            transform: translateY(0px) rotateX(5deg);
          }
          50% {
            transform: translateY(-20px) rotateX(5deg);
          }
        }

        /* School Scene */
        .school-scene {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            #87ceeb 0%,
            #b8e6ff 50%,
            #d4f1ff 100%
          );
          border-radius: 32px;
          overflow: hidden;
          box-shadow:
            0 40px 80px rgba(15, 23, 42, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset;
          transform-style: preserve-3d;
        }

        /* Sky */
        .sky-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #87ceeb 0%, #b8e6ff 60%);
          z-index: 0;
        }

        /* Sun */
        .sun {
          position: absolute;
          top: 40px;
          right: 60px;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #fff59d, #ffd54f);
          border-radius: 50%;
          box-shadow: 0 0 40px rgba(255, 213, 79, 0.6);
          animation: sun-pulse 4s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes sun-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .sun-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120px;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 213, 79, 0.6),
            transparent
          );
          transform-origin: left center;
          animation: rotate-ray 20s linear infinite;
        }

        .sun-ray:nth-child(1) {
          transform: rotate(0deg);
        }
        .sun-ray:nth-child(2) {
          transform: rotate(45deg);
        }
        .sun-ray:nth-child(3) {
          transform: rotate(90deg);
        }
        .sun-ray:nth-child(4) {
          transform: rotate(135deg);
        }

        @keyframes rotate-ray {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Clouds */
        .cloud {
          position: absolute;
          background: white;
          border-radius: 100px;
          opacity: 0.9;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 2;
        }

        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: white;
          border-radius: 100px;
        }

        .cloud-1 {
          width: 80px;
          height: 30px;
          top: 60px;
          left: 50px;
          animation: float-cloud 25s linear infinite;
        }

        .cloud-1::before {
          width: 50px;
          height: 40px;
          top: -20px;
          left: 10px;
        }

        .cloud-1::after {
          width: 40px;
          height: 30px;
          top: -15px;
          right: 10px;
        }

        .cloud-2 {
          width: 100px;
          height: 35px;
          top: 100px;
          right: 80px;
          animation: float-cloud 30s linear infinite;
          animation-delay: -10s;
        }

        .cloud-2::before {
          width: 60px;
          height: 50px;
          top: -25px;
          left: 15px;
        }

        .cloud-2::after {
          width: 50px;
          height: 35px;
          top: -20px;
          right: 15px;
        }

        .cloud-3 {
          width: 70px;
          height: 28px;
          top: 140px;
          left: 150px;
          animation: float-cloud 35s linear infinite;
          animation-delay: -20s;
        }

        .cloud-3::before {
          width: 45px;
          height: 38px;
          top: -18px;
          left: 12px;
        }

        .cloud-3::after {
          width: 35px;
          height: 28px;
          top: -14px;
          right: 12px;
        }

        @keyframes float-cloud {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100vw);
          }
        }

        /* School Building */
        .school-building {
          position: absolute;
          bottom: 180px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          animation: building-appear 1s ease-out forwards;
        }

        @keyframes building-appear {
          from {
            transform: translateX(-50%) translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        .building-main {
          position: relative;
        }

        .building-roof {
          width: 240px;
          height: 60px;
          background: linear-gradient(to bottom, #e53935, #c62828);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .building-front {
          width: 220px;
          height: 140px;
          background: linear-gradient(to bottom, #fff9c4, #fff59d);
          border: 3px solid #f57f17;
          border-radius: 0 0 8px 8px;
          position: relative;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .window-row {
          display: flex;
          justify-content: space-around;
          padding: 15px 20px;
        }

        .window {
          width: 35px;
          height: 40px;
          background: linear-gradient(135deg, #4fc3f7, #0288d1);
          border: 2px solid #01579b;
          border-radius: 4px;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
          animation: window-shine 3s ease-in-out infinite;
        }

        @keyframes window-shine {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .entrance {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 60px;
        }

        .door {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #8d6e63, #6d4c41);
          border: 2px solid #4e342e;
          border-radius: 4px 4px 0 0;
          position: relative;
        }

        .door::after {
          content: "";
          position: absolute;
          right: 8px;
          top: 50%;
          width: 4px;
          height: 4px;
          background: #ffd54f;
          border-radius: 50%;
        }

        .flag-pole {
          position: absolute;
          top: -40px;
          right: 20px;
          width: 3px;
          height: 80px;
          background: #757575;
        }

        .flag {
          position: absolute;
          top: 10px;
          left: 3px;
          width: 30px;
          height: 20px;
          background: linear-gradient(to right, #ef5350, #e53935);
          border-radius: 2px;
          transform-origin: left center;
          animation: flag-wave 2s ease-in-out infinite;
        }

        @keyframes flag-wave {
          0%,
          100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(15deg);
          }
        }

        /* Playground */
        .playground {
          position: absolute;
          bottom: 50px;
          left: 0;
          right: 0;
          z-index: 4;
        }

        /* Swing Set */
        .swing-set {
          position: absolute;
          bottom: 0;
          left: 60px;
          width: 120px;
          height: 100px;
        }

        .swing-frame-left,
        .swing-frame-right {
          position: absolute;
          width: 4px;
          height: 100px;
          background: linear-gradient(to bottom, #ff6f00, #e65100);
          bottom: 0;
        }

        .swing-frame-left {
          left: 0;
          transform: rotate(-5deg);
          transform-origin: bottom;
        }
        .swing-frame-right {
          right: 0;
          transform: rotate(5deg);
          transform-origin: bottom;
        }

        .swing-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #ff6f00, #e65100);
        }

        .swing {
          position: absolute;
          bottom: 10px;
        }

        .swing-1 {
          left: 20px;
          animation: swing-motion 2s ease-in-out infinite;
        }
        .swing-2 {
          right: 20px;
          animation: swing-motion 2s ease-in-out infinite;
          animation-delay: -1s;
        }

        @keyframes swing-motion {
          0%,
          100% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(8deg);
          }
        }

        .swing-chain {
          width: 2px;
          height: 60px;
          background: #424242;
          margin: 0 auto;
        }

        .swing-seat {
          width: 30px;
          height: 8px;
          background: linear-gradient(to bottom, #8d6e63, #6d4c41);
          border-radius: 4px;
          margin-top: -2px;
        }

        /* Slide */
        .slide {
          position: absolute;
          bottom: 0;
          right: 100px;
          width: 80px;
          height: 90px;
        }

        .slide-ladder {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 4px;
          height: 70px;
          background: #ff6f00;
        }

        .slide-ladder::before,
        .slide-ladder::after {
          content: "";
          position: absolute;
          left: 0;
          width: 20px;
          height: 2px;
          background: #ff6f00;
        }

        .slide-ladder::before {
          top: 20px;
        }
        .slide-ladder::after {
          top: 40px;
        }

        .slide-platform {
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 6px;
          background: #ef5350;
          border-radius: 2px;
        }

        .slide-ramp {
          position: absolute;
          top: 6px;
          left: 25px;
          width: 60px;
          height: 85px;
          background: linear-gradient(135deg, #42a5f5, #1e88e5);
          border-radius: 8px;
          transform: rotate(40deg);
          transform-origin: top left;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Seesaw */
        .seesaw {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }

        .seesaw-base {
          width: 8px;
          height: 25px;
          background: #ff6f00;
          margin: 0 auto;
          border-radius: 4px 4px 0 0;
        }

        .seesaw-plank {
          position: absolute;
          bottom: 20px;
          left: 50%;
          width: 100px;
          height: 6px;
          background: linear-gradient(to right, #8d6e63, #6d4c41);
          border-radius: 3px;
          transform: translateX(-50%);
          transform-origin: center;
          animation: seesaw-motion 3s ease-in-out infinite;
        }

        @keyframes seesaw-motion {
          0%,
          100% {
            transform: translateX(-50%) rotate(-5deg);
          }
          50% {
            transform: translateX(-50%) rotate(5deg);
          }
        }

        .seesaw-plank::before,
        .seesaw-plank::after {
          content: "";
          position: absolute;
          top: -8px;
          width: 12px;
          height: 12px;
          background: #ef5350;
          border-radius: 50%;
        }

        .seesaw-plank::before {
          left: 5px;
        }
        .seesaw-plank::after {
          right: 5px;
        }

        /* Trees */
        .tree {
          position: absolute;
          bottom: 0;
          animation: tree-sway 4s ease-in-out infinite;
          transform-origin: bottom center;
        }

        @keyframes tree-sway {
          0%,
          100% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        .tree-1 {
          left: 20px;
        }
        .tree-2 {
          right: 30px;
          animation-delay: -2s;
        }

        .tree-trunk {
          width: 12px;
          height: 50px;
          background: linear-gradient(to right, #6d4c41, #8d6e63);
          margin: 0 auto;
          border-radius: 2px;
        }

        .tree-crown {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #66bb6a, #43a047);
          border-radius: 50%;
          margin: -30px auto 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .tree-crown::before,
        .tree-crown::after {
          content: "";
          position: absolute;
          background: radial-gradient(circle, #66bb6a, #43a047);
          border-radius: 50%;
        }

        .tree-crown::before {
          width: 45px;
          height: 45px;
          top: -15px;
          left: -10px;
        }

        .tree-crown::after {
          width: 50px;
          height: 50px;
          top: -10px;
          right: -15px;
        }

        /* Basketball Hoop */
        .basketball-hoop {
          position: absolute;
          bottom: 0;
          right: 200px;
        }

        .hoop-pole {
          width: 4px;
          height: 80px;
          background: linear-gradient(to bottom, #757575, #616161);
          margin: 0 auto;
        }

        .hoop-backboard {
          position: absolute;
          top: 5px;
          left: -20px;
          width: 45px;
          height: 35px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #ef5350;
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .hoop-ring {
          position: absolute;
          top: 35px;
          left: -15px;
          width: 35px;
          height: 4px;
          background: #ff6f00;
          border-radius: 2px;
        }

        .hoop-ring::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 15px;
          border: 2px solid #ff6f00;
          border-top: none;
          border-radius: 0 0 17px 17px;
        }

        /* Benches */
        .bench {
          position: absolute;
          bottom: 0;
        }

        .bench-1 {
          left: 220px;
        }

        .bench-seat {
          width: 50px;
          height: 6px;
          background: linear-gradient(to bottom, #8d6e63, #6d4c41);
          border-radius: 2px;
          margin: 0 auto;
        }

        .bench-leg {
          position: absolute;
          bottom: -15px;
          width: 4px;
          height: 15px;
          background: #6d4c41;
        }

        .bench-leg-left {
          left: 8px;
        }
        .bench-leg-right {
          right: 8px;
        }

        /* Ground */
        .ground {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: linear-gradient(to bottom, #66bb6a, #4caf50);
          z-index: 3;
        }

        .path {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: repeating-linear-gradient(
            90deg,
            #b0bec5 0px,
            #b0bec5 20px,
            #90a4ae 20px,
            #90a4ae 40px
          );
          z-index: 3;
        }

        /* Floating Info Cards */
        .info-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
          animation: float-card 4s ease-in-out infinite;
          z-index: 10;
        }

        .card-1 {
          top: 50px;
          left: -80px;
          animation-delay: 0s;
        }

        .card-2 {
          top: 200px;
          right: -90px;
          animation-delay: -1.5s;
        }

        .card-3 {
          bottom: 100px;
          left: -70px;
          animation-delay: -3s;
        }

        @keyframes float-card {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .card-icon {
          font-size: 1.5rem;
        }

        .card-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--hero-text-primary);
          white-space: nowrap;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-content {
            align-items: center;
          }

          .hero-title,
          .hero-subtitle {
            max-width: 100%;
          }

          .feature-grid {
            justify-content: center;
          }

          .cta-buttons {
            justify-content: center;
          }

          .trust-badge {
            justify-content: center;
          }

          .scene-container {
            height: 500px;
          }

          .info-card {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 1rem;
          }

          .hero-container {
            gap: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }

          .feature-grid {
            flex-direction: column;
            gap: 1rem;
          }

          .trust-badge {
            flex-direction: column;
            gap: 1rem;
          }

          .trust-divider {
            display: none;
          }

          .scene-container {
            height: 400px;
          }

          .school-building {
            transform: translateX(-50%) scale(0.8);
          }

          .swing-set {
            transform: scale(0.8);
          }

          .slide {
            transform: scale(0.8);
          }

          .tree {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
