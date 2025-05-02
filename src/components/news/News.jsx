import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt, FaUser, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import ScrollToTop from '../scrollToTop/ScrollToTop';

const News = () => {
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/news`
        );
        setPosts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const pageLimit = 3;
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const changePage = (pageNumber) => setCurrentPage(pageNumber);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4 p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Bishoftu Finance Office
          </h2>
        </div>
      </div>
    );
  }
  // if (loading) {
  //    return (
  //      <div className="flex justify-center items-center min-h-screen">
  //        <FaSpinner className="animate-spin text-4xl text-blue-600 flex-1" />
  //        <h2 className="text-blue-600">Bishoftu Finance Office</h2>
  //      </div>
  //    );
  //  }

  // if (error) {
  //   return (
  //     <div className="text-center py-12 text-red-500">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <>
    <ScrollToTop/>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 text-center text-white bg-gradient-to-r from-[#46b8ec] to-[#6c757d]">
        <div className="absolute inset-0 bg-[url('./banner_bg.png')] bg-cover bg-center opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              Finance Office News
            </h1>
            
            <p className="text-base md:text-lg text-blue-100 mb-6">
              Stay informed with the latest financial reports and announcements
            </p>
            
            <div className="flex justify-center">
              <Link 
                to="/contact"
                className="flex items-center px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-all duration-300 border border-white border-opacity-30"
              >
                Contact Us <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Latest Updates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Browse through our collection of financial news
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="zoom-in-right"
          >
            {currentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative bg-gray-100 aspect-video"> {/* Changed to aspect-video */}
                  <Link to={`/news/details/${post.id}`} className="block w-full h-full">
                    {post.image ? (
                      <img
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        src={`${process.env.REACT_APP_API_URL}/${post.image}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback Content */}
                    <div 
                      className={`flex flex-col items-center justify-center p-4 bg-gray-200 text-gray-600 w-full h-full ${
                        post.image ? 'hidden' : 'flex'
                      }`}
                      style={{ display: post.image ? 'none' : 'flex' }}
                    >
                      <span className="text-sm text-center font-medium line-clamp-3">
                        {post.description}
                      </span>
                    </div>
                  </Link>
                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-teal-500 to-green-500 text-white px-2 py-1 text-xs rounded flex items-center">
                    <FaCalendarAlt className="mr-1 text-xs" /> 
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <FaUser className="mr-1" /> By {post.author}
                  </div>
                  <h3 className="text-lg font-medium mb-2 hover:text-blue-600 transition-colors">
                    <Link to={`/news/details/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>
                  <Link 
                    to={`/news/details/${post.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Read More <FaArrowRight className="ml-1 text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <nav className="flex justify-center">
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 ml-0 rounded-l-lg border text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {startPage > 1 && (
                    <li>
                      <button
                        onClick={() => changePage(1)}
                        className="px-3 py-1 border text-sm bg-white text-gray-600 hover:bg-gray-50"
                      >
                        1
                      </button>
                    </li>
                  )}
                  
                  {pageNumbers.map((pageNumber) => (
                    <li key={pageNumber}>
                      <button
                        onClick={() => changePage(pageNumber)}
                        className={`px-3 py-1 border text-sm ${currentPage === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  
                  {endPage < totalPages && (
                    <li>
                      <button
                        onClick={() => changePage(totalPages)}
                        className="px-3 py-1 border text-sm bg-white text-gray-600 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}
                  
                  <li>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-r-lg border text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;