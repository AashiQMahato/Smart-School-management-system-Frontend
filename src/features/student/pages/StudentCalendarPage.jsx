/**
 * StudentCalendarPage
 * Motivational calendar view for students
 * Features: Exam countdown, holidays, assignment deadlines, clean summary
 */

import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  Clock,
  BookOpen,
  PartyPopper,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  CalendarGrid,
  CalendarWeekView,
  CalendarListView,
  CalendarViewToggle,
  CalendarHeader,
  EventTypeBadge,
} from "../../../components/Calendar";
import {
  getStudentEvents,
  EVENT_TYPES,
  getEventTypeConfig,
} from "../../../services/calendar.service";

const StudentCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };
      const res = await getStudentEvents(filters);
      if (res.success) setEvents(res.data);
    } catch {
      message.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

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

  // Smart feature data
  const now = new Date();

  const nextExam = events
    .filter((e) => e.eventType === "exam" && new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const nextAssignment = events
    .filter(
      (e) =>
        e.eventType === "assignment_deadline" && new Date(e.startDate) > now,
    )
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const nextHoliday = events
    .filter((e) => e.eventType === "holiday" && new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  const getDaysUntil = (dateStr) => {
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Calendar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stay on top of your exams, assignments, and school events
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Next Exam Countdown */}
        <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200/50 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/20 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <BookOpen size={18} className="text-red-500" />
            </div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              Next Exam
            </span>
          </div>
          {nextExam ? (
            <>
              <h4 className="text-sm font-bold text-slate-800 mb-1 truncate">
                {nextExam.title}
              </h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-red-600">
                  {getDaysUntil(nextExam.startDate)}
                </span>
                <span className="text-sm font-medium text-red-400">
                  days left
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(nextExam.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No upcoming exams 🎉</p>
          )}
        </div>

        {/* Next Assignment */}
        <div className="bg-linear-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/20 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <FileText size={18} className="text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
              Next Assignment
            </span>
          </div>
          {nextAssignment ? (
            <>
              <h4 className="text-sm font-bold text-slate-800 mb-1 truncate">
                {nextAssignment.title}
              </h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-orange-600">
                  {getDaysUntil(nextAssignment.startDate)}
                </span>
                <span className="text-sm font-medium text-orange-400">
                  days left
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(nextAssignment.startDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400 mt-2">All caught up! ✅</p>
          )}
        </div>

        {/* Next Holiday */}
        <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/50 p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <PartyPopper size={18} className="text-green-500" />
            </div>
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              Next Holiday
            </span>
          </div>
          {nextHoliday ? (
            <>
              <h4 className="text-sm font-bold text-slate-800 mb-1 truncate">
                {nextHoliday.title}
              </h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-green-600">
                  {getDaysUntil(nextHoliday.startDate)}
                </span>
                <span className="text-sm font-medium text-green-400">
                  days away
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(nextHoliday.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400 mt-2">No holidays soon</p>
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
        <CalendarViewToggle currentView={view} onViewChange={setView} />
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
            emptyMessage="No events this month"
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
                  <span className="text-slate-400">Start</span>
                  <span className="text-slate-700">
                    {new Date(selectedEvent.startDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">End</span>
                  <span className="text-slate-700">
                    {new Date(selectedEvent.endDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                {new Date(selectedEvent.startDate) > now && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-xl text-center">
                    <span className="text-2xl font-black text-indigo-600">
                      {getDaysUntil(selectedEvent.startDate)}
                    </span>
                    <span className="text-sm text-indigo-400 ml-2">
                      days remaining
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCalendarPage;
