/**
 * MySchedulePage - Teacher's Schedule View
 * Modern, responsive schedule display for teachers
 */

import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Calendar, Clock, TrendingUp, RefreshCw } from "lucide-react";
import { PageHeader } from "../../../components/UI";
import { ScheduleView } from "../../../components/Schedule";
import scheduleService from "../../../services/schedule.service";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, subtext }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-400",
      ring: "ring-blue-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      ring: "ring-emerald-100",
    },
    violet: {
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      ring: "ring-violet-100",
    },
    amber: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      ring: "ring-amber-100",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-slate-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const MySchedulePage = () => {
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

  // Fetch teacher's schedule
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await scheduleService.getTeacherSchedules();
      setScheduleData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const items = scheduleData.items || [];
    const groupedByDay = scheduleData.groupedByDay || {};

    // Total classes
    const totalClasses = items.length;

    // Teaching days (days with at least one class)
    const teachingDays = Object.values(groupedByDay).filter(
      (day) => day.length > 0,
    ).length;

    // Total hours per week
    const totalHours = items.reduce((total, schedule) => {
      if (!schedule.startTime || !schedule.endTime) return total;
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const [endH, endM] = schedule.endTime.split(":").map(Number);
      const duration = (endH * 60 + endM - (startH * 60 + startM)) / 60;
      return total + duration;
    }, 0);

    // Unique subjects
    const uniqueSubjects = new Set(
      items.map((item) => item.subjectId?._id).filter(Boolean),
    ).size;

    // Unique classes
    const uniqueClasses = new Set(
      items
        .map((item) => `${item.classId?._id}-${item.section}`)
        .filter(Boolean),
    ).size;

    return {
      totalClasses,
      teachingDays,
      totalHours: totalHours.toFixed(1),
      uniqueSubjects,
      uniqueClasses,
    };
  }, [scheduleData]);

  // Get unique subjects and classes for filters
  const { subjects, classes } = useMemo(() => {
    const subjectMap = new Map();
    const classMap = new Map();

    (scheduleData.items || []).forEach((item) => {
      if (item.subjectId?._id) {
        subjectMap.set(item.subjectId._id, item.subjectId);
      }
      if (item.classId?._id) {
        classMap.set(item.classId._id, item.classId);
      }
    });

    return {
      subjects: Array.from(subjectMap.values()),
      classes: Array.from(classMap.values()),
    };
  }, [scheduleData.items]);

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Teaching Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage your weekly class schedule
          </p>
        </div>
        <button
          onClick={fetchSchedule}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.totalClasses}
          color="blue"
          subtext="This semester"
        />
        <StatCard
          icon={Calendar}
          label="Teaching Days"
          value={stats.teachingDays}
          color="emerald"
          subtext="Days per week"
        />
        <StatCard
          icon={Clock}
          label="Hours/Week"
          value={stats.totalHours}
          color="violet"
          subtext="Total teaching hours"
        />
        <StatCard
          icon={TrendingUp}
          label="Subjects"
          value={stats.uniqueSubjects}
          color="amber"
          subtext={`Across ${stats.uniqueClasses} classes`}
        />
      </div>

      {/* Schedule View */}
      <ScheduleView
        groupedByDay={scheduleData.groupedByDay}
        loading={loading}
        error={error}
        onRefresh={fetchSchedule}
        onItemClick={(item) => console.log("Schedule clicked:", item)}
        showTeacher={false}
        showClass={true}
        subjects={subjects}
        emptyTitle="No Classes Assigned"
        emptySubtitle="You don't have any scheduled classes at the moment. Please contact your administrator if you believe this is an error."
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        role="teacher"
      />
    </div>
  );
};

export default MySchedulePage;
