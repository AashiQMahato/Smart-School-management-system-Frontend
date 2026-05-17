/**
 * TimetablePage - Student's Schedule View
 * Modern, responsive timetable display for students
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { ScheduleView } from "../../../components/Schedule";
import scheduleService from "../../../services/schedule.service";
import { useAuth } from "../../../hooks/useAuth";

// Stat Card Component
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

const TimetablePage = () => {
  const { user } = useAuth();
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

  // Fetch student's class schedule
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await scheduleService.getStudentSchedules();
      setScheduleData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchedule();
    }
  }, [user]);

  // Calculate statistics
  const stats = useMemo(() => {
    const items = scheduleData.items || [];
    const groupedByDay = scheduleData.groupedByDay || {};

    // Total classes per week
    const totalClasses = items.length;

    // School days
    const schoolDays = Object.values(groupedByDay).filter(
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

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Timetable</h1>
          <p className="text-sm text-slate-500 mt-1">
            View your weekly class schedule and upcoming classes
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.totalClasses}
          color="indigo"
          subtext="Per week"
        />
        <StatCard
          icon={Calendar}
          label="School Days"
          value={stats.schoolDays}
          color="emerald"
          subtext="Days per week"
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
        emptyTitle="No Timetable Published"
        emptySubtitle="Your class schedule will appear here once the admin publishes it."
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        role="student"
      />
    </div>
  );
};

export default TimetablePage;
