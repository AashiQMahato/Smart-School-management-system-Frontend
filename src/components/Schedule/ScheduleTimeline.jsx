/**
 * ScheduleTimeline - Timeline View Component
 * Displays events in a chronological timeline format
 * Shows time slots and current time indicator
 */

import React, { useEffect, useState, useMemo } from "react";
import { Clock } from "lucide-react";
import ScheduleEventCard from "./ScheduleEventCard";

// Time slot configuration
const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// Format time for display
const formatTimeSlot = (time) => {
  const [hours] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour} ${ampm}`;
};

// Parse time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Get current time as minutes since midnight
const getCurrentTimeMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Check if an event is currently happening
const isEventNow = (startTime, endTime) => {
  const currentMins = getCurrentTimeMinutes();
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  return currentMins >= startMins && currentMins < endMins;
};

// Check if an event has passed
const isEventPast = (endTime) => {
  const currentMins = getCurrentTimeMinutes();
  const endMins = timeToMinutes(endTime);
  return currentMins > endMins;
};

// Current Time Indicator Component
const CurrentTimeIndicator = ({ position }) => {
  if (position < 0 || position > 100) return null;

  return (
    <div
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${position}%` }}>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-200 -ml-1.5" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
    </div>
  );
};

// Time Slot Row Component
const TimeSlotRow = ({ time, isCurrentHour }) => (
  <div
    className={`
      flex items-center gap-4 py-4 border-b border-slate-100
      ${isCurrentHour ? "bg-indigo-50/50" : ""}
    `}>
    <div className="w-16 shrink-0 text-right">
      <span
        className={`
          text-sm font-medium
          ${isCurrentHour ? "text-indigo-600" : "text-slate-400"}
        `}>
        {formatTimeSlot(time)}
      </span>
    </div>
    <div className="flex-1 min-h-[60px]" />
  </div>
);

// Event Position Component
const PositionedEvent = ({
  item,
  startPercent,
  heightPercent,
  onClick,
  showTeacher,
  showClass,
  isNow,
  isPast,
}) => (
  <div
    className={`
      absolute left-20 right-4 z-10 transition-all duration-300
      ${isPast ? "opacity-60" : ""}
    `}
    style={{
      top: `${startPercent}%`,
      minHeight: `${Math.max(heightPercent, 8)}%`,
    }}>
    <div
      className={`${isNow ? "ring-2 ring-indigo-500 ring-offset-2 rounded-xl" : ""}`}>
      <ScheduleEventCard
        item={item}
        onClick={onClick}
        showTeacher={showTeacher}
        showClass={showClass}
      />
    </div>
    {isNow && (
      <div className="absolute -left-6 top-1/2 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      </div>
    )}
  </div>
);

