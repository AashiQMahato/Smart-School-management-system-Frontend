/**
 * AdminCalendarPage
 * Full-featured calendar dashboard for administrators
 * Includes: Calendar overview, event CRUD, analytics panel
 */

import { useState, useEffect, useCallback } from "react";
import { message, Popconfirm, Tooltip, Select } from "antd";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Calendar as CalendarIcon,
  AlertTriangle,
  BookOpen,
  PartyPopper,
  TrendingUp,
} from "lucide-react";
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
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  togglePublishEvent,
  getAnalytics,
  EVENT_TYPES,
} from "../../../services/calendar.service";
import { getAllClasses } from "../../../services/class.service";

const AdminCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const filters = { month, year };
      if (eventTypeFilter) filters.eventType = eventTypeFilter;

      const [eventsRes, analyticsRes] = await Promise.all([
        getEvents(filters),
        getAnalytics(),
      ]);

      if (eventsRes.success) setEvents(eventsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (error) {
      message.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  }, [currentDate, eventTypeFilter]);

  // Fetch classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await getAllClasses();
        if (res.success) setClasses(res.data);
      } catch {
        // Non-critical
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Navigation
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (view === "week") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (view === "week") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => setCurrentDate(new Date());

  // CRUD operations
  const handleCreateEvent = async (data) => {
    try {
      setSubmitting(true);
      const res = await createEvent(data);
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

  const handleUpdateEvent = async (data) => {
    try {
      setSubmitting(true);
      const res = await updateEvent(editingEvent._id, data);
      if (res.success) {
        message.success("Event updated successfully");
        setEditingEvent(null);
        setModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        message.success("Event deleted");
        fetchEvents();
        if (selectedEvent?._id === eventId) setSelectedEvent(null);
      }
    } catch (error) {
      message.error("Failed to delete event");
    }
  };

  const handleTogglePublish = async (eventId) => {
    try {
      const res = await togglePublishEvent(eventId);
      if (res.success) {
        message.success(
          res.data.isPublished ? "Event published" : "Event unpublished",
        );
        fetchEvents();
      }
    } catch (error) {
      message.error("Failed to toggle publish status");
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  // Event actions (for list view)
  const renderEventActions = (evt) => (
    <>
      <Tooltip title={evt.isPublished ? "Unpublish" : "Publish"}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePublish(evt._id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            evt.isPublished
              ? "text-green-600 hover:bg-green-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}>
          {evt.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </Tooltip>
      <Tooltip title="Edit">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openEditModal(evt);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Edit3 size={14} />
        </button>
      </Tooltip>
      <Popconfirm
        title="Delete this event?"
        onConfirm={(e) => {
          e?.stopPropagation();
          handleDeleteEvent(evt._id);
        }}
        onCancel={(e) => e?.stopPropagation()}
        okText="Delete"
        okButtonProps={{ danger: true }}>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Trash2 size={14} />
        </button>
      </Popconfirm>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage school events, exams, holidays, and announcements
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-300 active:scale-95">
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticsCard
            icon={<CalendarIcon size={20} />}
            label="Events This Month"
            value={analytics.totalThisMonth}
            color="indigo"
          />
          <AnalyticsCard
            icon={<BookOpen size={20} />}
            label="Upcoming Exams"
            value={analytics.upcomingExams}
            color="red"
          />
          <AnalyticsCard
            icon={<PartyPopper size={20} />}
            label="Holidays"
            value={analytics.holidayCount}
            color="green"
          />
          <AnalyticsCard
            icon={<AlertTriangle size={20} />}
            label="Overlapping Events"
            value={analytics.overlappingWarnings?.length || 0}
            color={
              analytics.overlappingWarnings?.length > 0 ? "amber" : "slate"
            }
          />
        </div>
      )}

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        <div className="flex items-center gap-3">
          <Select
            value={eventTypeFilter}
            onChange={setEventTypeFilter}
            placeholder="All Types"
            allowClear
            className="w-40"
            options={[
              ...EVENT_TYPES.map((t) => ({
                value: t.value,
                label: `${t.icon} ${t.label}`,
              })),
            ]}
          />
          <CalendarViewToggle currentView={view} onViewChange={setView} />
        </div>
      </div>

      {/* Calendar View */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        {view === "month" && (
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onDateClick={(day) => {
              // Could open create modal with pre-filled date
            }}
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
            actions={renderEventActions}
            emptyMessage="No events this month"
          />
        )}
      </div>

      {/* Event Detail Sidebar */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => openEditModal(selectedEvent)}
          onDelete={() => handleDeleteEvent(selectedEvent._id)}
          onTogglePublish={() => handleTogglePublish(selectedEvent._id)}
        />
      )}

      {/* Create/Edit Modal */}
      <EventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
        classes={classes}
        loading={submitting}
      />
    </div>
  );
};

// ==================== Sub Components ====================

const AnalyticsCard = ({ icon, label, value, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    red: "bg-red-50 text-red-600 border-red-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${colors[color]} transition-all duration-300 hover:shadow-md`}>
      <div className="p-2 rounded-lg bg-white/80 shadow-sm">{icon}</div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium opacity-70">{label}</div>
      </div>
    </div>
  );
};

const EventDetailPanel = ({
  event,
  onClose,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 border-l border-slate-200 animate-in slide-in-from-right duration-300">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Event Details</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <EventTypeBadge type={event.eventType} size="large" />

          <div>
            <h4 className="text-xl font-bold text-slate-900">{event.title}</h4>
            {event.description && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <DetailRow label="Start Date" value={formatDate(event.startDate)} />
            <DetailRow label="End Date" value={formatDate(event.endDate)} />
            <DetailRow
              label="Status"
              value={
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    event.isPublished
                      ? "bg-green-50 text-green-600"
                      : "bg-amber-50 text-amber-600"
                  }`}>
                  {event.isPublished ? "Published" : "Draft"}
                </span>
              }
            />
            {event.classId && (
              <DetailRow
                label="Class"
                value={`${event.classId.name}${event.classId.section ? ` - ${event.classId.section}` : ""}`}
              />
            )}
            <DetailRow
              label="Visible To"
              value={
                <div className="flex flex-wrap gap-1">
                  {event.roleVisibility?.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs capitalize">
                      {role}
                    </span>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-200 flex gap-2">
          <button
            onClick={onTogglePublish}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all duration-200">
            {event.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200">
            Edit
          </button>
          <Popconfirm
            title="Delete this event?"
            onConfirm={onDelete}
            okText="Delete"
            okButtonProps={{ danger: true }}>
            <button className="py-2.5 px-4 text-sm font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all duration-200">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-sm text-slate-400 shrink-0">{label}</span>
    <span className="text-sm text-slate-700 text-right">{value}</span>
  </div>
);

export default AdminCalendarPage;
