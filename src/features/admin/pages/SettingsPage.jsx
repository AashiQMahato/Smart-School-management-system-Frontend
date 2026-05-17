/**
 * Admin Settings Page — Redesigned
 * Modern left-nav settings layout.
 */

import { useState } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  Select,
  message,
  Divider,
  Avatar,
  Tag,
} from "antd";
import {
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
  UserOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  LockOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  TeamOutlined,
  NotificationOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

/* ── Nav items ───────────────────────────────────────── */
const NAV = [
  { id: "general", label: "General", icon: GlobalOutlined },
  { id: "notifications", label: "Notifications", icon: BellOutlined },
  { id: "security", label: "Security", icon: SafetyOutlined },
  { id: "data", label: "Data & Privacy", icon: DatabaseOutlined },
];

const SettingsPage = () => {
  const [active, setActive] = useState("general");
  const [generalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  /* ── Admin stored data ── */
  const storedAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("ssms_user") || "{}");
    } catch {
      return {};
    }
  })();
  const adminUser = storedAdmin.roleProfile?.userId || storedAdmin;

  const saveGeneral = (v) => {
    console.log(v);
    message.success("System settings saved!");
  };
  const saveSecurity = (v) => {
    console.log(v);
    message.success("Security settings updated!");
  };
  const savePassword = (v) => {
    console.log(v);
    message.success("Password changed!");
    passwordForm.resetFields();
  };

  /* ── Section: General ───────────────────────────────── */
  const SectionGeneral = () => (
    <div className="space-y-6">
      {/* Admin account card */}
      <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 flex items-center gap-5">
        <Avatar
          size={72}
          icon={<UserOutlined />}
          className="bg-white/20 border-4 border-white/30 text-white"
        />
        <div className="text-white">
          <p className="font-black text-xl">
            {adminUser?.name || "Administrator"}
          </p>
          <p className="text-slate-400 text-sm">
            {adminUser?.email || "admin@ssms.edu"}
          </p>
          <Tag color="default" className="mt-2 bg-white/10 text-white border-0">
            System Administrator
          </Tag>
        </div>
      </div>

      {/* School settings form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <GlobalOutlined className="text-blue-500" /> School Information
        </h3>
        <Form
          form={generalForm}
          layout="vertical"
          onFinish={saveGeneral}
          initialValues={{
            schoolName: "Smart School Management System",
            email: "admin@ssms.edu",
            phone: "555-0000",
            address: "123 Education Street, Learning City",
            timezone: "UTC",
          }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="schoolName"
              label="School Name"
              rules={[{ required: true }]}>
              <Input placeholder="School name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Contact Email"
              rules={[{ required: true, type: "email" }]}>
              <Input prefix={<MailOutlined className="text-slate-400" />} />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input prefix={<PhoneOutlined className="text-slate-400" />} />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone">
              <Select>
                <Select.Option value="UTC">UTC</Select.Option>
                <Select.Option value="EST">Eastern Time</Select.Option>
                <Select.Option value="PST">Pacific Time</Select.Option>
                <Select.Option value="IST">India Standard Time</Select.Option>
                <Select.Option value="NPT">Nepal Time (NPT)</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              className="bg-blue-600 hover:bg-blue-700 px-6">
              Save Settings
            </Button>
          </div>
        </Form>
      </div>

      {/* System preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <SettingOutlined className="text-slate-500" /> System Preferences
        </h3>
        <div className="space-y-1">
          {[
            {
              label: "Maintenance Mode",
              desc: "Temporarily disable user access for maintenance",
              key: "maintenance",
            },
            {
              label: "Allow Student Self-Enrollment",
              desc: "Let students register themselves with an enrollment code",
              key: "selfEnroll",
            },
            {
              label: "Public Result Visibility",
              desc: "Students can view published results without login",
              key: "publicResults",
              default: true,
            },
            {
              label: "Auto Academic Year Rollover",
              desc: "Automatically advance academic year on July 1",
              key: "autoRollover",
              default: true,
            },
          ].map((item) => (
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
      </div>
    </div>
  );

  /* ── Section: Notifications ─────────────────────────── */
  const SectionNotifications = () => {
    const groups = [
      {
        title: "Academic",
        items: [
          {
            key: "attendance",
            label: "Attendance Reports",
            desc: "Daily attendance summary email",
            default: true,
          },
          {
            key: "exams",
            label: "Exam Schedules",
            desc: "Notify when exams are published",
            default: true,
          },
          {
            key: "results",
            label: "Result Publishing",
            desc: "Alert when results are released",
          },
        ],
      },
      {
        title: "Finance",
        items: [
          {
            key: "fees",
            label: "Fee Reminders",
            desc: "Upcoming and overdue payment alerts",
            default: true,
          },
          {
            key: "payments",
            label: "Payment Received",
            desc: "Confirmation when fee is collected",
            default: true,
          },
        ],
      },
      {
        title: "System",
        items: [
          {
            key: "logins",
            label: "Admin Login Alerts",
            desc: "Email when a new admin session starts",
          },
          {
            key: "errors",
            label: "System Error Reports",
            desc: "Critical system error notifications",
            default: true,
          },
        ],
      },
    ];
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <NotificationOutlined className="text-amber-500" /> Notification
          Preferences
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Configure which events trigger notifications for administrators.
        </p>
        {groups.map((g) => (
          <div key={g.title} className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              {g.title}
            </p>
            <div className="space-y-1">
              {g.items.map((item) => (
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
            onClick={() => message.success("Preferences saved!")}
            className="bg-blue-600 px-6">
            Save
          </Button>
        </div>
      </div>
    );
  };

  /* ── Section: Security ─────────────────────────────── */
  const SectionSecurity = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <SafetyCertificateOutlined className="text-2xl text-emerald-600" />
        </div>
        <div>
          <p className="font-bold text-emerald-800">
            System security is active
          </p>
          <p className="text-sm text-emerald-600">
            All admin access is protected by JWT authentication.
          </p>
        </div>
      </div>

      {/* Password policy */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <SafetyOutlined className="text-red-500" /> Password Policy
        </h3>
        <div className="space-y-1 mb-6">
          {[
            {
              label: "Minimum Password Length",
              desc: "Min characters required",
              type: "select",
              opts: ["6", "8", "10", "12"],
              def: "8",
            },
            {
              label: "Require Uppercase + Number",
              desc: "Enforce strong password format",
              type: "switch",
              def: true,
            },
            {
              label: "Two-Factor Authentication",
              desc: "Require 2FA for all admin accounts",
              type: "switch",
              def: false,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              {item.type === "switch" ? (
                <Switch defaultChecked={item.def} />
              ) : (
                <Select defaultValue={item.def} className="w-24">
                  {item.opts.map((o) => (
                    <Select.Option key={o} value={o}>
                      {o} chars
                    </Select.Option>
                  ))}
                </Select>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Session Timeout
              </p>
              <p className="text-xs text-slate-500">
                Auto logout after inactivity
              </p>
            </div>
            <Select defaultValue="30" className="w-36">
              <Select.Option value="15">15 minutes</Select.Option>
              <Select.Option value="30">30 minutes</Select.Option>
              <Select.Option value="60">1 hour</Select.Option>
              <Select.Option value="120">2 hours</Select.Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => message.success("Security settings saved!")}
            className="bg-blue-600 px-6">
            Save Policy
          </Button>
        </div>
      </div>

      {/* Admin password change */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <LockOutlined className="text-slate-600" /> Change Admin Password
        </h3>
        <Form form={passwordForm} layout="vertical" onFinish={savePassword}>
          <Form.Item
            label="Current Password"
            name="current"
            rules={[{ required: true }]}>
            <Input.Password
              iconRender={(v) =>
                v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="New Password"
              name="newPwd"
              rules={[{ required: true, min: 8 }]}>
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm"
              rules={[{ required: true }]}>
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<LockOutlined />}
            className="bg-blue-600">
            Update Password
          </Button>
        </Form>
      </div>
    </div>
  );

  /* ── Section: Data & Privacy ────────────────────────── */
  const SectionData = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <DatabaseOutlined className="text-indigo-500" /> Data Management
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Data Backup",
              desc: "Download a full backup of all school data",
              color: "blue",
              action: "Download Backup",
            },
            {
              label: "Export Student Data",
              desc: "Export all student records as CSV",
              color: "emerald",
              action: "Export CSV",
            },
            {
              label: "Export Financial Data",
              desc: "Export fee collection history",
              color: "amber",
              action: "Export",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-4 px-5 border border-slate-200 rounded-xl">
              <div>
                <p className="font-semibold text-sm text-slate-800">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <Button
                onClick={() => message.info(`${item.action} initiated`)}
                size="small">
                {item.action}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <TeamOutlined className="text-slate-500" /> Privacy Controls
        </h3>
        <div className="space-y-1">
          {[
            {
              label: "Anonymize Student Data in Reports",
              desc: "Hide personally identifiable info in exports",
              key: "anon",
            },
            {
              label: "Allow Third-Party Analytics",
              desc: "Send usage telemetry to improve the platform",
              key: "analytics",
              default: true,
            },
            {
              label: "Audit Log Retention (1 Year)",
              desc: "Keep admin activity logs for 12 months",
              key: "audit",
              default: true,
            },
          ].map((item) => (
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
      </div>
    </div>
  );

  const SECTIONS = {
    general: <SectionGeneral />,
    notifications: <SectionNotifications />,
    security: <SectionSecurity />,
    data: <SectionData />,
  };

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <SettingOutlined className="text-blue-500" /> Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage system configuration, security, and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left nav */}
          <nav className="lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                    <Icon
                      className={isActive ? "text-blue-600" : "text-slate-400"}
                    />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">{SECTIONS[active]}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
