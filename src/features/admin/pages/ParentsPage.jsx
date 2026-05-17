/**
 * Parents Management Page
 * Admin page for managing parents
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  message,
  Avatar,
  Card,
  Row,
  Col,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/admin.service";

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers({ role: "parent" });
      const parentUsers = (response.data || []).map((user) => ({
        _id: user._id,
        userId: user,
        children: [],
      }));
      setParents(parentUsers);
    } catch (error) {
      message.error(error.message || "Error fetching parents");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Parent",
      dataIndex: "userId",
      key: "parent",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-purple-100 text-purple-600"
          />
          <div>
            <div className="font-medium">{user?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">{user?.email || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "userId",
      key: "phone",
      render: (user) => user?.phone || "N/A",
    },
    {
      title: "Children",
      dataIndex: "children",
      key: "children",
      render: (children) => (
        <div className="flex flex-wrap gap-1">
          {children && children.length > 0 ? (
            children.map((child, index) => (
              <Tag key={index} color="blue">
                {child?.userId?.name || "Unknown"}
              </Tag>
            ))
          ) : (
            <Tag color="default">No children linked</Tag>
          )}
        </div>
      ),
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Parent">
            <Button
              type="primary"
              size="small"
              ghost
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this parent?"
            description="This will also delete the user account."
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No">
            <Tooltip title="Delete Parent">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingParent(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingParent(record);
    form.setFieldsValue({
      name: record.userId?.name,
      email: record.userId?.email,
      phone: record.userId?.phone,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingParent) {
        // Update existing parent user
        await updateUser(editingParent.userId._id, {
          name: values.name,
          email: values.email,
          phone: values.phone,
        });
        message.success("Parent updated successfully");
      } else {
        // Create new parent user (Parent profile auto-created in backend)
        await createUser({
          name: values.name,
          email: values.email,
          password: values.password || "parent123",
          phone: values.phone,
          role: "parent",
        });
        message.success("Parent created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error saving parent");
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteUser(record.userId._id);
      message.success("Parent deleted successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error deleting parent");
    }
  };

  // Stats
  const totalParents = parents.length;
  const parentsWithChildren = parents.filter(
    (p) => p.children && p.children.length > 0,
  ).length;
  const parentsWithoutChildren = totalParents - parentsWithChildren;

  return (
    <div>
      <PageHeader
        title="Parents Management"
        subtitle="Manage parent accounts and view their linked children"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Parents" },
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
              Add Parent
            </Button>
          </Space>
        }
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={8}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalParents}</div>
                <div className="text-xs text-gray-500">Total Parents</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <LinkOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parentsWithChildren}</div>
                <div className="text-xs text-gray-500">With Children</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={8}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DisconnectOutlined className="text-yellow-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {parentsWithoutChildren}
                </div>
                <div className="text-xs text-gray-500">No Children</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Parents Table */}
      <Card>
        <DataTable
          columns={columns}
          data={parents}
          loading={loading}
          showSearch
          searchPlaceholder="Search parents..."
          rowKey={(record) => record._id}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingParent ? "Edit Parent" : "Add New Parent"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={500}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter parent name" }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}>
            <Input
              placeholder="parent@example.com"
              disabled={!!editingParent}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          {!editingParent && (
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="Default: parent123" />
            </Form.Item>
          )}

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingParent ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParentsPage;
