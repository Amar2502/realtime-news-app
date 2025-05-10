import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/news/getnews/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news article. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">News article not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                news.category === "Tech" || news.category === "tech"
                  ? "bg-blue-100 text-blue-800"
                  : news.category === "Business"
                  ? "bg-indigo-100 text-indigo-800"
                  : news.category === "Health"
                  ? "bg-red-100 text-red-800"
                  : news.category === "Science"
                  ? "bg-cyan-100 text-cyan-800"
                  : news.category === "Entertainment"
                  ? "bg-purple-100 text-purple-800"
                  : news.category === "Sports"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {news.category}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimeAgo(news.createdAt)}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{news.content}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail; 