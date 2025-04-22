// app/bestofyear/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  ChevronLeft,
  ExternalLink,
  Star,
  Trophy,
  Calendar,
  Gamepad,
} from "lucide-react";

export default function BestOfYear() {
  const [gamesByYear, setGamesByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const router = useRouter();

  // Generate years from current year back to 1980 for more nostalgia
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    if (selectedYear) {
      fetchGamesForYear(selectedYear);
    }
  }, [selectedYear]);

  const fetchGamesForYear = async (year) => {
    setLoading(true);
    setExpandedGame(null);
    try {
      // Fetch top rated games
      const topRatedResponse = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
          `&dates=${year}-01-01,${year}-12-31` +
          "&ordering=-rating" +
          "&page_size=12"
      );

      // Fetch most acclaimed games (by metacritic)
      const acclaimedResponse = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
          `&dates=${year}-01-01,${year}-12-31` +
          "&ordering=-metacritic" +
          "&page_size=12"
      );

      // Fetch popular games
      const popularResponse = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
          `&dates=${year}-01-01,${year}-12-31` +
          "&ordering=-added" +
          "&page_size=12"
      );

      if (
        !topRatedResponse.ok ||
        !acclaimedResponse.ok ||
        !popularResponse.ok
      ) {
        throw new Error(`Failed to fetch games for ${year}`);
      }

      const topRatedData = await topRatedResponse.json();
      const acclaimedData = await acclaimedResponse.json();
      const popularData = await popularResponse.json();

      // Combine and deduplicate games
      const allGames = [
        ...topRatedData.results,
        ...acclaimedData.results,
        ...popularData.results,
      ];
      const uniqueGames = allGames.reduce((acc, game) => {
        if (!acc.some((g) => g.id === game.id)) {
          acc.push(game);
        }
        return acc;
      }, []);

      // Sort by rating and limit to 24 games
      const sortedGames = uniqueGames
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 24);

      setGamesByYear((prev) => ({
        ...prev,
        [year]: sortedGames,
      }));
      setLoading(false);
    } catch (err) {
      setError(`Failed to load games for ${year}. Please try again later.`);
      setLoading(false);
    }
  };

  const fetchGameDetails = async (gameId) => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch game details");
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching game details:", err);
      return null;
    }
  };

  const handleExpandGame = async (game) => {
    if (expandedGame?.id === game.id) {
      setExpandedGame(null);
    } else {
      const details = await fetchGameDetails(game.id);
      setExpandedGame({
        ...game,
        details: details || {},
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-gray-200">
      {/* Header with nostalgic gaming vibe */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-lg border-b border-purple-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-purple-300 transition group"
            >
              <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-white flex items-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300">
              <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
              Hall of Gaming Fame
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedYear ? (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <Calendar className="h-6 w-6 mr-2 text-purple-300" />
              Select a Year to Explore Gaming History
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative bg-gray-800 hover:bg-gradient-to-br from-purple-800 to-indigo-800 text-white text-xl font-bold py-8 rounded-lg transition-all transform hover:scale-105 overflow-hidden group`}
                >
                  <span className="relative z-10">{year}</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
                    {selectedYear} Gaming Hall of Fame
                  </span>
                </h2>
                <p className="text-purple-300 flex items-center">
                  <Gamepad className="h-4 w-4 mr-1" />
                  The most acclaimed games of the year
                </p>
              </div>
              <button
                onClick={() => setSelectedYear(null)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition group"
              >
                <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                All Years
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                <span className="ml-3 text-purple-300">
                  Loading gaming history...
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gamesByYear[selectedYear]?.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isExpanded={expandedGame?.id === game.id}
                    onExpand={() => handleExpandGame(game)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function GameCard({ game, isExpanded, onExpand }) {
  const ratingStars = Math.round(game.rating);
  const metacriticColor =
    game.metacritic >= 90
      ? "bg-green-600/80"
      : game.metacritic >= 75
      ? "bg-yellow-600/80"
      : "bg-red-600/80";

  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/50 transition-all ${
        isExpanded ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <div
        className="h-48 overflow-hidden relative cursor-pointer"
        onClick={onExpand}
      >
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{game.name}</h3>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < ratingStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-500"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-300">
              {game.rating.toFixed(1)}
            </span>
          </div>
        </div>
        {game.metacritic && (
          <div
            className={`absolute top-2 right-2 ${metacriticColor} text-white text-sm font-bold px-2 py-1 rounded`}
          >
            {game.metacritic}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm text-purple-300">
            {new Date(game.released).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex space-x-2">
            {game.platforms?.slice(0, 3).map((platform) => (
              <span
                key={platform.platform.id}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
              >
                {platform.platform.name}
              </span>
            ))}
            {game.platforms?.length > 3 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                +{game.platforms.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.genres?.slice(0, 4).map((genre) => (
            <span
              key={genre.id}
              className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {isExpanded && game.details && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="font-bold text-white mb-2">About</h4>
            <p className="text-sm text-gray-300 mb-4 line-clamp-4">
              {game.details.description_raw || "No description available."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <h5 className="text-xs text-gray-400">Developer</h5>
                <p className="text-sm text-white">
                  {game.details.developers?.[0]?.name || "Unknown"}
                </p>
              </div>
              <div>
                <h5 className="text-xs text-gray-400">Publisher</h5>
                <p className="text-sm text-white">
                  {game.details.publishers?.[0]?.name || "Unknown"}
                </p>
              </div>
            </div>

            {game.details.tags?.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs text-gray-400 mb-1">Features</h5>
                <div className="flex flex-wrap gap-2">
                  {game.details.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={onExpand}
            className="text-sm text-purple-400 hover:text-purple-300 transition"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
          <a
            href={`https://rawg.io/games/${game.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm bg-purple-900/50 hover:bg-purple-900/70 text-purple-300 hover:text-white px-3 py-1.5 rounded transition"
          >
            View Details <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
