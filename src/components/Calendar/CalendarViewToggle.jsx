/**
 * CalendarViewToggle Component
 * Smooth toggle between Month, Week, and List views
 */

const VIEWS = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "list", label: "List" },
];

const CalendarViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
      {VIEWS.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`
            relative px-4 py-2 text-sm font-medium rounded-lg
            transition-all duration-300 ease-out
            ${
              currentView === view.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }
          `}>
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default CalendarViewToggle;
