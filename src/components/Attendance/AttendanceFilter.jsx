/**
 * AttendanceFilter Component
 * Provides filtering options for attendance views
 */

import { Card, Form, Select, DatePicker, Button, Row, Col, Space } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getAllClasses } from "../../services/class.service";
import { getAllSubjects } from "../../services/subject.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const AttendanceFilter = ({
  onFilter,
  showClassFilter = true,
  showSubjectFilter = true,
  showDateFilter = true,
  showDateRange = false,
  initialValues = {},
}) => {
  const [form] = Form.useForm();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    setLoading(true);
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        showClassFilter ? getAllClasses() : Promise.resolve({ data: [] }),
        showSubjectFilter ? getAllSubjects() : Promise.resolve({ data: [] }),
      ]);

      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (values) => {
    const filters = {
      classId: values.classId,
      subjectId: values.subjectId,
      date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
      startDate: values.dateRange?.[0]
        ? values.dateRange[0].format("YYYY-MM-DD")
        : undefined,
      endDate: values.dateRange?.[1]
        ? values.dateRange[1].format("YYYY-MM-DD")
        : undefined,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        initialValues={initialValues}>
        <Row gutter={16}>
          {showClassFilter && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="classId" label="Class">
                <Select
                  placeholder="Select class"
                  allowClear
                  loading={loading}
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
            </Col>
          )}

          {showSubjectFilter && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="subjectId" label="Subject">
                <Select
                  placeholder="Select subject"
                  allowClear
                  loading={loading}
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
            </Col>
          )}

          {showDateFilter && !showDateRange && (
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="date" label="Date">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select date"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
          )}

          {showDateRange && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={24} md={showDateRange ? 4 : 6}>
            <Form.Item label=" ">
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit">
                  Filter
                </Button>
                <Button icon={<ClearOutlined />} onClick={handleReset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AttendanceFilter;
