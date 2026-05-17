import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, Download, Users, Award } from "lucide-react";

import { PageHeader, LoadingScreen, EmptyState } from "../../../components/UI";
import { GradeSubmissionModal } from "../../../components/Assignment";
import * as assignmentService from "../../../services/assignment.service";

const TeacherAssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const stats = useMemo(() => {
    const total = submissions.length;
    const graded = submissions.filter((s) => s.status === "graded").length;
    const late = submissions.filter((s) => s.isLate).length;
    return { total, graded, pending: total - graded, late };
  }, [submissions]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [assignmentRes, subsRes] = await Promise.all([
        assignmentService.getAssignmentById(id),
        assignmentService.getAssignmentSubmissions(id),
      ]);

      setAssignment(assignmentRes.data || null);
      setSubmissions(subsRes.data || []);
    } catch (err) {
      message.error(err.message || "Failed to load assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (gradeData) => {
    if (!selectedSubmission?._id) return;
    setGrading(true);
    try {
      await assignmentService.gradeSubmission(
        selectedSubmission._id,
        gradeData,
      );
      message.success("Submission graded");
      setSelectedSubmission(null);
      await fetchAll();
    } catch (err) {
      message.error(err.message || "Failed to grade submission");
    } finally {
      setGrading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!assignment) {
    return (
      <div className="p-6">
        <EmptyState
          title="Assignment not found"
          description="This assignment may have been removed."
          action={{ label: "Back", onClick: () => navigate(-1) }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={assignment.title}
        description={`Class: ${assignment.class?.name || "N/A"} - ${assignment.class?.section || ""} • Subject: ${assignment.subject?.name || "N/A"}`}
        action={
          <button
            onClick={() => navigate("/teacher/assignments")}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={18} />
            Back
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <span className="font-semibold">{assignment.totalMarks}</span>
            <span className="text-gray-500">total marks</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            <span className="font-semibold">{stats.total}</span>
            <span className="text-gray-500">submissions</span>
            {stats.pending > 0 && (
              <span className="text-amber-600 font-semibold">
                ({stats.pending} pending)
              </span>
            )}
            {stats.late > 0 && (
              <span className="text-red-600 font-semibold">
                ({stats.late} late)
              </span>
            )}
          </div>
          <div>
            <span className="text-gray-500">Due:</span>{" "}
            <span className="font-semibold">
              {new Date(assignment.dueDate).toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: assignment.description || "" }}
        />

        {assignment.attachments?.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              Attachments
            </div>
            <div className="space-y-2">
              {assignment.attachments.map((f, idx) => (
                <a
                  key={idx}
                  href={f.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {f.fileName}
                    </div>
                    <div className="text-xs text-gray-500">{f.fileType}</div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 font-medium">
                    <Download size={16} />
                    Download
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-lg font-bold text-gray-900 mb-4">Submissions</div>

        {submissions.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Students haven't submitted this assignment."
          />
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {s.student?.name || "Student"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(s.submittedAt).toLocaleString()} •{" "}
                    {s.isLate ? "Late" : "On time"} • {s.status}
                  </div>
                  {s.files?.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {s.files.length} file(s)
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {s.status === "graded" ? (
                    <div className="text-sm font-bold text-gray-900">
                      {s.marksObtained} / {assignment.totalMarks}
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-amber-600">
                      Pending
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedSubmission(s)}
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700">
                    Grade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GradeSubmissionModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onSubmit={handleGrade}
        submission={selectedSubmission}
        assignment={assignment}
        isLoading={grading}
      />
    </div>
  );
};

export default TeacherAssignmentDetailPage;
