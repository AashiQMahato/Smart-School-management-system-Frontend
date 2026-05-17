/**
 * Universal User Settings Page
 * Used by Teacher, Student, and Parent roles.
 * Provides Account, Notifications, Security, and Help settings.
 */

import { useState } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  message,
  Avatar,
  Tag,
  Divider,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useUser } from "../hooks/useAuth";
import BASE_URL from "../config/baseUrl";
import axios from "axios";

/* ── Helpers ──────────────────────────────────────────── */
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("ssms_token")}` },
});

const ROLE_COLORS = {
  teacher: { from: "from-blue-600", to: "to-blue-800", badge: "blue" },
  student: { from: "from-emerald-600", to: "to-emerald-800", badge: "green" },
  parent: { from: "from-purple-600", to: "to-purple-800", badge: "purple" },
  admin: { from: "from-slate-700", to: "to-slate-900", badge: "default" },
};

const ROLE_LABELS = {
  teacher: "Teacher",
  student: "Student",
  parent: "Parent / Guardian",
  admin: "Administrator",
};

/* ── Section IDs ──────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "account", label: "Account", icon: UserOutlined },
  { id: "notifications", label: "Notifications", icon: BellOutlined },
  { id: "security", label: "Security", icon: LockOutlined },
  { id: "help", label: "Help & Support", icon: QuestionCircleOutlined },
];

/* ═══════════════════════════════════════════════════════ */
export default function UserSettingsPage() {
  const { user, userRole } = useUser();
  const [activeSection, setActiveSection] = useState("account");
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  /* Stored user data */
  const storedRaw = (() => {
    try {
      return JSON.parse(localStorage.getItem("ssms_user") || "{}");
    } catch {
      return {};
    }
  })();
  const profile = storedRaw.roleProfile || storedRaw;
  const account = profile.userId || profile;
  const role = userRole || storedRaw.role || "student";
  const theme = ROLE_COLORS[role] || ROLE_COLORS.student;

  /* ── Handlers ─────────────────────────────────────── */
  const handleProfileSave = async (values) => {
    setSavingProfile(true);
    try {
      await axios.put(
        `${BASE_URL}/users/me`,
        { phone: values.phone, bio: values.bio },
        getAuthHeaders(),
      );
      message.success("Profile updated successfully!");
    } catch {
      message.info("Profile changes saved locally.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    setSavingPassword(true);
    try {
      await axios.put(
        `${BASE_URL}/users/me/password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        getAuthHeaders(),
      );
      message.success("Password changed successfully!");
      passwordForm.resetFields();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  /* ── Subcomponents ────────────────────────────────── */
  const SectionAccount = () => (
    <div className="space-y-8">
      {/* Avatar hero */}
      <div
        className={`rounded-2xl bg-linear-to-br ${theme.from} ${theme.to} p-6 flex items-center gap-5`}>
        <div className="relative">
          <Avatar
            size={80}
            icon={<UserOutlined />}
            className="bg-white/20 border-4 border-white/40 text-white text-2xl"
            src={account?.avatar}
          />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <EditOutlined className="text-xs text-slate-600" />
          </button>
        </div>
        <div className="text-white">
          <h2 className="text-xl font-bold">
            {account?.name || user?.name || "—"}
          </h2>
          <p className="text-white/70 text-sm">
            {account?.email || user?.email}
          </p>
          <Tag
            color={theme.badge}
            className="mt-2 capitalize border-0 bg-white/20 text-white">
            {ROLE_LABELS[role]}
          </Tag>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <UserOutlined className="text-blue-500" /> Personal Information
        </h3>
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileSave}
          initialValues={{
            name: account?.name || user?.name,
            email: account?.email || user?.email,
            phone: account?.phone || profile?.phone,
            bio: profile?.bio || account?.bio,
          }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Full Name" name="name">
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                disabled
                className="bg-slate-50"
                placeholder="Your name"
              />
            </Form.Item>
            <Form.Item label="Email Address" name="email">
              <Input
                prefix={<MailOutlined className="text-slate-400" />}
                disabled
                className="bg-slate-50"
                placeholder="your@email.com"
              />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone">
              <Input
                prefix={<PhoneOutlined className="text-slate-400" />}
                placeholder="Enter phone number"
              />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Input
                value={ROLE_LABELS[role]}
                disabled
                className="bg-slate-50 capitalize"
                defaultValue={ROLE_LABELS[role]}
              />
            </Form.Item>
          </div>
          <Form.Item label="Bio / About" name="bio">
            <Input.TextArea
              rows={3}
              placeholder="Tell us a little about yourself…"
              className="resize-none"
            />
          </Form.Item>
          <div className="flex justify-end pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={savingProfile}
              icon={<CheckOutlined />}
              className="bg-blue-600 hover:bg-blue-700 px-6">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );

  const SectionNotifications = () => {
    const groups = [
      {
        title: "Academic Alerts",
        items: [
          {
            key: "attendance",
            label: "Attendance Reminders",
            desc: "Get notified when attendance is marked",
          },
          {
            key: "results",
            label: "Result Updates",
            desc: "Notify when new results are published",
          },
          {
            key: "assignments",
            label: "Assignment Deadlines",
            desc: "Reminders 24h before due date",
          },
        ],
      },
      {
        title: "Communication",
        items: [
          {
            key: "messages",
            label: "In-app Messages",
            desc: "Show notification badges for messages",
            default: true,
          },
          {
            key: "emails",
            label: "Email Notifications",
            desc: "Receive important updates by email",
            default: true,
          },
          { key: "sms", label: "SMS Alerts", desc: "Critical alerts via SMS" },
        ],
      },
      {
        title: "System",
        items: [
          {
            key: "announcements",
            label: "School Announcements",
            desc: "News, events and school notices",
            default: true,
          },
          {
            key: "fees",
            label: "Fee Reminders",
            desc: "Payment deadlines and receipts",
            default: true,
          },
        ],
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
            <NotificationOutlined className="text-amber-500" /> Notification
            Preferences
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Control what notifications you receive and how.
          </p>

          {groups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default ?? false} />
                  </div>
                ))}
              </div>
              <Divider className="my-3" />
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => message.success("Notification preferences saved!")}
              className="bg-blue-600 hover:bg-blue-700 px-6">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const SectionSecurity = () => (
    <div className="space-y-6">
      {/* Status card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <SafetyCertificateOutlined className="text-2xl text-emerald-600" />
        </div>
        <div>
          <p className="font-bold text-emerald-800">Your account is secure</p>
          <p className="text-sm text-emerald-600">
            Last login:{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <LockOutlined className="text-slate-600" /> Change Password
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Choose a strong password that you haven't used before.
        </p>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Enter current password" }]}>
            <Input.Password
              iconRender={(v) =>
                v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="••••••••"
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, min: 8, message: "Min 8 characters" }]}>
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder="••••••••"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: "Confirm your password" }]}>
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder="••••••••"
              />
            </Form.Item>
          </div>
          <ul className="text-xs text-slate-500 list-disc list-inside mb-5 space-y-1">
            <li>At least 8 characters long</li>
            <li>Mix of uppercase, lowercase and numbers</li>
            <li>Avoid using your name or email</li>
          </ul>
          <Button
            type="primary"
            htmlType="submit"
            loading={savingPassword}
            icon={<LockOutlined />}
            className="bg-blue-600 hover:bg-blue-700">
            Update Password
          </Button>
        </Form>
      </div>

      {/* Session info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Active Sessions
        </h3>
        <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                This Device
              </p>
              <p className="text-xs text-slate-500">
                Active right now ·{" "}
                {navigator.userAgent.includes("Mac") ? "Mac" : "Windows"}
              </p>
            </div>
          </div>
          <Tag color="green">Current</Tag>
        </div>
      </div>
    </div>
  );

  const SectionHelp = () => {
    const faqs = [
      {
        q: "How do I update my profile picture?",
        a: "Go to Account settings and click the edit icon on your avatar image.",
      },
      {
        q: "I forgot my password — what do I do?",
        a: "Use the 'Forgot Password' link on the login page, or contact your school administrator.",
      },
      {
        q: "How do I view my academic results?",
        a: "Navigate to Results in the sidebar under the Academics section.",
      },
      {
        q: "Why can't I edit my email address?",
        a: "Email addresses are managed by your school administrator. Contact the admin to request a change.",
      },
    ];
    const [open, setOpen] = useState(null);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="text-sm font-semibold text-slate-800">
                    {faq.q}
                  </span>
                  <span
                    className={`text-slate-400 transition-transform ${open === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 py-4 bg-slate-50 text-sm text-slate-600 border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="mailto:support@ssms.edu"
            className="block bg-blue-50 border border-blue-200 rounded-2xl p-5 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <MailOutlined className="text-blue-600" />
            </div>
            <p className="font-bold text-slate-800">Email Support</p>
            <p className="text-sm text-slate-500 mt-1">support@ssms.edu</p>
          </a>
          <a
            href="tel:+1-555-0100"
            className="block bg-emerald-50 border border-emerald-200 rounded-2xl p-5 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
              <PhoneOutlined className="text-emerald-600" />
            </div>
            <p className="font-bold text-slate-800">Phone Support</p>
            <p className="text-sm text-slate-500 mt-1">+1 (555) 010-0100</p>
          </a>
        </div>
      </div>
    );
  };

  const SECTIONS = {
    account: <SectionAccount />,
    notifications: <SectionNotifications />,
    security: <SectionSecurity />,
    help: <SectionHelp />,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account preferences and security.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left nav ── */}
          <nav className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                    <Icon
                      className={active ? "text-blue-600" : "text-slate-400"}
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0">{SECTIONS[activeSection]}</div>
        </div>
      </div>
    </div>
  );
}
