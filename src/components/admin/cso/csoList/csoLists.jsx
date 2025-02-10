import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination } from 'react-table';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import axios from 'axios';

const CSOLists = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [filterInput, setFilterInput] = useState(''); // State for global search input
  const [pageIndex, setPageIndex] = useState(0); // State for current page index
  const [pageSize, setPageSize] = useState(10); // State for page size

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cso?page=${pageIndex + 1}&limit=${pageSize}`);
        setData(response.data); // Assuming the API returns an array of CSO objects
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIndex, pageSize]); // Re-fetch data when pageIndex or pageSize changes

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Date', accessor: 'date' },
    ],
    []
  );

  // Use react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Use the `page` array for paginated rows
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Initial page settings
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Handle export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CSO Lists');
    XLSX.writeFile(workbook, 'CSOLists.xlsx');
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.Header)],
      body: data.map(row => columns.map(col => row[col.accessor])),
    });
    doc.save('CSOLists.pdf');
  };

  // Handle global search input change
  const handleSearchChange = e => {
    const value = e.target.value || '';
    setFilterInput(value);
    setGlobalFilter(value);
  };

  // Handle page size change
  const handlePageSizeChange = e => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPageIndex(0); // Reset to the first page when page size changes
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input
        value={filterInput}
        onChange={handleSearchChange}
        placeholder="Search by name, category, or date"
      />
      <button onClick={handleExportExcel}>Export to Excel</button>
      <button onClick={handleExportPDF}>Export to PDF</button>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
          </strong>{' '}
        </span>
        <select value={pageSize} onChange={handlePageSizeChange}>
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CSOLists;