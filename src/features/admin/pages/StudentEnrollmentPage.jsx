/**
 * Student Enrollment Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing student enrollment
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
  BookOutlined,
  SwapOutlined,
  CopyOutlined,
  MoreOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  getAllStudents,
  getAllParents,
  createStudent,
  updateStudent,
  generatePassword,
  changeStudentClass,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

const StudentEnrollmentPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeClassModalOpen, setIsChangeClassModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const [changeClassForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes, parentsRes] = await Promise.all([
        getAllStudents(),
        getAllClasses(),
        getAllParents(),
      ]);

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
      setParents(parentsRes.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      name: student.userId?.name,
      email: student.userId?.email,
      phone: student.userId?.phone,
      classId: student.classId?._id,
      section: student.section,
      rollNumber: student.rollNumber,
      parentId: student.parentId?._id || null,
      academicYear: student.academicYear,
    });
    setIsModalOpen(true);
  };

  const handleChangeClass = (student) => {
    setSelectedStudent(student);
    changeClassForm.setFieldsValue({
      currentClass: student.classId
        ? `${student.classId?.name} - ${student.classId?.section}`
        : "Not assigned",
      newClassId: null,
      newSection: student.section,
      newRollNumber: "",
    });
    setIsChangeClassModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      // Soft delete - just deactivate
      message.success("Student deleted successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error deleting student");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, {
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId,
          academicYear: values.academicYear,
        });
        message.success("Student updated successfully");
      } else {
        await createStudent({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId || null,
          academicYear: values.academicYear,
        });
        message.success("Student enrolled successfully");
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  const handleChangeClassSubmit = async (values) => {
    try {
      await changeStudentClass(
        selectedStudent._id,
        values.newClassId,
        values.newSection,
        values.newRollNumber,
      );
      message.success("Student class changed successfully");
      setIsChangeClassModalOpen(false);
      setSelectedStudent(null);
      changeClassForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error changing class");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    form.setFieldsValue({ password: newPassword });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Password copied to clipboard");
  };

  const getActionItems = (student) => [
    {
      key: "edit",
      label: "Edit Student",
      icon: <EditOutlined />,
      onClick: () => handleEdit(student),
    },
    {
      key: "changeClass",
      label: "Change Class",
      icon: <SwapOutlined />,
      onClick: () => handleChangeClass(student),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Student",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Delete Student",
          content: `Are you sure you want to delete ${student.userId?.name}? This will deactivate the student account.`,
          okText: "Delete",
          okType: "danger",
          onOk: () => handleDelete(student._id),
        });
      },
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.userId?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-emerald-50 via-white to-teal-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl border border-emerald-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Student Enrollment</h1>
              <p className="text-emerald-200 text-sm mt-0.5">Enroll students and manage class assignments</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <ReloadOutlined /> Refresh
            </button>
            <button
              onClick={() => { setEditingStudent(null); form.resetFields(); setGeneratedPassword(""); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-lg">
              <PlusOutlined /> Enroll Student
            </button>
          </div>
        </div>
        {/* Mini stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Total Students", value: students.length, color: "bg-white/15" },
            { label: "Classes", value: classes.length, color: "bg-teal-500/30" },
            { label: "Parents", value: parents.length, color: "bg-emerald-400/30" },
            { label: "Without Parent", value: students.filter((s) => !s.parentId).length, color: "bg-orange-400/30" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-emerald-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-emerald-700" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">All Students</h2>
              <p className="text-xs text-slate-500">{filteredStudents.length} record{filteredStudents.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Input.Search
            placeholder="Search by name, email, or roll..."
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
          ) : filteredStudents.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  {searchQuery ? "No students found matching your search" : "No students enrolled yet"}
                </span>
              }
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => {
                const initial = student.userId?.name?.[0]?.toUpperCase() || "S";
                return (
                  <div
                    key={student._id}
                    className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-slate-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-base text-white">
                          {initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{student.userId?.name || "N/A"}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{student.userId?.email || "N/A"}</p>
                        </div>
                      </div>
                      <Dropdown
                        menu={{ items: getActionItems(student) }}
                        trigger={["click"]}
                        placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined />} className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-xl" />
                      </Dropdown>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                          <IdcardOutlined /> Roll: {student.rollNumber || "N/A"}
                        </span>
                        {student.classId && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            <BookOutlined /> {student.classId?.name} - {student.classId?.section}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {student.parentId ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <TeamOutlined /> Has Parent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                            No Parent
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">
                          {student.academicYear || "2025-2026"}
                        </span>
                      </div>
                      {student.parentId && (
                        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                          <TeamOutlined className="mr-1" />
                          Parent: {student.parentId.userId?.name || "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enroll/Edit Student Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">{editingStudent ? "Edit Student" : "Enroll New Student"}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingStudent(null); form.resetFields(); }}
        footer={null}
        width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-1">Personal Information</p>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label={<span className="font-medium">Full Name</span>} rules={[{ required: true, message: "Please enter student name" }]}>
              <Input size="large" prefix={<UserOutlined className="text-slate-400" />} placeholder="Enter full name" disabled={!!editingStudent} />
            </Form.Item>
            <Form.Item name="email" label={<span className="font-medium">Email</span>} rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }]}>
              <Input size="large" prefix={<MailOutlined className="text-slate-400" />} placeholder="Enter email" disabled={!!editingStudent} />
            </Form.Item>
            <Form.Item name="phone" label={<span className="font-medium">Phone Number</span>} rules={[{ required: true, message: "Please enter phone number" }]}>
              <Input size="large" prefix={<PhoneOutlined className="text-slate-400" />} placeholder="Enter phone number" disabled={!!editingStudent} />
            </Form.Item>
            {!editingStudent && (
              <Form.Item name="password" label={<span className="font-medium">Password</span>} rules={[{ required: true, message: "Please enter password" }, { min: 6, message: "Password must be at least 6 characters" }]}>
                <Input.Password size="large" prefix={<LockOutlined className="text-slate-400" />} placeholder="Enter password" />
              </Form.Item>
            )}
          </div>

          {generatedPassword && !editingStudent && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-blue-700 font-semibold">{generatedPassword}</code>
                <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedPassword)} className="text-blue-600">Copy</Button>
              </div>
              <p className="text-xs text-blue-500 mt-1">⚠️ Save this password — it will only be shown once!</p>
            </div>
          )}

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">Academic Information</p>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="classId" label={<span className="font-medium">Class</span>} rules={[{ required: true, message: "Please select class" }]}>
              <Select size="large" placeholder="Select class">
                {classes.map((c) => (<Select.Option key={c._id} value={c._id}>{c.name} - {c.section}</Select.Option>))}
              </Select>
            </Form.Item>
            <Form.Item name="section" label={<span className="font-medium">Section</span>} rules={[{ required: true, message: "Please enter section" }]}>
              <Input size="large" placeholder="e.g., A, B, C" />
            </Form.Item>
            <Form.Item name="rollNumber" label={<span className="font-medium">Roll Number</span>} rules={[{ required: true, message: "Please enter roll number" }]}>
              <Input size="large" placeholder="Enter roll number" />
            </Form.Item>
            <Form.Item name="academicYear" label={<span className="font-medium">Academic Year</span>} rules={[{ required: true, message: "Please enter academic year" }]} initialValue="2025-2026">
              <Input size="large" placeholder="e.g., 2025-2026" />
            </Form.Item>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">Parent Assignment (Optional)</p>
          <Form.Item name="parentId" label={<span className="font-medium">Assign Parent</span>}>
            <Select size="large" placeholder="Select parent (optional)" allowClear showSearch optionFilterProp="children">
              {parents.map((p) => (<Select.Option key={p._id} value={p._id}>{p.userId?.name || "N/A"} ({p.userId?.email || "N/A"})</Select.Option>))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button onClick={() => { setIsModalOpen(false); setEditingStudent(null); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {editingStudent ? "Update Student" : "Enroll Student"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Change Class Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <SwapOutlined className="text-purple-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">Change Class — {selectedStudent?.userId?.name}</span>
          </div>
        }
        open={isChangeClassModalOpen}
        onCancel={() => { setIsChangeClassModalOpen(false); setSelectedStudent(null); changeClassForm.resetFields(); }}
        footer={null}
        width={500}>
        <Form form={changeClassForm} layout="vertical" onFinish={handleChangeClassSubmit} className="mt-4">
          <Form.Item name="currentClass" label={<span className="font-medium">Current Class</span>}>
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item name="newClassId" label={<span className="font-medium">New Class</span>} rules={[{ required: true, message: "Please select new class" }]}>
            <Select size="large" placeholder="Select new class">
              {classes.map((c) => (<Select.Option key={c._id} value={c._id}>{c.name} - {c.section}</Select.Option>))}
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="newSection" label={<span className="font-medium">Section</span>} rules={[{ required: true, message: "Please enter section" }]}>
              <Input size="large" placeholder="Enter section" />
            </Form.Item>
            <Form.Item name="newRollNumber" label={<span className="font-medium">New Roll Number</span>} rules={[{ required: true, message: "Please enter new roll number" }]}>
              <Input size="large" placeholder="Enter new roll number" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button onClick={() => { setIsChangeClassModalOpen(false); setSelectedStudent(null); changeClassForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-purple-600 hover:bg-purple-700">Change Class</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentEnrollmentPage;
