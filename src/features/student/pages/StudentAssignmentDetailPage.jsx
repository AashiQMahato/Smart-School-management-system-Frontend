import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { ArrowLeft, Download } from "lucide-react";

import { PageHeader, LoadingScreen, EmptyState } from "../../../components/UI";
import { FileUploader } from "../../../components/UI";
import * as assignmentService from "../../../services/assignment.service";

const StudentAssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignment, setAssignment] = useState(null);

  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");

  const mySubmission = assignment?.mySubmission || null;

  const canEditSubmission = useMemo(() => {
    if (!assignment) return false;
    if (!mySubmission) return true;
    if (mySubmission.status === "graded") return false;
    const now = new Date();
    return now <= new Date(assignment.dueDate);
  }, [assignment, mySubmission]);

  useEffect(() => {
    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const res = await assignmentService.getStudentAssignmentById(id);
      const data = res.data || null;
      setAssignment(data);
      setNotes(data?.mySubmission?.submissionNotes || "");
    } catch (err) {
      message.error(err.message || "Failed to load assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    if (!canEditSubmission) {
      message.error("Submission can no longer be updated");
      return;
    }

    if (!mySubmission && files.length === 0) {
      message.error("Please attach at least one file");
      return;
    }

    setSaving(true);
    try {
      const uploaded = files.length
        ? await Promise.all(files.map((f) => assignmentService.uploadFile(f)))
        : [];

      const payload = {
        files: uploaded.filter((r) => r?.success && r?.data).map((r) => r.data),
        submissionNotes: notes,
      };

      if (mySubmission?._id) {
        await assignmentService.updateSubmission(mySubmission._id, payload);
        message.success("Submission updated");
      } else {
        await assignmentService.submitAssignment(id, payload);
        message.success("Assignment submitted");
      }

      setFiles([]);
      await fetchAssignment();
    } catch (err) {
      message.error(err.message || "Failed to submit assignment");
    } finally {
      setSaving(false);
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
        description={`Subject: ${assignment.subject?.name || "N/A"} • Due: ${new Date(assignment.dueDate).toLocaleString()}`}
        action={
          <button
            onClick={() => navigate("/student/assignments")}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={18} />
            Back
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="text-lg font-bold text-gray-900">My Submission</div>

        {mySubmission ? (
          <div className="text-sm text-gray-700">
            <div>
              <span className="text-gray-500">Status:</span>{" "}
              <span className="font-semibold">{mySubmission.status}</span>
              {mySubmission.isLate ? (
                <span className="ml-2 text-red-600 font-semibold">(Late)</span>
              ) : null}
            </div>
            {mySubmission.status === "graded" && (
              <div className="mt-2">
                <span className="text-gray-500">Marks:</span>{" "}
                <span className="font-bold text-gray-900">
                  {mySubmission.marksObtained} / {assignment.totalMarks}
                </span>
              </div>
            )}

            {mySubmission.files?.length > 0 && (
              <div className="mt-3 space-y-2">
                {mySubmission.files.map((f, idx) => (
                  <a
                    key={idx}
                    href={f.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                    <div className="font-medium text-gray-900">
                      {f.fileName}
                    </div>
                    <div className="text-xs text-gray-500">{f.fileType}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            You haven’t submitted yet.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            disabled={!canEditSubmission || saving}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-60"
            placeholder="Add a short note for your teacher..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload files
          </label>
          <FileUploader
            onFilesChange={setFiles}
            disabled={!canEditSubmission || saving}
          />
          <div className="text-xs text-gray-500 mt-2">
            {canEditSubmission
              ? "Upload your answer files (PDF, images, docs)."
              : "Submission editing is closed (due date passed or graded)."}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || !canEditSubmission}
            className="px-6 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60">
            {saving
              ? "Submitting..."
              : mySubmission
                ? "Update Submission"
                : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentDetailPage;
