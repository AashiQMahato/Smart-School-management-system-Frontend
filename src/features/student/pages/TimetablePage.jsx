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

import { Button } from "antd";
import { PageHeader, StatCard } from "../../../components/UI";

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
      <PageHeader
        title="My Timetable"
        subtitle="View your weekly class schedule and upcoming classes"
        actions={
          <Button
            type="primary"
            onClick={fetchSchedule}
            disabled={loading}
            icon={
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            }
          >
            Refresh
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          title="Total Classes"
          value={stats.totalClasses}
          tone="indigo"
          hint="Per week"
        />
        <StatCard
          icon={Calendar}
          title="School Days"
          value={stats.schoolDays}
          tone="emerald"
          hint="Days per week"
        />
        <StatCard
          icon={Clock}
          title="Hours/Week"
          value={stats.totalHours}
          tone="violet"
          hint="Total class hours"
        />
        <StatCard
          icon={GraduationCap}
          title="Subjects"
          value={stats.uniqueSubjects}
          tone="amber"
          hint="This semester"
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
