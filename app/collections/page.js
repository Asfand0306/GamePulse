"use client";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ExternalLink, Loader2, ListTree, Gamepad2, Star } from "lucide-react";
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

  // Predefined list of popular franchises with their IDs
  const popularFranchises = [
    { id: 1, name: "Call of Duty", slug: "call-of-duty" },
    { id: 2, name: "Assassin's Creed", slug: "assassins-creed" },
    { id: 3, name: "Grand Theft Auto", slug: "grand-theft-auto" },
    { id: 4, name: "The Legend of Zelda", slug: "the-legend-of-zelda" },
    { id: 5, name: "Final Fantasy", slug: "final-fantasy" },
    { id: 6, name: "Resident Evil", slug: "resident-evil" },
    { id: 7, name: "Super Mario", slug: "super-mario" },
    { id: 8, name: "Metal Gear", slug: "metal-gear" },
    { id: 9, name: "Halo", slug: "halo" },
    { id: 10, name: "God of War", slug: "god-of-war" },
    { id: 11, name: "Pokémon", slug: "pokemon" },
    { id: 12, name: "The Witcher", slug: "the-witcher" },
    { id: 13, name: "Dark Souls", slug: "dark-souls" },
    { id: 14, name: "Elder Scrolls", slug: "elder-scrolls" },
    { id: 15, name: "Fallout", slug: "fallout" },
    { id: 16, name: "Battlefield", slug: "battlefield" },
    { id: 17, name: "Far Cry", slug: "far-cry" },
    { id: 18, name: "Mass Effect", slug: "mass-effect" },
    { id: 19, name: "Borderlands", slug: "borderlands" },
    { id: 20, name: "Tomb Raider", slug: "tomb-raider" }
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
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=20`
      );
      
      if (!response.ok) throw new Error("Failed to search games");
      
      const data = await response.json();
      
      // Extract potential franchises from search results
      const potentialFranchises = data.results.reduce((acc, game) => {
        // Check if the game name contains the search term (likely a franchise)
        if (game.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          const existing = acc.find(f => f.name.toLowerCase() === game.name.toLowerCase());
          if (!existing) {
            acc.push({
              id: game.id,
              name: game.name,
              slug: game.slug,
              image: game.background_image
            });
          }
        }
        return acc;
      }, []);
      
      // Combine with predefined franchises if no results found
      const results = potentialFranchises.length > 0 
        ? potentialFranchises 
        : popularFranchises.filter(f => 
            f.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
      
      setGameSeries(results);
      setLoading(false);
    } catch (err) {
      setError("Failed to perform search. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch games in a series
  const fetchGamesInSeries = async (seriesSlug) => {
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
          `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodeURIComponent(seriesSlug)}&page_size=40`
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
    fetchGamesInSeries(series.slug);
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
            <form onSubmit={handleSearch} className="relative mb-8 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search game franchises..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gameSeries.map((series) => (
                    <div
                      key={series.id}
                      onClick={() => handleSeriesSelect(series)}
                      className="bg-gray-800 hover:bg-gradient-to-br from-purple-900/50 to-indigo-900/50 text-white rounded-lg transition-all transform hover:scale-[1.02] group relative overflow-hidden h-48 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                        <h3 className="text-xl font-bold text-white mb-1">{series.name}</h3>
                        <div className="flex items-center text-sm text-purple-300">
                          <Gamepad2 className="h-4 w-4 mr-1" />
                          Click to view games
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  className={`h-4 w-4 ${i < ratingStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-300">{game.rating.toFixed(1)}</span>
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