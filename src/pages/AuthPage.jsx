/**
 * AuthPage - Premium Login Experience
 * Modern, classy authentication with visual storytelling
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, Form, message, Alert } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import {
  FaGraduationCap,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const location = useLocation();

  const redirectMessage = location.state?.message;

  const handleSubmit = async (values) => {
    setLoading(true);
    clearError();
    try {
      const result = await login(values);
      if (result.success) {
        message.success(`Login successful!`);
      } else {
        message.error(result.error || "Login failed");
      }
    } catch (err) {
      message.error("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-600 via-indigo-650 to-slate-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"
          style={{ animationDuration: "4s" }}></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}></div>
        <div
          className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl mx-4 my-6">
        <div className="flex flex-col lg:flex-row bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Left Panel - Visual Branding */}
          <div className="lg:w-1/2 relative overflow-hidden bg-linear-to-br from-slate-500 via-indigo-800 to-purple-500">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src="https://thumbs.dreamstime.com/b/print-161837181.jpg"
                alt="Education Background"
                className="w-full h-full object-cover opacity-60"
              />
             
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12 text-amber-100">
              {/* Logo & Branding */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                    <FaGraduationCap className="text-3xl text-amber-100" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                      SSMS
                    </h1>
                    <p className="text-indigo-300 text-sm font-medium mt-1">
                      Smart School Management System
                    </p>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="space-y-4 mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-amber-100">
                    Welcome to the Future of
                    <span className="block bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Education Management
                    </span>
                  </h2>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4 hidden lg:block">
                  <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-indigo-400/30">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaShieldAlt className="text-xl text-indigo-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          Secure Access
                        </h3>
                        <p className="text-sm text-indigo-200/80">
                          Enterprise-grade security with role-based
                          authentication
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-purple-400/30">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaUsers className="text-xl text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          Multi-Role Platform
                        </h3>
                        <p className="text-sm text-indigo-200/80">
                          Tailored experiences for admins, teachers, parents &
                          students
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-blue-400/30">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FaChartLine className="text-xl text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          Real-Time Insights
                        </h3>
                        <p className="text-sm text-indigo-200/80">
                          Comprehensive analytics and performance tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaGraduationCap className="text-2xl text-amber-100" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    SSMS
                  </div>
                  <div className="text-xs text-gray-500">
                    Smart School System
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sign In to Your Account
                </h2>
                <p className="text-gray-500">
                  Enter your credentials to access your personalized dashboard
                </p>
              </div>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={clearError}
                  className="mb-6 rounded-xl"
                />
              )}

              {/* Login Form */}
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
                className="space-y-2">
                <Form.Item
                  name="email"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Email Address
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}>
                  <Input
                    prefix={<MailOutlined className="text-gray-400 mr-1" />}
                    placeholder="yourname@school.edu"
                    size="large"
                    className="rounded-xl h-14 border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="text-gray-700 font-semibold text-sm">
                      Password
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}>
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400 mr-1" />}
                    placeholder="Enter your secure password"
                    size="large"
                    className="rounded-xl h-14 border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </Form.Item>

                <div className="flex items-center justify-between mb-6 pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="w-full h-14 rounded-xl text-base font-bold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300 transform hover:scale-[1.02]">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In <span>→</span>
                      </span>
                    )}
                  </Button>
                </Form.Item>
              </Form>


              {/* Help Box */}
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <FaUsers className="text-amber-100 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">
                      Don't have an account?
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Contact your school administrator to receive your login
                      credentials. All accounts are created and managed by
                      authorized personnel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-semibold transition-colors group">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">
                    ←
                  </span>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-amber-100/60">
            © {new Date().getFullYear()} SSMS - Smart School Management System.
            <span className="mx-2">•</span>
            <span className="text-amber-100/80">Secure. Reliable. Trusted.</span>
          </p>
        </div>
      </div>

      {/* Floating Elements (Decorative) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
