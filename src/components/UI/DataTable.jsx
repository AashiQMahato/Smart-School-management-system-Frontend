/**
 * DataTable Component
 * Reusable data table with search, filters, and pagination
 */

import { useState } from "react";
import { Table, Input, Select, Button, Space, Tag } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Search } = Input;

/**
 * DataTable
 * @param {object} props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onSearch - Search handler
 * @param {function} props.onFilter - Filter handler
 * @param {function} props.onRefresh - Refresh handler
 * @param {object} props.pagination - Pagination config
 * @param {boolean} props.showSearch - Show search input
 * @param {boolean} props.showFilters - Show filter controls
 * @param {Array} props.filterOptions - Filter options [{key, label, options}]
 * @param {string} props.searchPlaceholder - Search input placeholder
 */
const DataTable = ({
  columns,
  data,
  loading = false,
  onSearch,
  onFilter,
  onRefresh,
  pagination = { pageSize: 10 },
  showSearch = true,
  showFilters = false,
  filterOptions = [],
  searchPlaceholder = "Search...",
  rowKey = "id",
  ...tableProps
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleReset = () => {
    setSearchValue("");
    setFilters({});
    onSearch?.("");
    onFilter?.({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Toolbar */}
      {(showSearch || showFilters || onRefresh) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <Search
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                className="w-full sm:w-64"
                allowClear
              />
            )}

            {/* Filters */}
            {showFilters && filterOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <Select
                    key={filter.key}
                    placeholder={filter.label}
                    value={filters[filter.key]}
                    onChange={(value) => handleFilterChange(filter.key, value)}
                    className="w-full sm:w-40"
                    allowClear
                    options={filter.options}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 sm:ml-auto">
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
              {onRefresh && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  loading={loading}>
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowKey={rowKey}
        scroll={{ x: "max-content" }}
        {...tableProps}
      />
    </div>
  );
};

export default DataTable;
