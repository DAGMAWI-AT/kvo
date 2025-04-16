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

const StaffList = () => {
  const [staffData, setStaffData] = useState([]);
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
  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    filterData();
  }, [staffData, searchText, statusFilter, roleFilter, dateRange]);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/staff/staff`
      );
      setStaffData(
        response.data.map((item, index) => ({
          ...item,
          displayId: `${index + 1}`,
          // Ensure created_at is a valid date
          created_at: item.created_at ? new Date(item.created_at) : new Date(),
        }))
      );
    } catch (error) {
      toast.error("Error fetching staff data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = [...staffData];

    // Apply search filter
    if (searchText) {
      result = result.filter((item) =>
        Object.keys(item).some((key) =>
          item[key]?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((item) => item.role === roleFilter);
    }

    // Apply date range filter - FIXED
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        if (!item.created_at) return false;

        const itemDate = moment(new Date(item.created_at));
        const startDate = moment(new Date(start));
        const endDate = moment(new Date(end));

        // Compare dates (ignoring time)
        return (
          itemDate.isSameOrAfter(startDate, "day") &&
          itemDate.isSameOrBefore(endDate, "day")
        );
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const toggleStaffStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/staff/update/${id}`,
        {
          status: newStatus,
        }
      );
      toast.success(`Staff status updated to ${newStatus}`);
      fetchStaffData();
    } catch (error) {
      toast.error("Error updating staff status");
      console.error("Error:", error);
    }
  };

  const deleteStaff = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/staff/${id}`);
      toast.success("Staff member deleted successfully");
      fetchStaffData();
    } catch (error) {
      toast.error("Error deleting staff member");
      console.error("Error:", error);
    }
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const exportData = filteredData.map((item, index) => ({
      "#": `${index + 1}`,
      "Registration ID": item.registrationId,
      Name: item.name,
      Email: item.email,
      Phone: item.phone || "N/A",
      Position: item.position || "N/A",
      Role: item.role.toUpperCase(),
      Status: item.status.toUpperCase(),
      "Registration Date": moment(item.created_at).format("YYYY-MM-DD HH:mm"),
      "Last Updated": item.updated_at
        ? moment(item.updated_at).format("YYYY-MM-DD HH:mm")
        : "N/A",
      "Email Verified": item.email_verified ? "Yes" : "No",
      //   'Photo': `${process.env.REACT_APP_API_URL}/staff/${item.photo}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Data");

    const columnWidths = [
      { wch: 8 },
      {
        wch: Math.max(
          3,
          ...exportData.map((item) => item.RegistrationId?.length || 0),
          15
        ),
      },
      {
        wch: Math.max(
          4,
          ...exportData.map((item) => item.Name?.length || 0),
          30
        ),
      },
      {
        wch: Math.max(
          5,
          ...exportData.map((item) => item.Email?.length || 0),
          40
        ),
      },
      {
        wch: Math.max(
          3,
          ...exportData.map((item) => item.Phone?.length || 0),
          25
        ),
      },
      {
        wch: Math.max(
          3,
          ...exportData.map((item) => item.Position?.length || 0),
          25
        ),
      },
      {
        wch: Math.max(
          4,
          ...exportData.map((item) => item.Role?.length || 0),
          15
        ),
      },
      {
        wch: Math.max(
          6,
          ...exportData.map((item) => item.Status?.length || 0),
          10
        ),
      },
      { wch: 20 },
      { wch: 20 },
      { wch: 5 },
      //   { wch: Math.max(3, ...exportData.map(item => item.Photo?.length || 0), 20) },
    ];

    worksheet["!cols"] = columnWidths;
    XLSX.writeFile(workbook, "staff_data.xlsx");
  };

  const exportToPDF = () => {
    if (filteredData.length === 0) {
      return;
    }

    try {
      const doc = new jsPDF("landscape");
      const title = "Staff List Report - " + moment().format("YYYY-MM-DD");
      const headers = [
        "#",
        "Registration ID",
        "Name",
        "Email",
        "Role",
        "Status",
        "Position",
        "Phone",
        "Reg-Date",
        "Last-Update",
        "Verified",
      ];

      const data = filteredData.map((item, index) => [
        index + 1,
        item.registrationId,
        item.name,
        item.email,
        item.role.toUpperCase(),
        item.status.toUpperCase(),
        item.position || "N/A",
        item.phone || "N/A",
        moment(item.created_at).format("YYYY-MM-DD HH:mm"),
        moment(item.updated_at).format("YYYY-MM-DD HH:mm"),
        item.email_verified ? "Yes" : "No",
      ]);

      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 16);
      doc.setFontSize(10);

      // AutoTable configuration
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 10, right: 10 },
        tableWidth: "auto",
      });

      doc.save(`staff_report_${moment().format("YYYYMMDD_HHmmss")}.pdf`);
      //   e('PDF export completed');
    } catch (error) {
      //   showError('Error generating PDF file');
      console.error("PDF export error:", error);
    }
  };
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this staff member?",
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone and will permanently remove the staff record.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return deleteStaff(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: <span className="text-blue-950 font-medium">#</span>,
      dataIndex: "displayId",
      key: "displayId",
      width: 80,
      fixed: "left",
      className: "text-blue-900",
      // This will make all text in this column blue
      sorter: (a, b) => a.displayId.localeCompare(b.displayId),
    },
    {
      title: <span className="text-gray-700 font-medium">Reg-ID</span>,
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
        { text: "Admin", value: "admin" },
        { text: "Super Admin", value: "sup_admin" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color =
          role === "sup_admin"
            ? "volcano"
            : role === "admin"
            ? "geekblue"
            : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
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
          onChange={() => toggleStaffStatus(record.id, status)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },

    {
      title: <span className="text-gray-700 font-medium">Action</span>,
      key: "action",
      //   fixed: 'right',
      className: "text-blue-950",

      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-700"
              //   onClick={() => viewStaffDetails(record.id)}
              onClick={() => navigate(`/admin/staffs/view/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              className="text-blue-700"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/staffs/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this staff member?"
            onConfirm={() => deleteStaff(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={() => showDeleteConfirm(record.id)}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const registerNewStaff = () => {
    navigate("/admin/staff_register");
  };

  // Pagination calculations
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
            placeholder="Search staff..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-48"
            ref={searchInput}
            prefix={<SearchOutlined />}
            allowClear
          />

          <Select
            placeholder="Filter by status"
            className="w-full md:w-40"
            onChange={handleStatusChange}
            value={statusFilter}
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          <Select
            placeholder="Filter by role"
            className="w-full md:w-40"
            onChange={handleRoleChange}
            value={roleFilter}
            allowClear
          >
            <Option value="all">All Roles</Option>
            <Option value="admin">Admin</Option>
            <Option value="sup_admin">Super Admin</Option>
          </Select>

          <RangePicker
            onChange={handleDateChange}
            className="w-full md:w-64"
            placeholder={["Start Date", "End Date"]}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={registerNewStaff}
            className="bg-blue-600"
          >
            Register Staff
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

      <div className="bg-white p-4 rounded-lg shadow text-outline ">
        <Table
          columns={columns}
          dataSource={currentItems}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
          bordered-b
          className="custom-table text-outline text-blue-600"
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

export default StaffList;
