import { useState, useEffect } from "react";
import { Select, Table, Tag, Empty, Spin, message, Button, Avatar } from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  PrinterOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import {
  getChildExamResults,
  getReportCard,
} from "../../../services/exam.service";
import { getMyChildren } from "../../../services/parent.service";
import { GradeBadge, ReportCardView } from "../../../components/Results";

const ParentResultsPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await getMyChildren();
      const data = res.data || [];
      setChildren(data);
      if (data.length === 1) {
        handleChildSelect(data[0]._id);
      }
    } catch (e) {
      message.error("Error loading children");
    } finally {
      setLoading(false);
    }
  };

  const handleChildSelect = async (studentId) => {
    setSelectedChild(studentId);
    setSelectedExam(null);
    setResults([]);
    setReportCard(null);
    setLoading(true);
    try {
      const res = await getChildExamResults(studentId);
      const data = res.data || [];
      const examMap = {};
      data.forEach((r) => {
        const examId = r.examId?._id || r.examId;
        if (!examMap[examId]) {
          examMap[examId] = {
            examId,
            examName: r.examId?.name || "Exam",
            examType: r.examId?.examType || "",
            results: [],
          };
        }
        examMap[examId].results.push(r);
      });
      setExams(Object.values(examMap));
    } catch (e) {
      message.error("Error loading results");
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = async (examId) => {
    const exam = exams.find((e) => e.examId === examId);
    setSelectedExam(exam);
    setResults(exam?.results || []);
    setReportCard(null);
    setLoadingReport(true);
    try {
      const res = await getReportCard(selectedChild, examId);
      setReportCard(res.data || null);
    } catch {
      // May not be available
    } finally {
      setLoadingReport(false);
    }
  };

  const computeSummary = () => {
    if (!results.length) return null;
    const totalObtained = results.reduce(
      (s, r) => s + (r.marksObtained || 0),
      0,
    );
    const totalMax = results.reduce(
      (s, r) => s + (r.maxMarks ?? r.totalMarks ?? 0),
      0,
    );
    const pct =
      totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
    const allPassed = results.every((r) => r.isPassed);
    return { totalObtained, totalMax, percentage: pct, allPassed };
  };

  const summary = selectedExam ? computeSummary() : null;

  const columns = [
    { title: "#", width: 50, render: (_, __, i) => i + 1 },
    {
      title: "Subject",
      dataIndex: "subjectId",
      render: (s) => s?.name || "—",
    },
    {
      title: "Marks",
      render: (_, r) =>
        `${r.marksObtained} / ${r.maxMarks ?? r.totalMarks ?? 0}`,
      width: 100,
    },
    {
      title: "%",
      dataIndex: "percentage",
      render: (v) => `${v ?? 0}%`,
      width: 70,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      render: (g) => <GradeBadge grade={g} />,
      width: 80,
    },
    {
      title: "Result",
      dataIndex: "isPassed",
      width: 80,
      render: (v) =>
        v ? <Tag color="success">PASS</Tag> : <Tag color="error">FAIL</Tag>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (v) => v || "—",
    },
  ];

  const getGradeColor = (pct) => {
    const p = parseFloat(pct);
    if (p >= 90)
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-600",
        light: "bg-emerald-50",
      };
    if (p >= 75)
      return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" };
    if (p >= 60)
      return {
        bg: "bg-amber-500",
        text: "text-amber-600",
        light: "bg-amber-50",
      };
    if (p >= 40)
      return {
        bg: "bg-orange-500",
        text: "text-orange-600",
        light: "bg-orange-50",
      };
    return { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50" };
  };

  const selectedChildData = children.find((c) => c._id === selectedChild);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !children.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 -m-6 p-6">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Child Exam Results</h1>
              <p className="text-purple-100">
                Monitor your child's academic performance
              </p>
            </div>
            {selectedChildData && (
              <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-5 py-3 border border-white/20">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="bg-white/20"
                />
                <div>
                  <div className="font-bold text-sm">
                    {selectedChildData.userId?.name}
                  </div>
                  <div className="text-purple-200 text-xs">
                    {selectedChildData.classId?.name} –{" "}
                    {selectedChildData.section}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selectors */}
        <div className="no-print mb-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <UserOutlined className="text-purple-500" /> Select Child
              </label>
              <Select
                className="w-full"
                placeholder="Choose your child..."
                size="large"
                value={selectedChild}
                onChange={handleChildSelect}
                options={children.map((c) => ({
                  value: c._id,
                  label: `${c.userId?.name || "Student"} – ${c.classId?.name || ""}${c.section ? " " + c.section : ""}`,
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Select Exam
              </label>
              <Select
                className="w-full"
                placeholder={
                  selectedChild ? "Choose an exam..." : "Select child first"
                }
                size="large"
                disabled={!selectedChild || !exams.length}
                onChange={handleExamSelect}
                options={exams.map((e) => ({
                  value: e.examId,
                  label: `${e.examName}${e.examType ? ` (${e.examType})` : ""}`,
                }))}
              />
            </div>
          </div>
        </div>

        {loading && selectedChild ? (
          <div className="text-center py-16">
            <Spin size="large" />
            <p className="text-slate-400 mt-3">Loading results...</p>
          </div>
        ) : selectedExam ? (
          <div id="printable-report">
            {/* Exam Title Banner */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedExam.examName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {selectedExam.examType && (
                    <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                      {selectedExam.examType}
                    </span>
                  )}
                  {selectedChildData && (
                    <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-sm">
                      {selectedChildData.userId?.name}
                    </span>
                  )}
                </div>
              </div>
              {summary && (
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  className="no-print"
                  size="large">
                  Download / Print PDF
                </Button>
              )}
            </div>

            {/* Summary Cards */}
            {summary &&
              (() => {
                const colors = getGradeColor(summary.percentage);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BookOutlined className="text-xl text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {summary.totalObtained}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        of {summary.totalMax} marks
                      </div>
                      <div className="text-sm font-medium text-slate-600 mt-1">
                        Total Marks
                      </div>
                    </div>

                    <div
                      className={`${colors.light} rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow`}>
                      <div
                        className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <PercentageOutlined className="text-xl text-white" />
                      </div>
                      <div className={`text-2xl font-bold ${colors.text}`}>
                        {summary.percentage}%
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Overall Score
                      </div>
                      <div className="text-sm font-medium text-slate-600 mt-1">
                        Percentage
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FileTextOutlined className="text-xl text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {results.length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Subjects taken
                      </div>
                      <div className="text-sm font-medium text-slate-600 mt-1">
                        Subjects
                      </div>
                    </div>

                    <div
                      className={`${summary.allPassed ? "bg-emerald-50" : "bg-red-50"} rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow`}>
                      <div
                        className={`w-12 h-12 ${summary.allPassed ? "bg-emerald-500" : "bg-red-500"} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        {summary.allPassed ? (
                          <CheckCircleOutlined className="text-xl text-white" />
                        ) : (
                          <CloseCircleOutlined className="text-xl text-white" />
                        )}
                      </div>
                      <div
                        className={`text-2xl font-bold ${summary.allPassed ? "text-emerald-600" : "text-red-600"}`}>
                        {summary.allPassed ? "PASS" : "FAIL"}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {summary.allPassed
                          ? "All subjects cleared"
                          : "Some subjects failed"}
                      </div>
                      <div className="text-sm font-medium text-slate-600 mt-1">
                        Overall Result
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Subject Results Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrophyOutlined className="text-purple-600" />
                </div>
                <span className="font-bold text-slate-800 text-lg">
                  Subject-wise Results
                </span>
              </div>
              <Table
                columns={columns}
                dataSource={results}
                rowKey="_id"
                pagination={false}
                size="middle"
                rowClassName={(r) => (r.isPassed ? "" : "bg-red-50")}
              />
            </div>

            {/* Report Card */}
            {loadingReport ? (
              <div className="text-center py-12">
                <Spin size="large" />
                <p className="text-sm text-slate-500 mt-3">
                  Loading report card...
                </p>
              </div>
            ) : reportCard ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileTextOutlined className="text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg">
                      Official Report Card
                    </span>
                  </div>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    className="no-print">
                    Print / Save PDF
                  </Button>
                </div>
                <div className="p-6">
                  <ReportCardView data={reportCard} />
                </div>
              </div>
            ) : null}
          </div>
        ) : selectedChild && exams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileTextOutlined className="text-4xl text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No results published yet
            </h3>
            <p className="text-slate-400">
              Exam results for this child will appear here once published by the
              school.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyOutlined className="text-4xl text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Select a child and exam above
            </h3>
            <p className="text-slate-400">
              Results and report card will appear here
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ParentResultsPage;
