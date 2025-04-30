import React, { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

const HealthNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const category = "Health";

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("📡 Socket event received:", event, args);
    });
    
    // Fetch initial news
    setIsLoading(true);
    axios.get(`http://localhost:3000/news/getallnews/${category}`)
      .then(res => {
        setNews(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });

    // Subscribe to category
    socket.emit("subscribe", category);

    // Listen for new news
    socket.on("new-news", (newItem) => {
      console.log("🔔 Received new-news:", newItem); // <-- Debug log
      if (newItem.category === category) {
        setNews(prev => [newItem, ...prev]);
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
    
    // For older dates, show the actual date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return past.toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg mr-4 shadow-md">
            <h1 className="text-3xl font-bold flex items-center">
              <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              {category} News
            </h1>
          </div>
          {!isLoading && (
            <div className="flex items-center">
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {news.length} articles
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          {isLoading ? (
            <div className="flex items-center text-blue-500 bg-blue-50 px-4 py-2 rounded-md">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Updating feed...</span>
            </div>
          ) : (
            <div className="">
            </div>
          )}
        </div>
      </div>

      {news.length === 0 && !isLoading ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p className="text-gray-600 text-lg">No news articles available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map(item => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex-grow">{item.title}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2 ${
                    item.category === "Tech" || item.category === "tech" ? "bg-blue-100 text-blue-800" :
                    item.category === "Finance" ? "bg-green-100 text-green-800" :
                    item.category === "Business" ? "bg-indigo-100 text-indigo-800" :
                    item.category === "Sports" ? "bg-orange-100 text-orange-800" :
                    item.category === "Entertainment" ? "bg-purple-100 text-purple-800" :
                    item.category === "Health" ? "bg-red-100 text-red-800" :
                    item.category === "Science" ? "bg-cyan-100 text-cyan-800" :
                    item.category === "Education" ? "bg-yellow-100 text-yellow-800" :
                    item.category === "Politics" ? "bg-gray-100 text-gray-800" :
                    item.category === "Environment" ? "bg-emerald-100 text-emerald-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {item.createdAt ? formatTimeAgo(item.createdAt) : "Recent"}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 inline-flex items-center">
                    </button>
                    <button className="text-blue-500 hover:text-blue-700 font-medium">
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthNewsFeed;