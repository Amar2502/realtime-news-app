import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, ChevronRight, Rss, Plus, Sparkles, Star } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section with greeting and create button */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="relative p-8 rounded-3xl backdrop-blur-sm bg-white/40 border border-white/20 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Rss className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Live Updates
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
                  Welcome to NewsHub
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Stay informed with real-time news updates from around the world. Discover trending stories and breaking news as they happen.
                </p>
              </div>
              <Link
                to="/create-news"
                className="group relative inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create News
              </Link>
            </div>
          </div>
        </div>

        {/* Category selection */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Browse Categories
              </h2>
              <p className="text-gray-600">Explore news by your interests</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200/50 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-gray-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`relative w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {category.icon}
                  </div>
                  
                  <h3 className={`relative font-semibold ${category.textColor} group-hover:scale-105 transition-transform duration-300`}>
                    {category.name}
                  </h3>
                  
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Loading latest news...</p>
                <p className="text-sm text-gray-500">Getting the freshest stories for you</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Latest News Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
                  <p className="text-gray-600">Fresh stories from around the globe</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestNews
                  .filter((item) => item._id !== featured?._id)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={item._id}
                      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col transform hover:-translate-y-2"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                              item.category === "Tech"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                                : item.category === "Business"
                                ? "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800"
                                : item.category === "Health"
                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                                : item.category === "Science"
                                ? "bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800"
                                : item.category === "Entertainment"
                                ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800"
                                : item.category === "Sports"
                                ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800"
                                : item.category === "Politics"
                                ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                                : item.category === "Environment"
                                ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800"
                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
                            }`}
                          >
                            {item.category}
                          </span>
                          
                          {item.trending && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-medium rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              Trending
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {item.content}
                        </p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {formatTimeAgo(item.createdAt)}
                          </div>
                          
                          <Link
                            to={`/news/${item._id}`}
                            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:underline transition-colors duration-300"
                          >
                            Read more
                            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Hover accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsHomepage;