import React, { useState } from "react";
import { X, Award } from "lucide-react";

const GradeSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  submission,
  assignment,
  isLoading = false,
}) => {
  const [gradeData, setGradeData] = useState({
    marksObtained: submission?.marksObtained || "",
    feedback: submission?.feedback || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGradeData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!gradeData.marksObtained && gradeData.marksObtained !== 0) {
      newErrors.marksObtained = "Marks are required";
    } else if (
      gradeData.marksObtained < 0 ||
      gradeData.marksObtained > assignment?.totalMarks
    ) {
      newErrors.marksObtained = `Marks must be between 0 and ${assignment?.totalMarks}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(gradeData);
  };

  if (!isOpen || !submission || !assignment) return null;

  const percentage = assignment.totalMarks
    ? ((gradeData.marksObtained || 0) / assignment.totalMarks) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Grade Submission
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Student: {submission.student?.name || "Unknown"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Submission Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Submitted:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <p className="font-medium text-gray-900">
                    {submission.isLate ? "Late Submission" : "On Time"}
                  </p>
                </div>
              </div>

              {submission.submissionNotes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-gray-600 text-sm">Student Notes:</span>
                  <p className="text-gray-900 mt-1">
                    {submission.submissionNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Submitted Files */}
            {submission.files && submission.files.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submitted Files
                </label>
                <div className="space-y-2">
                  {submission.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">
                        {file.fileName}
                      </span>
                      <a
                        href={file.fileUrl}
                        download
                        className="text-sm text-blue-400 hover:text-blue-700 font-medium">
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marks Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks Obtained <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="marksObtained"
                  value={gradeData.marksObtained}
                  onChange={handleChange}
                  min="0"
                  max={assignment.totalMarks}
                  placeholder={`0 - ${assignment.totalMarks}`}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold ${
                    errors.marksObtained ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-gray-400">
                    / {assignment.totalMarks}
                  </span>
                  <Award className="text-amber-500" size={20} />
                </div>
              </div>
              {errors.marksObtained && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.marksObtained}
                </p>
              )}

              {/* Percentage Display */}
              {gradeData.marksObtained !== "" && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 80
                          ? "bg-green-500"
                          : percentage >= 60
                            ? "bg-blue-500"
                            : percentage >= 40
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 min-w-15">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                name="feedback"
                value={gradeData.feedback}
                onChange={handleChange}
                rows="4"
                placeholder="Provide feedback to the student..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              {isLoading ? "Submitting..." : "Submit Grade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;
