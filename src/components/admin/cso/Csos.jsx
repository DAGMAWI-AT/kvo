import React, { useState } from "react";
import { FaSortAlphaDown, FaSortAlphaUp, FaThLarge, FaList } from "react-icons/fa";
import { useNavigate } from "react-router";

export  const allcsos=[
  {
    id: 1,
    name: "Green Earth Initiative",
    date: "2022-05-15",
    notifications: 1,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Youth for Change",
    date: "2021-11-20",
    notifications: 2,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "Health and Wellness Foundation",
    date: "2023-01-10",
    notifications: 0,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "Community Builders Network",
    date: "2020-06-25",
    notifications: 1,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    name: "Educators United",
    date: "2023-07-05",
    notifications: 3,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 6,
    name: "Green Earth Initiative",
    date: "2022-05-15",
    notifications: 1,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 7,
    name: "Youth for Change",
    date: "2021-11-20",
    notifications: 2,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 8,
    name: "Health and Wellness Foundation",
    date: "2023-01-10",
    notifications: 0,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 9,
    name: "Community Builders Network",
    date: "2020-06-25",
    notifications: 1,
    imageUrl: "https://via.placeholder.com/100",
  },
  {
    id: 10,
    name: "Educators United",
    date: "2023-07-05",
    notifications: 3,
    imageUrl: "https://via.placeholder.com/100",
  },
];
const Csos = () => {
  const navigate= useNavigate();

  const [csos, setCsos] = useState(allcsos)
  const [, setFilter] = useState("alphabet");//filter
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [displayMode, setDisplayMode] = useState("gallery");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const handleClick = (id) => {
    navigate(`/admin/each_cso/${id}`);
  };

  const handleSortChange = (order) => {
    setFilter(order);
    setCsos((prev) =>
      [...prev].sort((a, b) => {
        if (order === "asc") return a.name.localeCompare(b.name);
        if (order === "desc") return b.name.localeCompare(a.name);
        return 0;
      })
    );
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCsos = csos
    .filter((cso) =>
      cso.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((cso) => {
      const startDate = dateFilter.start ? new Date(dateFilter.start) : new Date(0);
      const endDate = dateFilter.end ? new Date(dateFilter.end) : new Date();
      const csoDate = new Date(cso.date);
      return csoDate >= startDate && csoDate <= endDate;
    });

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev === "gallery" ? "list" : "gallery"));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCsos.length / itemsPerPage);
  const currentItems = filteredCsos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-8 mx-auto max-w-6xl bg-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Civic Society Organizations
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <label className="text-gray-600 font-semibold">
            Sort By:
            <div className="flex space-x-2 items-center ml-2">
              <button
                onClick={() => handleSortChange("asc")}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FaSortAlphaDown className="text-lg text-gray-700" />
              </button>
              <button
                onClick={() => handleSortChange("desc")}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FaSortAlphaUp className="text-lg text-gray-700" />
              </button>
            </div>
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            name="start"
            value={dateFilter.start}
            onChange={handleDateFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
          <span>to</span>
          <input
            type="date"
            name="end"
            value={dateFilter.end}
            onChange={handleDateFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search"
          className="px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 w-36"
        />
      </div>

      {/* Display Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDisplayMode}
          className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
        >
          {displayMode === "gallery" ? (
            <FaList className="text-gray-700" />
          ) : (
            <FaThLarge className="text-gray-700" />
          )}
        </button>
      </div>

      {/* CSOs */}
      <div
        className={`${
          displayMode === "gallery"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : "flex flex-col space-y-4"
        }`}
      >
        {currentItems.length > 0 ? (
          currentItems.map((cso) => (
            <div
              key={cso.id}
              className={`relative bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:scale-105 ${
                displayMode === "list" ? "flex items-center space-x-4" : ""
              }`}
              onClick={() => handleClick(cso.id)}
            >
              {cso.notifications > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cso.notifications}
                </span>
              )}
              <img
                src={cso.imageUrl}
                alt={cso.name}
                className={`${
                  displayMode === "list"
                    ? "w-16 h-16 rounded-full"
                    : "w-20 h-20 rounded-full mx-auto mb-4"
                }`}
              />
              <div className={`${displayMode === "list" ? "flex-1" : "text-center"}`}>
                <h3 className="text-lg font-semibold text-gray-700">{cso.name}</h3>
                <p className="text-sm text-gray-500">
                  Registered: {new Date(cso.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No organizations found matching your criteria.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Csos;
