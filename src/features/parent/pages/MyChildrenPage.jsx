/**
 * My Children Page — Modern redesign
 */

import { useEffect, useMemo, useState } from "react";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  BookOutlined,
  TeamOutlined,
  IdcardOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getMyChildren } from "../../../services/parent.service";

const MyChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => {
      const aName = a?.userId?.name || a?.name || "";
      const bName = b?.userId?.name || b?.name || "";
      return aName.localeCompare(bName);
    });
  }, [children]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMyChildren();
        setChildren(res.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load children");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const AVATAR_COLORS = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
  ];

  const quickActions = (childId) => [
    {
      label: "Schedule",
      icon: <CalendarOutlined />,
      to: `/parent/child-schedule?child=${childId}`,
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
    },
    {
      label: "Attendance",
      icon: <CheckCircleOutlined />,
      to: `/parent/attendance?child=${childId}`,
      color:
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100",
    },
    {
      label: "Grades",
      icon: <BookOutlined />,
      to: `/parent/performance/grades?child=${childId}`,
      color:
        "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100",
    },
    {
      label: "Full Profile",
      icon: <RightOutlined />,
      to: `/parent/children/${childId}`,
      color: "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200",
    },
  ];

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl border border-purple-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TeamOutlined className="text-xl" />
              </div>
              <h1 className="text-3xl font-black">My Children</h1>
            </div>
            <p className="text-purple-200">
              View and manage your children&apos;s profiles &amp; academics
            </p>
          </div>
          {!loading && (
            <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 text-center">
              <p className="text-sm text-purple-200">Total Children</p>
              <p className="text-4xl font-black">{children.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0 font-bold">
            !
          </div>
          <div>
            <p className="font-semibold">Could not load children</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-36 bg-linear-to-r from-slate-100 to-slate-200" />
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-16 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-14 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sortedChildren.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TeamOutlined className="text-3xl text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No children linked yet
          </h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            Please contact the school administrator to link your children to
            this account.
          </p>
        </div>
      )}

      {/* Children Cards */}
      {!loading && sortedChildren.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedChildren.map((child, index) => {
            const childId = child?._id;
            const childName = child?.userId?.name || "Student";
            const clsName = child?.classId?.name || "—";
            const section = child?.section || "—";
            const rollNumber = child?.rollNumber || "—";
            const admissionNo = child?.admissionNumber || "—";
            const email = child?.userId?.email || "";
            const enrollStatus = child?.enrollmentStatus || "active";
            const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

            return (
              <div
                key={childId}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Hero banner */}
                <div
                  className={`bg-linear-to-br ${colorClass} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white" />
                  </div>
                  <div className="relative flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                      <span className="text-3xl font-black">
                        {childName[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="text-xl font-black truncate">
                          {childName}
                        </h2>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${enrollStatus === "active" ? "bg-white/20 text-white" : "bg-amber-400/30 text-amber-100"}`}>
                          {enrollStatus.toUpperCase()}
                        </span>
                      </div>
                      {email && (
                        <p className="text-white/70 text-sm truncate mb-2">
                          {email}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-white/15 px-2 py-1 rounded-lg font-semibold">
                          Class {clsName}
                        </span>
                        <span className="text-xs bg-white/15 px-2 py-1 rounded-lg font-semibold">
                          Section {section}
                        </span>
                        <span className="text-xs bg-white/15 px-2 py-1 rounded-lg font-semibold">
                          Roll {rollNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info tiles */}
                <div className="px-6 pt-5 pb-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        icon: <TeamOutlined className="text-purple-500" />,
                        label: "Class",
                        value: clsName,
                        bg: "bg-purple-50",
                      },
                      {
                        icon: <IdcardOutlined className="text-blue-500" />,
                        label: "Roll No.",
                        value: rollNumber,
                        bg: "bg-blue-50",
                      },
                      {
                        icon: <BookOutlined className="text-emerald-500" />,
                        label: "Admission",
                        value: admissionNo,
                        bg: "bg-emerald-50",
                      },
                      {
                        icon: <CalendarOutlined className="text-amber-500" />,
                        label: "Year",
                        value: child?.academicYear || "—",
                        bg: "bg-amber-50",
                      },
                    ].map(({ icon, label, value, bg }) => (
                      <div
                        key={label}
                        className={`${bg} rounded-2xl p-3 text-center`}>
                        <div className="flex justify-center mb-1">{icon}</div>
                        <div className="font-bold text-slate-800 text-sm truncate">
                          {value}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="px-6 py-5">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {quickActions(childId).map(({ label, icon, to, color }) => (
                      <Link key={label} to={to}>
                        <div
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${color}`}>
                          <span className="text-lg">{icon}</span>
                          <span>{label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyChildrenPage;
