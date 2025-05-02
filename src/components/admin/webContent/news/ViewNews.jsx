import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Button, Input, Avatar, List, Modal } from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  DownOutlined,
  UpOutlined
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { TextArea } = Input;

const ViewNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [expandedContent, setExpandedContent] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3); // Show first 3 comments initially

  // Fetch news details and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newsResponse, commentsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/news/${id}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/news/${id}/comments`),
        ]);

        setNews(newsResponse.data.data);
        setComments(commentsResponse.data.data);
      } catch (error) {
        message.error("Failed to fetch news details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning("Please enter a comment");
      return;
    }

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/news/news/${id}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      
      setComments([response.data.data, ...comments]);
      setNewComment("");
      message.success("Comment added successfully");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/news/comments/${commentToDelete}`
      );

      setComments(comments.filter((comment) => comment.id !== commentToDelete));
      message.success("Comment deleted successfully");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete comment"
      );
    } finally {
      setDeleteModalVisible(false);
      setCommentToDelete(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY [at] h:mm A");
  };

  // Toggle content expansion
  const toggleContent = () => {
    setExpandedContent(!expandedContent);
  };

  // Show more comments
  const showMoreComments = () => {
    setVisibleComments(prev => prev + 5);
  };

  // Show fewer comments
  const showLessComments = () => {
    setVisibleComments(3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>News not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-700"
      >
        Back
      </Button>

      {/* News content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{news.title}</h1>

        <div className="flex items-center text-gray-500 mb-4">
          <span>
            By {news.author || "Unknown"} • {formatDate(news.created_at)}
          </span>
          <span className="mx-2">•</span>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {news.tag}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {news.image && (
            <div className="md:w-1/2">
              <img
                src={`${process.env.REACT_APP_API_URL}/${news.image}`}
                alt={news.title}
                className="w-full h-auto rounded-lg object-cover max-h-96"
              />
            </div>
          )}
          <div className={`md:w-1/2 ${!news.image && 'md:w-full'}`}>
            <div 
              className={`prose max-w-none ${!expandedContent ? 'line-clamp-5' : ''}`}
              dangerouslySetInnerHTML={{ __html: news.description }}
            />
            {news.description && news.description.length > 500 && (
              <Button 
                type="link" 
                onClick={toggleContent}
                className="p-0 mt-2"
              >
                {expandedContent ? (
                  <>
                    <UpOutlined /> Read Less
                  </>
                ) : (
                  <>
                    <DownOutlined /> Read More
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Comments ({comments.length})
        </h2>

        {/* Add comment form */}
        <div className="mb-6">
          <TextArea
            rows={4}
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            loading={commentLoading}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>

        {/* Comments list */}
        {comments.length > 0 ? (
          <>
            <List
              itemLayout="horizontal"
              dataSource={comments.slice(0, visibleComments)}
              renderItem={(comment) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setCommentToDelete(comment.id);
                        setDeleteModalVisible(true);
                      }}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {comment.name || "Anonymous"}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        {comment.email && (
                          <span className="text-gray-500 text-xs block">
                            {comment.email}
                          </span>
                        )}
                      </>
                    }
                    description={comment.content}
                  />
                </List.Item>
              )}
            />
            <div className="flex justify-center mt-4 gap-2">
              {visibleComments < comments.length && (
                <Button type="link" onClick={showMoreComments}>
                  <DownOutlined /> Show More Comments
                </Button>
              )}
              {visibleComments > 3 && (
                <Button type="link" onClick={showLessComments}>
                  <UpOutlined /> Show Fewer Comments
                </Button>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        title="Delete Comment"
        visible={deleteModalVisible}
        onOk={handleDeleteComment}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCommentToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </div>
  );
};

export default ViewNews;