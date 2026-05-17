import { useState, useEffect } from "react";
import {
  Card,
  Select,
  Table,
  Button,
  InputNumber,
  Input,
  message,
  Tag,
  Space,
  Tabs,
  Empty,
  Spin,
  Statistic,
  Progress,
} from "antd";
import {
  SendOutlined,
  SaveOutlined,
  EyeOutlined,
  BarChartOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getTeacherExams,
  getExamSubjects,
  enterMarks,
  submitMarksForApproval,
  getExamResults,
  getClassAnalytics,
} from "../../../services/exam.service";
import { getStudentsByClass } from "../../../services/teacher.service";
import { GradeBadge } from "../../../components/Results";

const examTypeLabels = {
  "unit-test-1": "Unit Test 1",
  "unit-test-2": "Unit Test 2",
  midterm: "Midterm",
  final: "Final",
  assignment: "Assignment",
  practical: "Practical",
};

const TeacherResultsPage = () => {
  const [activeTab, setActiveTab] = useState("enter");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examSubjects, setExamSubjects] = useState([]);
  const [selectedExamSubject, setSelectedExamSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Performance view
  const [resultsData, setResultsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await getTeacherExams();
      setExams(res.data || []);
    } catch (e) {
      message.error("Error loading exams");
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = async (examId) => {
    const exam = exams.find((e) => e._id === examId);
    setSelectedExam(exam);
    setSelectedExamSubject(null);
    setSelectedClassId(null);
    setStudents([]);
    setMarksData([]);
    try {
      const res = await getExamSubjects(examId);
      setExamSubjects(res.data || []);
    } catch (e) {
      message.error("Error loading subjects");
    }
  };

  const refreshExamSubjects = async (examId, keepSelectedId = null) => {
    try {
      const res = await getExamSubjects(examId);
      const list = res.data || [];
      setExamSubjects(list);
      if (keepSelectedId) {
        const updated = list.find((x) => x._id === keepSelectedId);
        if (updated) setSelectedExamSubject(updated);
      }
    } catch {
      // no-op: caller already shows error where relevant
    }
  };

  const handleSubjectSelect = async (esId) => {
    const es = examSubjects.find((s) => s._id === esId);
    setSelectedExamSubject(es);
    setSelectedClassId(es?.classId?._id);
    setStudents([]);
    setMarksData([]);
    setLoading(true);
    try {
      const classId = es?.classId?._id;
      const subjectId = es?.subjectId?._id;
      if (!classId || !subjectId || !selectedExam?._id) {
        throw new Error("Please select a valid exam, class, and subject");
      }

      const studentRes = await getStudentsByClass(classId, subjectId);
      const studentList = studentRes.data || [];

      // Load existing marks
      const resultsRes = await getExamResults(
        selectedExam._id,
        classId,
        subjectId,
      );
      const existingResults = resultsRes.data || [];

      const mergedMarks = studentList.map((stu) => {
        const existing = existingResults.find(
          (r) => r.studentId?._id === stu._id,
        );
        return {
          studentId: stu._id,
          studentName: stu.userId?.name || "—",
          rollNumber: stu.rollNumber || "—",
          marksObtained: existing?.marksObtained ?? "",
          remarks: existing?.remarks || "",
          resultId: existing?._id || null,
        };
      });
      setMarksData(mergedMarks);
      setStudents(studentList);
    } catch (e) {
      setStudents([]);
      setMarksData([]);
      message.error(e.message || "Error loading students");
    } finally {
      setLoading(false);
    }
  };

  const updateMarks = (index, field, value) => {
    const updated = [...marksData];
    updated[index][field] = value;
    setMarksData(updated);
  };

  const handleSaveMarks = async () => {
    if (!selectedExam || !selectedExamSubject) return;
    const valid = marksData.filter(
      (m) => m.marksObtained !== "" && m.marksObtained !== null,
    );
    if (!valid.length) {
      message.warning("Enter at least one student's marks");
      return;
    }

    // Validate max marks
    const max = selectedExamSubject.maxMarks;
    const invalid = valid.filter(
      (m) => m.marksObtained > max || m.marksObtained < 0,
    );
    if (invalid.length) {
      message.error(`Marks must be between 0 and ${max}`);
      return;
    }

    setSaving(true);
    try {
      await enterMarks(
        selectedExam._id,
        selectedExamSubject._id,
        valid.map((m) => ({
          studentId: m.studentId,
          marksObtained: Number(m.marksObtained),
          remarks: m.remarks,
        })),
      );
      message.success("Marks saved as draft");

      await refreshExamSubjects(selectedExam._id, selectedExamSubject._id);
    } catch (e) {
      message.error(
        e?.response?.data?.message || e?.message || "Error saving marks",
      );
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedExamSubject) return;
    if (saving || submitting) return;
    if (!selectedExam?._id) {
      message.warning("Select an exam first");
      return;
    }

    // Ensure marks are persisted before submitting.
    const valid = marksData.filter(
      (m) => m.marksObtained !== "" && m.marksObtained !== null,
    );
    if (!valid.length) {
      message.warning("Enter at least one student's marks");
      return;
    }

    // Validate max marks before submitting.
    const max = selectedExamSubject.maxMarks;
    const invalid = valid.filter(
      (m) => m.marksObtained > max || m.marksObtained < 0,
    );
    if (invalid.length) {
      message.error(`Marks must be between 0 and ${max}`);
      return;
    }

    setSubmitting(true);
    try {
      await enterMarks(
        selectedExam._id,
        selectedExamSubject._id,
        valid.map((m) => ({
          studentId: m.studentId,
          marksObtained: Number(m.marksObtained),
          remarks: m.remarks,
        })),
      );

      await submitMarksForApproval(selectedExamSubject._id);
      message.success("Marks submitted for approval");

      await refreshExamSubjects(selectedExam._id, selectedExamSubject._id);
    } catch (e) {
      message.error(
        e?.response?.data?.message || e?.message || "Error submitting",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PERFORMANCE TAB =====

  const loadPerformance = async (examId, classId) => {
    setLoading(true);
    try {
      const [resResults, resAnalytics] = await Promise.all([
        getExamResults(examId, classId),
        getClassAnalytics(examId, classId),
      ]);
      setResultsData(resResults.data || []);
      setAnalyticsData(resAnalytics.data || null);
    } catch (e) {
      message.error("Error loading performance data");
    } finally {
      setLoading(false);
    }
  };

  const marksColumns = [
    {
      title: "#",
      width: 50,
      render: (_, __, i) => i + 1,
    },
    {
      title: "Roll No",
      dataIndex: "rollNumber",
      width: 90,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
    },
    {
      title: `Marks (Max: ${selectedExamSubject?.maxMarks || "—"})`,
      key: "marks",
      width: 160,
      render: (_, r, i) => (
        <InputNumber
          min={0}
          max={selectedExamSubject?.maxMarks || 100}
          value={r.marksObtained}
          onChange={(v) => updateMarks(i, "marksObtained", v)}
          className="w-full"
          disabled={selectedExamSubject?.marksEntryStatus === "approved"}
        />
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      width: 200,
      render: (_, r, i) => (
        <Input
          value={r.remarks}
          onChange={(e) => updateMarks(i, "remarks", e.target.value)}
          placeholder="Optional"
          disabled={selectedExamSubject?.marksEntryStatus === "approved"}
        />
      ),
    },
  ];

  const tabItems = [
    {
      key: "enter",
      label: "Enter Marks",
      children: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Select Exam
              </label>
              <Select
                className="w-full"
                placeholder="Choose an exam"
                value={selectedExam?._id}
                onChange={handleExamSelect}
                options={exams.map((e) => ({
                  value: e._id,
                  label: `${e.name} (${examTypeLabels[e.examType] || e.examType})`,
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Select Subject
              </label>
              <Select
                className="w-full"
                placeholder="Choose a subject"
                value={selectedExamSubject?._id}
                onChange={handleSubjectSelect}
                disabled={!selectedExam}
                options={examSubjects.map((es) => ({
                  value: es._id,
                  label: `${es.subjectId?.name || "?"} (${es.subjectId?.code || "?"}) – ${es.classId?.name || "?"}-${es.classId?.section || "?"}`,
                }))}
              />
            </div>
          </div>

          {selectedExamSubject && (
            <Card className="border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedExamSubject.subjectId?.name} –{" "}
                    {selectedExamSubject.classId?.name}-
                    {selectedExamSubject.classId?.section}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Max: {selectedExamSubject.maxMarks} | Pass:{" "}
                    {selectedExamSubject.passingMarks} | Status:{" "}
                    <Tag
                      color={
                        {
                          pending: "default",
                          draft: "orange",
                          submitted: "blue",
                          approved: "green",
                        }[selectedExamSubject.marksEntryStatus]
                      }>
                      {selectedExamSubject.marksEntryStatus?.toUpperCase()}
                    </Tag>
                  </p>
                </div>
                <Space>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleSaveMarks}
                    loading={saving}
                    disabled={
                      selectedExamSubject.marksEntryStatus === "approved"
                    }>
                    Save Draft
                  </Button>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    className="bg-blue-600"
                    onClick={handleSubmitForApproval}
                    loading={submitting}
                    disabled={
                      selectedExamSubject.marksEntryStatus === "approved" ||
                      selectedExamSubject.marksEntryStatus === "submitted" ||
                      saving
                    }>
                    Submit for Approval
                  </Button>
                </Space>
              </div>

              <Table
                columns={marksColumns}
                dataSource={marksData}
                rowKey="studentId"
                loading={loading}
                pagination={false}
                size="middle"
              />
            </Card>
          )}

          {!selectedExamSubject && (
            <Empty description="Select an exam and subject to enter marks" />
          )}
        </div>
      ),
    },
    {
      key: "performance",
      label: "Class Performance",
      children: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Select Exam
              </label>
              <Select
                className="w-full"
                placeholder="Choose an exam"
                onChange={(examId) => {
                  const exam = exams.find((e) => e._id === examId);
                  setSelectedExam(exam);
                  if (exam?.classes?.length) {
                    const classId = exam.classes[0]._id;
                    setSelectedClassId(classId);
                    loadPerformance(examId, classId);
                  }
                }}
                options={exams.map((e) => ({
                  value: e._id,
                  label: `${e.name} (${examTypeLabels[e.examType] || e.examType})`,
                }))}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Spin size="large" />
            </div>
          ) : analyticsData ? (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="text-center">
                  <Statistic
                    title="Students"
                    value={analyticsData.overview?.totalStudents || 0}
                  />
                </Card>
                <Card className="text-center">
                  <Statistic
                    title="Average"
                    value={analyticsData.overview?.overallAverage || 0}
                    suffix="%"
                    styles={{ color: "#2563eb" }}
                  />
                </Card>
                <Card className="text-center">
                  <Statistic
                    title="Pass"
                    value={analyticsData.overview?.passCount || 0}
                    styles={{ color: "#16a34a" }}
                  />
                </Card>
                <Card className="text-center">
                  <Statistic
                    title="Fail"
                    value={analyticsData.overview?.failCount || 0}
                    styles={{ color: "#dc2626" }}
                  />
                </Card>
              </div>

              <h4 className="font-semibold mb-3">Subject Breakdown</h4>
              <div className="space-y-3 mb-6">
                {analyticsData.subjectAnalytics?.map((sa, i) => (
                  <Card key={i} size="small">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">
                          {sa.subject?.name}
                        </span>
                        <div className="text-xs text-slate-500">
                          Avg: {sa.average} | High: {sa.highest} | Low:{" "}
                          {sa.lowest}
                        </div>
                      </div>
                      <Progress
                        type="circle"
                        percent={parseFloat(sa.passPercentage)}
                        size={50}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <h4 className="font-semibold mb-3">Student Ranking</h4>
              <Table
                size="small"
                dataSource={analyticsData.studentRanking}
                rowKey={(r) => r.student?._id}
                pagination={{ pageSize: 10 }}
                columns={[
                  { title: "Rank", dataIndex: "rank", width: 60 },
                  {
                    title: "Student",
                    render: (_, r) => r.student?.userId?.name || "—",
                  },
                  {
                    title: "Total",
                    render: (_, r) => `${r.totalMarks} / ${r.totalMaxMarks}`,
                  },
                  {
                    title: "%",
                    dataIndex: "percentage",
                    render: (v) => `${v}%`,
                  },
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
          ) : (
            <Empty description="Select an exam to view performance" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Results</h1>
        <p className="text-slate-500">
          Enter marks for your assigned subjects and view performance
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default TeacherResultsPage;
