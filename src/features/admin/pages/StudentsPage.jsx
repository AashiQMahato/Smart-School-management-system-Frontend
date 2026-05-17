/**
 * Students Management Page
 * Admin page for managing students with class assignments
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Avatar,
  Card,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  BookOutlined,
  TeamOutlined,
  IdcardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
import {
  getAllUsers,
  createStudent,
  updateStudent,
  deleteUser,
  updateUser,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClassAssignModalOpen, setIsClassAssignModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [classAssignForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes, parentsRes] = await Promise.all([
        getAllUsers({ role: "student" }),
        getAllClasses(),
        getAllUsers({ role: "parent" }),
      ]);

      const studentUsers = (studentsRes.data || []).map((user) => ({
        _id: user._id,
        userId: user,
        classId: null,
        section: null,
        rollNumber: null,
        parentId: null,
      }));

      const parentUsers = (parentsRes.data || []).map((user) => ({
        _id: user._id,
        userId: user,
        children: [],
      }));

      setStudents(studentUsers);
      setClasses(classesRes.data || []);
      setParents(parentUsers);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "userId",
      key: "student",
      render: (user, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium">{user?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">{user?.email || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Class",
      dataIndex: "classId",
      key: "class",
      render: (classData, record) => (
        <div>
          {classData ? (
            <>
              <Tag color="blue" icon={<BookOutlined />}>
                {classData.name}
              </Tag>
              <div className="text-xs text-gray-500 mt-1">
                Section: {record.section || "A"}
              </div>
            </>
          ) : (
            <Tag color="red">Not Assigned</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      key: "rollNumber",
      render: (rollNumber) => rollNumber || "N/A",
    },
    {
      title: "Parent",
      dataIndex: "parentId",
      key: "parent",
      render: (parentId) =>
        parentId ? (
          <Tag color="success" icon={<TeamOutlined />}>
            {parentId.name || "Linked"}
          </Tag>
        ) : (
          <Tag color="warning">No Parent</Tag>
        ),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
      render: (year) => year || "N/A",
    },
    {
      title: "Status",
      dataIndex: "userId",
      key: "status",
      render: (user) => (
        <Tag color={user?.status === "active" ? "success" : "default"}>
          {user?.status || "active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Student">
            <Button
              type="primary"
              size="small"
              ghost
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Assign to Class">
            <Button
              size="small"
              icon={<HomeOutlined />}
              onClick={() => handleOpenClassAssign(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this student?"
            description="This will also delete the user account."
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No">
            <Tooltip title="Delete Student">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingStudent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.userId?.name,
      email: record.userId?.email,
      phone: record.userId?.phone,
      classId: record.classId?._id,
      section: record.section,
      rollNumber: record.rollNumber,
      parentId: record.parentId?._id || record.parentId,
      academicYear: record.academicYear,
    });
    setIsModalOpen(true);
  };

  const handleOpenClassAssign = (record) => {
    setSelectedStudent(record);
    classAssignForm.setFieldsValue({
      classId: record.classId?._id,
      section: record.section,
      rollNumber: record.rollNumber,
    });
    setIsClassAssignModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent._id, {
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId || null,
          academicYear: values.academicYear,
        });
        // Update user info if name/email/phone changed
        await updateUser(editingStudent.userId._id, {
          name: values.name,
          email: values.email,
          phone: values.phone,
        });
        message.success("Student updated successfully");
      } else {
        // Create new student
        await createStudent({
          name: values.name,
          email: values.email,
          password: values.password || "student123",
          phone: values.phone,
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId || null,
          academicYear: values.academicYear,
        });
        message.success("Student created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error saving student");
    }
  };

  const handleClassAssignment = async (values) => {
    try {
      await updateStudent(selectedStudent._id, {
        classId: values.classId,
        section: values.section,
        rollNumber: values.rollNumber,
      });
      message.success("Student assigned to class successfully");
      setIsClassAssignModalOpen(false);
      classAssignForm.resetFields();
      setSelectedStudent(null);
      fetchData();
    } catch (error) {
      message.error(error.message || "Error assigning student to class");
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteUser(record.userId._id);
      message.success("Student deleted successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error deleting student");
    }
  };

  // Stats
  const totalStudents = students.length;
  const studentsWithClass = students.filter((s) => s.classId).length;
  const studentsWithoutClass = totalStudents - studentsWithClass;
  const studentsWithParent = students.filter((s) => s.parentId).length;

  return (
    <div>
      <PageHeader
        title="Students Management"
        subtitle="Manage student enrollment, class assignments, and parent linkage"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Students" },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}>
              Add Student
            </Button>
          </Space>
        }
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-blue-400 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <div className="text-xs text-gray-500">Total Students</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <HomeOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{studentsWithClass}</div>
                <div className="text-xs text-gray-500">Assigned to Class</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <IdcardOutlined className="text-yellow-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{studentsWithoutClass}</div>
                <div className="text-xs text-gray-500">No Class</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{studentsWithParent}</div>
                <div className="text-xs text-gray-500">With Parent</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Students Table */}
      <Card>
        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          showSearch
          searchPlaceholder="Search students..."
          rowKey={(record) => record._id}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter student name" },
                ]}>
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter valid email" },
                ]}>
                <Input
                  placeholder="student@example.com"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}>
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            {!editingStudent && (
              <Col span={12}>
                <Form.Item name="password" label="Password">
                  <Input.Password placeholder="Default: student123" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Divider>Class Assignment</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: "Please select class" }]}>
                <Select
                  placeholder="Select class"
                  showSearch
                  optionFilterProp="children">
                  {classes.map((cls) => (
                    <Select.Option key={cls._id} value={cls._id}>
                      {cls.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="section"
                label="Section"
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input placeholder="A, B, C..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rollNumber"
                label="Roll Number"
                rules={[
                  { required: true, message: "Please enter roll number" },
                ]}>
                <Input placeholder="001, 002..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="academicYear"
                label="Academic Year"
                rules={[
                  { required: true, message: "Please enter academic year" },
                ]}>
                <Input placeholder="2025-2026" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="parentId" label="Parent (Optional)">
            <Select
              placeholder="Select parent"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }>
              {parents.map((parent) => (
                <Select.Option
                  key={parent.userId._id}
                  value={parent.userId._id}>
                  {parent.userId.name} ({parent.userId.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingStudent ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Class Assignment Modal */}
      <Modal
        title="Assign Student to Class"
        open={isClassAssignModalOpen}
        onCancel={() => {
          setIsClassAssignModalOpen(false);
          classAssignForm.resetFields();
          setSelectedStudent(null);
        }}
        footer={null}
        width={500}>
        {selectedStudent && (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar icon={<UserOutlined />} className="bg-blue-100" />
                <div>
                  <div className="font-medium">
                    {selectedStudent.userId?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedStudent.userId?.email}
                  </div>
                </div>
              </div>
            </div>

            <Form
              form={classAssignForm}
              layout="vertical"
              onFinish={handleClassAssignment}>
              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: "Please select class" }]}>
                <Select
                  placeholder="Select class"
                  showSearch
                  optionFilterProp="children">
                  {classes.map((cls) => (
                    <Select.Option key={cls._id} value={cls._id}>
                      {cls.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="section"
                label="Section"
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input placeholder="A, B, C..." />
              </Form.Item>

              <Form.Item
                name="rollNumber"
                label="Roll Number"
                rules={[
                  { required: true, message: "Please enter roll number" },
                ]}>
                <Input placeholder="001, 002..." />
              </Form.Item>

              <Form.Item className="mb-0 text-right">
                <Space>
                  <Button onClick={() => setIsClassAssignModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<HomeOutlined />}>
                    Assign to Class
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default StudentsPage;
