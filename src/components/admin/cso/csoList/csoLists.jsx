import React, { useMemo, useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
// import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Icons for actions
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";
import { FiChevronLeft, FiChevronRight, FiType } from "react-icons/fi";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";

// Checkbox for row selection
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
      />
    );
  }
);

const CSOLists = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterInput, setFilterInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const [textSize, setTextSize] = useState("medium");
  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-xl",
  };
  // Fetch all data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/staff/me`,
          {
            withCredentials: true,
          }
        );

        if (!meResponse.data?.success) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cso/get`
        );
        if (response.succuss) {
        }
        setData(response.data);
      } catch (error) {
        if (error.status === 401) {
          navigate("/login");
          return;
        }
        toast.error("Error!" + error, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns based on your actual data structure
  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
      },
      { Header: "Registration ID", accessor: "registrationId" },
      { Header: "CSO Name", accessor: "csoName" },
      { Header: "Representative", accessor: "repName" },
      { Header: "Email", accessor: "email" },
      // { Header: "Sector", accessor: "sector" },
      // { Header: 'Status', accessor: 'status' },
      {
        Header: "Registration Date",
        accessor: (row) =>
          new Date(row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => handleView(row.original)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <FaEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className="text-green-500 hover:text-green-700"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return data;

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    });
  }, [data, startDate, endDate]);

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${row.csoName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/cso/remove/${row.id}`
        );
        setData((prevData) => prevData.filter((item) => item.id !== row.id));
        toast.success(
          "Deleted!" + `${row.csoName} has been deleted.` + "success"
        );
      } catch (error) {
        toast.error("Error!", "Failed to delete record.", "error");
      }
    }
  };

  const handleEdit = (row) => {
    navigate(`/admin/cso_edit/${row.id}`);
  };

  const handleView = (row) => {
    navigate(`/admin/cso_profile/${row.id}`);
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    selectedFlatRows,
    state: { globalFilter, pageIndex, pageSize, selectedRowIds },
    setPageSize,
    gotoPage, // Add this from react-table
    pageCount, // Add this from react-table
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: false, // Ensure react-table handles pagination
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // Update selectedRows state
  useEffect(() => {
    setSelectedRows(selectedFlatRows.map((row) => row.original));
  }, [selectedFlatRows]);

  // Handle export to Excel
  const handleExportExcel = (exportAll = false) => {
    const rowsToExport = exportAll ? filteredData : selectedRows;
    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CSO Lists");
    XLSX.writeFile(workbook, "CSOLists.xlsx");
  };

  // Handle export to PDF

  const handleExportPDF = (exportAll = false) => {
    const rowsToExport = exportAll ? filteredData : selectedRows;

    // Filter out selection and actions columns
    const pdfColumns = columns.filter(
      (col) => col.id !== "selection" && col.accessor !== "actions"
    );

    // Prepare headers
    const headers = pdfColumns.map((col) => col.Header);

    // Prepare data
    const body = rowsToExport.map((row) =>
      pdfColumns.map((col) => {
        // Handle nested objects if needed
        const value = row[col.accessor];
        return typeof value === "object" ? JSON.stringify(value) : value;
      })
    );

    const doc = new jsPDF();
    doc.autoTable({
      head: [headers],
      body: body,
      theme: "grid",
      styles: { fontSize: 10 },
      headerStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 50 },
    });

    doc.save("CSO_List.pdf");
  };

  // Handle global search input change
  const handleSearchChange = (e) => {
    const value = e.target.value || "";
    setFilterInput(value);
    setGlobalFilter(value);
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
  };

  const handleRegister = () => {
    navigate("/admin/user_register");
  };
  // const totalPages = Math.ceil(filteredData.length / pageSize);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-2"
      >
        <PlusOutlined />
        Register CSO
      </button>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <input
          className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterInput}
          onChange={handleSearchChange}
          placeholder="Search all records..."
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-950"
          />
        </div>
        <div className="w-full sm:w-auto flex items-center">
          <FiType className="mr-2 text-gray-500 hidden sm:block" />
          <select
            className="border rounded-lg px-3 py-2 text-blue-900 text-xs sm:text-xs w-full"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value)}
          >
            <option value="small">Small Text</option>
            <option value="medium">Medium Text</option>
            <option value="large">Large Text</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportExcel(false)}
            disabled={selectedRows.length === 0}
            className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
              selectedRows.length > 0
                ? "border border-green-500 text-green-600 font-bold hover:bg-green-50 wh"
                : "border border-green-500 text-green-600 opacity-75"
            }`}
          >
            <DownloadOutlined /> Excel
          </button>

          <button
            onClick={() => handleExportPDF(false)}
            disabled={selectedRows.length === 0}
            className={`px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
              selectedRows.length > 0
                ? "border border-red-500 text-red-600 hover:bg-red-50 font-bold"
                : "border border-red-500 text-red-600 opacity-75"
            }`}
          >
            <DownloadOutlined /> Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`px-4 py-3 text-left font-medium text-gray-500 uppercase whitespace-nowrap tracking-wider ${textSizes[textSize]}`}
                  >
                    {column.render("Header")}
                    <span className="text-xs">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className={`bg-white divide-y divide-gray-200 ${textSizes[textSize]}`}
          >
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className={`px-4 py-3 text-blue-950 ${textSizes[textSize]}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Page <span className="font-semibold">{pageIndex + 1}</span> of{" "}
            <span className="font-semibold">{pageCount}</span>
          </span>

          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">First</span>
              <FiChevronLeft className="h-5 w-5" />
              <FiChevronLeft className="h-5 w-5 -ml-3" />
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              let pageNum;
              if (pageCount <= 5) {
                pageNum = i + 1;
              } else if (pageIndex + 1 <= 3) {
                pageNum = i + 1;
              } else if (pageIndex + 1 >= pageCount - 2) {
                pageNum = pageCount - 4 + i;
              } else {
                pageNum = pageIndex + 1 - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => gotoPage(pageNum - 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageIndex + 1 === pageNum
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Last</span>
              <FiChevronRight className="h-5 w-5" />
              <FiChevronRight className="h-5 w-5 -ml-3" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CSOLists;
