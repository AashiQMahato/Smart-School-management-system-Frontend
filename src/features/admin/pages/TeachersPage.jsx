/**
 * Teachers Management Page
 * Admin page for managing teachers
 */

import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";

const TeachersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form] = Form.useForm();

  // Mock data - replace with API calls
  const [teachers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@ssms.edu",
      phone: "555-0101",
      subject: "Mathematics",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@ssms.edu",
      phone: "555-0102",
      subject: "Science",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@ssms.edu",
      phone: "555-0103",
      subject: "English",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@ssms.edu",
      phone: "555-0104",
      subject: "History",
      status: "inactive",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@ssms.edu",
      phone: "555-0105",
      subject: "Physics",
      status: "active",
    },
  ]);

  const columns = [
    {
      title: "Teacher",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-blue-100 text-blue-400"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Teacher",
      content: "Are you sure you want to delete this teacher?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        message.success("Teacher deleted successfully");
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTeacher) {
        message.success("Teacher updated successfully");
      } else {
        message.success("Teacher added successfully");
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      form.resetFields();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "subject",
      label: "Subject",
      options: [
        { value: "mathematics", label: "Mathematics" },
        { value: "science", label: "Science" },
        { value: "english", label: "English" },
        { value: "history", label: "History" },
        { value: "physics", label: "Physics" },
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle="Manage all teachers in the system"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Teachers" },
        ]}
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTeacher(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>
            Add Teacher
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={teachers}
        showSearch
        showFilters
        filterOptions={filterOptions}
        searchPlaceholder="Search teachers..."
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeacher(null);
          form.resetFields();
        }}
        footer={null}
        width={600}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter teacher name" }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}>
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter email address"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}>
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please select subject" }]}>
            <Select placeholder="Select subject">
              <Select.Option value="Mathematics">Mathematics</Select.Option>
              <Select.Option value="Science">Science</Select.Option>
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="History">History</Select.Option>
              <Select.Option value="Physics">Physics</Select.Option>
              <Select.Option value="Chemistry">Chemistry</Select.Option>
              <Select.Option value="Biology">Biology</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingTeacher ? "Update" : "Add"} Teacher
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeachersPage;
