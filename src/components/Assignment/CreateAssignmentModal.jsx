import React, { useState } from "react";
import { X } from "lucide-react";
import { FileUploader } from "../UI";
import { uploadFile } from "../../services/assignment.service";

const CreateAssignmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  classes = [],
  subjects = [],
  teachers = [],
  isAdmin = false,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      subject: "",
      class: "",
      teacher: "",
      totalMarks: "",
      dueDate: "",
      attachments: [],
      status: "draft",
    },
  );

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.class) {
      newErrors.class = "Class is required";
    }

    if (isAdmin && !formData.teacher) {
      newErrors.teacher = "Teacher is required";
    }

    if (!formData.totalMarks || formData.totalMarks < 1) {
      newErrors.totalMarks = "Total marks must be at least 1";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validate()) return;

    let attachments = [];
    if (uploadedFiles.length > 0) {
      const uploaded = await Promise.all(
        uploadedFiles.map((file) => uploadFile(file)),
      );
      attachments = uploaded
        .filter((r) => r?.success && r?.data)
        .map((r) => r.data);
    }

    const submissionData = {
      ...formData,
      status,
      attachments,
    };

    await onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? "Edit Assignment" : "Create New Assignment"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mathematics Chapter 5 Exercise"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
               <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter assignment description, instructions, and requirements..."
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Subject and Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.class ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p className="text-red-500 text-sm mt-1">{errors.class}</p>
                )}
              </div>
            </div>

            {/* Teacher (Admin only) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.teacher ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.userId} value={t.userId}>
                      {t.name}
                      {t.email ? ` (${t.email})` : ""}
                    </option>
                  ))}
                </select>
                {errors.teacher && (
                  <p className="text-red-500 text-sm mt-1">{errors.teacher}</p>
                )}
              </div>
            )}

            {/* Total Marks and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 100"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.totalMarks ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.totalMarks && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.totalMarks}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <FileUploader
                onFilesChange={handleFilesChange}
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50">
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isLoading ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
