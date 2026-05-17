/**
 * ChildSchedulePage - Parent's View of Child's Schedule
 * Modern, responsive schedule display for parents to view their children's timetables
 * Updated to match Admin and Student schedule design patterns
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  RefreshCw,
  Users,
  ChevronDown,
} from "lucide-react";
import { ScheduleView } from "../../../components/Schedule";
import scheduleService from "../../../services/schedule.service";
import { useAuth } from "../../../hooks/useAuth";
import { getMyChildren } from "../../../services/parent.service";
import { useSearchParams } from "react-router-dom";

// Stat Card Component - Modern design
const StatCard = ({ icon: Icon, label, value, color, subtext }) => {
  const colorClasses = {
    indigo: {
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    emerald: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    violet: {
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    amber: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    blue: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-400",
    },
    rose: {
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Child Selector Component - Enhanced modern design
const ChildSelector = ({ children, selectedChild, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!children || children.length === 0) {
    return null;
  }

  const selected = children.find((c) => c._id === selectedChild) || children[0];
  const selectedName =
    selected?.userId?.name || selected?.name || "Select Child";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all min-w-55">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-800">{selectedName}</p>
          <p className="text-xs text-slate-500">
            {selected?.classId?.name || "Class"} - Section{" "}
            {selected?.section || "-"}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {children.map((child) => {
              const isSelected = child._id === selectedChild;
              return (
                <button
                  key={child._id}
                  onClick={() => {
                    onSelect(child._id);
                    setIsOpen(false);
                  }}
                  className={`
                  w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0
                  ${isSelected ? "bg-indigo-50" : ""}
                `}>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                      isSelected
                        ? "bg-linear-to-br from-indigo-500 to-purple-600"
                        : "bg-slate-100"
                    }`}>
                    <GraduationCap
                      className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500"}`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                      {child?.userId?.name || child?.name || "Student"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {child.classId?.name || "Class"} - Section{" "}
                      {child.section || "-"}
                      {child.rollNumber && ` • Roll: ${child.rollNumber}`}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const ChildSchedulePage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
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

  const EMPTY_GROUPED = useMemo(
    () => ({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    }),
    [],
  );

  // Fetch parent's linked children
  useEffect(() => {
    const loadChildren = async () => {
      try {
        const res = await getMyChildren();
        const list = res.data || [];
        setChildren(list);

        const preselected = searchParams.get("child");
        const hasPreselected =
          preselected && list.some((c) => c._id === preselected);
        if (hasPreselected) {
          setSelectedChild(preselected);
        } else if (list.length > 0) {
          setSelectedChild(list[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch children:", err);
        setChildren([]);
        setSelectedChild(null);
      }
    };

    if (user) loadChildren();
  }, [user, searchParams]);

  // Fetch schedule for selected child
  const fetchSchedule = async () => {
    if (!selectedChild) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parent schedule endpoint returns schedules for all linked children
      const response = await scheduleService.getParentSchedules();
      const childrenSchedules = response.data?.children || [];
      const match = childrenSchedules.find(
        (c) => c?.student?._id === selectedChild,
      );

      if (match) {
        setScheduleData({
          items: match.items || [],
          groupedByDay: match.groupedByDay || EMPTY_GROUPED,
        });
      } else {
        setScheduleData({ items: [], groupedByDay: EMPTY_GROUPED });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChild) {
      fetchSchedule();
    }
  }, [selectedChild]);

  // Calculate statistics
  const stats = useMemo(() => {
    const items = scheduleData.items || [];
    const groupedByDay = scheduleData.groupedByDay || {};

    const totalClasses = items.length;
    const schoolDays = Object.values(groupedByDay).filter(
      (day) => day.length > 0,
    ).length;

    const totalHours = items.reduce((total, schedule) => {
      if (!schedule.startTime || !schedule.endTime) return total;
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const [endH, endM] = schedule.endTime.split(":").map(Number);
      const duration = (endH * 60 + endM - (startH * 60 + startM)) / 60;
      return total + duration;
    }, 0);

    const uniqueSubjects = new Set(
      items.map((item) => item.subjectId?._id).filter(Boolean),
    ).size;

    return {
      totalClasses,
      schoolDays,
      totalHours: totalHours.toFixed(1),
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

  const selectedChildData = children.find((c) => c._id === selectedChild);
  const selectedChildName =
    selectedChildData?.userId?.name || selectedChildData?.name || "";

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Child's Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your child's weekly class timetable and monitor their academic
            schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          {children.length > 0 && (
            <ChildSelector
              children={children}
              selectedChild={selectedChild}
              onSelect={setSelectedChild}
            />
          )}
          <button
            onClick={fetchSchedule}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Child Info Banner */}
      {selectedChildData && (
        <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{selectedChildName}</h2>
              <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {selectedChildData.classId?.name || "Class"} - Section{" "}
                  {selectedChildData.section || "-"}
                </span>
                {selectedChildData.rollNumber && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Roll No: {selectedChildData.rollNumber}
                  </span>
                )}
                {selectedChildData.academicYear && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {selectedChildData.academicYear}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.totalClasses}
          color="indigo"
          subtext="Classes per week"
        />
        <StatCard
          icon={Calendar}
          label="School Days"
          value={stats.schoolDays}
          color="emerald"
          subtext="Active days"
        />
        <StatCard
          icon={Clock}
          label="Hours/Week"
          value={stats.totalHours}
          color="violet"
          subtext="Total class hours"
        />
        <StatCard
          icon={GraduationCap}
          label="Subjects"
          value={stats.uniqueSubjects}
          color="amber"
          subtext="This semester"
        />
      </div>

      {/* Schedule View */}
      <ScheduleView
        groupedByDay={scheduleData.groupedByDay}
        loading={loading}
        error={error}
        onRefresh={fetchSchedule}
        onItemClick={(item) => console.log("Schedule clicked:", item)}
        showTeacher={true}
        showClass={false}
        subjects={subjects}
        teachers={teachers}
        emptyTitle={
          children.length === 0 ? "No Children Linked" : "No Schedule Available"
        }
        emptySubtitle={
          children.length === 0
            ? "Please contact the school administrator to link your child's account."
            : "The timetable for your child will appear here once it's published by the school."
        }
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        role="parent"
      />
    </div>
  );
};

export default ChildSchedulePage;
