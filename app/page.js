"use client";
import { useState, useEffect, useMemo } from "react";
import { Clock, Search, RefreshCw, ExternalLink } from "lucide-react";
import SidebarPopup from "./components/SidebarPopup";

// Category Filter Component
const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: "general", name: "All News" },
    { id: "releases", name: "New Releases" },
    { id: "esports", name: "Esports" },
    { id: "industry", name: "Industry" },
    { id: "hardware", name: "Hardware" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedCategory === category.id
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default function GamingNewsApp() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchGamingNews();
  }, []);

  const fetchGamingNews = async () => {
    setLoading(true);
    try {
      // Using World News API with gaming parameters
      const response = await fetch(
        `https://api.worldnewsapi.com/search-news?` +
          `text="gaming" OR "video games" OR "esports"` +
          `&language=en` +
          `&sort=publish-time` +
          `&sort-direction=desc` +
          `&api-key=${process.env.NEXT_PUBLIC_WORLD_NEWS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch gaming news");
      }
      const data = await response.json();
      setNews(data.news || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load gaming news. Please try again later.");
      setLoading(false);
      console.error(err);
    }
  };

  const filteredNews = useMemo(() => {
    let results = news.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply category filters
    if (selectedCategory !== "general") {
      results = results.filter((item) => {
        const title = item.title.toLowerCase();
        switch (selectedCategory) {
          case "releases":
            return title.includes("release") || title.includes("launch");
          case "esports":
            return (
              title.includes("esports") ||
              title.includes("tournament") ||
              title.includes("competitive")
            );
          case "industry":
            return (
              title.includes("studio") ||
              title.includes("developer") ||
              title.includes("acquisition")
            );
          case "hardware":
            return (
              title.includes("console") ||
              title.includes("controller") ||
              title.includes("pc") ||
              title.includes("hardware")
            );
          default:
            return true;
        }
      });
    }

    return results;
  }, [news, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen text-gray-200">
      {/* Header */}
      <header className="bg-purple-900 shadow-lg relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarPopup isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">GamePulse</h1>
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-purple-800/50 border border-purple-700 text-white rounded-full py-1 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full max-w-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <section className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </section>

        {/* Featured News Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Breaking Gaming News
            </h2>
            <button
              onClick={fetchGamingNews}
              className="flex items-center bg-purple-800 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.slice(0, 3).map((article) => (
                <FeaturedNewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Latest News Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Latest Updates</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              No news found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.slice(3).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 GameNews - Latest Video Game Updates</p>
          <p className="text-sm">Powered by World News API</p>
        </div>
      </footer>
    </div>
  );
}

// Featured News Card Component
function FeaturedNewsCard({ article }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition">
      <div className="h-48 overflow-hidden">
        <img
          src={article.image || "/placeholder-news.jpg"}
          alt={article.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(article.publish_date).toLocaleDateString()} • {article.source?.name}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {article.text || article.summary || "No description available"}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-400 hover:text-purple-300"
        >
          Read Full Story <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}

// News Card Component
function NewsCard({ article }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-32 md:h-auto relative overflow-hidden">
          <img
            src={article.image || "/placeholder-news.jpg"}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <div className="w-full md:w-3/4 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white transition-all duration-300 hover:text-purple-400">
              {article.title}
            </h3>
          </div>
          <div className="flex items-center text-xs text-gray-400 mb-3">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(article.publish_date).toLocaleDateString()} • {article.source?.name}
          </div>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {article.text || article.summary || "No description available"}
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-all duration-300 hover:scale-105"
          >
            Read More <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}