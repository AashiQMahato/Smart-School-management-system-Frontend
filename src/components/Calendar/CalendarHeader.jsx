/**
 * CalendarHeader Component
 * Navigation between months/weeks with title display
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CalendarHeader = ({ currentDate, view, onPrev, onNext, onToday }) => {
  const getTitle = () => {
    const month = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    if (view === "week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const startMonth = MONTHS[startOfWeek.getMonth()];
      const endMonth = MONTHS[endOfWeek.getMonth()];

      if (startMonth === endMonth) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startMonth} ${year}`;
      }
      return `${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth} ${year}`;
    }

    return `${month} ${year}`;
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200">
          Today
        </button>

        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={onPrev}
            className="p-1.5 hover:bg-white rounded-md transition-all duration-200 text-slate-600 hover:text-slate-900">
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={onNext}
            className="p-1.5 hover:bg-white rounded-md transition-all duration-200 text-slate-600 hover:text-slate-900">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
