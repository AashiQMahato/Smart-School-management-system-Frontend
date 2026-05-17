import { useState, useEffect } from "react";
import { Select, Table, Tag, Empty, Spin, message, Button } from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import {
  getMyExamResults,
  getReportCard,
} from "../../../services/exam.service";
import { getMyStudentProfile } from "../../../services/student.service";
import { GradeBadge, ReportCardView } from "../../../components/Results";

const StudentResultsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [reportCard, setReportCard] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [res, profileRes] = await Promise.all([
        getMyExamResults(),
        getMyStudentProfile().catch(() => ({ data: null })),
      ]);
      setStudentId(profileRes.data?._id || null);

      const data = res.data || [];
      // Group results by exam
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

    if (!studentId) return;
    setLoadingReport(true);
    try {
      const res = await getReportCard(studentId, examId);
      setReportCard(res.data || null);
    } catch {
      // report card may not be available
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
      title: "Code",
      dataIndex: "subjectId",
      render: (s) => s?.code || "—",
      width: 90,
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
      title: "Status",
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
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

      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 -m-6 p-6">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">My Exam Results</h1>
              <p className="text-indigo-100">
                Track your academic performance across all exams
              </p>
            </div>
            {selectedExam && summary && (
              <div className="flex items-center gap-3">
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                  className="no-print bg-white text-indigo-700 border-0 font-semibold hover:bg-indigo-50"
                  size="large">
                  Download / Print PDF
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Exam Selector */}
        <div className="no-print mb-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Select Exam to View Results
          </label>
          <Select
            className="w-full max-w-md"
            placeholder="Choose an exam..."
            size="large"
            onChange={handleExamSelect}
            options={exams.map((e) => ({
              value: e.examId,
              label: `${e.examName}${e.examType ? ` (${e.examType})` : ""}`,
            }))}
          />
          {exams.length === 0 && (
            <p className="text-sm text-slate-400 mt-2">
              No published exam results yet.
            </p>
          )}
        </div>

        {selectedExam ? (
          <div id="printable-report">
            {/* Exam Title Banner */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedExam.examName}
              </h2>
              {selectedExam.examType && (
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                  {selectedExam.examType}
                </span>
              )}
            </div>

            {/* Summary Cards */}
            {summary &&
              (() => {
                const colors = getGradeColor(summary.percentage);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BookOutlined className="text-xl text-indigo-600" />
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
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FileTextOutlined className="text-xl text-purple-600" />
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
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrophyOutlined className="text-indigo-600" />
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
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileTextOutlined className="text-purple-600" />
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
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyOutlined className="text-4xl text-indigo-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Select an exam above
            </h3>
            <p className="text-slate-400">
              Your results and report card will appear here
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentResultsPage;
