/**
 * TeacherCalendarPage
 * Calendar view for teachers with class filtering
 * Features: View events, filter by class/type, add class-level events
 */

import { useState, useEffect, useCallback } from "react";
import { message, Select } from "antd";
import { Plus, BookOpen, FileText, Clock } from "lucide-react";
import {
  CalendarGrid,
  CalendarWeekView,
  CalendarListView,
  EventModal,
  CalendarViewToggle,
  CalendarHeader,
  EventTypeBadge,
} from "../../../components/Calendar";
import {
  getTeacherEvents,
  createTeacherEvent,
  EVENT_TYPES,
} from "../../../services/calendar.service";
import { getAllClasses } from "../../../services/class.service";

const TeacherCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };
      if (classFilter) filters.classId = classFilter;
      if (eventTypeFilter) filters.eventType = eventTypeFilter;

      const res = await getTeacherEvents(filters);
      if (res.success) setEvents(res.data);
    } catch (error) {
      message.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, [currentDate, classFilter, eventTypeFilter]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses();
        if (res.success) setClasses(res.data);
      } catch {}
    };
    loadClasses();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrev = () => {
    const d = new Date(currentDate);
    view === "week" ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    view === "week" ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleCreateEvent = async (data) => {
    try {
      setSubmitting(true);
      const res = await createTeacherEvent(data);
      if (res.success) {
        message.success("Event created successfully");
        setModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  // Highlight sections
  const upcomingExams = events
    .filter((e) => e.eventType === "exam" && new Date(e.startDate) > new Date())
    .slice(0, 3);

  const upcomingDeadlines = events
    .filter(
      (e) =>
        e.eventType === "assignment_deadline" &&
        new Date(e.startDate) > new Date(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View school events and manage class activities
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-all duration-300 active:scale-95">
          <Plus size={18} />
          Add Class Event
        </button>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <BookOpen size={16} className="text-red-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">
              Upcoming Exams
            </h3>
          </div>
          {upcomingExams.length > 0 ? (
            <div className="space-y-2">
              {upcomingExams.map((exam) => (
                <div
                  key={exam._id}
                  className="flex items-center justify-between p-2 bg-red-50/50 rounded-lg">
                  <span className="text-sm text-slate-700 font-medium">
                    {exam.title}
                  </span>
                  <span className="text-xs text-red-500">
                    {new Date(exam.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No upcoming exams</p>
          )}
        </div>

        {/* Assignment Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FileText size={16} className="text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">
              Assignment Deadlines
            </h3>
          </div>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-2">
              {upcomingDeadlines.map((dl) => (
                <div
                  key={dl._id}
                  className="flex items-center justify-between p-2 bg-orange-50/50 rounded-lg">
                  <span className="text-sm text-slate-700 font-medium">
                    {dl.title}
                  </span>
                  <span className="text-xs text-orange-500">
                    {new Date(dl.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No upcoming deadlines</p>
          )}
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={() => setCurrentDate(new Date())}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={classFilter}
            onChange={setClassFilter}
            placeholder="All Classes"
            allowClear
            className="w-36"
            options={classes.map((c) => ({
              value: c._id,
              label: `${c.name}${c.section ? ` - ${c.section}` : ""}`,
            }))}
          />
          <Select
            value={eventTypeFilter}
            onChange={setEventTypeFilter}
            placeholder="All Types"
            allowClear
            className="w-36"
            options={EVENT_TYPES.map((t) => ({
              value: t.value,
              label: `${t.icon} ${t.label}`,
            }))}
          />
          <CalendarViewToggle currentView={view} onViewChange={setView} />
        </div>
      </div>

      {/* Calendar */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        {view === "month" && (
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onEventClick={(evt) => setSelectedEvent(evt)}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            currentDate={currentDate}
            events={events}
            onEventClick={(evt) => setSelectedEvent(evt)}
          />
        )}
        {view === "list" && (
          <CalendarListView
            events={events}
            onEventClick={(evt) => setSelectedEvent(evt)}
            emptyMessage="No events found for this period"
          />
        )}
      </div>

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 border-l border-slate-200">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Event Details
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <EventTypeBadge type={selectedEvent.eventType} size="large" />
              <h4 className="text-xl font-bold text-slate-900">
                {selectedEvent.title}
              </h4>
              {selectedEvent.description && (
                <p className="text-sm text-slate-500 leading-relaxed">
                  {selectedEvent.description}
                </p>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-slate-700">
                    {new Date(selectedEvent.startDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                {selectedEvent.classId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class</span>
                    <span className="text-slate-700">
                      {selectedEvent.classId.name}{" "}
                      {selectedEvent.classId.section || ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateEvent}
        classes={classes}
        loading={submitting}
      />
    </div>
  );
};

export default TeacherCalendarPage;
