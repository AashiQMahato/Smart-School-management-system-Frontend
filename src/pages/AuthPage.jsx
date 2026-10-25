/**
 * AuthPage - sign in
 * Shares the landing page design system (tokens in landing.css).
 * Login logic lives in AuthProvider; this page only collects credentials.
 */

import "../features/landing/landing.css";
import "../features/landing/auth.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../features/landing/data";
import { Brand } from "../features/landing/components/primitives";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Please enter your email";
  else if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "Please enter a valid email";
  if (!password) errors.password = "Please enter your password";
  return errors;
};

/* Decorative: the four dashboards a single sign-in can lead to. */
const RoleStack = () => (
  <ul className="ssl-auth__roles" aria-label="One sign-in for every role">
    {ROLES.map((role, i) => {
      const Icon = role.icon;
      return (
        <li
          key={role.key}
          data-role={role.key}
          className="ssl-enter"
          style={{ "--d": i + 3 }}>
          <span className="ssl-auth__role-icon">
            <Icon size={16} aria-hidden="true" />
          </span>
          <span>
            <b>{role.label}</b>
            <small>{role.tagline}</small>
          </span>
        </li>
      );
    })}
  </ul>
);

const AuthPage = () => {
  const { login, error, clearError } = useAuth();
  const location = useLocation();
  const redirectMessage = location.state?.message;

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
    if (error) clearError();
  };

  const onKey = (e) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`ssl-auth-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setLoading(true);
    clearError();
    try {
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      });
      if (result.success) {
        message.success("Login successful!");
      } else {
        message.error(result.error || "Login failed");
      }
    } catch {
      message.error("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ssl ssl-auth">
      {/* Brand panel */}
      <aside className="ssl-auth__aside">
        <div className="ssl-auth__aside-inner">
          <Link
            to="/"
            className="ssl-auth__brand"
            aria-label="Smart School home">
            <Brand inverted />
          </Link>

          <div className="ssl-auth__pitch">
            <p className="ssl-eyebrow ssl-enter" style={{ "--d": 0 }}>
              One sign-in for every role
            </p>
            <h1 className="ssl-auth__title ssl-enter" style={{ "--d": 1 }}>
              Welcome back to <span>your school day.</span>
            </h1>
            <p className="ssl-auth__lead ssl-enter" style={{ "--d": 2 }}>
              Sign in once and you&apos;ll land on the dashboard for your role,
              with only the information it allows.
            </p>
          </div>

          <RoleStack />

          <p className="ssl-auth__aside-foot">
            © {new Date().getFullYear()} Smart School Management System
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="ssl-auth__main">
        <div className="ssl-auth__top">
          <Link
            to="/"
            className="ssl-auth__brand-mobile"
            aria-label="Smart School home">
            <Brand />
          </Link>
          <Link to="/" className="ssl-auth__back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <div
          className="ssl-auth__card ssl-enter ssl-enter--visual"
          style={{ "--d": 1 }}>
          <header className="ssl-auth__head">
            <h2 className="ssl-h3">Sign in to your account</h2>
            <p>Enter the email and password provided by your school.</p>
          </header>

          {redirectMessage && (
            <div
              className="ssl-auth__notice ssl-auth__notice--info"
              role="status">
              <Info size={18} aria-hidden="true" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {error && (
            <div
              className="ssl-auth__notice ssl-auth__notice--error"
              role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form className="ssl-auth__form" onSubmit={handleSubmit} noValidate>
            <div className="ssl-field" data-invalid={!!errors.email}>
              <label htmlFor="ssl-auth-email">Email address</label>
              <div className="ssl-field__control">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="ssl-auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="yourname@school.edu"
                  value={values.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "ssl-auth-email-error" : undefined
                  }
                />
              </div>
              {errors.email && (
                <p id="ssl-auth-email-error" className="ssl-field__error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="ssl-field" data-invalid={!!errors.password}>
              <label htmlFor="ssl-auth-password">Password</label>
              <div className="ssl-field__control">
                <Lock size={18} aria-hidden="true" />
                <input
                  id="ssl-auth-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={onChange}
                  onKeyUp={onKey}
                  onKeyDown={onKey}
                  onBlur={() => setCapsLock(false)}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    [
                      errors.password && "ssl-auth-password-error",
                      capsLock && "ssl-auth-caps",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
                <button
                  type="button"
                  className="ssl-field__reveal"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}>
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="ssl-auth-password-error" className="ssl-field__error">
                  {errors.password}
                </p>
              )}
              {capsLock && (
                <p id="ssl-auth-caps" className="ssl-field__hint">
                  Caps Lock is on
                </p>
              )}
            </div>

            <button
              type="submit"
              className="ssl-btn ssl-btn--primary ssl-btn--lg ssl-auth__submit"
              disabled={loading}
              aria-busy={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="ssl-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="ssl-auth__help">
            <b>Don&apos;t have an account?</b>
            <p>
              Accounts are created by your school&apos;s administrator. Contact
              them to receive your login details or reset your password.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