// List View Component (when items don't fit timeline well)
const ListView = ({ items, onItemClick, showTeacher, showClass }) => {
  // Sort items by start time
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = timeToMinutes(a.startTime);
      const bTime = timeToMinutes(b.startTime);
      return aTime - bTime;
    });
  }, [items]);

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => {
        const isNow = isEventNow(item.startTime, item.endTime);
        const isPast = isEventPast(item.endTime);

        return (
          <div
            key={item._id}
            className={`
              relative transition-all duration-300
              ${isPast ? "opacity-60" : ""}
            `}>
            {/* Time indicator */}
            <div className="flex items-start gap-4">
              <div className="w-20 shrink-0 pt-4">
                <div
                  className={`
                    text-sm font-semibold
                    ${isNow ? "text-indigo-600" : isPast ? "text-slate-400" : "text-slate-700"}
                  `}>
                  {item.startTime}
                </div>
                <div className="text-xs text-slate-400">{item.endTime}</div>
              </div>

              {/* Timeline dot and line */}
              <div className="flex flex-col items-center pt-4">
                <div
                  className={`
                    w-3 h-3 rounded-full border-2
                    ${
                      isNow
                        ? "border-indigo-500 bg-indigo-500"
                        : isPast
                          ? "border-slate-300 bg-slate-100"
                          : "border-slate-400 bg-white"
                    }
                  `}
                />
                <div className="w-0.5 flex-1 bg-slate-200 min-h-[60px]" />
              </div>

              {/* Event Card */}
              <div className="flex-1 pb-4">
                <div
                  className={
                    isNow
                      ? "ring-2 ring-indigo-500 ring-offset-2 rounded-xl"
                      : ""
                  }>
                  <ScheduleEventCard
                    item={item}
                    onClick={() => onItemClick && onItemClick(item)}
                    showTeacher={showTeacher}
                    showClass={showClass}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main Timeline Component
const ScheduleTimeline = ({
  items = [],
  onItemClick,
  showTeacher = true,
  showClass = false,
  showGrid = false, // Whether to show the full time grid
}) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeMinutes());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeMinutes());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time range for the timeline
  const { startHour, endHour, totalMinutes } = useMemo(() => {
    if (items.length === 0) {
      return { startHour: 7, endHour: 18, totalMinutes: 11 * 60 };
    }

    let minStart = 24 * 60;
    let maxEnd = 0;

    items.forEach((item) => {
      const startMins = timeToMinutes(item.startTime);
      const endMins = timeToMinutes(item.endTime);
      minStart = Math.min(minStart, startMins);
      maxEnd = Math.max(maxEnd, endMins);
    });

    // Round to nearest hour with padding
    const startHour = Math.max(0, Math.floor(minStart / 60) - 1);
    const endHour = Math.min(24, Math.ceil(maxEnd / 60) + 1);
    const totalMinutes = (endHour - startHour) * 60;

    return { startHour, endHour, totalMinutes };
  }, [items]);

  // Calculate position percentage for a time
  const getPositionPercent = (timeStr) => {
    const mins = timeToMinutes(timeStr);
    const startMins = startHour * 60;
    return ((mins - startMins) / totalMinutes) * 100;
  };

  // Get current time position
  const currentTimePosition = useMemo(() => {
    const startMins = startHour * 60;
    const endMins = endHour * 60;
    if (currentTime < startMins || currentTime > endMins) return -1;
    return ((currentTime - startMins) / totalMinutes) * 100;
  }, [currentTime, startHour, endHour, totalMinutes]);

  // If no items or prefer list view for simplicity
  if (!showGrid) {
    return (
      <ListView
        items={items}
        onItemClick={onItemClick}
        showTeacher={showTeacher}
        showClass={showClass}
      />
    );
  }

  // Grid View with positioned events
  const visibleSlots = TIME_SLOTS.filter((slot) => {
    const hour = parseInt(slot.split(":")[0]);
    return hour >= startHour && hour <= endHour;
  });

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
        <Clock className="w-4 h-4" />
        <span>Timeline View</span>
        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? "class" : "classes"}
        </span>
      </div>

      {/* Timeline Grid */}
      <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Time Slots */}
        {visibleSlots.map((time) => {
          const hour = parseInt(time.split(":")[0]);
          const isCurrentHour = Math.floor(currentTime / 60) === hour;

          return (
            <TimeSlotRow key={time} time={time} isCurrentHour={isCurrentHour} />
          );
        })}

        {/* Current Time Indicator */}
        <CurrentTimeIndicator position={currentTimePosition} />

        {/* Positioned Events */}
        {items.map((item) => {
          const startPercent = getPositionPercent(item.startTime);
          const endPercent = getPositionPercent(item.endTime);
          const heightPercent = endPercent - startPercent;
          const isNow = isEventNow(item.startTime, item.endTime);
          const isPast = isEventPast(item.endTime);

          return (
            <PositionedEvent
              key={item._id}
              item={item}
              startPercent={startPercent}
              heightPercent={heightPercent}
              onClick={() => onItemClick && onItemClick(item)}
              showTeacher={showTeacher}
              showClass={showClass}
              isNow={isNow}
              isPast={isPast}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleTimeline;
