import { Divider } from "antd";
import GradeBadge from "./GradeBadge";

const ReportCardView = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-10 text-slate-400">
        Loading report card...
      </div>
    );
  }
  if (!data || !data.student) return null;

  const { student, results, summary, exam } = data;

  const getScoreBarColor = (pct) => {
    const p = parseFloat(pct);
    if (p >= 90) return "bg-emerald-500";
    if (p >= 75) return "bg-blue-500";
    if (p >= 60) return "bg-amber-500";
    if (p >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div id="report-card-print" className="font-sans">
      {/* Official Header */}
      <div className="border-2 border-indigo-200 rounded-2xl overflow-hidden">
        {/* School Banner */}
        <div className="bg-linear-to-r from-indigo-700 to-purple-700 text-white px-8 py-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
            <span className="text-2xl font-black text-white">S</span>
          </div>
          <h1 className="text-xl font-black tracking-wide mb-1">
            SMART SCHOOL MANAGEMENT SYSTEM
          </h1>
          <p className="text-indigo-200 text-sm">
            Excellence in Education · Academic Report Card
          </p>
        </div>

        {/* Exam Info Strip */}
        {exam && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-8 py-3 flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="font-semibold text-indigo-800">
              Exam:{" "}
              <span className="text-indigo-600">
                {exam.name || exam.examName || "—"}
              </span>
            </span>
            {exam.examType && (
              <span className="font-semibold text-indigo-800">
                Type: <span className="text-indigo-600">{exam.examType}</span>
              </span>
            )}
            {exam.academicYear && (
              <span className="font-semibold text-indigo-800">
                Year:{" "}
                <span className="text-indigo-600">{exam.academicYear}</span>
              </span>
            )}
          </div>
        )}

        {/* Student Information */}
        <div className="bg-white px-8 py-6 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Student Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                Student Name
              </p>
              <p className="font-bold text-slate-900">
                {student.userId?.name || "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                Admission No.
              </p>
              <p className="font-bold text-slate-900">
                {student.admissionNumber || "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                Class & Section
              </p>
              <p className="font-bold text-slate-900">
                {student.classId
                  ? `${student.classId.name} – ${student.classId.section || student.section || ""}`
                  : "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                Roll Number
              </p>
              <p className="font-bold text-slate-900">
                {student.rollNumber || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white px-8 py-6 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Subject-wise Performance
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50">
                <th className="text-left px-4 py-3 text-indigo-700 font-bold rounded-tl-lg">
                  #
                </th>
                <th className="text-left px-4 py-3 text-indigo-700 font-bold">
                  Subject
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold">
                  Max
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold">
                  Obtained
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold">
                  %
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold w-32">
                  Score Bar
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold">
                  Grade
                </th>
                <th className="text-center px-4 py-3 text-indigo-700 font-bold rounded-tr-lg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const pct = parseFloat(r.percentage ?? 0);
                const barColor = getScoreBarColor(pct);
                return (
                  <tr
                    key={r._id || i}
                    className={`border-b border-slate-100 ${r.isPassed ? "hover:bg-slate-50" : "bg-red-50 hover:bg-red-100"} transition-colors`}>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {r.subjectId?.name || "—"}
                      </div>
                      {r.subjectId?.code && (
                        <div className="text-xs text-slate-400">
                          {r.subjectId.code}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {r.maxMarks ?? r.totalMarks ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      {r.marksObtained ?? "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-bold ${pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
                      {r.percentage != null
                        ? `${parseFloat(r.percentage).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${barColor} transition-all`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <GradeBadge grade={r.grade} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${r.isPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {r.isPassed ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="bg-white px-8 py-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Overall Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-indigo-400 uppercase tracking-wide mb-1">
                  Total Marks
                </p>
                <p className="text-xl font-black text-indigo-800">
                  {summary.totalMarks}
                </p>
                <p className="text-xs text-indigo-400">
                  of {summary.totalMaxMarks}
                </p>
              </div>
              <div
                className={`rounded-2xl p-4 text-center ${parseFloat(summary.overallPercentage) >= 75 ? "bg-emerald-50" : parseFloat(summary.overallPercentage) >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Percentage
                </p>
                <p
                  className={`text-xl font-black ${parseFloat(summary.overallPercentage) >= 75 ? "text-emerald-700" : parseFloat(summary.overallPercentage) >= 50 ? "text-amber-700" : "text-red-700"}`}>
                  {summary.overallPercentage}%
                </p>
                <div className="w-full bg-white/50 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full ${getScoreBarColor(summary.overallPercentage)}`}
                    style={{
                      width: `${Math.min(parseFloat(summary.overallPercentage), 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-purple-400 uppercase tracking-wide mb-2">
                  Overall Grade
                </p>
                <GradeBadge grade={summary.overallGrade} size="large" />
              </div>
              <div
                className={`rounded-2xl p-4 text-center ${summary.result === "PASS" ? "bg-emerald-50" : "bg-red-50"}`}>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                  Final Result
                </p>
                <p
                  className={`text-xl font-black ${summary.result === "PASS" ? "text-emerald-700" : "text-red-700"}`}>
                  {summary.result}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {summary.passedSubjects}/{summary.totalSubjects} subjects
                  passed
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span>
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
              </span>
              <span className="text-indigo-400 font-medium">
                Smart School Management System
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCardView;
