/**
 * MarkAttendanceForm Component
 * Form for marking attendance for multiple students
 */

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Table,
  Radio,
  Input,
  Button,
  message,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { getAllClasses } from "../../services/class.service";
import { getAllSubjects } from "../../services/subject.service";
import {
  getStudentsForAttendance,
  markAttendance,
} from "../../services/attendance.service";
import dayjs from "dayjs";

const MarkAttendanceForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchInitialData();
    }
  }, [visible]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedDate) {
      fetchStudents();
    }
  }, [selectedClass, selectedSubject, selectedDate]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        getAllClasses(),
        getAllSubjects(),
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      message.error("Error loading data");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getStudentsForAttendance({
        classId: selectedClass,
        subjectId: selectedSubject,
        date: selectedDate,
      });

      setStudents(response.data || []);

      // Pre-fill attendance data if it exists
      const initialData = {};
      response.data.forEach((student) => {
        if (student.attendance) {
          initialData[student._id] = {
            status: student.attendance.status,
            remarks: student.attendance.remarks || "",
          };
        } else {
          initialData[student._id] = {
            status: "present",
            remarks: "",
          };
        }
      });
      setAttendanceData(initialData);
    } catch (error) {
      message.error("Error loading students");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !selectedDate) {
      message.error("Please select class, subject, and date");
      return;
    }

    const attendanceRecords = students.map((student) => ({
      studentId: student._id,
      status: attendanceData[student._id]?.status || "present",
      remarks: attendanceData[student._id]?.remarks || "",
    }));

    setLoading(true);
    try {
      await markAttendance({
        classId: selectedClass,
        subjectId: selectedSubject,
        date: selectedDate,
        attendanceRecords,
      });

      message.success("Attendance marked successfully");
      onSuccess?.();
      handleClose();
    } catch (error) {
      message.error(error.message || "Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setStudents([]);
    setAttendanceData({});
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedDate(null);
    onClose();
  };

  const markAllAs = (status) => {
    const newData = {};
    students.forEach((student) => {
      newData[student._id] = {
        status,
        remarks: attendanceData[student._id]?.remarks || "",
      };
    });
    setAttendanceData(newData);
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 280,
      render: (_, record) => (
        <Radio.Group
          value={attendanceData[record._id]?.status || "present"}
          onChange={(e) => handleStatusChange(record._id, e.target.value)}
          buttonStyle="solid"
          size="small">
          <Radio.Button value="present">
            <CheckCircleOutlined className="text-green-600" /> Present
          </Radio.Button>
          <Radio.Button value="absent">
            <CloseCircleOutlined className="text-red-600" /> Absent
          </Radio.Button>
          <Radio.Button value="late">
            <ClockCircleOutlined className="text-yellow-600" /> Late
          </Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      render: (_, record) => (
        <Input.TextArea
          placeholder="Optional remarks"
          value={attendanceData[record._id]?.remarks || ""}
          onChange={(e) => handleRemarksChange(record._id, e.target.value)}
          rows={1}
          maxLength={200}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Mark Attendance"
      open={visible}
      onCancel={handleClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={loading}
          disabled={students.length === 0}>
          Save Attendance
        </Button>,
      ]}>
      <div className="space-y-4">
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Class" required>
              <Select
                placeholder="Select class"
                value={selectedClass}
                onChange={setSelectedClass}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }>
                {classes.map((cls) => (
                  <Select.Option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Subject" required>
              <Select
                placeholder="Select subject"
                value={selectedSubject}
                onChange={setSelectedSubject}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }>
                {subjects.map((subject) => (
                  <Select.Option key={subject._id} value={subject._id}>
                    {subject.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Date" required>
              <DatePicker
                className="w-full"
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(date) =>
                  setSelectedDate(date ? date.format("YYYY-MM-DD") : null)
                }
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </div>
        </Form>

        {students.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Students ({students.length})</h4>
              <Space>
                <Button size="small" onClick={() => markAllAs("present")}>
                  Mark All Present
                </Button>
                <Button size="small" onClick={() => markAllAs("absent")}>
                  Mark All Absent
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={students}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default MarkAttendanceForm;
