import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, Share2, BookOpen, Calendar, User, Star, Heart, AlertCircle, Home } from "lucide-react";
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
        const res = await axios.get(`https://realtime-news-app-kjfj.onrender.com/news/getnews/${id}`);
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
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    const options = { year: "numeric", month: "long", day: "numeric" };
    return past.toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Tech: "from-blue-500 to-cyan-500",
      Business: "from-indigo-500 to-purple-500", 
      Health: "from-green-500 to-emerald-500",
      Science: "from-cyan-500 to-blue-500",
      Entertainment: "from-purple-500 to-pink-500",
      Sports: "from-orange-500 to-red-500",
      Finance: "from-green-500 to-teal-500",
      Politics: "from-gray-500 to-slate-500",
      Environment: "from-emerald-500 to-green-500",
      Education: "from-yellow-500 to-orange-500"
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  const getCategoryBgColor = (category) => {
    const colors = {
      Tech: "bg-blue-50 text-blue-700 border-blue-200",
      Business: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Health: "bg-green-50 text-green-700 border-green-200",
      Science: "bg-cyan-50 text-cyan-700 border-cyan-200",
      Entertainment: "bg-purple-50 text-purple-700 border-purple-200",
      Sports: "bg-orange-50 text-orange-700 border-orange-200",
      Finance: "bg-green-50 text-green-700 border-green-200",
      Politics: "bg-gray-50 text-gray-700 border-gray-200",
      Environment: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Education: "bg-yellow-50 text-yellow-700 border-yellow-200"
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">Loading article...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center p-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg max-w-md">
              <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl w-fit mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Something went wrong</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center p-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg max-w-md">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl w-fit mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Article Not Found</h3>
              <p className="text-gray-500 mb-6">The news article you're looking for doesn't exist</p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-600 hover:text-gray-900 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/80"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
            Back to feed
          </button>
        </div>

        {/* Main Article */}
        <article className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/60 to-white/80 rounded-3xl"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
            
            {/* Header Section */}
            <div className="p-8 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 text-sm font-bold rounded-2xl border ${getCategoryBgColor(news.category)} shadow-sm`}>
                    {news.category}
                  </span>
                  {news.trending && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
                      <Star className="w-3 h-3 fill-current" />
                      Trending
                    </div>
                  )}
                </div>
                
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200 group">
                  <Share2 className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                </button>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                {news.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gray-100 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="font-medium">{formatTimeAgo(news.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <span>{new Date(news.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-gray-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                  </div>
                  <span>{Math.ceil(news.content.split(' ').length / 200)} min read</span>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap font-normal">
                  {news.content}
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <div className="px-8 pb-8">
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                
                
                <div className={`h-2 w-24 bg-gradient-to-r ${getCategoryColor(news.category)} rounded-full shadow-sm`}></div>
              </div>
            </div>
          </div>
        </article>
        
        {/* Navigation Section */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;