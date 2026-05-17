import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { Plus, Search } from "lucide-react";

import { PageHeader, EmptyState, LoadingScreen } from "../../../components/UI";
import {
  AssignmentCard,
  CreateAssignmentModal,
} from "../../../components/Assignment";

import * as assignmentService from "../../../services/assignment.service";
import * as classService from "../../../services/class.service";
import * as subjectService from "../../../services/subject.service";
import * as adminService from "../../../services/admin.service";

const AdminAssignmentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    class: "",
    subject: "",
    teacher: "",
    search: "",
  });

  const teacherOptions = useMemo(() => {
    return (teachers || [])
      .filter((t) => t?.userId?._id)
      .map((t) => ({
        teacherProfileId: t._id,
        userId: t.userId?._id,
        name: t.userId?.name || "Teacher",
        email: t.userId?.email,
      }));
  }, [teachers]);

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchInitial = async () => {
    setLoading(true);
    try {
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        classService.getAllClasses(),
        subjectService.getAllSubjects(),
        adminService.getAllTeachers(),
      ]);

      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
      setTeachers(teachersRes.data || []);

      await fetchAssignments();
    } catch (err) {
      message.error(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await assignmentService.getAdminAssignments(filters);
      setAssignments(res.data || []);
    } catch (err) {
      message.error(err.message || "Failed to load assignments");
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await assignmentService.adminCreateAssignment(assignmentData);
      message.success("Assignment created successfully!");
      setIsModalOpen(false);
      fetchAssignments();
    } catch (err) {
      message.error(err.message || "Failed to create assignment");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Assignments"
        description="Create and manage assignments across the school"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg">
            <Plus size={20} />
            Create Assignment
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search assignments..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={filters.class}
            onChange={(e) => handleFilterChange("class", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={filters.teacher}
            onChange={(e) => handleFilterChange("teacher", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Teachers</option>
            {teacherOptions.map((t) => (
              <option key={t.userId} value={t.userId}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Create an assignment to get started"
          action={{
            label: "Create Assignment",
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => (
            <AssignmentCard
              key={a._id}
              assignment={a}
              onClick={() => {}}
              viewMode="teacher"
            />
          ))}
        </div>
      )}

      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAssignment}
        classes={classes}
        subjects={subjects}
        teachers={teacherOptions}
        isAdmin
      />
    </div>
  );
};

export default AdminAssignmentsPage;
