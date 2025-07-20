import React, { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, ChevronRight, Trophy, Star, ArrowLeft, Sparkles, Activity, Target } from "lucide-react";

const SportsNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const category = "Sports";

  useEffect(() => {
    // Fetch initial news
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://realtime-news-app-kjfj.onrender.com/news/getallnews/${category}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    // Subscribe to category
    socket.emit("subscribe", category);

    // Listen for new news
    socket.on("new-news", (newItem) => {
      if (newItem.category === category) {
        setNews((prev) => [newItem, ...prev]);
      }
    });

    return () => {
      socket.off("new-news");
      socket.emit("unsubscribe", category);
    };
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    const options = { year: "numeric", month: "short", day: "numeric" };
    return past.toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 rounded-3xl"></div>
          <div className="relative p-8 rounded-3xl backdrop-blur-sm bg-white/40 border border-white/20 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Link 
                    to="/"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </Link>
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Live Updates
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent mb-3">
                  Sports News
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Stay updated with the latest scores, player transfers, championship results, and breaking sports news from around the world.
                </p>
              </div>
              {!isLoading && (
                <div className="flex flex-col items-end gap-2">
                  <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">
                      {news.length} Articles
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center my-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent absolute top-0"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Loading sports news...</p>
                <p className="text-sm text-gray-500">Getting the latest match updates</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {news.length === 0 ? (
              <div className="flex justify-center my-16">
                <div className="text-center p-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg max-w-md">
                  <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl w-fit mx-auto mb-6">
                    <Target className="w-12 h-12 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sports News Available</h3>
                  <p className="text-gray-500">Check back soon for the latest game results and sports updates</p>
                </div>
              </div>
            ) : (
              /* News Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1.5 text-xs font-bold rounded-full shadow-sm bg-gradient-to-r from-orange-100 to-red-200 text-orange-800">
                          {item.category}
                        </span>
                        
                        {item.trending && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            <Star className="w-3 h-3 fill-current" />
                            Trending
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-700 transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                        {item.content}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {item.createdAt ? formatTimeAgo(item.createdAt) : "Recent"}
                        </div>
                        
                        <Link
                          to={`/news/${item._id}`}
                          className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 group-hover:underline transition-colors duration-300"
                        >
                          Read more
                          <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Hover accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SportsNewsFeed;