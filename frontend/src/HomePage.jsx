import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, ChevronRight, Rss } from "lucide-react";

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
    // Simulate fetching latest news from all categories
    const fetchNews = () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // Sample news data across categories
        const sampleNews = [
          {
            _id: "1",
            title: "New AI Model Breaks Performance Records",
            content:
              "Researchers have developed a new AI model that outperforms previous benchmarks by 30% while using less computational resources.",
            category: "Tech",

            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            _id: "2",
            title: "Global Market Rally Continues for Third Day",
            content:
              "Stock markets around the world continue their upward trend following positive economic indicators.",
            category: "Business",

            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: "3",
            title: "Breakthrough in Cancer Treatment Shows Promise",
            content:
              "A new immunotherapy approach has shown remarkable results in early clinical trials.",
            category: "Health",

            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            _id: "4",
            title: "Climate Summit Concludes with New Global Agreements",
            content:
              "World leaders have reached consensus on ambitious new targets to reduce carbon emissions by 2030.",
            category: "Environment",

            createdAt: new Date(Date.now() - 10800000).toISOString(),
          },
          {
            _id: "5",
            title: "Major Sports League Announces Expansion Teams",
            content:
              "Two new cities will join the league starting next season, bringing the total number of teams to 32.",
            category: "Sports",

            createdAt: new Date(Date.now() - 14400000).toISOString(),
          },
          {
            _id: "6",
            title: "Scientists Discover New Exoplanet with Potential for Life",
            content:
              "The newly found exoplanet orbits in the habitable zone and shows signs of water vapor in its atmosphere.",
            category: "Science",

            createdAt: new Date(Date.now() - 18000000).toISOString(),
          },
        ];

        // Set featured article (first trending one)
        const featuredArticle = sampleNews.find((article) => article.trending);
        setFeatured(featuredArticle);

        // Set other articles
        setLatestNews(sampleNews);
        setIsLoading(false);
      }, 1500);
    };

    fetchNews();
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
      {/* Hero section with greeting */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to NewsHub
        </h1>
        <p className="text-xl text-gray-600">
          Your daily source for the latest and most relevant news
        </p>
      </div>

      {/* Category selection */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Browse Categories
          </h2>
          <Link
            to="/categories"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
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

            <h2>Latest News</h2>

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
                      <div className="flex items-center justify-between mt-auto text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTimeAgo(item.createdAt)}
                        </div>
                        <Link
                          to={`/news/${item._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
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
