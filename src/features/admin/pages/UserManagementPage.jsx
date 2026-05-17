/**
 * User Management Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing system users
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Dropdown,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BookOutlined,
  UserSwitchOutlined,
  CopyOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  SafetyOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  generatePassword,
  getDashboardStats,
} from "../../../services/admin.service";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeTab !== "all") {
        filters.role = activeTab;
      }
      const response = await getAllUsers(filters);
      setUsers(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        color: "#dc2626",
        bgColor: "#fee2e2",
        label: "Admin",
        icon: <SafetyOutlined />,
      },
      teacher: {
        color: "#2563eb",
        bgColor: "#dbeafe",
        label: "Teacher",
        icon: <BookOutlined />,
      },
      student: {
        color: "#16a34a",
        bgColor: "#dcfce7",
        label: "Student",
        icon: <UserOutlined />,
      },
      parent: {
        color: "#9333ea",
        bgColor: "#f3e8ff",
        label: "Parent",
        icon: <TeamOutlined />,
      },
    };
    return configs[role] || configs.student;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: "#16a34a",
        bgColor: "#dcfce7",
        label: "Active",
        icon: <CheckCircleOutlined />,
      },
      suspended: {
        color: "#ea580c",
        bgColor: "#ffedd5",
        label: "Suspended",
        icon: <StopOutlined />,
      },
      inactive: {
        color: "#6b7280",
        bgColor: "#f3f4f6",
        label: "Inactive",
        icon: <CloseCircleOutlined />,
      },
    };
    return configs[status] || configs.active;
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setIsPasswordModalOpen(true);
  };

  const handleSetNewPassword = (user) => {
    setSelectedUser(user);
    setGeneratedPassword("");
    setIsPasswordModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
      fetchStats();
    } catch (error) {
      message.error(error.message || "Error deleting user");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, values);
        message.success("User updated successfully");
      } else {
        const passwordToUse = generatedPassword || generatePassword();
        if (!generatedPassword) {
          setGeneratedPassword(passwordToUse);
        }
        await createUser({ ...values, password: passwordToUse });
        message.success("User created successfully");
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      setGeneratedPassword("");
      fetchUsers();
      fetchStats();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!selectedUser?._id || !generatedPassword) {
        message.error("Missing user or generated password");
        return;
      }

      await resetUserPassword(selectedUser._id, generatedPassword);
      message.success("Password reset successfully");
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setGeneratedPassword("");
    } catch (error) {
      message.error(error.message || "Error resetting password");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    form.setFieldsValue({ password: newPassword });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const getActionItems = (user) => [
    {
      key: "edit",
      label: "Edit User",
      icon: <EditOutlined />,
      onClick: () => handleEdit(user),
    },
    {
      key: "reset",
      label: "Reset Password",
      icon: <LockOutlined />,
      onClick: () => handleResetPassword(user),
    },
    {
      key: "set-password",
      label: "Set New Password",
      icon: <LockOutlined />,
      onClick: () => handleSetNewPassword(user),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete User",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Delete User",
          content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          okText: "Delete",
          okType: "danger",
          onOk: () => handleDelete(user._id),
        });
      },
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = [
    { key: "all", label: "All Users", count: stats.totalUsers || 0 },
    { key: "admin", label: "Admins", count: null },
    { key: "teacher", label: "Teachers", count: stats.totalTeachers || 0 },
    { key: "student", label: "Students", count: stats.totalStudents || 0 },
    { key: "parent", label: "Parents", count: stats.totalParents || 0 },
  ];

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-slate-500 to-blue-900 rounded-3xl p-8 text-white shadow-2xl border border-slate-600/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TeamOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                User Management
              </h1>
              <p className="text-slate-300 text-sm mt-0.5">
                Manage all system users, roles, and permissions
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <ReloadOutlined /> Refresh
            </button>
            <button
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setGeneratedPassword("");
                handleGeneratePassword();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all shadow-lg">
              <PlusOutlined /> Add User
            </button>
          </div>
        </div>
        {/* Mini stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers || 0,
              color: "bg-white/15",
            },
            {
              label: "Active",
              value: stats.activeUsers || 0,
              color: "bg-emerald-500/30",
            },
            {
              label: "Suspended",
              value: stats.suspendedUsers || 0,
              color: "bg-orange-500/30",
            },
            {
              label: "Classes",
              value: stats.totalClasses || 0,
              color: "bg-purple-500/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.color} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Panel header with tabs + search */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {tab.label}
                  {tab.count !== null && (
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Input.Search
              placeholder="Search by name or email..."
              size="large"
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="p-6">
          {/* User Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users in this category"}
                </span>
              }
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                const statusConfig = getStatusConfig(user.status || "active");
                const initial = user.name?.[0]?.toUpperCase() || "U";

                return (
                  <div
                    key={user._id}
                    className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-slate-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-white"
                          style={{ backgroundColor: roleConfig.color }}>
                          {initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {user.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Dropdown
                        menu={{ items: getActionItems(user) }}
                        trigger={["click"]}
                        placement="bottomRight">
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-xl"
                        />
                      </Dropdown>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <PhoneOutlined />
                        <span>{user.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: roleConfig.bgColor,
                            color: roleConfig.color,
                          }}>
                          {roleConfig.label}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: statusConfig.bgColor,
                            color: statusConfig.color,
                          }}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-100">
                        <IdcardOutlined />
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              {editingUser ? "Edit User" : "Create New User"}
            </span>
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setGeneratedPassword("");
        }}
        width={700}
        okText={editingUser ? "Update User" : "Create User"}
        okButtonProps={{
          className: "bg-blue-600 hover:bg-blue-700",
        }}
        confirmLoading={loading}>
        <Form
          form={form}
          layout="vertical"
          className="mt-6"
          autoComplete="off"
          onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="font-medium">Full Name</span>}
              rules={[{ required: true, message: "Please enter user's name" }]}>
              <Input
                size="large"
                placeholder="Enter full name"
                prefix={<UserOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="font-medium">Email Address</span>}
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}>
              <Input
                size="large"
                placeholder="user@example.com"
                prefix={<MailOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="font-medium">Phone Number</span>}
              rules={[
                { required: true, message: "Please enter phone number" },
              ]}>
              <Input
                size="large"
                placeholder="Enter phone number"
                prefix={<PhoneOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="role"
              label={<span className="font-medium">Role</span>}
              rules={[{ required: true, message: "Please select a role" }]}>
              <Select
                size="large"
                placeholder="Select role"
                suffixIcon={<TeamOutlined className="text-slate-400" />}>
                <Select.Option value="admin">
                  <UserSwitchOutlined /> Admin
                </Select.Option>
                <Select.Option value="teacher">
                  <BookOutlined /> Teacher
                </Select.Option>
                <Select.Option value="student">
                  <UserOutlined /> Student
                </Select.Option>
                <Select.Option value="parent">
                  <TeamOutlined /> Parent
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label={<span className="font-medium">Address</span>}
              className="col-span-2">
              <Input.TextArea
                size="large"
                placeholder="Enter address"
                rows={2}
              />
            </Form.Item>
          </div>

          {!editingUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <LockOutlined className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-2">
                    Auto-Generated Password
                  </p>
                  {generatedPassword ? (
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-sm font-mono text-blue-700 font-semibold">
                          {generatedPassword}
                        </code>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(generatedPassword)}
                          className="hover:bg-blue-100 text-blue-600">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        ⚠️ Save this password - it will only be shown once!
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-700">
                      A secure password will be generated automatically when you
                      create the user.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <LockOutlined className="text-orange-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Set New Password
            </span>
          </div>
        }
        open={isPasswordModalOpen}
        onOk={handlePasswordReset}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
          setGeneratedPassword("");
        }}
        okText="Update Password"
        okButtonProps={{
          className: "bg-orange-600 hover:bg-orange-700",
        }}
        confirmLoading={loading}>
        <div className="py-4">
          <p className="text-slate-600 mb-4">
            Set a new password for{" "}
            <span className="font-semibold text-slate-900">
              {selectedUser?.name}
            </span>
            .
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LockOutlined className="text-orange-600 mt-1" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 mb-2">
                  Set New Password
                </p>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex flex-col gap-3">
                    <Input.Password
                      size="large"
                      placeholder="Enter new password (min 6 characters)"
                      value={generatedPassword}
                      onChange={(e) => setGeneratedPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setGeneratedPassword(generatePassword())}
                        className="hover:border-orange-500 hover:text-orange-600">
                        Generate
                      </Button>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(generatedPassword)}
                        disabled={!generatedPassword}
                        className="hover:bg-orange-100 text-orange-600">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-orange-600">
                      Password must be at least 6 characters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
