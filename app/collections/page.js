"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ExternalLink,
  Loader2,
  ListTree,
  Gamepad2,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CollectionsPage() {
  const [gameSeries, setGameSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [seriesGames, setSeriesGames] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const router = useRouter();

  // Predefined list of popular franchises with images
  const popularFranchises = [
    {
      id: 1,
      name: "Call of Duty",
      slug: "call-of-duty",
      image:
        "https://media.rawg.io/media/games/587/587588c64afbeff73b3a0b1cd2388aa6.jpg",
    },
    {
      id: 2,
      name: "Assassin's Creed",
      slug: "assassins-creed",
      image:
        "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
    },
    {
      id: 3,
      name: "Grand Theft Auto",
      slug: "grand-theft-auto",
      image:
        "https://media.rawg.io/media/games/84d/84da2ac3fdfc6507807a1808595afb12.jpg",
    },
    {
      id: 4,
      name: "The Legend of Zelda",
      slug: "the-legend-of-zelda",
      image:
        "https://media.rawg.io/media/games/3c1/3c139f67a73f0bf5ce0b8b2ee408db9b.jpg",
    },
    {
      id: 5,
      name: "Final Fantasy",
      slug: "final-fantasy",
      image:
        "https://media.rawg.io/media/games/d1a/d1a2e99ade53494c6330a0ed945fe823.jpg",
    },
    {
      id: 6,
      name: "Resident Evil",
      slug: "resident-evil",
      image:
        "https://media.rawg.io/media/games/7f3/7f3a378e914615d7dfa8f6d6d8a5310e.jpg",
    },
    {
      id: 7,
      name: "Super Mario",
      slug: "super-mario",
      image:
        "https://media.rawg.io/media/games/367/367463bf43c8c5a96584e2d694826d8e.jpg",
    },
    {
      id: 8,
      name: "Metal Gear",
      slug: "metal-gear",
      image:
        "https://media.rawg.io/media/games/2b3/2b3f0b8d3f1b6a9f3e3a5f0e0b0e0e0e.jpg",
    },
    {
      id: 9,
      name: "Halo",
      slug: "halo",
      image:
        "https://media.rawg.io/media/games/120/1201a40e4364557b124392ee50317b99.jpg",
    },
    {
      id: 10,
      name: "God of War",
      slug: "god-of-war",
      image:
        "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
    },
  ];

  // Initialize with popular franchises
  useEffect(() => {
    setGameSeries(popularFranchises);
    setLoading(false);
  }, []);

  // Search for franchises
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setGameSeries(popularFranchises);
      return;
    }

    setLoading(true);
    try {
      // Search for games matching the search term
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${
          process.env.NEXT_PUBLIC_RAWG_API_KEY
        }&search=${encodeURIComponent(searchTerm)}&page_size=20`
      );

      if (!response.ok) throw new Error("Failed to search games");

      const data = await response.json();

      if (data.results.length > 0) {
        // Create a franchise entry from the first result
        const newFranchise = {
          id: data.results[0].id,
          name: data.results[0].name.includes(searchTerm)
            ? data.results[0].name
            : `${searchTerm} Games`,
          slug: data.results[0].slug,
          image: data.results[0].background_image,
        };

        setGameSeries([newFranchise]);
      } else {
        setGameSeries([]);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to perform search. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch games in a series
  const fetchGamesInSeries = async (seriesSlug, seriesName) => {
    setSeriesLoading(true);
    try {
      // First try to get games in the same series using the game-series endpoint
      const seriesResponse = await fetch(
        `https://api.rawg.io/api/games/${seriesSlug}/game-series?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page_size=40`
      );

      if (seriesResponse.ok) {
        const seriesData = await seriesResponse.json();
        setSeriesGames(seriesData.results);
      } else {
        // Fallback to searching for games with the franchise name
        const searchResponse = await fetch(
          `https://api.rawg.io/api/games?key=${
            process.env.NEXT_PUBLIC_RAWG_API_KEY
          }&search=${encodeURIComponent(seriesName)}&page_size=40`
        );

        if (!searchResponse.ok) throw new Error("Failed to fetch games");

        const searchData = await searchResponse.json();
        setSeriesGames(searchData.results);
      }

      setSeriesLoading(false);
    } catch (err) {
      setError("Failed to load series games. Please try again later.");
      setSeriesLoading(false);
    }
  };

  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    fetchGamesInSeries(series.slug, series.name);
  };

  return (
    <div className="min-h-screen text-gray-200 bg-gradient-to-b from-gray-900 to-gray-800">
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
            <h1 className="text-2xl font-bold text-white flex items-center">
              <ListTree className="h-6 w-6 mr-2 text-purple-300" />
              Game Franchises Explorer
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedSeries ? (
          <div>
            <form
              onSubmit={handleSearch}
              className="relative mb-8 max-w-md mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search game franchises (e.g. 'Persona')..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border border-purple-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <span className="ml-3 text-purple-300">Searching...</span>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  {searchTerm ? "Search Results" : "Popular Game Franchises"}
                </h2>
                {gameSeries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No franchises found. Try a different search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {gameSeries.map((series) => (
                      <div
                        key={series.id}
                        onClick={() => handleSeriesSelect(series)}
                        className="bg-gray-800 hover:bg-gradient-to-br from-purple-900/50 to-indigo-900/50 text-white rounded-lg transition-all transform hover:scale-[1.02] group relative overflow-hidden h-48 cursor-pointer"
                      >
                        {series.image && (
                          <img
                            src={series.image}
                            alt={series.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {series.name}
                          </h3>
                          <div className="flex items-center text-sm text-purple-300">
                            <Gamepad2 className="h-4 w-4 mr-1" />
                            Click to view games
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {selectedSeries.name} Games
                </h2>
                <p className="text-purple-300 flex items-center">
                  <Gamepad2 className="h-4 w-4 mr-1" />
                  {seriesGames.length} games found
                </p>
              </div>
              <button
                onClick={() => setSelectedSeries(null)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition group"
              >
                <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Franchises
              </button>
            </div>

            {seriesLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <span className="ml-3 text-purple-300">Loading games...</span>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : seriesGames.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No games found in this series.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  const ratingStars = Math.round(game.rating);
  const releaseYear = new Date(game.released).getFullYear();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/50 transition-all group">
      <div className="h-48 overflow-hidden relative">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{game.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
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
            <span className="text-sm text-gray-300">{releaseYear}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {game.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
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
              +{game.platforms.length - 3} more
            </span>
          )}
        </div>
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
  );
}
