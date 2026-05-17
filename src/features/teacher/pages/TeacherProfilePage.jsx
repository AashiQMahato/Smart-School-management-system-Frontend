/**
 * Teacher Profile Page
 * Modern profile page for teachers to view and manage their information
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
  List,
  Badge,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  TeamOutlined,
  IdcardOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import { getMyAssignments } from "../../../services/teacher.service";

const TeacherProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [accountUser, setAccountUser] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Get teacher profile from localStorage
      const userData = localStorage.getItem("ssms_user");
      if (userData) {
        const storedUser = JSON.parse(userData);
        setAccountUser(storedUser);
        setTeacherProfile(storedUser.roleProfile || null);
      }

      // Fetch assignments and classes
      const assignmentsRes = await getMyAssignments().catch(() => ({
        items: [],
      }));
      setAssignments(assignmentsRes.items || []);
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

  // Get unique subjects and classes
  const uniqueSubjects = [
    ...new Map(
      assignments
        .filter((a) => a.subjectId)
        .map((a) => [
          a.subjectId._id || a.subjectId,
          {
            id: a.subjectId._id || a.subjectId,
            name: a.subjectId.name || "Unknown Subject",
            code: a.subjectId.code,
          },
        ]),
    ).values(),
  ];

  const uniqueClasses = [
    ...new Map(
      assignments
        .filter((a) => a.classId)
        .map((a) => {
          const cls = a.classId;
          return [
            cls._id || cls,
            {
              id: cls._id || cls,
              name: cls.name || "Unknown Class",
              section: a.section || cls.section,
            },
          ];
        }),
    ).values(),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!accountUser) {
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

  const user = accountUser;
  const profile = teacherProfile || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
      />

      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <div className="bg-linear-to-r from-blue-500 to-cyan-600 rounded-xl p-8 -m-6 mb-6">
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
                  icon={<IdcardOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  Employee ID: {profile.employeeId || "N/A"}
                </Tag>
                <Tag
                  icon={<BookOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  {profile.qualification || "Teacher"}
                </Tag>
                {profile.department && (
                  <Tag
                    icon={<TeamOutlined />}
                    className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                    {profile.department}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <Row gutter={[24, 24]} className="mt-6">
          <Col xs={24} sm={8}>
            <Card className="text-center bg-blue-50 border-blue-200">
              <Statistic
                title={
                  <span className="text-blue-700 font-semibold">
                    Total Classes
                  </span>
                }
                value={uniqueClasses.length}
                styles={{ color: "#2563eb" }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-emerald-50 border-emerald-200">
              <Statistic
                title={
                  <span className="text-emerald-700 font-semibold">
                    Total Subjects
                  </span>
                }
                value={uniqueSubjects.length}
                styles={{ color: "#059669" }}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-purple-50 border-purple-200">
              <Statistic
                title={
                  <span className="text-purple-700 font-semibold">
                    Total Assignments
                  </span>
                }
                value={assignments.length}
                styles={{ color: "#7c3aed" }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
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
                {user?.phone || profile.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <HomeOutlined className="mr-2" />
                    Address
                  </span>
                }>
                {teacherProfile.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Date of Birth
                  </span>
                }>
                {teacherProfile.dateOfBirth
                  ? new Date(teacherProfile.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Joining Date
                  </span>
                }>
                {teacherProfile.joiningDate
                  ? new Date(teacherProfile.joiningDate).toLocaleDateString()
                  : "N/A"}
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
                    Employee ID
                  </span>
                }>
                {teacherProfile.employeeId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <BookOutlined className="mr-2" />
                    Qualification
                  </span>
                }>
                {teacherProfile.qualification || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <BookOutlined className="mr-2" />
                    Specialization
                  </span>
                }>
                {teacherProfile.specialization || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <TeamOutlined className="mr-2" />
                    Department
                  </span>
                }>
                {teacherProfile.department || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Experience
                  </span>
                }>
                {teacherProfile.experience
                  ? `${teacherProfile.experience} years`
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

        {/* Assigned Classes */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TeamOutlined className="text-purple-600" />
                <span>Assigned Classes</span>
                <Tag color="purple">{uniqueClasses.length} classes</Tag>
              </div>
            }
            className="shadow-md border-slate-200">
            {uniqueClasses.length > 0 ? (
              <List
                dataSource={uniqueClasses}
                renderItem={(cls) => (
                  <List.Item>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="small"
                        className="bg-purple-100 text-purple-600"
                        icon={<TeamOutlined />}
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {cls.name}
                        </div>
                        {cls.section && (
                          <div className="text-xs text-slate-500">
                            Section: {cls.section}
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No classes assigned yet" />
            )}
          </Card>
        </Col>

        {/* Assigned Subjects */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-blue-600" />
                <span>Assigned Subjects</span>
                <Tag color="blue">{uniqueSubjects.length} subjects</Tag>
              </div>
            }
            className="shadow-md border-slate-200">
            {uniqueSubjects.length > 0 ? (
              <List
                dataSource={uniqueSubjects}
                renderItem={(subject) => (
                  <List.Item>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="small"
                        className="bg-blue-100 text-blue-600"
                        icon={<BookOutlined />}
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {subject.name}
                        </div>
                        {subject.code && (
                          <div className="text-xs text-slate-500">
                            Code: {subject.code}
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No subjects assigned yet" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherProfilePage;
