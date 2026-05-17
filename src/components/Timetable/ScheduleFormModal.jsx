import React from "react";
import BASE_URL from "../../config/baseUrl";

const ScheduleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  title = "Add Schedule",
  existingSchedules = [],
  editingScheduleId = null,
  serverConflict = null,
}) => {
  const [formData, setFormData] = React.useState({
    classId: "",
    section: "",
    subjectId: "",
    teacherId: "",
    room: "",
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    academicYear: "",
    ...initialData,
  });

  const [errors, setErrors] = React.useState({});
  const [classes, setClasses] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showServerConflict, setShowServerConflict] = React.useState(true);

  const getDefaultAcademicYear = React.useCallback(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  }, []);

  const normalizeSection = React.useCallback(
    (value) => (value == null ? "" : String(value).trim().toUpperCase()),
    [],
  );

  const timeToMinutes = React.useCallback((timeStr) => {
    if (!timeStr || typeof timeStr !== "string")
      return Number.POSITIVE_INFINITY;
    const [hRaw, mRaw] = timeStr.split(":");
    const hours = Number(hRaw);
    const minutes = Number(mRaw);
    if (Number.isNaN(hours) || Number.isNaN(minutes))
      return Number.POSITIVE_INFINITY;
    return hours * 60 + minutes;
  }, []);

  const hasOverlap = React.useCallback(
    (startA, endA, startB, endB) => {
      const aStart = timeToMinutes(startA);
      const aEnd = timeToMinutes(endA);
      const bStart = timeToMinutes(startB);
      const bEnd = timeToMinutes(endB);
      if (
        !Number.isFinite(aStart) ||
        !Number.isFinite(aEnd) ||
        !Number.isFinite(bStart) ||
        !Number.isFinite(bEnd)
      ) {
        return false;
      }
      return aStart < bEnd && aEnd > bStart;
    },
    [timeToMinutes],
  );

  // Fetch classes, subjects, and teachers on mount
  React.useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  React.useEffect(() => {
    setShowServerConflict(true);
  }, [serverConflict]);

  const fetchDropdownData = async () => {
    setLoading(true);
    const token = localStorage.getItem("ssms_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all data in parallel
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        fetch(`${BASE_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${BASE_URL}/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${BASE_URL}/users?role=teacher`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData.data || []);
      }

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData.data || []);
      }

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.data || []);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (
      [
        "dayOfWeek",
        "startTime",
        "endTime",
        "classId",
        "section",
        "subjectId",
      ].includes(name)
    ) {
      setShowServerConflict(false);
    }

    // Auto-populate section when class is selected
    if (name === "classId") {
      const selectedClass = classes.find((c) => c._id === value);
      if (selectedClass) {
        setFormData((prev) => ({
          ...prev,
          section: selectedClass.section,
          academicYear: selectedClass.academicYear || prev.academicYear,
        }));
      }
    }

    // Auto-populate teacherId when subject is selected
    if (name === "subjectId") {
      const selectedSubject = subjects.find((s) => s._id === value);
      if (selectedSubject && selectedSubject.assignedTeacher) {
        setFormData((prev) => ({
          ...prev,
          teacherId:
            selectedSubject.assignedTeacher._id ||
            selectedSubject.assignedTeacher,
        }));
      }
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const resolvedAcademicYear = React.useMemo(() => {
    const year = String(formData.academicYear || "").trim();
    return year ? year : getDefaultAcademicYear();
  }, [formData.academicYear, getDefaultAcademicYear]);

  const timeConflict = React.useMemo(() => {
    const day = formData.dayOfWeek;
    const startTime = formData.startTime;
    const endTime = formData.endTime;
    const classId = formData.classId;
    const section = normalizeSection(formData.section);
    const teacherId = formData.teacherId;

    if (!day || !startTime || !endTime) return null;
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) return null;

    const relevant = (existingSchedules || []).filter((s) => {
      if (!s || !s._id) return false;
      if (editingScheduleId && String(s._id) === String(editingScheduleId))
        return false;
      if (s.isActive === false) return false;
      if (s.dayOfWeek !== day) return false;

      const sYear = String(s.academicYear || "").trim();
      if ((sYear || getDefaultAcademicYear()) !== resolvedAcademicYear)
        return false;

      const sameTeacher =
        teacherId &&
        s.teacherId?._id &&
        String(s.teacherId._id) === String(teacherId);
      const sameClass =
        classId &&
        s.classId?._id &&
        String(s.classId._id) === String(classId) &&
        normalizeSection(s.section) === section;

      return sameTeacher || sameClass;
    });

    for (const s of relevant) {
      if (hasOverlap(startTime, endTime, s.startTime, s.endTime)) {
        const sameTeacher =
          teacherId &&
          s.teacherId?._id &&
          String(s.teacherId._id) === String(teacherId);
        const sameClass =
          classId &&
          s.classId?._id &&
          String(s.classId._id) === String(classId) &&
          normalizeSection(s.section) === section;

        const type = sameTeacher ? "teacher" : sameClass ? "class" : "time";

        return {
          type,
          schedule: s,
          message: "Time conflict: This slot is already assigned",
        };
      }
    }

    return null;
  }, [
    existingSchedules,
    editingScheduleId,
    formData.dayOfWeek,
    formData.startTime,
    formData.endTime,
    formData.classId,
    formData.section,
    formData.teacherId,
    resolvedAcademicYear,
    getDefaultAcademicYear,
    hasOverlap,
    normalizeSection,
    timeToMinutes,
  ]);

  const validate = () => {
    const newErrors = {};

    if (!formData.classId) newErrors.classId = "Class is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.subjectId) newErrors.subjectId = "Subject is required";
    // teacherId validation removed - it's auto-assigned from subject
    if (!formData.room) newErrors.room = "Room is required";
    if (!formData.dayOfWeek) newErrors.dayOfWeek = "Day is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Validate time range
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Basic time clash check (client-side best effort)
    if (!newErrors.startTime && !newErrors.endTime && timeConflict) {
      newErrors.dayOfWeek = newErrors.dayOfWeek || "";
      newErrors.startTime = newErrors.startTime || "";
      newErrors.endTime = newErrors.endTime || "";
      newErrors._timeConflict = timeConflict.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.classId ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.section} ({cls.academicYear})
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="text-red-500 text-xs mt-1">{errors.classId}</p>
                )}
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.section ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., A, B, C"
                />
                {errors.section && (
                  <p className="text-red-500 text-xs mt-1">{errors.section}</p>
                )}
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.subjectId ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subjectId}
                  </p>
                )}
              </div>

              {/* Teacher Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    (Auto-assigned from subject)
                  </span>
                </label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  disabled={true}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed ${
                    errors.teacherId ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="">Select a subject first</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.teacherId}
                  </p>
                )}
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.room ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Room 101"
                />
                {errors.room && (
                  <p className="text-red-500 text-xs mt-1">{errors.room}</p>
                )}
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dayOfWeek ||
                    timeConflict ||
                    (serverConflict && showServerConflict)
                      ? "border-amber-400"
                      : "border-gray-300"
                  }`}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
                {errors.dayOfWeek && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dayOfWeek}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Avoid overlapping schedules
                  </span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startTime
                      ? "border-red-500"
                      : timeConflict || (serverConflict && showServerConflict)
                        ? "border-amber-400"
                        : "border-gray-300"
                  }`}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endTime
                      ? "border-red-500"
                      : timeConflict || (serverConflict && showServerConflict)
                        ? "border-amber-400"
                        : "border-gray-300"
                  }`}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                )}
              </div>

              {(timeConflict ||
                (serverConflict && showServerConflict) ||
                errors._timeConflict) && (
                <div className="md:col-span-2 -mt-1">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-3 py-2 text-sm transition-all duration-200">
                    <div className="font-semibold">
                      Time conflict: This slot is already assigned
                    </div>
                    {serverConflict?.message && showServerConflict && (
                      <div className="text-xs text-amber-800 mt-0.5">
                        {serverConflict.message}
                      </div>
                    )}
                    {timeConflict?.schedule && (
                      <div className="text-xs text-amber-800 mt-0.5">
                        Conflicts with {timeConflict.schedule.startTime} -{" "}
                        {timeConflict.schedule.endTime}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Academic Year */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                Boolean(timeConflict) ||
                (serverConflict && showServerConflict)
              }
              className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal;
