// import React, { useEffect, useState } from "react";
// import { FaSortAlphaDown, FaSortAlphaUp, FaThLarge, FaList } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router";

// const Csos = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [csos, setCsos] = useState([]);
//   const [filter, setFilter] = useState("alphabet"); // Filter state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
//   const [displayMode, setDisplayMode] = useState("gallery");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/cso/get");
//         if (response.ok) {
//           const data = await response.json();
//           setCsos(data || []);
//         } else {
//           console.error("Failed to fetch profile data. Response:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   const handleClick = (id) => {
//     navigate(`/admin/each_cso/${id}`);
//   };

//   const handleSortChange = (order) => {
//     setFilter(order);
//     setCsos((prev) =>
//       [...prev].sort((a, b) => {
//         if (order === "asc") return a.csoName.localeCompare(b.csoName);
//         if (order === "desc") return b.csoName.localeCompare(a.csoName);
//         return 0;
//       })
//     );
//   };

//   const handleDateFilterChange = (e) => {
//     const { name, value } = e.target;
//     setDateFilter((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredCsos = csos
//     .filter((cso) =>
//       cso.csoName?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter((cso) => {
//       const startDate = dateFilter.start ? new Date(dateFilter.start) : new Date(0);
//       const endDate = dateFilter.end ? new Date(dateFilter.end) : new Date();
//       const csoDate = new Date(cso.date);
//       return csoDate >= startDate && csoDate <= endDate;
//     });

//   const toggleDisplayMode = () => {
//     setDisplayMode((prev) => (prev === "gallery" ? "list" : "gallery"));
//   };

//   const totalPages = Math.ceil(filteredCsos.length / itemsPerPage);
//   const currentItems = filteredCsos.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const goToNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   return (
//     <div className="p-0 lg:p-8 mx-auto max-w-6xl bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl md:text-4xl font-thin text-gray-600 mb-6 text-center">
//         Civic Society Organizations
//       </h2>

//       {/* Filters */}
//       <div className="flex p-2 lg:border-2  flex-wrap justify-between items-center mb-6 gap-4">
//       {/* <div className="flex border-2 p-2  sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0"> */}

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleSortChange("asc")}
//             className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//           >
//             <FaSortAlphaDown className="text-lg text-gray-700" />
//           </button>
//           <button
//             onClick={() => handleSortChange("desc")}
//             className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
//           >
//             <FaSortAlphaUp className="text-lg text-gray-700" />
//           </button>
//         </div>
//         <div className="flex items-center gap-2">
//           <input
//             type="date"
//             name="start"
//             value={dateFilter.start}
//             onChange={handleDateFilterChange}
//             className="p-2 border rounded-md shadow-sm"
//           />
//           <span>to</span>
//           <input
//             type="date"
//             name="end"
//             value={dateFilter.end}
//             onChange={handleDateFilterChange}
//             className="p-2 border rounded-md shadow-sm"
//           />
//         </div>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleSearch}
//           placeholder="Search"
//           className="px-4 py-2 border rounded-md shadow-sm"
//         />
//       </div>

//       {/* Display Mode Toggle */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={toggleDisplayMode}
//           className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
//         >
//           {displayMode === "gallery" ? <FaList /> : <FaThLarge />}
//         </button>
//       </div>

//       {/* CSOs */}
//       <div
//         className={`${
//           displayMode === "gallery"
//             ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
//             : "flex flex-col gap-4"
//         }`}
//       >
//         {currentItems.length > 0 ? (
//           currentItems.map((cso) => (
//             <div
//               key={cso.id}
//               className="relative bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:scale-105"
//               onClick={() => handleClick(cso.id)}
//             >
//               <img
//                 src={`http://localhost:8000/logos/${cso.logo}`} // Replace with a placeholder image if no image is provided
//                 alt={cso.csoName}
//                 className="w-20 h-20 rounded-full mx-auto mb-4"
//               />
//               <h3 className="text-lg font-semibold text-center">{cso.csoName}</h3>
//               <p className="text-sm text-center text-gray-500">
//                 Registered: {new Date(cso.registrationDate).toLocaleDateString()}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">
//             No organizations found matching your criteria.
//           </p>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between mt-6">
//         <button
//           onClick={goToPreviousPage}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-300 text-gray-600 rounded disabled:cursor-not-allowed"
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={goToNextPage}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-300 text-gray-600 rounded disabled:cursor-not-allowed"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Csos;

import React, { useEffect, useState } from "react";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";

const Csos = () => {
  const navigate = useNavigate();

  const [csos, setCsos] = useState([]);
  const [, setFilter] = useState("alphabet"); //filter
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [displayMode, setDisplayMode] = useState("gallery");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:8000/cso/get");
        if (response.ok) {
          const data = await response.json();
          setCsos(data || []);
        } else {
          console.error(
            "Failed to fetch profile data. Response:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleClick = (id) => {
    navigate(`/admin/each_cso/${id}`);
  };

  const handleSortChange = (order) => {
    setFilter(order);
    setCsos((prev) =>
      [...prev].sort((a, b) => {
        if (order === "asc") return a.csoName.localeCompare(b.csoName);
        if (order === "desc") return b.csoName.localeCompare(a.csoName);
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
      cso.csoName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((cso) => {
      const startDate = dateFilter.start
        ? new Date(dateFilter.start)
        : new Date(0);
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
    <div className="p-2 lg:p-8 md:p-6 mx-auto max-w-6xl bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl md:text-4xl lg:text-4x1 p-2 lg:p-4 md:p-4 font-thin text-gray-600 mb-6 text-center">
        Civic Society Organizations
      </h2>

      {/* Filters */}
      <div className="flex border-2 p-2  sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 lg:space-x-4 md:space-x-3">
          <label className="text-gray-600 font-semibold">
            {/* Sort By: */}
            <div className="flex mt-4 lg:mt-0 md:mt-0 space-x-2 items-center">
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
        <div className="flex items-center space-x-1 lg:space-x-4 ">
          <input
            type="date"
            name="start"
            value={dateFilter.start}
            onChange={handleDateFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 w-14 lg:w-36 md:w-36"
          />
          <span>to</span>
          <input
            type="date"
            name="end"
            value={dateFilter.end}
            onChange={handleDateFilterChange}
            className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 w-14 lg:w-36 md:w-36"
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search"
          className="px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200 w-20 lg:w-36 md:3-36"
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
              key={cso.registrationId}
              className={`relative bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition transform hover:scale-105 ${
                displayMode === "list" ? "flex items-center space-x-4" : ""
              }`}
              onClick={() => handleClick(cso.registrationId)}
            >
              {cso.notifications > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cso.notifications}
                </span>
              )}
              <img
                src={`http://localhost:8000/logos/${cso.logo}`} // Replace with a placeholder image if no image is provided
                alt={cso.csoName}
                className={`${
                  displayMode === "list"
                    ? "w-16 h-16 rounded-full"
                    : "w-20 h-20 rounded-full mx-auto mb-4"
                }`}
              />
              <div
                className={`${
                  displayMode === "list" ? "flex-1" : "text-center"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {cso.csoName}
                </h3>
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
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Csos;
