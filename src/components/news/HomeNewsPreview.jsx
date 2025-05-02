import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const HomeNewsPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/news`
        );
        setPosts(response.data.data.slice(0, 4)); //  Only first 4 news
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-blue-600 font-semibold animate-pulse">Loading latest news...</div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Latest News</h2>
          <p className="text-gray-600 text-sm">Catch up on the latest updates from Bishoftu Finance Office</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
              <Link to={`/news/details/${post.id}`}>
                {post.image ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${post.image}`}
                    alt={post.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </Link>
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <FaCalendarAlt className="mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2">
                  <Link to={`/news/details/${post.id}`}>
                    {post.title.length > 50 ? post.title.substring(0, 47) + "..." : post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All News Button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All News <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeNewsPreview;
