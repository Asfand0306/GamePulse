"use client";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ExternalLink, Gamepad2, Star, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [franchiseGames, setFranchiseGames] = useState([]);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // First search for the game
      const searchResponse = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=1`
      );

      if (!searchResponse.ok) throw new Error("Failed to search games");

      const searchData = await searchResponse.json();
      
      if (searchData.results.length === 0) {
        throw new Error("No games found matching your search");
      }

      const game = searchData.results[0];
      
      // Then get the game series
      const seriesResponse = await fetch(
        `https://api.rawg.io/api/games/${game.id}/game-series?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page_size=20`
      );

      if (!seriesResponse.ok) throw new Error("Failed to fetch game series");

      const seriesData = await seriesResponse.json();

      setSelectedFranchise({
        name: game.name,
        image: game.background_image
      });
      setFranchiseGames(seriesData.results);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedFranchise(null);
    setFranchiseGames([]);
  };

  return (
    <div className="min-h-screen text-gray-200 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg border-b border-purple-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-purple-300 transition group"
            >
              <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">Game Franchises</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Hero Section with Search */}
        <div className="w-full max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Game Franchises
          </h2>
          <p className="text-gray-400 mb-8">
            Search for a specific game franchise to see all its titles
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a franchise (e.g. 'Call of Duty', 'Zelda')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border-2 border-purple-700/50 text-white rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full transition-all"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Find Franchise
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center max-w-2xl w-full">
            {error}
          </div>
        ) : selectedFranchise ? (
          <div className="w-full max-w-6xl">
            {/* Franchise Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
              {selectedFranchise.image && (
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={selectedFranchise.image}
                    alt={selectedFranchise.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedFranchise.name} Series
                </h2>
                <p className="text-purple-300 flex items-center">
                  <Gamepad2 className="h-4 w-4 mr-1" />
                  {franchiseGames.length} games in this franchise
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                New Search
              </button>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {franchiseGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={game.background_image || "/placeholder-game.jpg"}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-lg font-bold text-white">{game.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-sm text-purple-300">
                          <Star className="h-4 w-4 mr-1" />
                          {game.rating?.toFixed(1)}
                        </div>
                        <span className="text-sm text-gray-300">
                          {game.released ? new Date(game.released).getFullYear() : "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
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
                      className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
                    >
                      View Details <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12 max-w-2xl">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-medium mb-2">Search for a Game Franchise</h3>
            <p>Enter the name of a game series to see all its titles</p>
          </div>
        )}
      </main>
    </div>
  );
}