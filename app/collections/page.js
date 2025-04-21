"use client";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CollectionsPage() {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [seriesGames, setSeriesGames] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const router = useRouter();

  // Fetch popular games to use as starting point for collections
  useEffect(() => {
    const fetchPopularGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&ordering=-rating&page_size=20`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch popular games");
        }
        const data = await response.json();
        setPopularGames(data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to load popular games. Please try again later.");
        setLoading(false);
      }
    };

    fetchPopularGames();
  }, []);

  const fetchGameSeries = async (gameId) => {
    setSeriesLoading(true);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}/game-series?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page_size=20`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch game series");
      }
      const data = await response.json();
      setSeriesGames(data.results);
      setSeriesLoading(false);
    } catch (err) {
      setError("Failed to load game series. Please try again later.");
      setSeriesLoading(false);
    }
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    fetchGameSeries(game.id);
  };

  const filteredGames = popularGames.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-200 bg-gray-900">
      {/* Header */}
      <header className="bg-purple-900 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-purple-300 transition"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">Game Collections</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedGame ? (
          <div>
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search popular games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border border-purple-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              </div>
            </div>

            {/* Popular Games Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleGameSelect(game)}
                    className="bg-gray-800 hover:bg-purple-800 text-white text-lg font-medium py-8 rounded-lg transition-all transform hover:scale-105 group relative overflow-hidden"
                  >
                    {game.background_image && (
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition"
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 mb-2 bg-purple-900/50 rounded-full flex items-center justify-center group-hover:bg-purple-700 transition">
                        <span className="text-2xl">{game.name.charAt(0)}</span>
                      </div>
                      {game.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedGame.name} Series
              </h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
              >
                Back to Collections
              </button>
            </div>

            {seriesLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seriesGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function GameCard({ game }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition group">
      <div className="h-48 overflow-hidden relative">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
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
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
          {game.name}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <div className="flex items-center">
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
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition"
        >
          View Details <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}