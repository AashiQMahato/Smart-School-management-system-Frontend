/**
 * CalendarWeekView Component
 * Detailed weekly timeline view
 */

import { getEventTypeConfig } from "../../services/calendar.service";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarWeekView = ({ currentDate, events = [], onEventClick }) => {
  // Get week start (Sunday)
  const weekStart = new Date(currentDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Get events for a date
  const getEventsForDate = (date) => {
    return events.filter((evt) => {
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  const isToday = (date) => date.getTime() === today.getTime();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Week Header */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={`py-3 px-2 text-center border-r last:border-r-0 border-slate-100 ${
              isToday(day) ? "bg-indigo-50" : ""
            }`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="hidden md:inline">{DAYS[idx]}</span>
              <span className="md:hidden">{DAYS_SHORT[idx]}</span>
            </div>
            <div
              className={`mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                isToday(day)
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-700"
              }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week Body */}
      <div className="grid grid-cols-7 min-h-100">
        {weekDays.map((day, idx) => {
          const dayEvents = getEventsForDate(day);
          return (
            <div
              key={idx}
              className={`border-r last:border-r-0 border-slate-100 p-2 ${
                isToday(day) ? "bg-indigo-50/30" : ""
              }`}>
              <div className="space-y-1.5">
                {dayEvents.map((evt) => {
                  const config = getEventTypeConfig(evt.eventType);
                  return (
                    <div
                      key={evt._id}
                      onClick={() => onEventClick?.(evt)}
                      className="p-2 rounded-lg cursor-pointer hover:shadow-sm transition-all duration-200 border border-transparent hover:border-slate-200"
                      style={{ backgroundColor: `${config.color}10` }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span
                          className="text-xs font-semibold truncate"
                          style={{ color: config.color }}>
                          {config.icon}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-800 truncate">
                        {evt.title}
                      </div>
                      {evt.description && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-2 hidden md:block">
                          {evt.description}
                        </div>
                      )}
                    </div>
                  );
                })}
                {dayEvents.length === 0 && (
                  <div className="text-xs text-slate-300 text-center py-4">
                    —
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeekView;
