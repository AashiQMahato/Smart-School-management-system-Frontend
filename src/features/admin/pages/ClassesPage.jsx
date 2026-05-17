/**
 * Classes Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing school classes
 */

import React, { useState, useEffect } from "react";
import * as classService from "../../../services/class.service";
import { getAllTeachers } from "../../../services/admin.service";
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
  ReloadOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classService.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      form.setFieldsValue({
        name: classItem.name,
        section: classItem.section,
        academicYear: classItem.academicYear,
        classTeacher: classItem.classTeacher?._id || "",
      });
    } else {
      setEditingClass(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.classTeacher) delete payload.classTeacher;

    try {
      if (editingClass) {
        await classService.updateClass(editingClass._id, payload);
        message.success("Class updated successfully!");
      } else {
        await classService.createClass(payload);
        message.success("Class created successfully!");
      }
      handleCloseModal();
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
      message.error(error.message);
    }
  };

  const handleDelete = async (classId) => {
    Modal.confirm({
      title: "Delete Class",
      content: "Are you sure you want to delete this class?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await classService.deleteClass(classId);
          message.success("Class deleted successfully!");
          fetchClasses();
        } catch (error) {
          console.error("Error deleting class:", error);
          message.error(error.message);
        }
      },
    });
  };

  const getActionItems = (classItem) => [
    {
      key: "edit",
      label: "Edit Class",
      icon: <EditOutlined />,
      onClick: () => handleOpenModal(classItem),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Class",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(classItem._id),
    },
  ];

  const filteredClasses = classes.filter((cls) =>
    `${cls.name} ${cls.section} ${cls.academicYear}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-violet-50 via-white to-purple-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-violet-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-violet-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BookOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Class Management</h1>
              <p className="text-violet-200 text-sm mt-0.5">Manage school classes, sections, and class teachers</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchClasses}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <ReloadOutlined /> Refresh
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-violet-800 rounded-2xl text-sm font-bold hover:bg-violet-50 transition-all shadow-lg">
              <PlusOutlined /> Add Class
            </button>
          </div>
        </div>
        {/* Mini stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Total Classes", value: classes.length, color: "bg-white/15" },
            { label: "With Teachers", value: classes.filter((c) => c.classTeacher).length, color: "bg-blue-500/30" },
            { label: "Total Teachers", value: teachers.length, color: "bg-emerald-500/30" },
            { label: "Active Classes", value: classes.filter((c) => c.isActive).length, color: "bg-amber-500/30" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-violet-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-violet-700" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm">All Classes</h2>
          </div>
          <Input.Search
            placeholder="Search classes by name, section, or year..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredClasses.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  {searchQuery ? "No classes found matching your search" : "No classes found. Create your first class to get started."}
                </span>
              }
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-slate-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
                        <BookOutlined className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{classItem.name} - {classItem.section}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{classItem.academicYear}</p>
                      </div>
                    </div>
                    <Dropdown
                      menu={{ items: getActionItems(classItem) }}
                      trigger={["click"]}
                      placement="bottomRight">
                      <Button type="text" icon={<MoreOutlined />} className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-xl" />
                    </Dropdown>
                  </div>
                  <div className="space-y-2.5">
                    {classItem.classTeacher ? (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <UserOutlined className="text-blue-600 text-[10px]" />
                        </div>
                        <span className="font-medium">{classItem.classTeacher.userId?.name || "Not Assigned"}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                        No Class Teacher
                      </span>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {classItem.subjects?.length || 0} subjects
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Class Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-violet-700" />
            </div>
            <span className="text-lg font-bold text-slate-900">{editingClass ? "Edit Class" : "Add New Class"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label={<span className="font-medium">Class Name</span>} rules={[{ required: true, message: "Class name is required" }]}>
            <Input size="large" placeholder="e.g., Grade 10" />
          </Form.Item>
          <Form.Item name="section" label={<span className="font-medium">Section</span>} rules={[{ required: true, message: "Section is required" }]}>
            <Input size="large" placeholder="e.g., A, B, C" />
          </Form.Item>
          <Form.Item name="academicYear" label={<span className="font-medium">Academic Year</span>} rules={[{ required: true, message: "Academic year is required" }]}>
            <Input size="large" placeholder="e.g., 2024-2025" />
          </Form.Item>
          <Form.Item name="classTeacher" label={<span className="font-medium">Class Teacher (Optional)</span>}>
            <Select size="large" placeholder="Select a teacher" allowClear showSearch optionFilterProp="children">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.userId?.name || "N/A"} ({teacher.userId?.email || ""})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-violet-600 hover:bg-violet-700">
              {editingClass ? "Update" : "Create"} Class
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassesPage;
