import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft } from "react-feather";
import { ListAltOutlined } from "@mui/icons-material";
// import { dataBlog } from "../data";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import ScrollToTop from '../scrollToTop/ScrollToTop';

const NewsDetails = () => {
  const { id } = useParams();

 
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [commentsToShow, setCommentsToShow] = useState(5);
  const maxCommentLength = 150;
  // const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [commentSubmitSuccess, setCommentSubmitSuccess] = useState(false);
  // Comment states
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const toggleCommentExpand = (commentId) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleShowComments = () => {
    setCommentsToShow((prev) =>
      prev >= comments.length ? 4 : comments.length
    );
  };

  // Modified comments display logic
  const displayedComments = comments.slice(0, commentsToShow);
  const fetchComments = async () => {
    // setIsFetchingComments(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/news/${id}/comments`
      );
      setComments(response.data.data || []);
      setCommentSubmitSuccess(false);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      // setIsFetchingComments(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, allPostsResponse, commentsResponse] =
          await Promise.all([
            axios.get(`${process.env.REACT_APP_API_URL}/api/news/${id}`),
            axios.get(`${process.env.REACT_APP_API_URL}/api/news`),
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/news/${id}/comments`
            ),
          ]);

        const currentPost = postResponse.data.data;
        const posts = allPostsResponse.data.data;
        const postComments = commentsResponse.data.data || [];
    

        // Sort posts by date (newest first)
        const sortedPosts = [...posts].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        // Find current index in the sorted array
        const currentIndex = sortedPosts.findIndex(post => post.id === currentPost.id);
        
        // Set previous and next posts
        setPrevBlog(sortedPosts[(currentIndex + 1) % sortedPosts.length]);
        setNextBlog(sortedPosts[(currentIndex - 1 + sortedPosts.length) % sortedPosts.length]);

        
        // Fetch comments
        // await fetchComments();
        setBlog(currentPost);
        setAllPosts(posts);
        setComments(postComments);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch post");
        navigate("/news", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
 
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingComment(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/news/${id}/comments`,
        commentForm
      );
      
      setCommentForm({ name: "", email: "", content: "" });
      setCommentSubmitSuccess(true);
      
      // Refresh comments after successful submission
      await fetchComments();
      
      // Scroll to comments section
      setTimeout(() => {
        const commentsSection = document.getElementById("comments-section");
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };


  // Get related posts based on tag
  const relatedPosts = allPosts
    .filter((post) => post.id !== blog?.id && post.tag === blog?.tag)
    .slice(0, 4);

  // Filter and sort blogs
  const filteredBlogs = allPosts.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedBlogs = [...allPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const recentBlogs = sortedBlogs.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <h2 className="text-blue-600">Bishoftu Finance Office</h2>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Article not found</div>
      </div>
    );
  }

  return (
    <>
    <ScrollToTop/>
      <section className="relative overflow-hidden py-16 text-center text-white bg-gradient-to-r from-[#46b8ec] to-[#6c757d]">
        <div className="absolute inset-0 bg-[url('./banner_bg.png')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blog Details
            </h1>
            <p className="text-lg text-blue-100">
              Stay informed with our latest updates
            </p>
          </div>
        </div>
      </section>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link
                  to="/news"
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to News
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 bg-white rounded-lg shadow-md p-6"
              >
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  {blog.category || "News"}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    By {blog.author || "Admin"}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blog.date || new Date().toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blog.read_time || "5 min read"}
                  </span>
                </div>

                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
                  {blog.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${blog.image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`${
                      blog.image ? "hidden" : "flex"
                    } absolute inset-0 flex-col items-center justify-center p-4 bg-gray-200 text-gray-600`}
                  >
                    <div className="text-gray-400 mb-2">No Image Available</div>
                    <span className="text-lg text-center font-medium">
                      {blog.title}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-sm sm:prose lg:prose-lg max-w-none bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <p className="mb-4">{blog.description}</p>

                {blog.quotes && (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic bg-gray-50 p-4 my-6">
                    <p>{blog.quotes}</p>
                    <cite className="not-italic font-semibold">
                      Finance office
                    </cite>
                  </blockquote>
                )}

                {blog.list && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 my-6"></h3>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <ListAltOutlined className="text-blue-500 mr-2 mt-1" />
                        <span>{blog.list}</span>
                      </li>
                    </ul>
                  </>
                )}
              </motion.article>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-between gap-4 mb-8"
              >
                <Link
                  to={`/news/details/${prevBlog.id}`}
                  className="flex-1 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        // src={prevBlog.image}
                        src={`${process.env.REACT_APP_API_URL}/${prevBlog.image}`}
                        alt={prevBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Previous</span>
                      <h4 className="font-medium">{prevBlog.title}</h4>
                    </div>
                  </div>
                </Link>

                <Link
                  to={`/news/details/${nextBlog.id}`}
                  className="flex-1 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 text-right">
                    <div className="ml-auto">
                      <span className="text-sm text-gray-500">Next</span>
                      <h4 className="font-medium">{nextBlog.title}</h4>
                    </div>
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        // src={nextBlog.image}
                        src={`${process.env.REACT_APP_API_URL}/${nextBlog.image}`}

                        alt={nextBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                </h3>

                {comments.length === 0 ? (
                  <p className="text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  <>
                    {displayedComments.map((comment, index) => {
                      if (!comment || typeof comment !== "object" || !comment.content || !comment.name) 
                        return null;

                      const commentId = comment.id || `comment-${index}`;
                      const isExpanded = expandedComments.has(commentId);
                      const shouldTruncate = comment.content.length > maxCommentLength;
                      const content = isExpanded
                        ? comment.content
                        : shouldTruncate
                        ? `${comment.content.slice(0, maxCommentLength)}...`
                        : comment.content;

                      return (
                        <div
                          key={commentId}
                          id={`comment-${commentId}`}
                          className={`border-b border-gray-200 pb-6 mb-6 last:border-0 ${
                            comment.isNew ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <strong>{comment.name}</strong>
                                <span className="text-sm text-gray-500">
                                  {comment.created_at
                                    ? new Date(comment.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Just now"}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700">
                                {content}
                                {shouldTruncate && (
                                  <button
                                    onClick={() => toggleCommentExpand(commentId)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    {isExpanded ? "Read Less" : "Read More"}
                                  </button>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {comments.length > 5 && (
                      <div className="text-center mt-6">
                        <button
                          onClick={toggleShowComments}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          {commentsToShow >= comments.length
                            ? "Show Less"
                            : `Show More (${comments.length - commentsToShow})`}
                        </button>
                      </div>
                    )}
                  </>
                )}


                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Leave a Reply
                  </h3>
                  <form className="space-y-4" onSubmit={handleCommentSubmit}>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Comment *
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="5"
                        placeholder="Write your comment..."
                        value={commentForm.content}
                        onChange={(e) =>
                          setCommentForm({
                            ...commentForm,
                            content: e.target.value,
                          })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={commentForm.name}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={commentForm.email}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input type="checkbox" id="save-info" className="mr-2" />
                      <label htmlFor="save-info" className="text-gray-700">
                        Save my name, email in this browser for the next time I
                        comment.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      disabled={isSubmittingComment}
                    >
                      {isSubmittingComment ? "Submitting..." : "Post Comment"}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="search"
                    className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </form>

                {searchQuery && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Search Results:
                    </h4>
                    {filteredBlogs.length > 0 ? (
                      <ul className="space-y-2">
                        {filteredBlogs.map((blog) => (
                          <li key={blog.id}>
                            <Link
                              to={`/news/details/${blog.id}`}
                              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <img
                          src={`${process.env.REACT_APP_API_URL}/${blog.image}`}
                          alt={blog.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h5 className="font-medium">{blog.title}</h5>
                                <span className="text-sm text-gray-500">
                                  {blog.date}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No results found</p>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6 mb-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/news/details/${blog.id}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${blog.image}`}

                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {blog.date}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Tags Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog?.tag && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {blog.tag}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetails;
