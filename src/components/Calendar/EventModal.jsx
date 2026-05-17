/**
 * EventModal Component
 * Modal for creating and editing calendar events (Admin)
 */

import { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Select, Switch, message } from "antd";
import { EVENT_TYPES, ROLE_OPTIONS } from "../../services/calendar.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventModal = ({
  open,
  onClose,
  onSubmit,
  event = null,
  classes = [],
  loading = false,
}) => {
  const isEdit = !!event;

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "school_event",
    dateRange: null,
    roleVisibility: ["admin", "teacher", "student", "parent"],
    classId: null,
    isPublished: false,
    isAllDay: true,
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        eventType: event.eventType || "school_event",
        dateRange:
          event.startDate && event.endDate
            ? [event.startDate, event.endDate]
            : null,
        roleVisibility: event.roleVisibility || [
          "admin",
          "teacher",
          "student",
          "parent",
        ],
        classId: event.classId?._id || event.classId || null,
        isPublished: event.isPublished || false,
        isAllDay: event.isAllDay !== undefined ? event.isAllDay : true,
      });
    } else {
      setForm({
        title: "",
        description: "",
        eventType: "school_event",
        dateRange: null,
        roleVisibility: ["admin", "teacher", "student", "parent"],
        classId: null,
        isPublished: false,
        isAllDay: true,
      });
    }
  }, [event, open]);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      message.error("Event title is required");
      return;
    }
    if (!form.dateRange || !form.dateRange[0] || !form.dateRange[1]) {
      message.error("Please select a date range");
      return;
    }

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      eventType: form.eventType,
      startDate:
        typeof form.dateRange[0] === "string"
          ? form.dateRange[0]
          : form.dateRange[0].toISOString
            ? form.dateRange[0].toISOString()
            : form.dateRange[0],
      endDate:
        typeof form.dateRange[1] === "string"
          ? form.dateRange[1]
          : form.dateRange[1].toISOString
            ? form.dateRange[1].toISOString()
            : form.dateRange[1],
      roleVisibility: form.roleVisibility,
      classId: form.classId || undefined,
      isPublished: form.isPublished,
      isAllDay: form.isAllDay,
    };

    onSubmit(data);
  };

  const eventTypeOptions = EVENT_TYPES.map((t) => ({
    value: t.value,
    label: (
      <span className="flex items-center gap-2">
        <span>{t.icon}</span>
        <span>{t.label}</span>
      </span>
    ),
  }));

  const classOptions = classes.map((c) => ({
    value: c._id,
    label: `${c.name}${c.section ? ` - ${c.section}` : ""}`,
  }));

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span className="font-semibold">
            {isEdit ? "Edit Event" : "Create New Event"}
          </span>
        </div>
      }
      okText={isEdit ? "Update Event" : "Create Event"}
      width={600}
      destroyOnClose>
      <div className="space-y-5 py-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Event Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter event title"
            size="large"
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter event description (optional)"
            rows={3}
            maxLength={1000}
            showCount
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Event Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.eventType}
            onChange={(val) => setForm({ ...form, eventType: val })}
            options={eventTypeOptions}
            className="w-full"
            size="large"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Date Range <span className="text-red-500">*</span>
          </label>
          <RangePicker
            value={form.dateRange}
            onChange={(dates) => setForm({ ...form, dateRange: dates })}
            className="w-full"
            size="large"
            format="YYYY-MM-DD"
          />
        </div>

        {/* Role Visibility */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Visible To
          </label>
          <Select
            mode="multiple"
            value={form.roleVisibility}
            onChange={(val) => setForm({ ...form, roleVisibility: val })}
            options={ROLE_OPTIONS}
            className="w-full"
            size="large"
            placeholder="Select roles"
          />
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Class (Optional)
          </label>
          <Select
            value={form.classId}
            onChange={(val) => setForm({ ...form, classId: val })}
            options={[
              { value: null, label: "All Classes (Global)" },
              ...classOptions,
            ]}
            className="w-full"
            size="large"
            placeholder="Select class or leave for all"
            allowClear
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <div className="text-sm font-medium text-slate-700">
              Publish Event
            </div>
            <div className="text-xs text-slate-400">
              Only published events are visible to users
            </div>
          </div>
          <Switch
            checked={form.isPublished}
            onChange={(checked) => setForm({ ...form, isPublished: checked })}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;
