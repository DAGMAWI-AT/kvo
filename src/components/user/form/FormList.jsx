import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BarLoader } from "react-spinners";
import { FiClock, FiEdit2, FiEye, FiPlusCircle, FiCheckCircle, FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import { formatDistanceToNow, parseISO } from 'date-fns';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/form`, {
        withCredentials: true,
      });

      const processedForms = response.data.map((form) => ({
        ...form,
        expires_at: parseISO(form.expires_at),
        isExpired: new Date(form.expires_at) < new Date(),
        canEdit: new Date(form.expires_at) > new Date(),
        user_submission: form.user_submission ? {
          ...form.user_submission,
          submitted_at: parseISO(form.user_submission.submitted_at)
        } : null,
      }));

      setForms(processedForms);
      setLastRefresh(new Date());
    } catch (error) {      
      if (error.response?.status === 401 || error.status === 401) navigate("/user/login");

      toast.error(error.response?.data?.error || error.response?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [navigate]);

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.form_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === "active") {
      matchesFilter = !form.isExpired;
    } else if (filter === "completed") {
      matchesFilter = !!form.user_submission;
    } else if (filter === "expired") {
      matchesFilter = form.isExpired;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormAction = (form) => {
    const isSubmissionClosed =
      form.isExpired &&
      (form.user_submission?.update_permission === "close" ||
        !form.user_submission?.update_permission);

    if (isSubmissionClosed) {
      navigate(`/user/form/view/${form.id}`);
    } else if (form.user_submission) {
      navigate(`/user/form/${form.id}`);
    } else {
      navigate(`/user/form/${form.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-blue-950">Available Forms</h1>
          <p className="text-gray-500 mt-1">
            Showing {paginatedForms.length} of {filteredForms.length} forms
            <span className="text-xs text-gray-400 ml-2">
              (Last refreshed: {formatDistanceToNow(lastRefresh)} ago)
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search forms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={fetchForms}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
            title="Refresh forms"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Forms</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No forms found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedForms.map((form) => {
              const isSubmissionClosed =
                form.isExpired &&
                (form.user_submission?.update_permission === "close" ||
                  !form.user_submission?.update_permission);

              const hasSubmission = !!form.user_submission;
              const deadlinePassed = form.isExpired;

              return (
                <div key={form.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {form.form_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {form.description || "No description provided"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          deadlinePassed
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {deadlinePassed ? "Closed" : "Active"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <p>
                          {deadlinePassed 
                            ? `Closed ${formatDistanceToNow(form.expires_at)} ago`
                            : `Closes in ${formatDistanceToNow(form.expires_at)}`}
                        </p>
                      </div>
                      <div className="text-sm text-yellow-600">
                        Deadline: {new Date(form.expires_at).toLocaleString()}
                      </div>
                    </div>

                    {hasSubmission && (
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <FiCheckCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" />
                        <p>
                          Submitted {formatDistanceToNow(new Date(form.user_submission.submitted_at), { 
                            addSuffix: true,
                            includeSeconds: true 
                          })}
                          <span className="text-xs text-gray-400 ml-1">
                            ({new Date(form.user_submission.submitted_at).toLocaleString()})
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <button
                      onClick={() => handleFormAction(form)}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        isSubmissionClosed
                          ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                          : hasSubmission
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      disabled={isSubmissionClosed}
                    >
                      {isSubmissionClosed ? (
                        <>
                          <FiEye className="mr-2 h-4 w-4" />
                          View
                        </>
                      ) : hasSubmission ? (
                        <>
                          <FiEdit2 className="mr-2 h-4 w-4" />
                          Edit
                        </>
                      ) : (
                        <>
                          <FiPlusCircle className="mr-2 h-4 w-4" />
                          Start
                        </>
                      )}
                    </button>

                    {hasSubmission && (
                      <span className="text-xs text-gray-500">
                        {form.user_submission.status || "Submitted"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
          )}
        </>
      )}
    </div>
  );
};

export default FormList;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";

// const FormList = () => {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/form`, {
//           withCredentials: true,
//         });

//         const processedForms = response.data.map((form) => ({
//           ...form,
//           isExpired: new Date(form.expires_at) < new Date(),
//           canEdit: new Date(form.expires_at) > new Date(), // Derive is_editable from expires_at
//           user_submission: form.user_submission || null, // Ensure user_submission exists
//         }));

//         setForms(processedForms);
//       } catch (error) {
//         toast.error(error.response?.data?.error || "Failed to load forms");
//         if (error.response?.status === 401) navigate("/user/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchForms();
//   }, [navigate]);

//   const handleFormAction = (form) => {
//     const isSubmissionClosed =
//       form.isExpired &&
//       (form.user_submission?.update_permission === "close" ||
//         form.user_submission?.update_permission === null ||
//         Object.keys(form.user_submission?.update_permission || {}).length === 0);

//     if (isSubmissionClosed) {
//       navigate(`/user/form/view/${form.id}`);
//     } else if (form.user_submission) {
//       navigate(`/user/form/${form.id}`);
//     } else {
//       navigate(`/user/form/${form.id}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-transparent">
//         <ClipLoader color="#4F46E5" size={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6 text-gray-600">Available Forms</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {forms.map((form) => {
//           const isSubmissionClosed =
//             form.isExpired &&
//             (form.user_submission?.update_permission === "close" ||
//               form.user_submission?.update_permission === null ||
//               Object.keys(form.user_submission?.update_permission || {}).length === 0);

//           const hasSubmission = !!form.user_submission;

//           return (
//             <div key={form.id} className="bg-white p-4 rounded-lg shadow-md">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-xl font-semibold text-gray-700">{form.form_name}</h3>
//                 <span
//                   className={`text-sm px-2 py-1 rounded ${
//                     form.isExpired
//                       ? "bg-red-100 text-red-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {form.isExpired ? "Closed" : "Active"}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-2">
//                 Deadline: {new Date(form.expires_at).toLocaleString()}
//               </p>
//               <div className="flex justify-between items-center">
//                 <button
//                   onClick={() => handleFormAction(form)}
//                   className={`px-4 py-2 rounded ${
//                     isSubmissionClosed
//                       ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                       : hasSubmission
//                       ? "bg-blue-500 text-white hover:bg-blue-600"
//                       : "bg-green-500 text-white hover:bg-green-600"
//                   }`}
//                   disabled={isSubmissionClosed}
//                 >
//                   {isSubmissionClosed
//                     ? "View Submission"
//                     : hasSubmission
//                     ? "Edit Submission"
//                     : "Start Submission"}
//                 </button>
//                 {form.user_submission && (
//                   <span className="text-sm text-gray-500">
//                     Last updated:{" "}
//                     {new Date(form.user_submission.submitted_at).toLocaleDateString()}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default FormList;