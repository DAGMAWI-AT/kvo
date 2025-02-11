import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Icons for actions
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

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
  const [filterInput, setFilterInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  // Fetch all data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cso/get');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns based on your actual data structure
  const columns = useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
      },
      { Header: 'Registration ID', accessor: 'registrationId' },
      { Header: 'CSO Name', accessor: 'csoName' },
      { Header: 'Representative', accessor: 'repName' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Sector', accessor: 'sector' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Registration Date', accessor: 'date' },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(row.original)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <FaEye className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className="text-green-500 hover:text-green-700"
              title="Edit"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <FaTrash className="w-5 h-5" />
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
      title: 'Are you sure?',
      text: `You are about to delete ${row.csoName}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/cso/remove/${row.id}`);
        setData((prevData) => prevData.filter((item) => item.id !== row.id));
        Swal.fire('Deleted!', `${row.csoName} has been deleted.`, 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete record.', 'error');
      }
    }
  };
  
  const handleEdit = (row) => {
    Swal.fire({
      title: 'Edit CSO',
      text: `Redirecting to edit ${row.csoName}...`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
    });
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
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // Handle export to Excel
  const handleExportExcel = (exportAll = false) => {
    const rowsToExport = exportAll ? filteredData : selectedFlatRows.map((row) => row.original);
    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CSO Lists');
    XLSX.writeFile(workbook, 'CSOLists.xlsx');
  };

  // Handle export to PDF
  const handleExportPDF = (exportAll = false) => {
    const rowsToExport = exportAll ? filteredData : selectedFlatRows.map((row) => row.original);
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map((col) => col.Header)],
      body: rowsToExport.map((row) => columns.map((col) => row[col.accessor])),
    });
    doc.save('CSOLists.pdf');
  };

  // Handle global search input change
  const handleSearchChange = (e) => {
    const value = e.target.value || '';
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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
                <button
            onClick={handleRegister}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
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
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExportExcel(false)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export Selected (Excel)
          </button>
          {/* <button
            onClick={() => handleExportExcel(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export All (Excel)
          </button> */}
          <button
            onClick={() => handleExportPDF(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export Selected (PDF)
          </button>
          {/* <button
            onClick={() => handleExportPDF(true)}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Export All (PDF)
          </button> */}
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ▼'
                          : ' ▲'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200"
          >
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {cell.render('Cell')}
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
            Page{' '}
            <span className="font-semibold">{pageIndex + 1}</span>{' '}
            of{' '}
            <span className="font-semibold">
              {Math.ceil(filteredData.length / pageSize)}
            </span>
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

        <div className="flex gap-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className={`px-4 py-2 text-sm rounded-lg ${
              canPreviousPage
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className={`px-4 py-2 text-sm rounded-lg ${
              canNextPage
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSOLists;