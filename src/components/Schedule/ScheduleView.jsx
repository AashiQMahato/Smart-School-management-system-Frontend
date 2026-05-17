/**
 * ScheduleView - Modern Schedule Component
 * A beautiful, responsive schedule viewer for Smart School Management System
 * Supports daily/weekly views with filtering and event details
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Grid3X3,
  List,
  X,
  RefreshCw,
} from "lucide-react";
import ScheduleEventCard from "./ScheduleEventCard";
import ScheduleTimeline from "./ScheduleTimeline";
import ScheduleDetailModal from "./ScheduleDetailModal";

// Constants
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const VIEWS = {
  DAY: "day",
  WEEK: "week",
};

const EVENT_TYPES = {
  CLASS: "class",
  EXAM: "exam",
  MEETING: "meeting",
  ACTIVITY: "activity",
};

// Helper functions
const getTodayLabel = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isSmallScreen = () =>
  typeof window !== "undefined" ? window.innerWidth < 1024 : false;

// Empty State Component
const EmptyState = ({ title, subtitle, icon: Icon = Calendar }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-50 to-slate-100 flex items-center justify-center mb-6 shadow-sm">
      <Icon className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    {subtitle && (
      <p className="text-sm text-slate-500 text-center max-w-sm">{subtitle}</p>
    )}
  </div>
);

// Loading Skeleton
const ScheduleSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-slate-100 rounded-xl w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-24 bg-slate-50 rounded-xl" />
          <div className="h-20 bg-slate-50 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

// Day Tabs Component (for mobile)
const DayTabs = ({ selectedDay, onSelect, groupedByDay }) => {
  const today = getTodayLabel();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {DAYS.map((day) => {
        const isSelected = day === selectedDay;
        const isToday = day === today;
        const hasEvents = (groupedByDay?.[day] || []).length > 0;

        return (
          <button
            key={day}
            type="button"
            onClick={() => onSelect(day)}
            className={`
              relative shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium 
              transition-all duration-200 border
              ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
              }
            `}>
            <span className="relative">
              {day.slice(0, 3)}
              {isToday && !isSelected && (
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              )}
            </span>
            {hasEvents && !isSelected && (
              <span className="ml-1.5 text-xs text-slate-400">
                ({groupedByDay[day].length})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// View Toggle Component
const ViewToggle = ({ view, onViewChange }) => (
  <div className="flex items-center bg-slate-100 rounded-xl p-1">
    <button
      onClick={() => onViewChange(VIEWS.DAY)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${
          view === VIEWS.DAY
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }
      `}>
      <List className="w-4 h-4" />
      <span className="hidden sm:inline">Day</span>
    </button>
    <button
      onClick={() => onViewChange(VIEWS.WEEK)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${
          view === VIEWS.WEEK
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }
      `}>
      <Grid3X3 className="w-4 h-4" />
      <span className="hidden sm:inline">Week</span>
    </button>
  </div>
);

// Filter Dropdown Component
const FilterDropdown = ({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
  onClear,
  subjects = [],
  teachers = [],
  eventTypes = Object.values(EVENT_TYPES),
}) => {
  const hasActiveFilters =
    filters.subject || filters.teacher || filters.eventType;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
          transition-all border
          ${
            hasActiveFilters
              ? "bg-indigo-50 text-indigo-600 border-indigo-200"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }
        `}>
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
            {
              [filters.subject, filters.teacher, filters.eventType].filter(
                Boolean,
              ).length
            }
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">
                  Filter Schedule
                </h4>
                {hasActiveFilters && (
                  <button
                    onClick={onClear}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Subject Filter */}
              {subjects.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select
                    value={filters.subject || ""}
                    onChange={(e) => onFilterChange("subject", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option
                        key={subject._id || subject}
                        value={subject._id || subject}>
                        {subject.name || subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Teacher Filter */}
              {teachers.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Teacher
                  </label>
                  <select
                    value={filters.teacher || ""}
                    onChange={(e) => onFilterChange("teacher", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">All Teachers</option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher._id || teacher}
                        value={teacher._id || teacher}>
                        {teacher.name || teacher}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Event Type Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Event Type
                </label>
                <select
                  value={filters.eventType || ""}
                  onChange={(e) => onFilterChange("eventType", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Search Input Component
const SearchInput = ({
  value,
  onChange,
  placeholder = "Search schedule...",
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                 placeholder:text-slate-400"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

// Week View Column Component
const WeekViewColumn = ({
  day,
  items,
  isSelected,
  isToday,
  onDaySelect,
  onItemClick,
  showTeacher,
  showClass,
}) => {
  return (
    <div
      onClick={() => onDaySelect(day)}
      className={`
        rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "border-indigo-400 ring-2 ring-indigo-100"
            : isToday
              ? "border-indigo-200 bg-indigo-50/30"
              : "border-slate-200 hover:border-slate-300"
        }
      `}>
      {/* Day Header */}
      <div
        className={`
          px-4 py-3 border-b transition-colors
          ${
            isSelected
              ? "bg-indigo-600 text-white border-indigo-600"
              : isToday
                ? "bg-indigo-50 text-indigo-900 border-indigo-100"
                : "bg-slate-50 text-slate-800 border-slate-100"
          }
        `}>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-sm">{day}</div>
          {isToday && !isSelected && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">
              Today
            </span>
          )}
        </div>
        <div
          className={`text-xs mt-0.5 ${
            isSelected ? "text-indigo-100" : "text-slate-500"
          }`}>
          {items.length
            ? `${items.length} ${items.length === 1 ? "class" : "classes"}`
            : "No classes"}
        </div>
      </div>

      {/* Events List */}
      <div className="p-3 space-y-2 min-h-30 bg-white">
        {items.length > 0 ? (
          items.map((item) => (
            <ScheduleEventCard
              key={item._id}
              item={item}
              onClick={() => onItemClick && onItemClick(item)}
              showTeacher={showTeacher}
              showClass={showClass}
              compact
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-20 text-slate-400 text-xs">
            No scheduled classes
          </div>
        )}
      </div>
    </div>
  );
};

// Main ScheduleView Component
const ScheduleView = ({
  groupedByDay = {},
  loading = false,
  error = null,
  onItemClick,
  onRefresh,
  showTeacher = true,
  showClass = false,
  subjects = [],
  teachers = [],
  emptyTitle = "No schedule available",
  emptySubtitle = "Once schedules are created, they'll appear here.",
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  defaultView = null,
  role = "student", // admin, teacher, student, parent
}) => {
  // State
  const [view, setView] = useState(
    defaultView || (isSmallScreen() ? VIEWS.DAY : VIEWS.WEEK),
  );
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = getTodayLabel();
    return DAYS.includes(today) ? today : "Monday";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    teacher: "",
    eventType: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const small = isSmallScreen();
      if (small && view === VIEWS.WEEK) {
        setView(VIEWS.DAY);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [view]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    const result = {};

    DAYS.forEach((day) => {
      let items = groupedByDay[day] || [];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(
          (item) =>
            item?.subjectId?.name?.toLowerCase().includes(query) ||
            item?.teacherId?.name?.toLowerCase().includes(query) ||
            item?.room?.toLowerCase().includes(query) ||
            item?.classId?.name?.toLowerCase().includes(query),
        );
      }

      // Apply subject filter
      if (filters.subject) {
        items = items.filter(
          (item) =>
            item?.subjectId?._id === filters.subject ||
            item?.subjectId === filters.subject,
        );
      }

      // Apply teacher filter
      if (filters.teacher) {
        items = items.filter(
          (item) =>
            item?.teacherId?._id === filters.teacher ||
            item?.teacherId === filters.teacher,
        );
      }

      // Apply event type filter
      if (filters.eventType) {
        items = items.filter((item) => item?.eventType === filters.eventType);
      }

      result[day] = items;
    });

    return result;
  }, [groupedByDay, searchQuery, filters]);

  // Total items count
  const totalItems = useMemo(
    () => DAYS.reduce((acc, day) => acc + (filteredData[day]?.length || 0), 0),
    [filteredData],
  );

  // Handle filter change
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ subject: "", teacher: "", eventType: "" });
    setSearchQuery("");
  }, []);

  // Handle item click
  const handleItemClick = useCallback(
    (item) => {
      setSelectedItem(item);
      onItemClick?.(item);
    },
    [onItemClick],
  );

  // Navigate days
  const navigateDay = useCallback(
    (direction) => {
      const currentIndex = DAYS.indexOf(selectedDay);
      const newIndex =
        direction === "prev"
          ? (currentIndex - 1 + DAYS.length) % DAYS.length
          : (currentIndex + 1) % DAYS.length;
      setSelectedDay(DAYS[newIndex]);
    },
    [selectedDay],
  );

  // Go to today
  const goToToday = useCallback(() => {
    const today = getTodayLabel();
    if (DAYS.includes(today)) {
      setSelectedDay(today);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <ScheduleSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Failed to load schedule
          </h3>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const today = getTodayLabel();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-slate-100">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Schedule</h2>
              <p className="text-xs text-slate-500">{getCurrentDate()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* View Toggle */}
            {showViewToggle && !isSmallScreen() && (
              <ViewToggle view={view} onViewChange={setView} />
            )}

            {/* Filter Button */}
            {showFilters && (
              <FilterDropdown
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
                subjects={subjects}
                teachers={teachers}
              />
            )}
          </div>
        </div>

        {/* Search and Navigation Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          {/* Search */}
          {showSearch && (
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by subject, teacher, room..."
              />
            </div>
          )}

          {/* Day Navigation (for day view) */}
          {view === VIEWS.DAY && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDay("prev")}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToToday}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === today
                    ? "bg-indigo-100 text-indigo-600"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}>
                Today
              </button>
              <button
                onClick={() => navigateDay("next")}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stats Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-lg bg-slate-100">
              {totalItems} {totalItems === 1 ? "class" : "classes"} total
            </span>
          </div>
        </div>
      </div>

      {/* Day Tabs (Mobile / Day View) */}
      {(view === VIEWS.DAY || isSmallScreen()) && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
          <DayTabs
            selectedDay={selectedDay}
            onSelect={setSelectedDay}
            groupedByDay={filteredData}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="p-6">
        {totalItems === 0 ? (
          <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
        ) : view === VIEWS.DAY || isSmallScreen() ? (
          /* Day View */
          <div className="space-y-3">
            {(filteredData[selectedDay] || []).length > 0 ? (
              <ScheduleTimeline
                items={filteredData[selectedDay]}
                onItemClick={handleItemClick}
                showTeacher={showTeacher}
                showClass={showClass}
              />
            ) : (
              <EmptyState
                title={`No classes on ${selectedDay}`}
                subtitle="Try selecting another day or adjust your filters."
              />
            )}
          </div>
        ) : (
          /* Week View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {DAYS.map((day) => (
              <WeekViewColumn
                key={day}
                day={day}
                items={filteredData[day] || []}
                isSelected={day === selectedDay}
                isToday={day === today}
                onDaySelect={setSelectedDay}
                onItemClick={handleItemClick}
                showTeacher={showTeacher}
                showClass={showClass}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <ScheduleDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          role={role}
        />
      )}
    </div>
  );
};

export default ScheduleView;
