import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  Space,
  Button,
  Input,
  DatePicker,
  Select,
  Tag,
  Tooltip,
  Switch,
  Popconfirm,
  Modal,
} from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { confirm } = Modal;

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const meResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/staff/me`,
        { withCredentials: true }
      );

      if (!meResponse.data?.success) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/users`,
        { withCredentials: true }
      );
      
      setUsersData(
        response.data.map((item, index) => ({
          ...item,
          displayId: index + 1,
          created_at: item.created_at ? new Date(item.created_at) : new Date(),
        }))
      );
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterData();
  }, [usersData, searchText, statusFilter, roleFilter, dateRange]);

  const filterData = () => {
    let result = [...usersData];

    // Search filter
    if (searchText) {
      result = result.filter((item) =>
        Object.keys(item).some((key) =>
          item[key]?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((item) => item.role === roleFilter);
    }

    // Date range filter
    if (dateRange?.length === 2) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const itemDate = moment(item.created_at);
        return itemDate.isBetween(moment(start), moment(end), null, "[]");
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleError = (error) => {
    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);
    if (error.response?.status === 401) navigate("/login");
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/remove/${id}`,
        { withCredentials: true }
      );
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      handleError(error);
    }
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const exportData = filteredData.map((item) => ({
      "#": item.displayId,
      "Reg ID": item.registrationId,
      Name: item.name,
      Email: item.email,
      Role: item.role.toUpperCase(),
      Status: item.status.toUpperCase(),
      "Registration Date": moment(item.created_at).format("YYYY-MM-DD HH:mm"),
      "Last Login": item.last_login ? moment(item.last_login).format("YYYY-MM-DD HH:mm") : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const exportToPDF = () => {
    if (filteredData.length === 0) return;

    const doc = new jsPDF("landscape");
    const title = "Users Report - " + moment().format("YYYY-MM-DD");
    const headers = ["#", "Reg ID", "Name", "Email", "Role", "Status", "Registration Date"];
    
    const data = filteredData.map((item) => [
      item.displayId,
      item.registrationId,
      item.name,
      item.email,
      item.role.toUpperCase(),
      item.status.toUpperCase(),
      moment(item.created_at).format("YYYY-MM-DD HH:mm"),
    ]);

    doc.setFontSize(16);
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`users_report_${moment().format("YYYYMMDD_HHmmss")}.pdf`);
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteUser(id),
    });
  };

  const columns = [
    {
      title: <span className="text-blue-950 font-medium">#</span>,
      dataIndex: "displayId",
      key: "displayId",
      width: 80,
      fixed: "left",
      sorter: (a, b) => a.displayId - b.displayId,
    },
    {
      title: <span className="text-gray-700 font-medium">Reg ID</span>,
      dataIndex: "registrationId",
      key: "registrationId",
      className: "text-blue-950",
      sorter: (a, b) => a.registrationId.localeCompare(b.registrationId),
    },
    {
      title: <span className="text-gray-700 font-medium">Name</span>,
      dataIndex: "name",
      key: "name",
      className: "text-blue-950",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <span className="text-gray-700 font-medium">Email</span>,
      dataIndex: "email",
      key: "email",
      className: "text-blue-950",
    },
    {
      title: <span className="text-gray-800 font-medium">Role</span>,
      dataIndex: "role",
      key: "role",
      className: "text-blue-950",
      filters: [
        { text: "Cso", value: "cso" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={role === "cso" ? "geekblue" : "green"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: <span className="text-gray-700 font-medium">Status</span>,
      dataIndex: "status",
      key: "status",
      className: "text-blue-950",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={() => toggleUserStatus(record.id, status)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: <span className="text-gray-700 font-medium">Action</span>,
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-700"
              onClick={() => navigate(`/admin/cso_profile/${record.userId}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-700"
              onClick={() => navigate(`/admin/users/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are You Sure Delete this user?"
            onConfirm={() => deleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="mb-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 flex-wrap">
          <Input
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-48"
            prefix={<SearchOutlined />}
            allowClear
          />

          <Select
            placeholder="Status"
            className="w-full md:w-40"
            onChange={setStatusFilter}
            value={statusFilter}
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          <Select
            placeholder="Role"
            className="w-full md:w-40"
            onChange={setRoleFilter}
            value={roleFilter}
            allowClear
          >
            <Option value="all">All Roles</Option>
            <Option value="cso">CSO</Option>
          </Select>

          <RangePicker
            onChange={setDateRange}
            className="w-full md:w-64"
            placeholder={["Start Date", "End Date"]}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-blue-600"
            onClick={() => navigate("/admin/users/create_account")}
          >
            Create Account
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            className="border-green-500 text-green-600 hover:bg-green-50"
            disabled={filteredData.length === 0}
          >
            Excel
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={exportToPDF}
            className="border-red-500 text-red-600 hover:bg-red-50"
            disabled={filteredData.length === 0}
          >
            PDF
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={currentItems}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
          className="text-blue-950"
        />

        <div className="flex justify-between items-center mt-4 flex-col md:flex-row gap-4">
          <div className="text-sm text-gray-700">
            Show:
            <Select
              value={itemsPerPage}
              onChange={(value) => setItemsPerPage(value)}
              className="ml-2 w-20"
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">First</span>
                <FiChevronLeft className="h-5 w-5" />
                <FiChevronLeft className="h-5 w-5 -ml-3" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNum
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Last</span>
                <FiChevronRight className="h-5 w-5" />
                <FiChevronRight className="h-5 w-5 -ml-3" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;