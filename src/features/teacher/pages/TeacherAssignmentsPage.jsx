import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Award,
  Clock,
  TrendingUp,
  ChevronDown,
  Grid,
  List,
  SortAsc,
  Users,
  CheckCircle2,
  Calendar,
  BookOpen,
  BarChart3,
  X,
} from "lucide-react";
import { message } from "antd";
import { StatCard, EmptyState, LoadingScreen } from "../../../components/UI";
import {
  AssignmentCard,
  CreateAssignmentModal,
} from "../../../components/Assignment";
import * as assignmentService from "../../../services/assignment.service";
import * as classService from "../../../services/class.service";
import * as subjectService from "../../../services/subject.service";

const TeacherAssignmentsPage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    class: "",
    subject: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, classesRes, subjectsRes, analyticsRes] =
        await Promise.all([
          assignmentService.getTeacherAssignments(),
          classService.getAllClasses(),
          subjectService.getAllSubjects(),
          assignmentService.getAssignmentAnalytics(),
        ]);

      setAssignments(assignmentsRes.data || []);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (error) {
      message.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await assignmentService.getTeacherAssignments(filters);
      setAssignments(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load assignments");
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await assignmentService.createAssignment(assignmentData);
      message.success("Assignment created successfully!");
      setIsModalOpen(false);
      fetchAssignments();
      if (analytics) {
        const analyticsRes = await assignmentService.getAssignmentAnalytics();
        setAnalytics(analyticsRes.data);
      }
    } catch (error) {
      message.error(error.message || "Failed to create assignment");
    }
  };

  const handleAssignmentClick = (assignment) => {
    navigate(`/teacher/assignments/${assignment._id}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      class: "",
      subject: "",
      search: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-400 via-indigo-500 to-purple-400 text-white rounded-xl">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>

        <div className="relative px-6 py-4 ">
          <div className="flex items-start justify-between mb-6">
       
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Assignment Management
              </h1>
        
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 px-6 py-3.5 bg-white text-blue-400 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl font-semibold">
              <div className="p-1 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Plus size={20} strokeWidth={2.5} />
              </div>
              Create Assignment
            </button>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {analytics.totalAssignments}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-100">
                  Total Assignments
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  {analytics.publishedAssignments} published
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {analytics.totalSubmissions}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-100">
                  Total Submissions
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  {analytics.gradedSubmissions} graded
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {analytics.pendingGrading}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-100">
                  Pending Grading
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  Awaiting review
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {analytics.averageMarksPercentage}%
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-100">
                  Average Score
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  Class performance
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search assignments by title..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-35 font-medium">
                <option value="">All Status</option>
                <option value="draft">📝 Draft</option>
                <option value="published">✅ Published</option>
                <option value="expired">⏰ Expired</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3.5 border rounded-xl font-medium transition-all ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>
                <Filter size={18} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-400 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-400"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-400"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={filters.class}
                    onChange={(e) =>
                      handleFilterChange("class", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) =>
                      handleFilterChange("subject", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        handleFilterChange("dateFrom", e.target.value)
                      }
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        handleFilterChange("dateTo", e.target.value)
                      }
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                    <X size={16} />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignments Grid/List */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
            <EmptyState
              title="No assignments found"
              description={
                activeFiltersCount > 0
                  ? "Try adjusting your filters or create a new assignment"
                  : "Create your first assignment to get started"
              }
              action={{
                label:
                  activeFiltersCount > 0
                    ? "Clear Filters"
                    : "Create Assignment",
                onClick:
                  activeFiltersCount > 0
                    ? clearFilters
                    : () => setIsModalOpen(true),
              }}
            />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {assignments.length}
                </span>{" "}
                assignment{assignments.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="transform transition-all duration-300 hover:-translate-y-1">
                    <AssignmentCard
                      assignment={assignment}
                      onClick={() => handleAssignmentClick(assignment)}
                      viewMode="teacher"
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    onClick={() => handleAssignmentClick(assignment)}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-400 transition-colors truncate">
                            {assignment.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              assignment.status === "published"
                                ? "bg-green-100 text-green-700"
                                : assignment.status === "draft"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}>
                            {assignment.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={16} className="text-blue-500" />
                            <span>{assignment.subject?.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users size={16} className="text-green-500" />
                            <span>
                              {assignment.class
                                ? `${assignment.class.name} - ${assignment.class.section}`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-purple-500" />
                            <span>
                              Due:{" "}
                              {new Date(
                                assignment.dueDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Award size={16} className="text-amber-500" />
                            <span>{assignment.totalMarks} pts</span>
                          </div>
                        </div>

                        {assignment.submissionStats && (
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2
                                size={16}
                                className="text-blue-500"
                              />
                              <span className="font-medium text-gray-700">
                                {assignment.submissionStats.total} submissions
                              </span>
                            </div>
                            {assignment.submissionStats.pending > 0 && (
                              <div className="flex items-center gap-1.5 text-amber-600">
                                <Clock size={16} />
                                <span className="font-medium">
                                  {assignment.submissionStats.pending} to grade
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`text-sm font-semibold ${
                            new Date(assignment.dueDate) < new Date()
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}>
                          {new Date(assignment.dueDate) < new Date()
                            ? "Overdue"
                            : "Active"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAssignment}
        classes={classes}
        subjects={subjects}
      />
    </div>
  );
};

export default TeacherAssignmentsPage;
