/**
 * Parent Profile Page — Beautiful Redesign
 * Rich profile page with real data fetching, children cards and attendance info
 */

import { useState, useEffect, useCallback } from "react";
import { Spin, Progress, Tooltip, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getMyProfile,
  getMyChildren,
  getChildAttendance,
} from "../../../services/parent.service";

/* ── helpers ── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const GRADIENT_PAIRS = [
  ["from-violet-500 to-purple-600", "bg-violet-100 text-violet-700"],
  ["from-blue-500 to-indigo-600", "bg-blue-100 text-blue-700"],
  ["from-emerald-500 to-teal-600", "bg-emerald-100 text-emerald-700"],
  ["from-rose-500 to-pink-600", "bg-rose-100 text-pink-700"],
  ["from-amber-500 to-orange-600", "bg-amber-100 text-amber-700"],
];

const InfoRow = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-slate-400",
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div
      className={`mt-0.5 p-1.5 rounded-lg bg-slate-50 ${iconColor} shrink-0`}>
      <Icon style={{ fontSize: 14 }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 wrap-break-word">
        {value ? value : <span className="text-slate-400 font-medium">—</span>}
      </p>
    </div>
  </div>
);

const toTitle = (str) =>
  (str || "")
    .toString()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const ChildCard = ({ child, index }) => {
  const [attendance, setAttendance] = useState(null);
  const [pair] = useState(GRADIENT_PAIRS[index % GRADIENT_PAIRS.length]);
  const name = child.userId?.name || child.name || "Student";
  const className = child.classId?.name || "N/A";
  const section = child.section || "";
  const roll = child.rollNumber || "—";
  const status = child.userId?.status || "active";

  useEffect(() => {
    const endDate = new Date().toISOString().split("T")[0];
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const startDate = start.toISOString().split("T")[0];
    getChildAttendance(child._id, { startDate, endDate })
      .then((res) => {
        const records = res?.data || [];
        if (!records.length) return;
        const present = records.filter(
          (r) => r.status === "present" || r.status === "Present",
        ).length;
        setAttendance(Math.round((present / records.length) * 100));
      })
      .catch(() => {});
  }, [child._id]);

  const attColor =
    attendance === null
      ? "#94a3b8"
      : attendance >= 80
        ? "#22c55e"
        : attendance >= 60
          ? "#f59e0b"
          : "#ef4444";

  return (
    <Link to={`/parent/children/${child._id}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${pair[0]} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0`}>
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500">
              {className}
              {section ? ` · ${section}` : ""}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}>
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Roll No.</span>
          <span className="font-semibold text-slate-700">{roll}</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Attendance (30d)</span>
            <span className="font-bold" style={{ color: attColor }}>
              {attendance === null ? "—" : `${attendance}%`}
            </span>
          </div>
          <Tooltip
            title={
              attendance === null ? "Loading..." : `${attendance}% attendance`
            }>
            <Progress
              percent={attendance ?? 0}
              showInfo={false}
              size="small"
              strokeColor={attColor}
              trailColor="#f1f5f9"
            />
          </Tooltip>
        </div>
      </div>
    </Link>
  );
};

/* ── Main Component ── */
const ParentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [parentProfile, setParentProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [authUser, setAuthUser] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("ssms_user");
      if (stored) {
        try {
          setAuthUser(JSON.parse(stored));
        } catch {
          // ignore invalid local storage
        }
      }

      try {
        const profileRes = await getMyProfile();
        const profile = profileRes?.data;
        if (profile) {
          setParentProfile(profile);
          setChildren(profile.children || []);
          return;
        }
      } catch {
        // fall back to localStorage + children list if profile endpoint fails
      }

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setParentProfile(parsed.roleProfile || parsed);
        } catch {
          // ignore invalid local storage
        }
      }
      const childrenRes = await getMyChildren().catch(() => ({ data: [] }));
      setChildren(childrenRes?.data || []);
    } catch {
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-80">
        <Spin size="large" />
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="text-center py-20 text-slate-400">Profile not found.</div>
    );
  }

  const populatedUserId = parentProfile?.userId;
  const user =
    populatedUserId && typeof populatedUserId === "object"
      ? populatedUserId
      : authUser || parentProfile;
  const isActive = user?.status === "active";
  const initials = getInitials(user?.name || "P");
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-slate-50 -m-6 p-6 min-h-[60vh]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-slate-900 truncate">
                {user?.name}
              </h1>
              <p className="text-sm text-slate-500 truncate">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {isActive ? "Active" : "Inactive"}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                  {children.length}{" "}
                  {children.length === 1 ? "Child" : "Children"}
                </span>
                {joinDate && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Joined {joinDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/parent/settings"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors">
              Settings
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Contact</h2>
            <InfoRow
              icon={MailOutlined}
              label="Email"
              value={user?.email}
              iconColor="text-blue-500"
            />
            <InfoRow
              icon={PhoneOutlined}
              label="Phone"
              value={user?.phone}
              iconColor="text-emerald-500"
            />
            <InfoRow
              icon={PhoneOutlined}
              label="Alternate Phone"
              value={parentProfile?.alternatePhone}
              iconColor="text-teal-500"
            />
            <InfoRow
              icon={HomeOutlined}
              label="Address"
              value={parentProfile?.address}
              iconColor="text-amber-500"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Parent Details</h2>
            <InfoRow
              icon={BankOutlined}
              label="Occupation"
              value={parentProfile?.occupation}
              iconColor="text-sky-500"
            />
            <InfoRow
              icon={SafetyOutlined}
              label="Emergency Contact"
              value={
                typeof parentProfile?.isEmergencyContact === "boolean"
                  ? parentProfile.isEmergencyContact
                    ? "Yes"
                    : "No"
                  : null
              }
              iconColor="text-red-500"
            />
            <InfoRow
              icon={UserOutlined}
              label="Relationship"
              value={toTitle(parentProfile?.relationshipType || "guardian")}
              iconColor="text-violet-500"
            />
          </div>
        </div>

        {/* Children */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-900">My Children</h2>
            <Link
              to="/parent/children"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700">
              View all →
            </Link>
          </div>

          {children.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child, i) => (
                <ChildCard key={child._id} child={child} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
              <p className="font-semibold">No children linked yet</p>
              <p className="text-sm mt-1">Ask the admin to link students.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfilePage;
