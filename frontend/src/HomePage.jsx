import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, ChevronRight, Rss, Plus } from "lucide-react";
import axios from "axios";
import socket from "./socket";

const NewsHomepage = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featured, setFeatured] = useState(null);

  // News categories with icons and colors
  const categories = [
    {
      id: "tech",
      name: "Technology",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      icon: "💻",
    },
    {
      id: "business",
      name: "Business",
      color: "bg-indigo-500",
      textColor: "text-indigo-500",
      icon: "📊",
    },
    {
      id: "health",
      name: "Health",
      color: "bg-red-500",
      textColor: "text-red-500",
      icon: "🩺",
    },
    {
      id: "science",
      name: "Science",
      color: "bg-cyan-500",
      textColor: "text-cyan-500",
      icon: "🔬",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      icon: "🎬",
    },
    {
      id: "sports",
      name: "Sports",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      icon: "🏆",
    },
  ];

  useEffect(() => {
    // Fetch latest news from all categories
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://realtime-news-app-kjfj.onrender.com/news/getallnews/all");
        setLatestNews(res.data);
        // Set featured article (first trending one)
        const featuredArticle = res.data.find((article) => article.trending);
        setFeatured(featuredArticle);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    // Subscribe to all categories for real-time updates
    categories.forEach((category) => {
      socket.emit("subscribe", category.id);
    });

    // Listen for new news
    socket.on("new-news", (newItem) => {
      setLatestNews((prev) => [newItem, ...prev]);
    });

    return () => {
      socket.off("new-news");
      categories.forEach((category) => {
        socket.emit("unsubscribe", category.id);
      });
    };
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section with greeting and create button */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to NewsHub
          </h1>
          <p className="text-xl text-gray-600">
            Your daily source for the latest and most relevant news
          </p>
        </div>
        <Link
          to="/create-news"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create News
        </Link>
      </div>

      {/* Category selection */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Browse Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/${category.id}`}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 group`}
            >
              <div
                className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-white text-2xl mb-3`}
              >
                {category.icon}
              </div>
              <h3
                className={`font-semibold ${category.textColor} group-hover:underline`}
              >
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Loading latest news...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Latest News Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews
                .filter((item) => item._id !== featured?._id)
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col"
                  >
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center mb-2">
                        <span
                          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            item.category === "Tech"
                              ? "bg-blue-100 text-blue-800"
                              : item.category === "Business"
                              ? "bg-indigo-100 text-indigo-800"
                              : item.category === "Health"
                              ? "bg-red-100 text-red-800"
                              : item.category === "Science"
                              ? "bg-cyan-100 text-cyan-800"
                              : item.category === "Entertainment"
                              ? "bg-purple-100 text-purple-800"
                              : item.category === "Sports"
                              ? "bg-orange-100 text-orange-800"
                              : item.category === "Politics"
                              ? "bg-gray-100 text-gray-800"
                              : item.category === "Environment"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {item.content}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(item.createdAt)}
                        </div>
                        <Link
                          to={`/news/${item._id}`}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsHomepage;
