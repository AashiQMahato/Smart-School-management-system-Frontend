import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  Tag,
  Tabs,
  message,
  Empty,
  Spin,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  EyeOutlined,
  SendOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  createExam,
  getAllExams,
  updateExam,
  deleteExam,
  addExamSubjects,
  getExamSubjects,
  getApprovalQueue,
  approveMarks,
  rejectMarks,
  publishExamResults,
  unpublishExamResults,
  getExamResults,
  getClassAnalytics,
} from "../../../services/exam.service";
import { getAllClasses } from "../../../services/class.service";
import { getAllSubjects } from "../../../services/subject.service";
import { GradeBadge, ResultTable } from "../../../components/Results";

const examTypes = [
  { value: "unit-test-1", label: "Unit Test 1" },
  { value: "unit-test-2", label: "Unit Test 2" },
  { value: "midterm", label: "Midterm" },
  { value: "final", label: "Final" },
  { value: "assignment", label: "Assignment" },
  { value: "practical", label: "Practical" },
];

const statusColors = {
  upcoming: "blue",
  ongoing: "orange",
  completed: "green",
  cancelled: "red",
};

const AdminResultsPage = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Exam modal
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examForm] = Form.useForm();

  // Subject assignment modal
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examSubjects, setExamSubjects] = useState([]);
  const [subjectForm] = Form.useForm();

  // Approval queue
  const [approvalQueue, setApprovalQueue] = useState([]);

  // Approval details (view marks)
  const [approvalDetailsOpen, setApprovalDetailsOpen] = useState(false);
  const [selectedApprovalItem, setSelectedApprovalItem] = useState(null);
  const [approvalMarks, setApprovalMarks] = useState([]);
  const [approvalMarksLoading, setApprovalMarksLoading] = useState(false);

  // Results view
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [selectedClassForResults, setSelectedClassForResults] = useState(null);

  // Analytics
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (activeTab === "approval") fetchApprovalQueue();
  }, [activeTab]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await getAllExams();
      setExams(res.data || []);
    } catch (e) {
      message.error(e.message || "Error fetching exams");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await getAllClasses();
      setClasses(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getAllSubjects();
      setSubjects(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApprovalQueue = async () => {
    setLoading(true);
    try {
      const res = await getApprovalQueue();
      setApprovalQueue(res.data || []);
    } catch (e) {
      message.error(e.message || "Error fetching approval queue");
    } finally {
      setLoading(false);
    }
  };

  const openApprovalDetails = async (row) => {
    const examId = row?.examId?._id;
    const classId = row?.classId?._id;
    const subjectId = row?.subjectId?._id;

    if (!examId || !classId || !subjectId) {
      message.error("Missing exam/class/subject for this approval item");
      return;
    }

    setSelectedApprovalItem(row);
    setApprovalDetailsOpen(true);
    setApprovalMarks([]);
    setApprovalMarksLoading(true);
    try {
      const res = await getExamResults(examId, classId, subjectId);
      setApprovalMarks(res.data || []);
    } catch (e) {
      message.error(e?.message || "Error loading marks");
      setApprovalMarks([]);
    } finally {
      setApprovalMarksLoading(false);
    }
  };

  // ===== EXAM CRUD =====

  const handleExamSubmit = async () => {
    try {
      const values = await examForm.validateFields();
      const payload = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };
      delete payload.dateRange;

      if (editingExam) {
        await updateExam(editingExam._id, payload);
        message.success("Exam updated");
      } else {
        await createExam(payload);
        message.success("Exam created");
      }
      setExamModalOpen(false);
      examForm.resetFields();
      setEditingExam(null);
      fetchExams();
    } catch (e) {
      if (e.errorFields) return;
      message.error(e.message || "Error saving exam");
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await deleteExam(id);
      message.success("Exam deleted");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error deleting exam");
    }
  };

  const openEditExam = (exam) => {
    setEditingExam(exam);
    examForm.setFieldsValue({
      name: exam.name,
      examType: exam.examType,
      academicYear: exam.academicYear,
      classes: exam.classes?.map((c) => c._id),
      description: exam.description,
      status: exam.status,
      dateRange: [dayjs(exam.startDate), dayjs(exam.endDate)],
    });
    setExamModalOpen(true);
  };

  // ===== SUBJECT ASSIGNMENT =====

  const openSubjectModal = async (exam) => {
    setSelectedExam(exam);
    setSubjectModalOpen(true);
    try {
      const res = await getExamSubjects(exam._id);
      setExamSubjects(res.data || []);
    } catch (e) {
      message.error("Error loading exam subjects");
    }
  };

  const handleAddSubjects = async () => {
    try {
      const values = await subjectForm.validateFields();
      const subjectsPayload = values.subjects.map((s) => ({
        subjectId: s.subjectId,
        classId: s.classId,
        maxMarks: s.maxMarks,
        passingMarks: s.passingMarks,
        examDate: s.examDate?.toISOString() || null,
      }));
      await addExamSubjects(selectedExam._id, subjectsPayload);
      message.success("Subjects assigned");
      subjectForm.resetFields();
      const res = await getExamSubjects(selectedExam._id);
      setExamSubjects(res.data || []);
    } catch (e) {
      if (e.errorFields) return;
      message.error(e.message || "Error assigning subjects");
    }
  };

  // ===== APPROVAL =====

  const handleApprove = async (id) => {
    try {
      await approveMarks(id);
      message.success("Marks approved");
      fetchApprovalQueue();
      if (selectedApprovalItem?._id === id) {
        setApprovalDetailsOpen(false);
        setSelectedApprovalItem(null);
        setApprovalMarks([]);
      }
    } catch (e) {
      message.error(e.message || "Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectMarks(id);
      message.success("Marks rejected");
      fetchApprovalQueue();
      if (selectedApprovalItem?._id === id) {
        setApprovalDetailsOpen(false);
        setSelectedApprovalItem(null);
        setApprovalMarks([]);
      }
    } catch (e) {
      message.error(e.message || "Error rejecting");
    }
  };

  // ===== PUBLISH =====

  const handlePublish = async (examId, classId) => {
    try {
      await publishExamResults(examId, classId);
      message.success("Results published");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error publishing");
    }
  };

  const handleUnpublish = async (examId, classId) => {
    try {
      await unpublishExamResults(examId, classId);
      message.success("Results unpublished");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error unpublishing");
    }
  };

  // ===== VIEW RESULTS =====

  const openResults = async (exam, classId) => {
    setSelectedExam(exam);
    setSelectedClassForResults(classId);
    setResultsModalOpen(true);
    setResultsLoading(true);
    try {
      const res = await getExamResults(exam._id, classId);
      setResultsData(res.data || []);
    } catch (e) {
      message.error("Error loading results");
    } finally {
      setResultsLoading(false);
    }
  };

  // ===== ANALYTICS =====

  const openAnalytics = async (exam, classId) => {
    setSelectedExam(exam);
    setAnalyticsModalOpen(true);
    setAnalyticsLoading(true);
    try {
      const res = await getClassAnalytics(exam._id, classId);
      setAnalyticsData(res.data || null);
      if (res.message) {
        message.info(res.message);
      }
    } catch (e) {
      message.error("Error loading analytics");
      setAnalyticsData(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ===== STATUS CONFIG =====
  const statusConfig = {
    upcoming: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Upcoming",
    },
    ongoing: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      dot: "bg-orange-500",
      label: "Ongoing",
    },
    completed: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Completed",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  };

  // ===== EXAM CARD RENDERER =====
  const ExamCard = ({ exam }) => {
    const sc = statusConfig[exam.status] || statusConfig.upcoming;
    const typeLabel =
      examTypes.find((e) => e.value === exam.examType)?.label || exam.examType;
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
              <CalendarOutlined className="text-rose-600 text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                {exam.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {typeLabel} · {exam.academicYear}
              </p>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </div>
        </div>

        {/* Date Row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <CalendarOutlined className="text-slate-400" />
          <span>
            {dayjs(exam.startDate).format("DD MMM YYYY")} –{" "}
            {dayjs(exam.endDate).format("DD MMM YYYY")}
          </span>
        </div>

        {/* Classes */}
        {exam.classes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {exam.classes.map((c) => (
              <span
                key={c._id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                {c.name}-{c.section}
              </span>
            ))}
          </div>
        )}

        {/* Primary Actions */}
        <div className="flex items-center gap-2 mb-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => openEditExam(exam)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            <EditOutlined /> Edit
          </button>
          <button
            onClick={() => openSubjectModal(exam)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 transition-colors">
            <FileTextOutlined /> Subjects
          </button>
          <Popconfirm
            title="Delete this exam?"
            onConfirm={() => handleDeleteExam(exam._id)}>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
              <DeleteOutlined /> Delete
            </button>
          </Popconfirm>
        </div>

        {/* Per-Class Actions */}
        {exam.classes?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Class Actions
            </p>
            {exam.classes.map((c) => (
              <div
                key={c._id}
                className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-2">
                <span className="text-xs font-bold text-slate-600 min-w-16">
                  {c.name}-{c.section}
                </span>
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  <button
                    onClick={() => openResults(exam, c._id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors">
                    <EyeOutlined /> Results
                  </button>
                  <button
                    onClick={() => openAnalytics(exam, c._id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors">
                    <BarChartOutlined /> Analytics
                  </button>
                  <button
                    onClick={() => handlePublish(exam._id, c._id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors">
                    <SendOutlined /> Publish
                  </button>
                  <button
                    onClick={() => handleUnpublish(exam._id, c._id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors">
                    <CloseCircleOutlined /> Unpublish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const approvalColumns = [
    {
      title: "Exam",
      key: "exam",
      render: (_, r) => (
        <div>
          <span className="font-semibold">{r.examId?.name}</span>
          <br />
          <span className="text-xs text-slate-500">
            {examTypes.find((e) => e.value === r.examId?.examType)?.label}
          </span>
        </div>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      render: (_, r) =>
        r.subjectId ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
              <FileTextOutlined className="text-violet-600 text-xs" />
            </div>
            <div>
              <div className="font-medium text-slate-800 text-sm">
                {r.subjectId.name}
              </div>
              <div className="text-xs text-slate-400">{r.subjectId.code}</div>
            </div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Class",
      key: "class",
      render: (_, r) =>
        r.classId ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            {r.classId.name}-{r.classId.section}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Submitted By",
      key: "teacher",
      render: (_, r) => {
        const name = r.submittedBy?.userId?.name || "—";
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
              {name[0]?.toUpperCase()}
            </div>
            <span className="text-sm text-slate-700">{name}</span>
          </div>
        );
      },
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "at",
      render: (v) =>
        v ? (
          <div>
            <div className="text-sm font-medium text-slate-700">
              {dayjs(v).format("DD MMM YYYY")}
            </div>
            <div className="text-xs text-slate-400">
              {dayjs(v).format("HH:mm")}
            </div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openApprovalDetails(r)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors">
            <EyeOutlined /> View Marks
          </button>
          <button
            onClick={() => handleApprove(r._id)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors">
            <CheckCircleOutlined /> Approve
          </button>
          <button
            onClick={() => handleReject(r._id)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
            <CloseCircleOutlined /> Reject
          </button>
        </div>
      ),
    },
  ];

  const approvalMarksColumns = [
    {
      title: "Roll No",
      key: "roll",
      width: 100,
      render: (_, r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
          {r.studentId?.rollNumber ?? "—"}
        </span>
      ),
    },
    {
      title: "Student",
      key: "student",
      render: (_, r) => {
        const name = r.studentId?.userId?.name || "Unknown";
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-black text-blue-600">
              {name[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-800">{name}</span>
          </div>
        );
      },
    },
    {
      title: "Marks",
      key: "marks",
      width: 120,
      render: (_, r) => (
        <span className="text-base font-black text-slate-800">
          {typeof r.marksObtained === "number" ? r.marksObtained : "—"}
        </span>
      ),
    },
    {
      title: "Result",
      key: "status",
      width: 120,
      render: (_, r) =>
        r.isPassed ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            <CheckCircleOutlined /> PASS
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
            <CloseCircleOutlined /> FAIL
          </span>
        ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (v) =>
        v ? (
          <span className="text-xs text-slate-500 italic">{v}</span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
  ];

  const tabItems = [
    {
      key: "exams",
      label: (
        <span className="flex items-center gap-1.5">
          <CalendarOutlined /> Exams
          {exams.length > 0 && (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold">
              {exams.length}
            </span>
          )}
        </span>
      ),
      children: (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
                <CalendarOutlined className="text-rose-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">All Exams</h2>
                <p className="text-xs text-slate-400">
                  {exams.length} exam{exams.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchExams}
                loading={loading}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-rose-600"
                onClick={() => {
                  setEditingExam(null);
                  examForm.resetFields();
                  setExamModalOpen(true);
                }}>
                Create Exam
              </Button>
            </div>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-50 rounded-2xl p-5 animate-pulse">
                    <div className="flex gap-3 mb-3">
                      <div className="w-11 h-11 bg-slate-200 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded" />
                      <div className="h-8 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : exams.length === 0 ? (
              <Empty
                description="No exams created yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-10"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {exams.map((exam) => (
                  <ExamCard key={exam._id} exam={exam} />
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "approval",
      label: (
        <span className="flex items-center gap-1.5">
          <CheckCircleOutlined /> Approval Queue
          {approvalQueue.length > 0 && (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 font-bold">
              {approvalQueue.length}
            </span>
          )}
        </span>
      ),
      children: (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">
                  Marks Approval Queue
                </h2>
                <p className="text-xs text-slate-400">
                  {approvalQueue.length} pending review
                </p>
              </div>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchApprovalQueue}
              loading={loading}>
              Refresh
            </Button>
          </div>
          <div className="p-4">
            {approvalQueue.length === 0 ? (
              <Empty
                description={
                  <span className="text-slate-500">
                    All marks have been reviewed
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="my-10"
              />
            ) : (
              <Table
                columns={approvalColumns}
                dataSource={approvalQueue}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                rowClassName="hover:bg-amber-50/30"
                scroll={{ x: 900 }}
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-rose-50 via-white to-orange-50 min-h-screen">
      {/* Gradient Header */}
      <div className="bg-rose-500 rounded-3xl p-8 text-white shadow-2xl border border-rose-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrophyOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Result Management
              </h1>
              <p className="text-rose-100 text-sm mt-0.5">
                Create exams, approve marks, publish results & view analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchExams}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-sm font-medium transition-all border border-white/20 backdrop-blur-sm">
              <ReloadOutlined />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingExam(null);
                examForm.resetFields();
                setExamModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-700 rounded-2xl text-sm font-bold hover:bg-rose-50 transition-all shadow-lg">
              <PlusOutlined />
              Create Exam
            </button>
          </div>
        </div>
        {/* Mini stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Total Exams", value: exams.length, bg: "bg-white/15" },
            {
              label: "Pending Approval",
              value: approvalQueue.length,
              bg: "bg-amber-500/30",
            },
            {
              label: "Upcoming",
              value: exams.filter((e) => e.status === "upcoming").length,
              bg: "bg-blue-500/30",
            },
            {
              label: "Completed",
              value: exams.filter((e) => e.status === "completed").length,
              bg: "bg-emerald-500/30",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-3 text-center border border-white/10`}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-rose-100 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* Approval Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <CheckCircleOutlined className="text-amber-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Review Submitted Marks
            </span>
          </div>
        }
        open={approvalDetailsOpen}
        onCancel={() => {
          setApprovalDetailsOpen(false);
          setSelectedApprovalItem(null);
          setApprovalMarks([]);
        }}
        footer={
          selectedApprovalItem
            ? [
                <Button
                  key="close"
                  onClick={() => {
                    setApprovalDetailsOpen(false);
                    setSelectedApprovalItem(null);
                    setApprovalMarks([]);
                  }}>
                  Close
                </Button>,
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(selectedApprovalItem._id)}>
                  Reject
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  className="bg-green-600"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApprove(selectedApprovalItem._id)}>
                  Approve
                </Button>,
              ]
            : null
        }
        width={900}>
        {selectedApprovalItem ? (
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarOutlined className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      {selectedApprovalItem.examId?.name}
                    </span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-200 text-amber-800">
                      {examTypes.find(
                        (e) =>
                          e.value === selectedApprovalItem.examId?.examType,
                      )?.label || selectedApprovalItem.examId?.examType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <FileTextOutlined className="text-violet-500" />
                      {selectedApprovalItem.subjectId?.name} (
                      {selectedApprovalItem.subjectId?.code})
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {selectedApprovalItem.classId?.name}-
                      {selectedApprovalItem.classId?.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span>
                      Max: <strong>{selectedApprovalItem.maxMarks}</strong>
                    </span>
                    <span>
                      Pass: <strong>{selectedApprovalItem.passingMarks}</strong>
                    </span>
                    <span>
                      By:{" "}
                      <strong>
                        {selectedApprovalItem.submittedBy?.userId?.name || "—"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Table
              columns={approvalMarksColumns}
              dataSource={approvalMarks}
              rowKey="_id"
              loading={approvalMarksLoading}
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: approvalMarksLoading
                  ? "Loading..."
                  : "No marks found for this submission",
              }}
            />
          </div>
        ) : (
          <Empty description="No approval selected" />
        )}
      </Modal>

      {/* Create/Edit Exam Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-rose-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              {editingExam ? "Edit Exam" : "Create New Exam"}
            </span>
          </div>
        }
        open={examModalOpen}
        onOk={handleExamSubmit}
        onCancel={() => {
          setExamModalOpen(false);
          setEditingExam(null);
        }}
        okText={editingExam ? "Update" : "Create"}
        okButtonProps={{ className: "bg-blue-600" }}
        width={600}>
        <Form form={examForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Exam Name"
            rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="e.g. Midterm Examination 2026" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="examType"
              label="Exam Type"
              rules={[{ required: true }]}>
              <Select options={examTypes} placeholder="Select type" />
            </Form.Item>
            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true }]}>
              <Input placeholder="2025-2026" />
            </Form.Item>
          </div>
          <Form.Item
            name="dateRange"
            label="Exam Dates"
            rules={[{ required: true }]}>
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="classes"
            label="Assign to Classes"
            rules={[{ required: true }]}>
            <Select
              mode="multiple"
              placeholder="Select classes"
              options={classes.map((c) => ({
                value: c._id,
                label: `${c.name} - ${c.section}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              placeholder="Select status"
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subject Assignment Modal */}
      <Modal
        title={`Manage Subjects – ${selectedExam?.name || ""}`}
        open={subjectModalOpen}
        onCancel={() => setSubjectModalOpen(false)}
        footer={null}
        width={800}>
        {examSubjects.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Assigned Subjects</h4>
            <Table
              size="small"
              dataSource={examSubjects}
              rowKey="_id"
              pagination={false}
              columns={[
                {
                  title: "Subject",
                  render: (_, r) =>
                    r.subjectId
                      ? `${r.subjectId.name} (${r.subjectId.code})`
                      : "—",
                },
                {
                  title: "Class",
                  render: (_, r) =>
                    r.classId ? `${r.classId.name}-${r.classId.section}` : "—",
                },
                { title: "Max", dataIndex: "maxMarks" },
                { title: "Pass", dataIndex: "passingMarks" },
                {
                  title: "Status",
                  dataIndex: "marksEntryStatus",
                  render: (s) => {
                    const colors = {
                      pending: "default",
                      draft: "orange",
                      submitted: "blue",
                      approved: "green",
                    };
                    return <Tag color={colors[s]}>{s?.toUpperCase()}</Tag>;
                  },
                },
              ]}
            />
          </div>
        )}

        <h4 className="font-semibold mb-2">Add Subjects</h4>
        <Form form={subjectForm} layout="vertical">
          <Form.List name="subjects" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <div
                    key={key}
                    className="grid grid-cols-5 gap-2 items-end mb-2">
                    <Form.Item
                      {...rest}
                      name={[name, "subjectId"]}
                      rules={[{ required: true }]}>
                      <Select
                        placeholder="Subject"
                        options={subjects.map((s) => ({
                          value: s._id,
                          label: `${s.name} (${s.code})`,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "classId"]}
                      rules={[{ required: true }]}>
                      <Select
                        placeholder="Class"
                        options={classes.map((c) => ({
                          value: c._id,
                          label: `${c.name}-${c.section}`,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "maxMarks"]}
                      rules={[{ required: true }]}>
                      <InputNumber
                        placeholder="Max"
                        min={1}
                        className="w-full"
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "passingMarks"]}
                      rules={[{ required: true }]}>
                      <InputNumber
                        placeholder="Pass"
                        min={0}
                        className="w-full"
                      />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Subject Row
                </Button>
              </>
            )}
          </Form.List>
          <Button
            type="primary"
            className="bg-blue-600 mt-4"
            onClick={handleAddSubjects}>
            Save Subjects
          </Button>
        </Form>
      </Modal>

      {/* Results View Modal */}
      <Modal
        title={`Results – ${selectedExam?.name || ""}`}
        open={resultsModalOpen}
        onCancel={() => setResultsModalOpen(false)}
        footer={null}
        width={1000}>
        <ResultTable results={resultsData} loading={resultsLoading} />
      </Modal>

      {/* Analytics Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-1">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChartOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Class Analytics – {selectedExam?.name || ""}
            </span>
          </div>
        }
        open={analyticsModalOpen}
        onCancel={() => {
          setAnalyticsModalOpen(false);
          setAnalyticsData(null);
        }}
        footer={null}
        width={900}>
        {analyticsLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : !analyticsData ? (
          <Empty description="No results data available" />
        ) : (
          <div>
            {/* Overview Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">
              {[
                {
                  label: "Total Students",
                  value: analyticsData.overview.totalStudents,
                  color: "bg-slate-50 border-slate-200",
                  text: "text-slate-800",
                },
                {
                  label: "Class Average",
                  value: `${analyticsData.overview.overallAverage}%`,
                  color: "bg-blue-50 border-blue-200",
                  text: "text-blue-700",
                },
                {
                  label: "Passed",
                  value: analyticsData.overview.passCount,
                  color: "bg-emerald-50 border-emerald-200",
                  text: "text-emerald-700",
                },
                {
                  label: "Failed",
                  value: analyticsData.overview.failCount,
                  color: "bg-red-50 border-red-200",
                  text: "text-red-700",
                },
              ].map((tile) => (
                <div
                  key={tile.label}
                  className={`${tile.color} border rounded-2xl p-4 text-center`}>
                  <div className={`text-2xl font-black ${tile.text}`}>
                    {tile.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {tile.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Subject Performance */}
            <h4 className="font-bold text-slate-800 mb-3">
              Subject Performance
            </h4>
            <div className="space-y-3 mb-6">
              {analyticsData.subjectAnalytics?.map((sa, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-slate-800">
                        {sa.subject?.name} ({sa.subject?.code})
                      </span>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Avg: {sa.average} | Highest: {sa.highest} | Lowest:{" "}
                        {sa.lowest}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-blue-700">
                        {sa.passPercentage}%
                      </div>
                      <div className="text-xs text-slate-500">
                        Pass: {sa.passCount} / Fail: {sa.failCount}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${parseFloat(sa.passPercentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Student Ranking */}
            <h4 className="font-bold text-slate-800 mb-3">Student Ranking</h4>
            <Table
              size="small"
              dataSource={analyticsData.studentRanking}
              rowKey={(r) => r.student?._id}
              pagination={{ pageSize: 10 }}
              columns={[
                {
                  title: "Rank",
                  dataIndex: "rank",
                  width: 60,
                  render: (v) => (
                    <span className="font-bold">
                      {v <= 3 ? (
                        <TrophyOutlined className="text-amber-500" />
                      ) : null}{" "}
                      #{v}
                    </span>
                  ),
                },
                {
                  title: "Student",
                  render: (_, r) => r.student?.userId?.name || "—",
                },
                {
                  title: "Total",
                  render: (_, r) => `${r.totalMarks} / ${r.totalMaxMarks}`,
                },
                { title: "%", dataIndex: "percentage", render: (v) => `${v}%` },
                {
                  title: "Grade",
                  dataIndex: "overallGrade",
                  render: (g) => <GradeBadge grade={g} />,
                },
                {
                  title: "Result",
                  render: (_, r) =>
                    r.allPassed ? (
                      <Tag color="success">PASS</Tag>
                    ) : (
                      <Tag color="error">FAIL</Tag>
                    ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminResultsPage;
