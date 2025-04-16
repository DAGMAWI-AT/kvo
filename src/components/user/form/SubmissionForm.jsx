


import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaBackward, FaExclamationTriangle, FaFileUpload, FaInfoCircle, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

const SubmissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submission, setSubmission] = useState({
    report_name: "",
    description: "",
    application_file: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError("Invalid form ID");
          return;
        }

        // Verify user session
        const meResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          credentials: "include",
        });

        if (!meResponse.ok) {
          navigate("/user/login");
          return;
        }

        // Get form data
        const formResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/form/${id}`,
          {
            credentials: "include",
          }
        );

        if (!formResponse.ok)
          throw new Error(`HTTP error! status: ${formResponse.status}: Form not found`);

        const formData = await formResponse.json();

        // Parse form_data if needed
        if (formData.form_data && typeof formData.form_data === "string") {
          formData.form_data = JSON.parse(formData.form_data);
        }

        // Ensure fields array exists
        if (!formData.form_data?.fields) {
          formData.form_data = { fields: [] };
        }

        // Fetch user's submission for this form
        const submissionResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/form/form/application?form_id=${id}`,
          {
            credentials: "include",
          }
        );

        if (!submissionResponse.ok)
          throw new Error(`HTTP error! status: ${submissionResponse.status}`);

        const submissionData = await submissionResponse.json();

        // If the user has already submitted, populate the form fields
        if (submissionData.length > 0) {
          setSubmission({
            report_name: submissionData[0].report_name,
            description: submissionData[0].description,
            application_file: submissionData[0].application_file,
          });
        }

        setForm(formData);
      } catch (error) {
        if (error.response?.status === 401) navigate("/user/login");
        toast.error(error.message || "Failed to load form");

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!id) {
        throw new Error("Form ID is missing");
      }
      if (error.response?.status === 401 || error.status === 401) navigate("/user/login");
      const formData = new FormData();
      formData.append("form_id", id);
      formData.append("report_name", submission.report_name);
      formData.append("description", submission.description);

      // Append the file only if a new file is selected
      if (submission.application_file instanceof File) {
        formData.append("application_file", submission.application_file);
      } else if (submission.application_file) {
        // Retain the existing file if no new file is uploaded
        formData.append("application_file", submission.application_file);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/form/application`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      navigate("/user/form");
    } catch (error) {
      if (error.response?.status === 401 || error.status === 401) navigate("/user/login");
      toast.error(error.message || "Submission failed. Please try again.");
    }finally {
      setSubmitting(false);
    }
  };


  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSubmission({
        ...submission,
        application_file: e.target.files[0],
      });
    }
  };

  const removeFile = () => {
    setSubmission({
      ...submission,
      application_file: null,
    });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <BarLoader color="#4F46E5" size={50} />
      </div>
    );
  }

  const isEditable = form?.can_edit && new Date(form.expires_at) > new Date();
  const hasSubmission = !!form?.user_submission;
  const isExpired = new Date(form?.expires_at) < new Date();
  const isSubmissionClosed =
    isExpired &&
    (form?.user_submission?.update_permission === "close" ||
      form?.user_submission?.update_permission === null ||
      Object.keys(form?.user_submission?.update_permission || {}).length === 0);

      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
              <BarLoader color="#3b82f6" height={4} width={200} />
              <p className="mt-3 text-gray-600">Loading form data...</p>
            </div>
          </div>
        );
      }
    
      if (!form) {
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                <FaTimes className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Form Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "The requested form could not be loaded."}</p>
              <button
                onClick={() => navigate("/user/form")}
                className="w-full max-w-xs mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Forms
              </button>
            </div>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
           
            <div className="mb-8 flex gap-4 flex-wrap">
            <Link
                onClick={() => navigate("/user/form")}
                className=""
              >
                <FaArrowAltCircleLeft/> Back To Form
              </Link>
              <h1 className="text-2xl font-semibold font-serif text-blue-950 ">{form.form_name}</h1>
              {isExpired && (
                <div className="flex items-center text-gray-500 mt-1">
                  <FaInfoCircle className="mr-2" />
                  <span>Closed on {new Date(form.expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
    
            {/* Side-by-side layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left panel - Form */}
              <div className="lg:w-2/3 bg-white rounded-xl shadow-md overflow-hidden">
                {isSubmissionClosed ? (
                  <div className="p-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <FaExclamationTriangle className="flex-shrink-0 text-yellow-500 mt-1 mr-3" />
                        <div>
                          <h3 className="font-medium text-yellow-800">
                            Submissions {hasSubmission ? "Updates" : "Creation"} Closed
                          </h3>
                          <p className="text-yellow-700 mt-1">
                            This form is no longer accepting {hasSubmission ? "updates" : "new submissions"}.
                          </p>
                          
                          {hasSubmission && (
                            <div className="mt-4 bg-white p-4 rounded-lg border border-yellow-100">
                              <h4 className="font-semibold text-gray-800 mb-3">Your Submission Details</h4>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <p className="text-gray-500">Report Name</p>
                                  <p className="text-gray-800 font-medium">{submission.report_name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Description</p>
                                  <p className="text-gray-800">{submission.description || "Not provided"}</p>
                                </div>
                                {submission.application_file && (
                                  <div>
                                    <p className="text-gray-500">Attached File</p>
                                    <p className="text-gray-800">
                                      {typeof submission.application_file === "string" 
                                        ? submission.application_file 
                                        : submission.application_file.name}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={submission.report_name}
                          onChange={(e) => setSubmission({ ...submission, report_name: e.target.value })}
                          placeholder="Enter report name"
                        />
                      </div>
    
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={submission.description}
                          onChange={(e) => setSubmission({ ...submission, description: e.target.value })}
                          placeholder="Provide additional details (optional)"
                        />
                      </div>
    
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application File {!hasSubmission && <span className="text-red-500">*</span>}
                        </label>
                        
                        {submission.application_file ? (
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300 mb-3">
                            <div className="flex items-center">
                              <FaFileUpload className="text-gray-400 mr-3 text-lg" />
                              <span className="truncate max-w-xs">
                                {submission.application_file instanceof File 
                                  ? submission.application_file.name 
                                  : submission.application_file}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove file"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ) : null}
                        
                        <label className="block">
                          <div className="mt-1 flex flex-col items-center justify-center px-6 pt-8 pb-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                            <FaFileUpload className="text-4xl text-gray-400 mb-3" />
                            <div className="flex text-sm text-gray-600 mb-1">
                              <span className="font-medium text-blue-600 hover:text-blue-500">
                                Click to upload
                              </span>
                              <span className="ml-1">or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Supports: PNG, JPG, PDF (Max: 10MB)
                            </p>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              required={!hasSubmission}
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
    
                    <div className="pt-4">
                      {isEditable || !isSubmissionClosed  ?  (
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`w-full flex items-center justify-center gap-3 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all ${
                            submitting ? 'opacity-80 cursor-not-allowed' : ''
                          }`}
                        >
                          {submitting ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              {hasSubmission ? "Updating..." : "Submitting..."}
                            </>
                          ) : (
                            <>
                              <FaSave />
                              {hasSubmission ? "Update Submission" : "Submit Form"}
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-700">
                          {hasSubmission
                            ? "Your submission is final and can no longer be edited"
                            : "This form is no longer accepting new submissions"}
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>
    
              {/* Right panel - Instructions/Info */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                  <div className="bg-blue-600 text-white p-4">
                    <h2 className="font-semibold text-lg">Submission Guidelines</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-500 mt-1 mr-3">
                        <FaInfoCircle />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Report Naming</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Use a clear, descriptive name that reflects the content of your report.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-500 mt-1 mr-3">
                        <FaInfoCircle />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">File Requirements</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Accepted formats: PNG, JPG, PDF (Max 10MB). Ensure files are readable and complete.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-blue-500 mt-1 mr-3">
                        <FaInfoCircle />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Submission Status</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {isExpired 
                            ? "This form is now closed for submissions."
                            : `Open until ${new Date(form.expires_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    
                    {hasSubmission && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 text-blue-500 mt-1 mr-3">
                          <FaInfoCircle />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Your Submission</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {isEditable 
                              ? "You can update your submission until the deadline."
                              : "Your submission is now final and cannot be edited."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default SubmissionForm;


// import React, { useState, useEffect } from "react";
// import { FaFileUpload, FaSave, FaTrash } from "react-icons/fa";
// import { FaSpinner } from "react-icons/fa6";
// import { useParams, useNavigate } from "react-router-dom";
// import { BarLoader } from "react-spinners";
// import { toast } from "react-toastify";

// const SubmissionForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState(null);
//   const [submission, setSubmission] = useState({
//     report_name: "",
//     description: "",
//     application_file: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!id) {
//           setError("Invalid form ID");
//           return;
//         }

//         // Verify user session
//         const meResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
//           credentials: "include",
//         });

//         if (!meResponse.ok) {
//           navigate("/user/login");
//           return;
//         }

//         // Get form data
//         const formResponse = await fetch(
//           `${process.env.REACT_APP_API_URL}/api/form/${id}`,
//           {
//             credentials: "include",
//           }
//         );

//         if (!formResponse.ok)
//           throw new Error(`HTTP error! status: ${formResponse.status}: Form not found`);

//         const formData = await formResponse.json();

//         // Parse form_data if needed
//         if (formData.form_data && typeof formData.form_data === "string") {
//           formData.form_data = JSON.parse(formData.form_data);
//         }

//         // Ensure fields array exists
//         if (!formData.form_data?.fields) {
//           formData.form_data = { fields: [] };
//         }

//         // Fetch user's submission for this form
//         const submissionResponse = await fetch(
//           `${process.env.REACT_APP_API_URL}/api/form/form/application?form_id=${id}`,
//           {
//             credentials: "include",
//           }
//         );

//         if (!submissionResponse.ok)
//           throw new Error(`HTTP error! status: ${submissionResponse.status}`);

//         const submissionData = await submissionResponse.json();

//         // If the user has already submitted, populate the form fields
//         if (submissionData.length > 0) {
//           setSubmission({
//             report_name: submissionData[0].report_name,
//             description: submissionData[0].description,
//             application_file: submissionData[0].application_file,
//           });
//         }

//         setForm(formData);
//       } catch (error) {
//         if (error.response?.status === 401) navigate("/user/login");
//         toast.error(error.message || "Failed to load form");

//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       if (!id) {
//         throw new Error("Form ID is missing");
//       }
//       if (error.response?.status === 401 || error.status === 401) navigate("/user/login");
//       const formData = new FormData();
//       formData.append("form_id", id);
//       formData.append("report_name", submission.report_name);
//       formData.append("description", submission.description);

//       // Append the file only if a new file is selected
//       if (submission.application_file instanceof File) {
//         formData.append("application_file", submission.application_file);
//       } else if (submission.application_file) {
//         // Retain the existing file if no new file is uploaded
//         formData.append("application_file", submission.application_file);
//       }

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/form/application`,
//         {
//           method: "PUT",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Submission failed");
//       }

//       navigate("/user/form");
//     } catch (error) {
//       if (error.response?.status === 401 || error.status === 401) navigate("/user/login");
//       toast.error(error.message || "Submission failed. Please try again.");
//     }finally {
//       setSubmitting(false);
//     }
//   };


//   const handleFileChange = (e) => {
//     if (e.target.files?.[0]) {
//       setSubmission({
//         ...submission,
//         application_file: e.target.files[0],
//       });
//     }
//   };

//   const removeFile = () => {
//     setSubmission({
//       ...submission,
//       application_file: null,
//     });
//   };
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-transparent">
//         <BarLoader color="#4F46E5" size={50} />
//       </div>
//     );
//   }

//   const isEditable = form?.can_edit && new Date(form.expires_at) > new Date();
//   const hasSubmission = !!form?.user_submission;
//   const isExpired = new Date(form?.expires_at) < new Date();
//   const isSubmissionClosed =
//     isExpired &&
//     (form?.user_submission?.update_permission === "close" ||
//       form?.user_submission?.update_permission === null ||
//       Object.keys(form?.user_submission?.update_permission || {}).length === 0);

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">{form?.form_name}</h2>
//         {isExpired && isSubmissionClosed && (
//           <button
//             onClick={() => navigate("/user/form")}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Close
//           </button>
//         )}
//       </div>

//       {/* Hide the form if update_permission is "close" and it's expired */}
//       {isSubmissionClosed ? (
//         <div className="space-y-4">
//           <div className="bg-yellow-100 p-4 rounded-lg">
//             This form is no longer accepting submissions.
//             {hasSubmission && (
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold">Your Submission</h3>
//                 {/* Display submission data */}
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Report Name
//             </label>
//             <input
//               type="text"
//               required
//               className="w-full p-2 border rounded-md"
//               value={submission.report_name}
//               onChange={(e) =>
//                 setSubmission({ ...submission, report_name: e.target.value })
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               className="w-full p-2 border rounded-md"
//               value={submission.description}
//               onChange={(e) =>
//                 setSubmission({ ...submission, description: e.target.value })
//               }
//             />
//           </div>
//           <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Application File {!hasSubmission && <span className="text-red-500">*</span>}
//                 </label>
//                 <div className="mt-1">
//                   {submission.application_file ? (
//                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-300">
//                       <div className="flex items-center">
//                         <FaFileUpload className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                         <span className="ml-2 truncate max-w-xs">
//                           {submission.application_file instanceof File 
//                             ? submission.application_file.name 
//                             : submission.application_file}
//                         </span>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={removeFile}
//                         className="text-red-500 hover:text-red-700"
//                         title="Remove file"
//                       >
//                         <FaTrash className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ) : null}
                  
//                   <label className="mt-2 block">
//                     <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                       <div className="space-y-1 text-center">
//                         <svg
//                           className="mx-auto h-12 w-12 text-gray-400"
//                           stroke="currentColor"
//                           fill="none"
//                           viewBox="0 0 48 48"
//                           aria-hidden="true"
//                         >
//                           <path
//                             d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                             strokeWidth={2}
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                         <div className="flex text-sm text-gray-600">
//                           <label
//                             htmlFor="file-upload"
//                             className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                           >
//                             <span>Upload a file</span>
//                             <input
//                               id="file-upload"
//                               name="file-upload"
//                               type="file"
//                               accept="image/*,application/pdf"
//                               required={!hasSubmission}
//                               className="sr-only"
//                               onChange={handleFileChange}
//                             />
//                           </label>
//                           <p className="pl-1">or drag and drop</p>
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           PNG, JPG, PDF up to 5MB
//                         </p>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//           {/* <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Application File
//             </label>
//             {submission.application_file &&
//             typeof submission.application_file === "string" ? (
//               <div className="mt-2">
//                 <span className="text-sm text-gray-600">
//                   Uploaded file: {submission.application_file}
//                 </span>
//                 <input
//                   type="file"
//                   accept="image/*,application/pdf"
//                   className="w-full p-2 border rounded-md mt-2"
//                   onChange={(e) => {
//                     if (e.target.files && e.target.files[0]) {
//                       setSubmission({
//                         ...submission,
//                         application_file: e.target.files[0],
//                       });
//                     }
//                   }}
//                 />
//               </div>
//             ) : (
//               <input
//                 type="file"
//                 accept="image/*,application/pdf"
//                 required
//                 className="w-full p-2 border rounded-md"
//                 onChange={(e) => {
//                   if (e.target.files && e.target.files[0]) {
//                     setSubmission({
//                       ...submission,
//                       application_file: e.target.files[0],
//                     });
//                   }
//                 }}
//               />
//             )}
//           </div> */}

//           {isEditable || !isSubmissionClosed ? (
//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors ${
//                   submitting ? 'opacity-75 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {submitting ? (
//                   <>
//                     <FaSpinner className="animate-spin" />
//                     {hasSubmission ? "Updating..." : "Submitting..."}
//                   </>
//                 ) : (
//                   <>
//                     <FaSave />
//                     {hasSubmission ? "Update Submission" : "Submit Form"}
//                   </>
//                 )}
//               </button>
//               {/* <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
//               >
//                 {hasSubmission ? "Update Submission" : "Submit Form"}
//               </button> */}
//             </div>
//           ) : (
//             <div className="bg-gray-100 p-4 rounded-lg text-center">
//               {hasSubmission
//                 ? "Your submission is final and can no longer be edited"
//                 : "This form is no longer accepting new submissions"}
//             </div>
//           )}
//         </form>
//       )}
//     </div>
//   );
// };

// export default SubmissionForm;