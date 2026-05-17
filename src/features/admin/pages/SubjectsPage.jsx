/**
 * Subjects Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing school subjects
 */

import React, { useState, useEffect } from "react";
import * as subjectService from "../../../services/subject.service";
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
  IdcardOutlined,
} from "@ant-design/icons";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await classService.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      message.error(error.message);
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

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);

      const resolvedClassIds = Array.isArray(subject.classIds)
        ? subject.classIds.map((c) => c?._id || c).filter(Boolean)
        : subject.classId
          ? [subject.classId?._id || subject.classId]
          : [];

      form.setFieldsValue({
        name: subject.name,
        code: subject.code,
        classIds: resolvedClassIds,
        assignedTeacher: subject.assignedTeacher?._id || "",
        academicYear: subject.academicYear,
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const payload = { ...values };
    if (!Array.isArray(payload.classIds) || payload.classIds.length === 0)
      delete payload.classIds;
    if (!payload.assignedTeacher) delete payload.assignedTeacher;

    // Backward compatibility: if older parts still send classId, strip it here
    if (payload.classId) delete payload.classId;

    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, payload);
        message.success("Subject updated successfully!");
      } else {
        await subjectService.createSubject(payload);
        message.success("Subject created successfully!");
      }
      handleCloseModal();
      fetchSubjects();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = async (subjectId) => {
    Modal.confirm({
      title: "Delete Subject",
      content: "Are you sure you want to delete this subject?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await subjectService.deleteSubject(subjectId);
          message.success("Subject deleted successfully!");
          fetchSubjects();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const getActionItems = (subject) => [
    {
      key: "edit",
      label: "Edit Subject",
      icon: <EditOutlined />,
      onClick: () => handleOpenModal(subject),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Subject",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(subject._id),
    },
  ];

  const filteredSubjects = subjects.filter((sub) =>
    `${sub.name} ${sub.code} ${sub.academicYear}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-green-50 via-white to-teal-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl border border-green-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BookOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Subject Management</h1>
              <p className="text-green-200 text-sm mt-0.5">Manage school subjects, assign teachers, and link to classes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubjects}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <ReloadOutlined /> Refresh
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-800 rounded-2xl text-sm font-bold hover:bg-green-50 transition-all shadow-lg">
              <PlusOutlined /> Add Subject
            </button>
          </div>
        </div>
        {/* Mini stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Total Subjects", value: subjects.length, color: "bg-white/15" },
            { label: "With Teachers", value: subjects.filter((s) => s.assignedTeacher).length, color: "bg-blue-500/30" },
            { label: "Total Classes", value: classes.length, color: "bg-purple-500/30" },
            { label: "Assigned to Class", value: subjects.filter((s) => { const ids = Array.isArray(s.classIds) ? s.classIds : s.classId ? [s.classId] : []; return ids.length > 0; }).length, color: "bg-amber-500/30" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-green-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-green-700" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm">All Subjects</h2>
          </div>
          <Input.Search
            placeholder="Search subjects by name, code, or year..."
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
          ) : filteredSubjects.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  {searchQuery ? "No subjects found matching your search" : "No subjects found. Create your first subject to get started."}
                </span>
              }
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((subject) => {
                const linkedClasses = Array.isArray(subject.classIds) ? subject.classIds : subject.classId ? [subject.classId] : [];
                return (
                  <div
                    key={subject._id}
                    className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-slate-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                          <BookOutlined className="text-xl text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{subject.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Code: {subject.code}</p>
                        </div>
                      </div>
                      <Dropdown
                        menu={{ items: getActionItems(subject) }}
                        trigger={["click"]}
                        placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined />} className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-xl" />
                      </Dropdown>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {linkedClasses.length === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">No Class</span>
                        ) : (
                          <>
                            {linkedClasses.slice(0, 2).map((cls) => (
                              <span key={cls?._id || cls} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                <BookOutlined className="text-[10px]" /> {cls?.name || "Class"}{cls?.section ? ` - ${cls.section}` : ""}
                              </span>
                            ))}
                            {linkedClasses.length > 2 && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                +{linkedClasses.length - 2} more
                              </span>
                            )}
                          </>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                          {subject.academicYear}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        {subject.assignedTeacher ? (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                              <UserOutlined className="text-blue-600 text-[10px]" />
                            </div>
                            <span className="font-medium">{subject.assignedTeacher.userId?.name || "N/A"}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                            No Teacher Assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Subject Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-green-700" />
            </div>
            <span className="text-lg font-bold text-slate-900">{editingSubject ? "Edit Subject" : "Add New Subject"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label={<span className="font-medium">Subject Name</span>} rules={[{ required: true, message: "Subject name is required" }]}>
              <Input size="large" placeholder="e.g., Mathematics" />
            </Form.Item>
            <Form.Item name="code" label={<span className="font-medium">Subject Code</span>} rules={[{ required: true, message: "Subject code is required" }]}>
              <Input size="large" placeholder="e.g., MATH101" />
            </Form.Item>
          </div>
          <Form.Item name="academicYear" label={<span className="font-medium">Academic Year</span>} rules={[{ required: true, message: "Academic year is required" }]}>
            <Input size="large" placeholder="e.g., 2024-2025" />
          </Form.Item>
          <Form.Item name="classIds" label={<span className="font-medium">Classes (Optional)</span>}>
            <Select size="large" mode="multiple" placeholder="Select one or more classes" allowClear showSearch optionFilterProp="children">
              {classes.map((cls) => (
                <Select.Option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section} ({cls.academicYear})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assignedTeacher" label={<span className="font-medium">Assigned Teacher (Optional)</span>}>
            <Select size="large" placeholder="Select a teacher" allowClear showSearch optionFilterProp="children">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.userId?.name || "N/A"} ({teacher.userId?.email || ""})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label={<span className="font-medium">Description (Optional)</span>}>
            <Input.TextArea rows={3} size="large" placeholder="Enter subject description" />
          </Form.Item>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-green-600 hover:bg-green-700">
              {editingSubject ? "Update" : "Create"} Subject
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
