"use client";
import { useState, useEffect,useMemo } from "react";
import { Clock, Search, RefreshCw, ExternalLink } from "lucide-react";
import SidebarPopup from "./components/SidebarPopup";

// Platform Filter Component
// This component allows users to filter games by platform
const PlatformFilter = ({ selectedPlatform, setSelectedPlatform }) => {
  const platforms = [
    { id: 4, name: "PC" },
    { id: 187, name: "PS5" },
    { id: 1, name: "Xbox" },
    { id: 18, name: "PS4" },
    { id: 7, name: "Switch" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setSelectedPlatform(null)}
        className={`px-3 py-1 rounded-md text-sm ${
          !selectedPlatform
            ? "bg-purple-700 text-white"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        All Platforms
      </button>
      {platforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => setSelectedPlatform(platform.id)}
          className={`px-3 py-1 rounded-md text-sm ${
            selectedPlatform === platform.id
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {platform.name}
        </button>
      ))}
    </div>
  );
};

// Main App Component
export default function GamingNewsApp() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  useEffect(() => {
    fetchGamingNews();
  }, []);

  const fetchGamingNews = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const currentDate = today.toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      const formattedStartDate = startDate.toISOString().split("T")[0];

      // Modified API URL to sort by popularity
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
          `&dates=${formattedStartDate},${currentDate}` +
          "&ordering=-popularity" + // Sort by popularity descending
          "&page_size=10"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch gaming news");
      }
      const data = await response.json();
      setNews(data.results);
      setLoading(false);
    } catch (err) {
      setError("Failed to load gaming news. Please try again later.");
      setLoading(false);
    }
  };
  const filteredNews = useMemo(() => {
    return (
      news
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!selectedPlatform ||
              item.platforms?.some((p) => p.platform.id === selectedPlatform))
        )
        // Sort by rating first, then popularity count
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.popularity - a.popularity;
        })
    );
  }, [news, searchTerm, selectedPlatform]);
  return (
    <div className="min-h-screen text-gray-200">
      {/* Header */}
{/* Header */}
<header className="bg-purple-900 shadow-lg relative">
  <div className="container mx-auto px-4 py-6">
    <div className="flex items-center justify-between">
      {/* Sidebar and logo container */}
      <div className="flex items-center space-x-4">
        <SidebarPopup isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">GamePulse</h1>
          <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            DAILY
          </span>    
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="hidden md:block relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search games..."
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
        {/* Platform Filter */}
        <section className="mb-6">
          <PlatformFilter
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
          />
        </section>

        {/* Featured Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Today's Gaming Highlights
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
              {filteredNews.slice(0, 3).map((item) => (
                <FeaturedCard key={item.id} game={item} />
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
              No games found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.slice(3).map((item) => (
                <NewsCard key={item.id} game={item} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 GamePulse - Your Daily Gaming News</p>
          <p className="text-sm">Powered by RAWG API</p>
        </div>
      </footer>
    </div>
  );
}

// Featured Card Component
function FeaturedCard({ game }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition">
      <div className="h-48 overflow-hidden">
        <img
          src={game.background_image || "/api/placeholder/400/200"}
          alt={game.name}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(game.released).toLocaleDateString()}
          </div>
          <div className="bg-purple-900/50 px-2 py-0.5 rounded">
            Rating: {game.rating}/5
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {game.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <a
          href={`https://rawg.io/games/${game.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-400 hover:text-purple-300"
        >
          Read More <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}

// News Card Component
function NewsCard({ game }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-32 md:h-auto relative overflow-hidden">
          <img
            src={game.background_image || "/api/placeholder/200/200"}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div className="flex flex-wrap gap-1">
              {game.platforms?.slice(0, 3).map((platform) => (
                <span
                  key={platform.platform.id}
                  className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-white"
                >
                  {platform.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white transition-all duration-300 hover:text-purple-400">
              {game.name}
            </h3>
            <div className="bg-purple-900/50 px-2 py-0.5 rounded">
              Rating: {game.rating}/5
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(game.released).toLocaleDateString()}
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            {game.description || ""}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {game.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded transition-all duration-300 hover:bg-purple-800 hover:text-white cursor-pointer"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <a
            href={`https://rawg.io/games/${game.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-all duration-300 hover:scale-105"
          >
            Details <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
