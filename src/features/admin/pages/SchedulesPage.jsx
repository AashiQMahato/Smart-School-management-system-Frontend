/**
 * SchedulesPage - Admin Schedule Management
 * Modern, comprehensive schedule management for administrators
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  BookOpen,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { ScheduleFormModal } from "../../../components/Timetable";
import { ScheduleView } from "../../../components/Schedule";
import scheduleService from "../../../services/schedule.service";
import { getAllClasses } from "../../../services/class.service";

const SchedulesPage = () => {
  const [scheduleData, setScheduleData] = useState({
    items: [],
    groupedByDay: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [conflictError, setConflictError] = useState(null);
  const [conflictDetails, setConflictDetails] = useState(null);

  const [filters, setFilters] = useState({
    classId: "",
    section: "",
    academicYear: "",
    dayOfWeek: "",
  });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses();
        setClasses(res.data || []);
      } catch {
        setClasses([]);
      }
    };
    loadClasses();
  }, []);

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v != null),
      );
      const response = await scheduleService.getAdminSchedules(cleanedFilters);
      setScheduleData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [
    filters.classId,
    filters.section,
    filters.academicYear,
    filters.dayOfWeek,
  ]);

  // Handle create/update schedule
  const handleSubmitSchedule = async (formData) => {
    try {
      setConflictError(null);
      setConflictDetails(null);

      if (editingSchedule) {
        // Update existing schedule
        await scheduleService.updateSchedule(editingSchedule._id, formData);
        setSuccessMessage("Schedule updated successfully!");
      } else {
        // Create new schedule
        await scheduleService.createSchedule(formData);
        setSuccessMessage("Schedule created successfully!");
      }

      setIsModalOpen(false);
      setEditingSchedule(null);
      fetchSchedules();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const isConflict =
        err?.status === 409 ||
        Boolean(err?.conflicts?.length) ||
        String(err?.message || "")
          .toLowerCase()
          .includes("conflict");

      if (isConflict) {
        setConflictError("Time conflict: This slot is already assigned");
        setConflictDetails({
          message: err.message,
          conflicts: err.conflicts || [],
        });
        return;
      }

      setError(err.message || "Failed to save schedule");
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      await scheduleService.deleteSchedule(scheduleId);
      setSuccessMessage("Schedule deleted successfully!");
      fetchSchedules();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete schedule");
    }
  };

  // Handle schedule card click
  const handleScheduleClick = (schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  // Handle add new schedule
  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const items = scheduleData.items || [];
    const groupedByDay = scheduleData.groupedByDay || {};

    // Total schedules
    const totalSchedules = items.length;

    // Active days
    const activeDays = Object.values(groupedByDay).filter(
      (day) => day.length > 0,
    ).length;

    // Unique teachers
    const uniqueTeachers = new Set(
      items.map((item) => item.teacherId?._id).filter(Boolean),
    ).size;

    // Unique subjects
    const uniqueSubjects = new Set(
      items.map((item) => item.subjectId?._id).filter(Boolean),
    ).size;

    return {
      totalSchedules,
      activeDays,
      uniqueTeachers,
      uniqueSubjects,
    };
  }, [scheduleData]);

  // Get unique subjects and teachers for filters
  const { subjects, teachers } = useMemo(() => {
    const subjectMap = new Map();
    const teacherMap = new Map();

    (scheduleData.items || []).forEach((item) => {
      if (item.subjectId?._id) {
        subjectMap.set(item.subjectId._id, item.subjectId);
      }
      if (item.teacherId?._id) {
        teacherMap.set(item.teacherId._id, item.teacherId);
      }
    });

    return {
      subjects: Array.from(subjectMap.values()),
      teachers: Array.from(teacherMap.values()),
    };
  }, [scheduleData.items]);

  return (
    <div className="space-y-6 p-1">
      {/* Gradient Header */}
      <div className="bg-[var(--ssd-hero)] rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Manage Schedules
              </h1>
              <p className="text-indigo-200 text-sm mt-0.5">
                Create and manage class timetables for the school
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSchedules}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-800 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-lg">
              <Plus className="w-4 h-4" />
              Add Schedule
            </button>
          </div>
        </div>
        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            {
              icon: Calendar,
              label: "Total Schedules",
              value: stats.totalSchedules,
            },
            { icon: Clock, label: "Active Days", value: stats.activeDays },
            { icon: Users, label: "Teachers", value: stats.uniqueTeachers },
            { icon: BookOpen, label: "Subjects", value: stats.uniqueSubjects },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/15 rounded-2xl p-3 text-center border border-white/10">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-indigo-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">
            Quick Filters
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Class
            </label>
            <select
              value={filters.classId}
              onChange={(e) =>
                setFilters((p) => ({ ...p, classId: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {c.section} ({c.academicYear})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Section
            </label>
            <input
              value={filters.section}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  section: e.target.value.toUpperCase(),
                }))
              }
              placeholder="A, B, C..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Academic Year
            </label>
            <input
              value={filters.academicYear}
              onChange={(e) =>
                setFilters((p) => ({ ...p, academicYear: e.target.value }))
              }
              placeholder="2025-2026"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Day
            </label>
            <select
              value={filters.dayOfWeek}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dayOfWeek: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white">
              <option value="">All days</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">
              {scheduleData?.items?.length || 0}
            </span>{" "}
            schedules found
          </div>
          <button
            type="button"
            onClick={() =>
              setFilters({
                classId: "",
                section: "",
                academicYear: "",
                dayOfWeek: "",
              })
            }
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="flex-1">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {conflictError && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div className="flex-1">
            <span className="font-semibold">Scheduling Conflict: </span>
            <span>{conflictError}</span>
          </div>
          <button
            onClick={() => setConflictError(null)}
            className="p-1 hover:bg-amber-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Schedule View */}
      <ScheduleView
        groupedByDay={scheduleData.groupedByDay}
        loading={loading}
        error={null}
        onRefresh={fetchSchedules}
        onItemClick={handleScheduleClick}
        showTeacher={true}
        showClass={true}
        subjects={subjects}
        teachers={teachers}
        emptyTitle="No schedules found"
        emptySubtitle="Adjust your filters or add a new schedule to get started."
        showFilters={false}
        showSearch={true}
        showViewToggle={true}
        role="admin"
      />

      {/* Schedule Form Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchedule(null);
          setConflictError(null);
          setConflictDetails(null);
        }}
        onSubmit={handleSubmitSchedule}
        existingSchedules={scheduleData.items || []}
        editingScheduleId={editingSchedule?._id || null}
        serverConflict={conflictDetails}
        initialData={
          editingSchedule
            ? {
                classId: editingSchedule.classId?._id || "",
                section: editingSchedule.section || "",
                subjectId: editingSchedule.subjectId?._id || "",
                teacherId: editingSchedule.teacherId?._id || "",
                room: editingSchedule.room || "",
                dayOfWeek: editingSchedule.dayOfWeek || "Monday",
                startTime: editingSchedule.startTime || "",
                endTime: editingSchedule.endTime || "",
                academicYear: editingSchedule.academicYear || "",
              }
            : null
        }
        title={editingSchedule ? "Edit Schedule" : "Add New Schedule"}
      />

      {/* Floating Delete Button (when editing) */}
      {editingSchedule && isModalOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => handleDeleteSchedule(editingSchedule._id)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl">
            <Trash2 className="w-5 h-5" />
            Delete Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
