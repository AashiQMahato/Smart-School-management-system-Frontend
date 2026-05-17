/**
 * Parent Child Mapping Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for linking parents to students
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Select,
  message,
  Dropdown,
  Empty,
  Input,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  ReloadOutlined,
  TeamOutlined,
  LinkOutlined,
  DisconnectOutlined,
  MailOutlined,
  PhoneOutlined,
  MoreOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  getAllParents,
  getAllStudents,
  linkChildToParent,
  unlinkChildFromParent,
} from "../../../services/admin.service";

const ParentChildMappingPage = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isQuickAssignModalOpen, setIsQuickAssignModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const [quickAssignForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parentsRes, studentsRes] = await Promise.all([
        getAllParents(),
        getAllStudents(),
      ]);

      setParents(parentsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLinkModal = (parent) => {
    setSelectedParent(parent);
    form.resetFields();
    setIsLinkModalOpen(true);
  };

  const handleViewDetails = (parent) => {
    Modal.info({
      title: `Children of ${parent.userId?.name}`,
      width: 600,
      content: (
        <div className="mt-4">
          {parent.children && parent.children.length > 0 ? (
            <List
              dataSource={parent.children}
              renderItem={(child) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      key="unlink"
                      title="Unlink this child?"
                      onConfirm={() =>
                        handleUnlinkChild(parent._id, child._id)
                      }>
                      <Button size="small" danger icon={<DisconnectOutlined />}>
                        Unlink
                      </Button>
                    </Popconfirm>,
                  ]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-green-100"
                      />
                    }
                    title={child?.userId?.name || "Unknown"}
                    description={
                      <div>
                        <div>
                          Class: {child?.classId?.name || "N/A"} -{" "}
                          {child?.section}
                        </div>
                        <div>Roll: {child?.rollNumber}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No children linked to this parent" />
          )}
        </div>
      ),
    });
  };

  const handleLinkChild = async (values) => {
    try {
      setAssignLoading(true);
      const studentIds = Array.isArray(values.studentIds)
        ? values.studentIds
        : [values.studentIds];

      // Link multiple students to parent
      for (const studentId of studentIds) {
        await linkChildToParent(selectedParent._id, studentId);
      }

      message.success(
        `${studentIds.length} student(s) linked to parent successfully`,
      );
      setIsLinkModalOpen(false);
      setSelectedParent(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error linking child");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleQuickAssign = (student) => {
    setSelectedStudent(student);
    quickAssignForm.resetFields();
    setIsQuickAssignModalOpen(true);
  };

  const handleQuickAssignSubmit = async (values) => {
    try {
      setAssignLoading(true);
      await linkChildToParent(values.parentId, selectedStudent._id);
      message.success("Student assigned to parent successfully");
      setIsQuickAssignModalOpen(false);
      setSelectedStudent(null);
      quickAssignForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error assigning student");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnlinkChild = async (parentId, studentId) => {
    try {
      await unlinkChildFromParent(parentId, studentId);
      message.success("Child unlinked from parent successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error unlinking child");
    }
  };

  // Stats
  const parentsWithChildren = parents.filter(
    (p) => p.children && p.children.length > 0,
  ).length;
  const parentsWithoutChildren = parents.length - parentsWithChildren;
  const studentsWithParent = students.filter((s) => s.parentId).length;
  const studentsWithoutParent = students.length - studentsWithParent;

  const getActionItems = (parent) => [
    {
      key: "assign",
      label: "Assign Children",
      icon: <PlusOutlined />,
      onClick: () => handleOpenLinkModal(parent),
    },
    {
      key: "view",
      label: "View Children",
      icon: <TeamOutlined />,
      onClick: () => handleViewDetails(parent),
    },
  ];

  const filteredParents = parents.filter(
    (parent) =>
      parent.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl border border-purple-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <LinkOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Parent-Child Mapping
              </h1>
              <p className="text-purple-200 text-sm mt-0.5">
                Link parents to their children for attendance and academic
                tracking
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm w-fit">
            <ReloadOutlined /> Refresh
          </button>
        </div>
        {/* Mini stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              label: "Total Parents",
              value: parents.length,
              color: "bg-white/15",
            },
            {
              label: "With Children",
              value: parentsWithChildren,
              color: "bg-emerald-500/30",
            },
            {
              label: "Without Children",
              value: parentsWithoutChildren,
              color: "bg-orange-500/30",
            },
            {
              label: "Students No Parent",
              value: studentsWithoutParent,
              color: "bg-red-500/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.color} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-purple-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-purple-700" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm">All Parents</h2>
          </div>
          <Input.Search
            placeholder="Search parents by name or email..."
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
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-full mt-3" />
                </div>
              ))}
            </div>
          ) : filteredParents.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-500">
                  {searchQuery
                    ? "No parents found matching your search"
                    : "No parents registered yet"}
                </span>
              }
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredParents.map((parent) => {
                const initial = parent.userId?.name?.[0]?.toUpperCase() || "P";
                return (
                  <div
                    key={parent._id}
                    className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-slate-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-base text-white">
                          {initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {parent.userId?.name || "N/A"}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {parent.userId?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                      <Dropdown
                        menu={{ items: getActionItems(parent) }}
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
                        <span>{parent.userId?.phone || "N/A"}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-400 mb-1.5">
                          Children:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {parent.children && parent.children.length > 0 ? (
                            parent.children.map((child, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                <UserOutlined className="text-[10px]" />{" "}
                                {child?.userId?.name || "Unknown"}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                              No children assigned
                            </span>
                          )}
                        </div>
                      </div>
                      {parent.children && parent.children.length > 0 && (
                        <div className="text-xs text-slate-400">
                          <TeamOutlined className="mr-1" />
                          {parent.children.length} child
                          {parent.children.length !== 1 ? "ren" : ""}
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

      {/* Students Without Parent Section */}
      {studentsWithoutParent > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-orange-100 bg-orange-50 flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-orange-600" />
            </div>
            <div>
              <h2 className="font-bold text-orange-900 text-sm">
                Students Without Parent ({studentsWithoutParent})
              </h2>
              <p className="text-xs text-orange-500">
                These students need a parent assigned
              </p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students
              .filter((s) => !s.parentId)
              .map((student) => {
                const initial = student.userId?.name?.[0]?.toUpperCase() || "S";
                return (
                  <div
                    key={student._id}
                    className="bg-orange-50 rounded-2xl p-4 border border-orange-100 hover:border-orange-300 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-sm">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {student.userId?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {student.userId?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <BookOutlined className="text-[10px]" />{" "}
                        {student.classId?.name || "No Class"}
                      </span>
                      {student.section && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          {student.section}
                        </span>
                      )}
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      block
                      icon={<LinkOutlined />}
                      onClick={() => handleQuickAssign(student)}
                      className="bg-orange-600 hover:bg-orange-700 border-orange-600">
                      Assign Parent
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Assign Children Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Assign Students to Parent
            </span>
          </div>
        }
        open={isLinkModalOpen}
        onCancel={() => {
          setIsLinkModalOpen(false);
          setSelectedParent(null);
          form.resetFields();
        }}
        footer={null}
        width={600}>
        <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-white text-base">
              {selectedParent?.userId?.name?.[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <div className="font-bold text-base text-slate-900">
                {selectedParent?.userId?.name}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MailOutlined />
                {selectedParent?.userId?.email}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <PhoneOutlined />
                {selectedParent?.userId?.phone || "N/A"}
              </div>
            </div>
          </div>
          {selectedParent?.children?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="text-xs text-gray-600 mb-1">
                Current Children:
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedParent.children.map((child, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {child?.userId?.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">Select Students to Assign</p>

        <Form form={form} layout="vertical" onFinish={handleLinkChild}>
          <Form.Item
            name="studentIds"
            label={<span className="font-medium">Students (Multi-select)</span>}
            rules={[
              { required: true, message: "Please select at least one student" },
            ]}
            extra="You can select multiple students to assign at once">
            <Select
              mode="multiple"
              size="large"
              placeholder="Search and select students..."
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              maxTagCount="responsive"
              options={students
                .filter(
                  (s) =>
                    !selectedParent?.children?.find((c) => c._id === s._id),
                )
                .map((student) => {
                  const name = student.userId?.name || "Unknown Student";
                  const className = student.classId?.name || "No Class";
                  const section = student.section || "N/A";
                  const rollNumber = student.rollNumber || "N/A";
                  const hasParent = student.parentId ? " [Has Parent]" : "";

                  return {
                    label: `${name} (${className} - ${section}, Roll: ${rollNumber})${hasParent}`,
                    value: student._id,
                    disabled: false,
                  };
                })}
              className="w-full"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setSelectedParent(null);
                  form.resetFields();
                }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LinkOutlined />}
                loading={assignLoading}
                className="bg-blue-600 hover:bg-blue-700">
                Assign Children
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Quick Assign Modal (from student to parent) */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">Assign Student to Parent</span>
          </div>
        }
        open={isQuickAssignModalOpen}
        onCancel={() => {
          setIsQuickAssignModalOpen(false);
          setSelectedStudent(null);
          quickAssignForm.resetFields();
        }}
        footer={null}
        width={500}>
        {selectedStudent && (
          <>
            <div className="mb-4 p-4 bg-linear-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-black text-white text-base">
                  {selectedStudent.userId?.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900">
                    {selectedStudent.userId?.name || "Unknown Student"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {selectedStudent.classId?.name || "No Class"} -{" "}
                    {selectedStudent.section || "N/A"} | Roll:{" "}
                    {selectedStudent.rollNumber || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">
                    <MailOutlined className="mr-1" />
                    {selectedStudent.userId?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-2">Select Parent</p>

            <Form
              form={quickAssignForm}
              layout="vertical"
              onFinish={handleQuickAssignSubmit}>
              <Form.Item
                name="parentId"
                label={<span className="font-medium">Parent</span>}
                rules={[{ required: true, message: "Please select a parent" }]}>
                <Select
                  size="large"
                  placeholder="Search and select parent..."
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={parents.map((parent) => ({
                    label: `${parent.userId?.name} (${parent.userId?.email}) - ${parent.children?.length || 0} children`,
                    value: parent._id,
                  }))}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setIsQuickAssignModalOpen(false);
                      setSelectedStudent(null);
                      quickAssignForm.resetFields();
                    }}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<LinkOutlined />}
                    loading={assignLoading}
                    className="bg-blue-600 hover:bg-blue-700">
                    Assign to Parent
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ParentChildMappingPage;
