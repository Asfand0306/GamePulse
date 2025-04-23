"use client";
import { useState, useEffect, useMemo } from "react";
import { Clock, RefreshCw, ExternalLink } from "lucide-react";
import SidebarPopup from "./components/SidebarPopup";

// Focused specifically on video game news websites only
const targetSources = [
  "ign.com",
  "gamespot.com",
];

const categories = [
  {
    id: "releases",
    name: "New Releases",
    keywords: ["release", "launch", "comes out", "available now", "launches"],
  },
  {
    id: "esports",
    name: "Esports",
    keywords: [
      "esports",
      "tournament",
      "competitive",
      "pro player",
      "championship",
    ],
  },
  {
    id: "industry",
    name: "Industry",
    keywords: [
      "studio",
      "developer",
      "acquisition",
      "merger",
      "layoff",
      "CEO",
      "executive",
    ],
  },
  {
    id: "hardware",
    name: "Hardware",
    keywords: [
      "console",
      "controller",
      "GPU",
      "CPU",
      "Steam Deck",
      "Nintendo",
      "PlayStation",
      "Xbox",
      "PC",
    ],
  },
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
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
  const [selectedCategory, setSelectedCategory] = useState("releases");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchGamingNews();
  }, []);

  const fetchGamingNews = async () => {
    setLoading(true);
    try {
      // Build source domains parameter
      const sourceDomains = targetSources.join(",");

      const response = await fetch(
        `https://api.worldnewsapi.com/search-news?` +
          `text=("video game" OR "gaming" OR "game release" OR "new game")` +
          ` -sports -basketball -football -soccer` +
          `&source-domains=${sourceDomains}` +
          `&language=en` +
          `&sort=publish-time` +
          `&sort-direction=desc` +
          `&number=30` +
          `&api-key=${process.env.NEXT_PUBLIC_WORLD_NEWS_API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch gaming news");
      const data = await response.json();

      // More specific filtering to ensure only video game content
      const gamingNews = (data.news || []).filter(
        (article) => {
          const title = article.title.toLowerCase();
          const text = (article.text || "").toLowerCase();
          
          // Look for specific video game related terms
          const videoGameTerms = ["video game", "gaming", "gameplay", "playstation", "xbox", 
                                "nintendo", "pc game", "console", "game release"];
          
          return videoGameTerms.some(term => 
            title.includes(term) || text.includes(term)
          );
        }
      );

      setNews(gamingNews);
    } catch (err) {
      setError("Failed to load gaming news. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    let results = news;

    // Apply strict category filtering
    if (selectedCategory) {
      const categoryKeywords =
        categories.find((c) => c.id === selectedCategory)?.keywords || [];
      results = results.filter((article) => {
        const title = article.title.toLowerCase();
        const text = (article.text || "").toLowerCase();

        return categoryKeywords.some(
          (keyword) => title.includes(keyword) || text.includes(keyword)
        );
      });
    }

    return results;
  }, [news, selectedCategory]);

  return (
    <div className="min-h-screen text-gray-200">
      <header className="bg-purple-900 shadow-lg relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarPopup
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
              />
              <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  GamePulse
                </h1>
                <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  Daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {categories.find((c) => c.id === selectedCategory)?.name} News
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
                <FeaturedNewsCard key={article.url} article={article} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Latest Updates</h2>

          {filteredNews.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              No{" "}
              {categories
                .find((c) => c.id === selectedCategory)
                ?.name.toLowerCase()}{" "}
              news found from our premium sources.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.slice(3).map((article) => (
                <NewsCard key={article.url} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-950 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 GamePulse - Your premium gaming source</p>
        </div>
      </footer>
    </div>
  );
}

function FeaturedNewsCard({ article }) {
  const sourceName =
    article.source?.name ||
    article.url
      ?.match(/https?:\/\/(www\.)?([^\/]+)/)?.[2]
      ?.replace("www.", "") ||
    "Gaming News";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition">
      <div className="h-48 overflow-hidden relative">
        <img
          src={article.image || "/game-controller-placeholder.jpg"}
          alt={article.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = "/game-controller-placeholder.jpg";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <span className="text-xs bg-purple-900/80 text-white px-2 py-1 rounded">
            {sourceName}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(article.publish_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {article.text ||
            article.summary ||
            "Click to read this gaming news story"}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-400 hover:text-purple-300"
        >
          Read on {sourceName} <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}

function NewsCard({ article }) {
  const sourceName =
    article.source?.name ||
    article.url
      ?.match(/https?:\/\/(www\.)?([^\/]+)/)?.[2]
      ?.replace("www.", "") ||
    "Gaming News";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-32 md:h-auto relative overflow-hidden">
          <img
            src={article.image || "/game-controller-placeholder.jpg"}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = "/game-controller-placeholder.jpg";
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
            <span className="text-xs bg-purple-900/80 text-white px-2 py-1 rounded">
              {sourceName}
            </span>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4">
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(article.publish_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {article.text ||
              article.summary ||
              "Click to read this gaming news story"}
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm transition-all duration-300 hover:scale-105"
          >
            Continue Reading <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}