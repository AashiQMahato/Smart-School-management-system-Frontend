import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Award, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { message } from "antd";
import {
  PageHeader,
  StatCard,
  EmptyState,
  LoadingScreen,
} from "../../../components/UI";
import { AssignmentCard } from "../../../components/Assignment";
import * as assignmentService from "../../../services/assignment.service";
import * as subjectService from "../../../services/subject.service";

const StudentAssignmentsPage = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    search: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAssignments();
    }
  }, [filters]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, subjectsRes, statsRes] = await Promise.all([
        assignmentService.getStudentAssignments(),
        subjectService.getAllSubjects(),
        assignmentService.getSubmissionStats(),
      ]);

      setAssignments(assignmentsRes.data || []);
      setSubjects(subjectsRes.data || []);
      setStats(statsRes.data || null);
    } catch (error) {
      message.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await assignmentService.getStudentAssignments(filters);
      setAssignments(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load assignments");
    }
  };

  const handleAssignmentClick = (assignment) => {
    navigate(`/student/assignments/${assignment._id}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Categorize assignments
  const pendingAssignments = assignments.filter(
    (a) => a.submissionStatus === "pending",
  );
  const submittedAssignments = assignments.filter(
    (a) => a.submissionStatus === "submitted" || a.submissionStatus === "late",
  );
  const gradedAssignments = assignments.filter(
    (a) => a.submissionStatus === "graded",
  );
  const overdueAssignments = assignments.filter(
    (a) => a.submissionStatus === "overdue",
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="My Assignments"
        description="View and submit your assignments"
      />

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Pending Grading"
            value={stats.pendingGrading}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Late Submissions"
            value={stats.lateSubmissions}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Average Score"
            value={`${stats.averagePercentage}%`}
            icon={Award}
            color="purple"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
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

          {/* Subject Filter */}
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange("subject", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overdue Assignments Alert */}
      {overdueAssignments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">
                You have {overdueAssignments.length} overdue assignment
                {overdueAssignments.length > 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-red-700">
                Please submit them as soon as possible
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Sections */}
      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="You don't have any assignments yet"
        />
      ) : (
        <div className="space-y-8">
          {/* Pending Assignments */}
          {pendingAssignments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Pending ({pendingAssignments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onClick={() => handleAssignmentClick(assignment)}
                    viewMode="student"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Overdue Assignments */}
          {overdueAssignments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Overdue ({overdueAssignments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overdueAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onClick={() => handleAssignmentClick(assignment)}
                    viewMode="student"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Submitted Assignments */}
          {submittedAssignments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Submitted ({submittedAssignments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submittedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onClick={() => handleAssignmentClick(assignment)}
                    viewMode="student"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Graded Assignments */}
          {gradedAssignments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Graded ({gradedAssignments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onClick={() => handleAssignmentClick(assignment)}
                    viewMode="student"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
