/**
 * CalendarGrid Component
 * Full month calendar view with color-coded event dots
 */

import { useState } from "react";
import { getEventTypeConfig } from "../../services/calendar.service";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({
  currentDate,
  events = [],
  onDateClick,
  onEventClick,
}) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get calendar grid data
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Previous month days for padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Get events for a specific date
  const getEventsForDate = (day) => {
    const date = new Date(year, month, day);
    return events.filter((evt) => {
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      date.setHours(12, 0, 0, 0);
      return date >= start && date <= end;
    });
  };

  // Build grid cells
  const cells = [];

  // Previous month padding
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      events: [],
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      isCurrentMonth: true,
      events: getEventsForDate(day),
      isToday: isToday(day),
    });
  }

  // Next month padding
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      isCurrentMonth: false,
      events: [],
    });
  }

  // Tooltip for hovered date
  const hoveredEvents = hoveredDate ? getEventsForDate(hoveredDate) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Day Headers */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
        {cells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => cell.isCurrentMonth && onDateClick?.(cell.day)}
            onMouseEnter={() =>
              cell.isCurrentMonth &&
              cell.events.length > 0 &&
              setHoveredDate(cell.day)
            }
            onMouseLeave={() => setHoveredDate(null)}
            className={`
              relative min-h-22.5 md:min-h-27.5 p-1.5 md:p-2 cursor-pointer
              transition-all duration-200 group
              ${cell.isCurrentMonth ? "bg-white hover:bg-slate-50/80" : "bg-slate-50/50"}
              ${cell.isToday ? "ring-2 ring-inset ring-indigo-500/30 bg-indigo-50/30" : ""}
            `}>
            {/* Date Number */}
            <div
              className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                transition-all duration-200
                ${
                  cell.isToday
                    ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200"
                    : cell.isCurrentMonth
                      ? "text-slate-700 font-medium group-hover:bg-slate-200"
                      : "text-slate-300"
                }
              `}>
              {cell.day}
            </div>

            {/* Event Dots */}
            {cell.events.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {cell.events.slice(0, 3).map((evt, i) => {
                  const config = getEventTypeConfig(evt.eventType);
                  return (
                    <div
                      key={evt._id || i}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(evt);
                      }}
                      className="flex items-center gap-1 px-1 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}>
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="truncate hidden md:inline">
                        {evt.title}
                      </span>
                    </div>
                  );
                })}
                {cell.events.length > 3 && (
                  <div className="text-xs text-slate-400 pl-1">
                    +{cell.events.length - 3} more
                  </div>
                )}
              </div>
            )}

            {/* Hover Tooltip */}
            {hoveredDate === cell.day && hoveredEvents.length > 0 && (
              <div className="absolute z-30 top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-3 pointer-events-none">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  {new Date(year, month, cell.day).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="space-y-1.5">
                  {hoveredEvents.slice(0, 5).map((evt, i) => {
                    const config = getEventTypeConfig(evt.eventType);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-xs text-slate-600 truncate">
                          {evt.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
