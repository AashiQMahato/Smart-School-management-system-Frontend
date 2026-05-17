/**
 * Admin Fee Dashboard Page
 * Comprehensive fee management with structures, assignment, payments, analytics
 * Modern SaaS-style admin interface
 */

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Card,
  Tooltip,
  Badge,
  Dropdown,
  Empty,
  Skeleton,
  Popconfirm,
  InputNumber,
  DatePicker,
  Table,
  Progress,
  Switch,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  SearchOutlined,
  SendOutlined,
  EyeOutlined,
  DownloadOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import * as feeService from "../../../services/fee.service";
import * as classService from "../../../services/class.service";
import dayjs from "dayjs";
import {
  PdfPreviewModal,
  BillPreviewModal,
  FeeTypeChart,
  PaymentStatusPieChart,
} from "../../fee/components";
import {
  buildFeeBillPdf,
  generatePaymentReceipt,
  generateFeeReport,
} from "../../fee/utils/pdfGenerator";

const PAYMENT_STATUS_CONFIG = {
  paid: {
    color: "success",
    label: "Paid",
    icon: <CheckCircleOutlined />,
  },
  unpaid: {
    color: "default",
    label: "Unpaid",
    icon: <ClockCircleOutlined />,
  },
  partial: {
    color: "warning",
    label: "Partial",
    icon: <ExclamationCircleOutlined />,
  },
  overdue: {
    color: "error",
    label: "Overdue",
    icon: <WarningOutlined />,
  },
};

const FEE_TYPES = [
  { value: "tuition", label: "Tuition", color: "blue" },
  { value: "exam", label: "Exam", color: "purple" },
  { value: "transport", label: "Transport", color: "green" },
  { value: "fine", label: "Fine", color: "red" },
  { value: "library", label: "Library", color: "gold" },
  { value: "lab", label: "Lab", color: "magenta" },
  { value: "admission", label: "Admission", color: "cyan" },
  { value: "sports", label: "Sports", color: "orange" },
  { value: "other", label: "Other", color: "default" },
];

const AdminFeeDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [structures, setStructures] = useState([]);
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modals
  const [structureModalOpen, setStructureModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [billPreviewOpen, setBillPreviewOpen] = useState(false);
  const [billPreviewPayload, setBillPreviewPayload] = useState(null);
  const [professionalBillPreview, setProfessionalBillPreview] = useState(false);
  const [professionalBillData, setProfessionalBillData] = useState(null);

  // Fee components for edit mode
  const [feeComponents, setFeeComponents] = useState({
    tuition: 0,
    exam: 0,
    transport: 0,
    fine: 0,
  });

  // Filters
  const [feeFilters, setFeeFilters] = useState({
    paymentStatus: "",
    feeType: "",
    classId: "",
    search: "",
  });

  const [structureForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === "fees") fetchFees();
    if (activeTab === "payments") fetchPayments();
  }, [activeTab, feeFilters]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, structuresRes, classesRes] = await Promise.all([
        feeService.getFeeStats(),
        feeService.getAllFeeStructures(),
        classService.getAllClasses(),
      ]);
      setStats(statsRes.data || null);
      setStructures(structuresRes.data || []);
      setClasses(classesRes.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await feeService.getAllFees(feeFilters);
      setFees(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await feeService.getAllPayments();
      setPayments(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load payments");
    }
  };

  const handleCreateStructure = async (values) => {
    try {
      const base = {
        name: values.name,
        classId: values.classId,
        academicYear: values.academicYear,
        dueDate: values.dueDate?.toISOString(),
        frequency: values.frequency,
        description: values.description,
      };

      // Editing with component breakdown
      if (editingStructure && values.multiType) {
        const amounts = values.amounts || {};
        const totalAmount =
          Number(amounts.tuition || 0) +
          Number(amounts.exam || 0) +
          Number(amounts.transport || 0) +
          Number(amounts.fine || 0);

        if (totalAmount === 0) {
          message.error("Total amount must be greater than 0");
          return;
        }

        const data = {
          ...base,
          feeType: editingStructure.feeType,
          amount: totalAmount,
        };

        await feeService.updateFeeStructure(editingStructure._id, data);
        message.success(
          `Fee structure updated with total ₹${totalAmount.toLocaleString()}`,
        );
        setStructureModalOpen(false);
        setEditingStructure(null);
        structureForm.resetFields();
        fetchInitialData();
        return;
      }

      // Multi-create mode (create several fee structures at once)
      if (!editingStructure && values.multiType) {
        const amounts = values.amounts || {};
        const items = [
          { feeType: "tuition", label: "Tuition", amount: amounts.tuition },
          { feeType: "exam", label: "Exam", amount: amounts.exam },
          {
            feeType: "transport",
            label: "Transport",
            amount: amounts.transport,
          },
          { feeType: "fine", label: "Fine", amount: amounts.fine },
        ].filter((i) => Number(i.amount || 0) > 0);

        if (items.length === 0) {
          message.error(
            "Enter at least one amount (Tuition/Exam/Transport/Fine)",
          );
          return;
        }

        await Promise.all(
          items.map((i) =>
            feeService.createFeeStructure({
              ...base,
              name: `${values.name} - ${i.label}`,
              feeType: i.feeType,
              amount: Number(i.amount),
            }),
          ),
        );

        message.success(`${items.length} fee structures created`);
      } else {
        // Single create/edit mode
        const data = {
          ...base,
          feeType: values.feeType,
          amount: values.amount,
        };

        if (editingStructure) {
          await feeService.updateFeeStructure(editingStructure._id, data);
          message.success("Fee structure updated");
        } else {
          await feeService.createFeeStructure(data);
          message.success("Fee structure created");
        }
      }

      setStructureModalOpen(false);
      setEditingStructure(null);
      structureForm.resetFields();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAssignFees = async (structureId) => {
    try {
      const result = await feeService.assignFeesToClass(structureId);
      message.success(result.message);
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleToggleStructure = async (id) => {
    try {
      await feeService.toggleFeeStructure(id);
      message.success("Status updated");
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteStructure = async (id) => {
    try {
      await feeService.deleteFeeStructure(id);
      message.success("Fee structure deleted");
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRecordPayment = async (values) => {
    try {
      await feeService.recordPayment(selectedFee._id, values);
      message.success("Payment recorded successfully");
      setPaymentModalOpen(false);
      setSelectedFee(null);
      paymentForm.resetFields();
      fetchFees();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDownloadBillFromPreview = (
    student,
    fees,
    summary,
    billNumber,
  ) => {
    try {
      const doc = buildFeeBillPdf(student, fees, summary);
      const fileName = `Fee-Bill-${student?.userId?.name?.replace(/\s+/g, "-")}-${billNumber}.pdf`;
      doc.save(fileName);
      message.success("Bill PDF downloaded successfully");
    } catch (error) {
      message.error("Failed to generate PDF");
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await feeService.deleteFee(feeId);
      message.success("Fee deleted");
      fetchFees();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const overall = stats?.overall || {};
  const collectionRate =
    overall.totalAmount > 0
      ? Math.round((overall.totalCollected / overall.totalAmount) * 100)
      : 0;

  // ═══════════════════════════════════════
  // OVERVIEW TAB
  // ═══════════════════════════════════════
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Generated",
            value: `₹${(overall.totalAmount || 0).toLocaleString("en-IN")}`,
            sub: `${(overall.paidCount || 0) + (overall.unpaidCount || 0) + (overall.partialCount || 0) + (overall.overdueCount || 0)} fee records`,
            iconBg: "bg-blue-600",
            cardBg: "from-blue-50 to-blue-100/50",
            textColor: "text-blue-700",
            icon: <DollarOutlined className="text-white text-xl" />,
          },
          {
            label: "Total Collected",
            value: `₹${(overall.totalCollected || 0).toLocaleString("en-IN")}`,
            sub: `${collectionRate}% collection rate`,
            iconBg: "bg-emerald-600",
            cardBg: "from-emerald-50 to-emerald-100/50",
            textColor: "text-emerald-700",
            icon: <CheckCircleOutlined className="text-white text-xl" />,
            trend: collectionRate >= 70 ? "up" : "down",
          },
          {
            label: "Pending Amount",
            value: `₹${(overall.totalPending || 0).toLocaleString("en-IN")}`,
            sub: `${(overall.unpaidCount || 0) + (overall.partialCount || 0)} unpaid/partial`,
            iconBg: "bg-amber-500",
            cardBg: "from-amber-50 to-amber-100/50",
            textColor: "text-amber-700",
            icon: <ClockCircleOutlined className="text-white text-xl" />,
          },
          {
            label: "Overdue Students",
            value: overall.overdueCount || 0,
            sub: "require immediate attention",
            iconBg: "bg-red-600",
            cardBg: "from-red-50 to-red-100/50",
            textColor: "text-red-700",
            icon: <WarningOutlined className="text-white text-xl" />,
          },
        ].map(
          ({ label, value, sub, iconBg, cardBg, textColor, icon, trend }) => (
            <Card
              key={label}
              className={`border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-linear-to-br ${cardBg}`}>
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-sm`}>
                  {icon}
                </div>
                {trend && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {trend === "up" ? <RiseOutlined /> : <FallOutlined />}{" "}
                    {trend === "up" ? "Good" : "Low"}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-slate-500 text-sm">{label}</p>
                <p className={`text-2xl font-black mt-0.5 ${textColor}`}>
                  {value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </div>
            </Card>
          ),
        )}
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={
            <span className="flex items-center gap-2 text-slate-800 font-bold">
              <BankOutlined className="text-blue-500" />
              Fee Collection by Type
            </span>
          }
          className="border-0 shadow-sm">
          <FeeTypeChart data={stats?.byFeeType || []} />
        </Card>

        <Card
          title={
            <span className="flex items-center gap-2 text-slate-800 font-bold">
              <TeamOutlined className="text-purple-500" />
              Payment Status Distribution
            </span>
          }
          className="border-0 shadow-sm">
          <PaymentStatusPieChart stats={stats} />
        </Card>
      </div>

      {/* Collection Progress + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Collection Progress" className="border-0 shadow-sm">
          <div className="text-center mb-4">
            <Progress
              type="dashboard"
              percent={collectionRate}
              strokeColor={{
                "0%": "#3b82f6",
                "100%": "#10b981",
              }}
              size={180}
              format={(percent) => (
                <div>
                  <div className="text-3xl font-bold text-slate-900">
                    {percent}%
                  </div>
                  <div className="text-sm text-slate-500">Collected</div>
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <p className="text-lg font-bold text-emerald-700">
                {overall.paidCount || 0}
              </p>
              <p className="text-sm text-emerald-600">Fully Paid</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <p className="text-lg font-bold text-amber-700">
                {overall.partialCount || 0}
              </p>
              <p className="text-sm text-amber-600">Partial</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-slate-700">
                {overall.unpaidCount || 0}
              </p>
              <p className="text-sm text-slate-600">Unpaid</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-lg font-bold text-red-700">
                {overall.overdueCount || 0}
              </p>
              <p className="text-sm text-red-600">Overdue</p>
            </div>
          </div>
        </Card>

        <Card title="Fee Type Breakdown" className="border-0 shadow-sm">
          {stats?.byFeeType && stats.byFeeType.length > 0 ? (
            <div className="space-y-4">
              {stats.byFeeType.map((item) => {
                const feeConfig = FEE_TYPES.find((f) => f.value === item._id);
                const percent =
                  item.totalAmount > 0
                    ? Math.round((item.totalCollected / item.totalAmount) * 100)
                    : 0;
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <Tag
                      color={feeConfig?.color || "#6b7280"}
                      className="min-w-20 text-center">
                      {feeConfig?.label || item._id}
                    </Tag>
                    <div className="flex-1">
                      <Progress
                        percent={percent}
                        strokeColor={feeConfig?.color || "#6b7280"}
                        size="small"
                        format={() =>
                          `₹${item.totalCollected.toLocaleString()} / ₹${item.totalAmount.toLocaleString()}`
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty description="No fee data available" />
          )}
        </Card>
      </div>

      {/* Recent Payments + Defaulters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent Payments"
          className="border-0 shadow-sm"
          extra={
            <Button type="link" onClick={() => setActiveTab("payments")}>
              View All
            </Button>
          }>
          {stats?.recentPayments && stats.recentPayments.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircleOutlined className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {payment.studentId?.userId?.name || "Student"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.feeId?.feeType} •{" "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">
                    ₹{payment.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No recent payments" />
          )}
        </Card>

        <Card
          title={
            <span className="text-red-600">
              <WarningOutlined className="mr-2" />
              Defaulters
            </span>
          }
          className="border-0 shadow-sm"
          extra={
            <Badge count={stats?.defaulters?.length || 0} color="#ef4444" />
          }>
          {stats?.defaulters && stats.defaulters.length > 0 ? (
            <div className="space-y-3">
              {stats.defaulters.slice(0, 5).map((fee) => (
                <div
                  key={fee._id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      {fee.studentId?.userId?.name || "Student"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {fee.studentId?.classId?.name}{" "}
                      {fee.studentId?.classId?.section} • Due:{" "}
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-bold text-red-600">
                    ₹{fee.balanceDue?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No defaulters! 🎉" />
          )}
        </Card>
      </div>
    </div>
  );

  // ═══════════════════════════════════════
  // FEE STRUCTURES TAB
  // ═══════════════════════════════════════
  const structureColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <p className="font-semibold text-slate-900">{text}</p>
          {record.description && (
            <p className="text-xs text-slate-500">{record.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "feeType",
      key: "feeType",
      render: (type) => {
        const config = FEE_TYPES.find((f) => f.value === type);
        return <Tag color={config?.color}>{config?.label || type}</Tag>;
      },
    },
    {
      title: "Class",
      dataIndex: "classId",
      key: "classId",
      render: (cls) => (cls ? `${cls.name} - ${cls.section}` : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-bold text-slate-900">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStructure(record._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Assign to Students">
            <Popconfirm
              title="Assign Fees"
              description="This will create fee records for all students in the class. Continue?"
              onConfirm={() => handleAssignFees(record._id)}
              okText="Assign">
              <Button
                size="small"
                type="primary"
                ghost
                icon={<SendOutlined />}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingStructure(record);
                structureForm.setFieldsValue({
                  ...record,
                  classId: record.classId?._id,
                  dueDate: dayjs(record.dueDate),
                });
                setStructureModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this fee structure?"
            onConfirm={() => handleDeleteStructure(record._id)}
            okType="danger">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const renderStructures = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Fee Structures ({structures.length})
        </h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStructure(null);
            structureForm.resetFields();
            setStructureModalOpen(true);
          }}
          className="bg-blue-600">
          Create Structure
        </Button>
      </div>

      <Table
        columns={structureColumns}
        dataSource={structures}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        className="border rounded-xl overflow-hidden"
      />
    </div>
  );

  // ═══════════════════════════════════════
  // STUDENT FEES TAB
  // ═══════════════════════════════════════
  const feeColumns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-slate-900">
            {record.studentId?.userId?.name || "N/A"}
          </p>
          <p className="text-xs text-slate-500">
            {record.studentId?.admissionNumber} •{" "}
            {record.studentId?.classId?.name}{" "}
            {record.studentId?.classId?.section}
          </p>
        </div>
      ),
    },
    {
      title: "Fee Type",
      key: "feeType",
      render: (_, record) => {
        const config = FEE_TYPES.find((f) => f.value === record.feeType);
        return (
          <div>
            <Tag color={config?.color}>{config?.label || record.feeType}</Tag>
            {record.description && (
              <p className="text-xs text-slate-500 mt-1">
                {record.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <p className="font-bold">₹{record.totalAmount?.toLocaleString()}</p>
          {record.discount > 0 && (
            <p className="text-xs text-green-600">
              Discount: ₹{record.discount}
            </p>
          )}
          {record.fine > 0 && (
            <p className="text-xs text-red-600">Fine: ₹{record.fine}</p>
          )}
        </div>
      ),
    },
    {
      title: "Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => (
        <span className="font-medium text-emerald-600">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balanceDue",
      key: "balanceDue",
      render: (balance) => (
        <span
          className={`font-bold ${balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
          ₹{balance?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => {
        const isOverdue = new Date(date) < new Date();
        return (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const config =
          PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.unpaid;
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="View Bill">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setProfessionalBillData({
                  student: record.studentId,
                  fees: [record],
                  summary: {
                    totalAmount: record.totalAmount,
                    totalPaid: record.amountPaid,
                    totalBalance: record.balanceDue,
                  },
                });
                setProfessionalBillPreview(true);
              }}
            />
          </Tooltip>
          {record.paymentStatus !== "paid" && (
            <Tooltip title="Record Payment">
              <Button
                size="small"
                type="primary"
                icon={<DollarOutlined />}
                onClick={() => {
                  setSelectedFee(record);
                  paymentForm.resetFields();
                  setPaymentModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {record.amountPaid === 0 && (
            <Popconfirm
              title="Delete this fee?"
              onConfirm={() => handleDeleteFee(record._id)}
              okType="danger">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const renderFees = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search student..."
          prefix={<SearchOutlined />}
          value={feeFilters.search}
          onChange={(e) =>
            setFeeFilters({ ...feeFilters, search: e.target.value })
          }
          className="w-64"
          allowClear
        />
        <Select
          placeholder="Payment Status"
          value={feeFilters.paymentStatus || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, paymentStatus: val || "" })
          }
          allowClear
          className="w-40">
          <Select.Option value="paid">Paid</Select.Option>
          <Select.Option value="unpaid">Unpaid</Select.Option>
          <Select.Option value="partial">Partial</Select.Option>
          <Select.Option value="overdue">Overdue</Select.Option>
        </Select>
        <Select
          placeholder="Fee Type"
          value={feeFilters.feeType || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, feeType: val || "" })
          }
          allowClear
          className="w-40">
          {FEE_TYPES.map((ft) => (
            <Select.Option key={ft.value} value={ft.value}>
              {ft.label}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Class"
          value={feeFilters.classId || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, classId: val || "" })
          }
          allowClear
          className="w-48">
          {classes.map((cls) => (
            <Select.Option key={cls._id} value={cls._id}>
              {cls.name} - {cls.section}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={feeColumns}
        dataSource={fees}
        rowKey="_id"
        pagination={{ pageSize: 15, showSizeChanger: true }}
        className="border rounded-xl overflow-hidden"
        loading={loading}
      />
    </div>
  );

  // ═══════════════════════════════════════
  // PAYMENTS TAB
  // ═══════════════════════════════════════
  const paymentColumns = [
    {
      title: "Receipt #",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      render: (receipt) => (
        <span className="font-mono text-sm text-blue-600">{receipt}</span>
      ),
    },
    {
      title: "Student",
      key: "student",
      render: (_, record) => record.studentId?.userId?.name || "N/A",
    },
    {
      title: "Fee Type",
      key: "feeType",
      render: (_, record) => {
        const feeType = record.feeId?.feeType;
        const config = FEE_TYPES.find((f) => f.value === feeType);
        return <Tag color={config?.color}>{config?.label || feeType}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-bold text-emerald-600">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag>{method?.toUpperCase()}</Tag>,
    },
    {
      title: "Paid By",
      key: "paidBy",
      render: (_, record) => (
        <Tag color={record.paidBy === "parent" ? "purple" : "blue"}>
          {record.paidBy === "parent" ? "Parent" : "Admin"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "success"
              ? "success"
              : status === "failed"
                ? "error"
                : "warning"
          }>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Receipt",
      key: "receipt",
      align: "center",
      render: (_, record) =>
        record.status === "success" ? (
          <Tooltip title="Download Receipt PDF">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              className="text-green-600 border-green-300 hover:bg-green-50"
              onClick={() =>
                generatePaymentReceipt(record, record.feeId, record.studentId)
              }
            />
          </Tooltip>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
  ];

  const renderPayments = () => (
    <div className="space-y-4">
      <Table
        columns={paymentColumns}
        dataSource={payments}
        rowKey="_id"
        pagination={{ pageSize: 15, showSizeChanger: true }}
        className="border rounded-xl overflow-hidden"
        loading={loading}
      />
    </div>
  );

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-sm">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BankOutlined className="text-blue-600" />
                Fee Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage fee structures, track payments, and monitor collections
              </p>
            </div>
            <div className="flex gap-3">
              <Button icon={<ReloadOutlined />} onClick={fetchInitialData}>
                Refresh
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => generateFeeReport(fees, stats)}>
                Fee Report PDF
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingStructure(null);
                  structureForm.resetFields();
                  setStructureModalOpen(true);
                }}
                className="bg-blue-600">
                New Fee Structure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "overview",
              label: (
                <span className="flex items-center gap-2">
                  <RiseOutlined />
                  Overview
                </span>
              ),
              children: renderOverview(),
            },
            {
              key: "structures",
              label: (
                <span className="flex items-center gap-2">
                  <FileTextOutlined />
                  Fee Structures
                  <Badge count={structures.length} className="ml-1" />
                </span>
              ),
              children: renderStructures(),
            },
            {
              key: "fees",
              label: (
                <span className="flex items-center gap-2">
                  <DollarOutlined />
                  Student Fees
                </span>
              ),
              children: renderFees(),
            },
            {
              key: "payments",
              label: (
                <span className="flex items-center gap-2">
                  <CheckCircleOutlined />
                  Payments
                  <Badge count={payments.length} className="ml-1" />
                </span>
              ),
              children: renderPayments(),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Fee Structure Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingStructure ? "Edit Fee Structure" : "Create Fee Structure"}
          </div>
        }
        open={structureModalOpen}
        onCancel={() => {
          setStructureModalOpen(false);
          setEditingStructure(null);
          structureForm.resetFields();
        }}
        footer={null}
        width={700}>
        <Form
          form={structureForm}
          layout="vertical"
          onFinish={handleCreateStructure}
          className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Structure Name"
              className="col-span-2"
              rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g., Tuition Fee - Class 10" />
            </Form.Item>

            <Form.Item
              label={
                editingStructure
                  ? "Edit Fee Components (amounts will be summed)"
                  : "Add multiple fee amounts (Tuition/Exam/Transport/Fine)"
              }
              name="multiType"
              valuePropName="checked"
              className="col-span-2"
              tooltip={
                editingStructure
                  ? "Enable to edit fee breakdown by components"
                  : "Creates separate fee structures for each non-zero amount"
              }>
              <Switch />
            </Form.Item>

            <Form.Item
              name="classId"
              label="Class"
              rules={[{ required: true, message: "Required" }]}>
              <Select placeholder="Select class">
                {classes.map((cls) => (
                  <Select.Option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const multi = !!getFieldValue("multiType");
                const tuition = getFieldValue(["amounts", "tuition"]) || 0;
                const exam = getFieldValue(["amounts", "exam"]) || 0;
                const transport = getFieldValue(["amounts", "transport"]) || 0;
                const fine = getFieldValue(["amounts", "fine"]) || 0;
                const calculatedTotal =
                  Number(tuition) +
                  Number(exam) +
                  Number(transport) +
                  Number(fine);

                if (multi) {
                  return (
                    <div className="col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="text-sm font-semibold text-slate-800 mb-1">
                        Fee Components Breakdown
                      </div>
                      <div className="text-xs text-slate-600 mb-3">
                        {editingStructure
                          ? "Update individual fee components. Total will be calculated automatically."
                          : "Enter amounts for each fee type. Separate structures will be created for non-zero amounts."}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <Form.Item
                          label="Tuition Fee (₹)"
                          name={["amounts", "tuition"]}>
                          <InputNumber
                            min={0}
                            className="w-full"
                            placeholder="0"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Exam Fee (₹)"
                          name={["amounts", "exam"]}>
                          <InputNumber
                            min={0}
                            className="w-full"
                            placeholder="0"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Transport Fee (₹)"
                          name={["amounts", "transport"]}>
                          <InputNumber
                            min={0}
                            className="w-full"
                            placeholder="0"
                          />
                        </Form.Item>
                        <Form.Item label="Fine (₹)" name={["amounts", "fine"]}>
                          <InputNumber
                            min={0}
                            className="w-full"
                            placeholder="0"
                          />
                        </Form.Item>
                      </div>
                      {editingStructure && calculatedTotal > 0 && (
                        <div className="mt-4 pt-3 border-t border-blue-300 flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-700">
                            Total Amount:
                          </span>
                          <span className="text-lg font-bold text-blue-700">
                            ₹{calculatedTotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-2">
                        {editingStructure
                          ? "Total will be saved to this structure."
                          : "Leave blank/0 to skip a type."}
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    <Form.Item
                      name="feeType"
                      label="Fee Type"
                      rules={[{ required: true, message: "Required" }]}>
                      <Select placeholder="Select type">
                        {FEE_TYPES.map((ft) => (
                          <Select.Option key={ft.value} value={ft.value}>
                            {ft.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="amount"
                      label="Amount (₹)"
                      rules={[{ required: true, message: "Required" }]}>
                      <InputNumber
                        min={0}
                        className="w-full"
                        placeholder="Enter amount"
                      />
                    </Form.Item>
                  </>
                );
              }}
            </Form.Item>

            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g., 2025-2026" />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: "Required" }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="frequency" label="Frequency">
              <Select placeholder="Select frequency" defaultValue="one-time">
                <Select.Option value="one-time">One-Time</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="quarterly">Quarterly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              className="col-span-2">
              <Input.TextArea rows={2} placeholder="Optional description" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => {
                setStructureModalOpen(false);
                structureForm.resetFields();
              }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {editingStructure ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            <DollarOutlined className="mr-2 text-emerald-600" />
            Record Payment
          </div>
        }
        open={paymentModalOpen}
        onCancel={() => {
          setPaymentModalOpen(false);
          setSelectedFee(null);
          paymentForm.resetFields();
        }}
        footer={null}
        width={500}>
        {selectedFee && (
          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Student:</span>
                  <p className="font-semibold">
                    {selectedFee.studentId?.userId?.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Fee Type:</span>
                  <p className="font-semibold">{selectedFee.feeType}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total Amount:</span>
                  <p className="font-semibold">
                    ₹{selectedFee.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Balance Due:</span>
                  <p className="font-bold text-red-600">
                    ₹{selectedFee.balanceDue?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Form
              form={paymentForm}
              layout="vertical"
              onFinish={handleRecordPayment}>
              <Form.Item
                name="amountPaid"
                label="Payment Amount (₹)"
                rules={[
                  { required: true, message: "Required" },
                  {
                    type: "number",
                    max: selectedFee.balanceDue,
                    message: `Max: ₹${selectedFee.balanceDue}`,
                  },
                ]}>
                <InputNumber
                  min={1}
                  max={selectedFee.balanceDue}
                  className="w-full"
                  placeholder="Enter amount"
                />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select method">
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="card">Card</Select.Option>
                  <Select.Option value="bank-transfer">
                    Bank Transfer
                  </Select.Option>
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="cheque">Cheque</Select.Option>
                  <Select.Option value="upi">UPI</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="transactionRef" label="Transaction Reference">
                <Input placeholder="Optional reference number" />
              </Form.Item>

              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={2} placeholder="Optional remarks" />
              </Form.Item>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    paymentForm.resetFields();
                  }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-emerald-600 hover:bg-emerald-700">
                  Record Payment
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      <PdfPreviewModal
        open={billPreviewOpen}
        title="Fee Bill Preview"
        build={() =>
          buildFeeBillPdf(
            billPreviewPayload?.student,
            billPreviewPayload?.fees,
            billPreviewPayload?.summary,
          )
        }
        onClose={() => {
          setBillPreviewOpen(false);
          setBillPreviewPayload(null);
        }}
        onDownloaded={() => message.success("Bill PDF downloaded")}
      />

      <BillPreviewModal
        open={professionalBillPreview}
        student={professionalBillData?.student}
        fees={professionalBillData?.fees || []}
        summary={professionalBillData?.summary}
        onClose={() => {
          setProfessionalBillPreview(false);
          setProfessionalBillData(null);
        }}
        onDownload={handleDownloadBillFromPreview}
      />
    </div>
  );
};

export default AdminFeeDashboardPage;
