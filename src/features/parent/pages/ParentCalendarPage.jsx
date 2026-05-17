/**
 * ParentCalendarPage
 * Calendar view for parents with child selector
 * Features: Child-specific events, fee due dates, exam schedules, combined view
 */

import { useState, useEffect, useCallback } from "react";
import { message, Select } from "antd";
import {
  Users,
  BookOpen,
  CreditCard,
  PartyPopper,
  CalendarDays,
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
  getParentEvents,
  EVENT_TYPES,
  getEventTypeConfig,
} from "../../../services/calendar.service";

const ParentCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };
      if (eventTypeFilter) filters.eventType = eventTypeFilter;

      const res = await getParentEvents(filters);
      if (res.success) setEvents(res.data);
    } catch {
      message.error("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, [currentDate, eventTypeFilter]);

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

  const now = new Date();

  // Upcoming summary data
  const upcomingExams = events
    .filter((e) => e.eventType === "exam" && new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const upcomingFees = events
    .filter((e) => e.eventType === "fee_due" && new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const upcomingHolidays = events
    .filter((e) => e.eventType === "holiday" && new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  const upcomingAll = events
    .filter((e) => new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  const getDaysUntil = (dateStr) => {
    return Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Academic Calendar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Stay informed about your children's academic schedule
        </p>
      </div>

      {/* Upcoming Events Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <CalendarDays size={16} className="text-violet-500" />
          Upcoming Events
        </h3>

        {upcomingAll.length > 0 ? (
          <div className="space-y-2.5">
            {upcomingAll.map((evt) => {
              const config = getEventTypeConfig(evt.eventType);
              const daysLeft = getDaysUntil(evt.startDate);
              return (
                <div
                  key={evt._id}
                  onClick={() => setSelectedEvent(evt)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: `${config.color}15` }}>
                      {config.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {evt.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(evt.startDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {evt.classId && ` · ${evt.classId.name}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div
                      className="text-lg font-black"
                      style={{ color: config.color }}>
                      {daysLeft}
                    </div>
                    <div className="text-xs text-slate-400">days</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">
            No upcoming events
          </p>
        )}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <QuickStat
          icon={<BookOpen size={16} />}
          label="Exams"
          count={upcomingExams.length}
          color="red"
        />
        <QuickStat
          icon={<CreditCard size={16} />}
          label="Fee Dues"
          count={upcomingFees.length}
          color="purple"
        />
        <QuickStat
          icon={<PartyPopper size={16} />}
          label="Holidays"
          count={upcomingHolidays.length}
          color="green"
        />
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
        <div className="flex items-center gap-3">
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
            emptyMessage="No events this month"
          />
        )}
      </div>

      {/* Event Detail */}
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
    </div>
  );
};

const QuickStat = ({ icon, label, count, color }) => {
  const colors = {
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div
      className={`flex items-center gap-2.5 p-3 rounded-xl border ${colors[color]} transition-all duration-200 hover:shadow-sm`}>
      <div className="p-1.5 bg-white/70 rounded-lg shadow-sm">{icon}</div>
      <div>
        <div className="text-lg font-bold">{count}</div>
        <div className="text-xs font-medium opacity-70">{label}</div>
      </div>
    </div>
  );
};

export default ParentCalendarPage;
