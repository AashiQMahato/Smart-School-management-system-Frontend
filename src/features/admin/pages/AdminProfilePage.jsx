/**
 * Admin Profile Page
 * Modern profile page for administrators to view and manage their information
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Statistic,
  message,
  Badge,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  TrophyOutlined,
  BookOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import { getDashboardStats } from "../../../services/admin.service";

const AdminProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Get admin profile from localStorage
      const userData = localStorage.getItem("ssms_user");
      if (userData) {
        const user = JSON.parse(userData);
        setAdminProfile(user.roleProfile || user);
      }

      // Fetch dashboard stats
      const statsRes = await getDashboardStats().catch(() => ({ data: null }));
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          subtitle="View your profile information"
        />
        <Card>
          <Empty description="Profile not found" />
        </Card>
      </div>
    );
  }

  const user = adminProfile.userId || adminProfile;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Administrator profile and system overview"
      />

      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <div className="bg-linear-to-r from-red-500 to-pink-600 rounded-xl p-8 -m-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="bg-white/20 border-4 border-white/30"
              src={user?.avatar}
            />
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Tag
                  icon={<TrophyOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  System Administrator
                </Tag>
                <Tag
                  icon={<IdcardOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  Admin ID: {adminProfile.adminId || user._id}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={12} sm={6}>
              <Card className="text-center bg-blue-50 border-blue-200">
                <Statistic
                  title={
                    <span className="text-blue-700 font-semibold">
                      Total Students
                    </span>
                  }
                  value={stats.totalStudents || 0}
                  styles={{ color: "#2563eb" }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center bg-emerald-50 border-emerald-200">
                <Statistic
                  title={
                    <span className="text-emerald-700 font-semibold">
                      Total Teachers
                    </span>
                  }
                  value={stats.totalTeachers || 0}
                  styles={{ color: "#059669" }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center bg-purple-50 border-purple-200">
                <Statistic
                  title={
                    <span className="text-purple-700 font-semibold">
                      Total Classes
                    </span>
                  }
                  value={stats.totalClasses || 0}
                  styles={{ color: "#7c3aed" }}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="text-center bg-amber-50 border-amber-200">
                <Statistic
                  title={
                    <span className="text-amber-700 font-semibold">
                      Total Parents
                    </span>
                  }
                  value={stats.totalParents || 0}
                  styles={{ color: "#d97706" }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Card>

      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-red-600" />
                <span>Personal Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Full Name
                  </span>
                }>
                {user?.name}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <MailOutlined className="mr-2" />
                    Email
                  </span>
                }>
                {user?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <PhoneOutlined className="mr-2" />
                    Phone
                  </span>
                }>
                {user?.phone || adminProfile.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <HomeOutlined className="mr-2" />
                    Address
                  </span>
                }>
                {adminProfile.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Date of Birth
                  </span>
                }>
                {adminProfile.dateOfBirth
                  ? new Date(adminProfile.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Status
                  </span>
                }>
                <Badge
                  status={user?.status === "active" ? "success" : "default"}
                  text={user?.status || "Active"}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Professional Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-emerald-600" />
                <span>Professional Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    Admin ID
                  </span>
                }>
                {adminProfile.adminId || user._id}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <TrophyOutlined className="mr-2" />
                    Role
                  </span>
                }>
                System Administrator
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <TeamOutlined className="mr-2" />
                    Department
                  </span>
                }>
                {adminProfile.department || "Administration"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Joining Date
                  </span>
                }>
                {adminProfile.joiningDate
                  ? new Date(adminProfile.joiningDate).toLocaleDateString()
                  : user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <BookOutlined className="mr-2" />
                    Qualification
                  </span>
                }>
                {adminProfile.qualification || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Experience
                  </span>
                }>
                {adminProfile.experience
                  ? `${adminProfile.experience} years`
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* System Responsibilities */}
        <Col xs={24}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TrophyOutlined className="text-purple-600" />
                <span>System Responsibilities</span>
              </div>
            }
            className="shadow-md border-slate-200">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserOutlined className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">
                        User Management
                      </div>
                      <div className="text-xs text-slate-500">
                        Manage all users
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BookOutlined className="text-2xl text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-emerald-600 font-medium">
                        Academic Oversight
                      </div>
                      <div className="text-xs text-slate-500">
                        Classes & Subjects
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CalendarOutlined className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-600 font-medium">
                        Schedule Management
                      </div>
                      <div className="text-xs text-slate-500">
                        Timetables & Events
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <DollarOutlined className="text-2xl text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm text-amber-600 font-medium">
                        Financial Oversight
                      </div>
                      <div className="text-xs text-slate-500">
                        Fees & Reports
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfilePage;
