"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ExternalLink,
  Star,
  Gamepad2,
  Code,
  ShoppingCart,
  Loader2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Build the API URL with all active filters
  const buildApiUrl = () => {
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40&page=${page}`;

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    if (selectedDeveloper) {
      url += `&developers=${selectedDeveloper}`;
    }

    if (selectedPlatform) {
      url += `&platforms=${selectedPlatform}`;
    }

    if (selectedGenre) {
      url += `&genres=${selectedGenre}`;
    }

    return url;
  };

  // Fetch data with current filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gamesUrl = buildApiUrl();
        const gamesResponse = await fetch(gamesUrl);

        if (!gamesResponse.ok) throw new Error("Failed to fetch games");
        const gamesData = await gamesResponse.json();

        setGames((prev) =>
          page === 1 ? gamesData.results : [...prev, ...gamesData.results]
        );
        setHasMore(gamesData.next !== null);

        // Fetch filter options if not already loaded
        if (developers.length === 0) {
          const devResponse = await fetch(
            `https://api.rawg.io/api/developers?key=${API_KEY}&page_size=100`
          );
          if (devResponse.ok) {
            const devData = await devResponse.json();
            setDevelopers(devData.results);
          }
        }

        if (platforms.length === 0) {
          const platformsResponse = await fetch(
            `https://api.rawg.io/api/platforms?key=${API_KEY}&page_size=100`
          );
          if (platformsResponse.ok) {
            const platformsData = await platformsResponse.json();
            setPlatforms(platformsData.results);
          }
        }

        if (genres.length === 0) {
          const genresResponse = await fetch(
            `https://api.rawg.io/api/genres?key=${API_KEY}&page_size=100`
          );
          if (genresResponse.ok) {
            const genresData = await genresResponse.json();
            setGenres(genresData.results);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchQuery, selectedDeveloper, selectedPlatform, selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setPage(1);
    setGames([]);
  };

  const clearFilters = () => {
    setSelectedDeveloper(null);
    setSelectedPlatform(null);
    setSelectedGenre(null);
    setSearchTerm("");
    setSearchQuery("");
    setPage(1);
    setGames([]);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Game Library</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search any game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border border-purple-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition"
              disabled={!!searchQuery}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </form>

          {/* Active filters */}
          {(selectedDeveloper ||
            selectedPlatform ||
            selectedGenre ||
            searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedDeveloper && (
                <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                  {developers.find((d) => d.id === selectedDeveloper)?.name}
                  <button
                    onClick={() => setSelectedDeveloper(null)}
                    className="text-purple-200 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedPlatform && (
                <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                  {platforms.find((p) => p.id === selectedPlatform)?.name}
                  <button
                    onClick={() => setSelectedPlatform(null)}
                    className="text-purple-200 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedGenre && (
                <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                  {genres.find((g) => g.id === selectedGenre)?.name}
                  <button
                    onClick={() => setSelectedGenre(null)}
                    className="text-purple-200 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchQuery("");
                      setPage(1);
                      setGames([]);
                    }}
                    className="text-purple-200 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-purple-400 hover:text-purple-300 ml-2 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            </div>
          )}

          {/* Filters dropdown */}
          {showFilters && !searchQuery && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Developer filter */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Code size={16} /> Developers
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {developers.map((developer) => (
                      <div
                        key={developer.id}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="radio"
                          id={`dev-${developer.id}`}
                          name="developer"
                          checked={selectedDeveloper === developer.id}
                          onChange={() => setSelectedDeveloper(developer.id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`dev-${developer.id}`}
                          className="text-sm cursor-pointer hover:text-white transition"
                        >
                          {developer.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform filter */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Gamepad2 size={16} /> Platforms
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`plat-${platform.id}`}
                          name="platform"
                          checked={selectedPlatform === platform.id}
                          onChange={() => setSelectedPlatform(platform.id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`plat-${platform.id}`}
                          className="text-sm cursor-pointer hover:text-white transition"
                        >
                          {platform.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Genre filter */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <ShoppingCart size={16} /> Genres
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {genres.map((genre) => (
                      <div key={genre.id} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`genre-${genre.id}`}
                          name="genre"
                          checked={selectedGenre === genre.id}
                          onChange={() => setSelectedGenre(genre.id)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`genre-${genre.id}`}
                          className="text-sm cursor-pointer hover:text-white transition"
                        >
                          {genre.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Games Grid */}
        {loading && games.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : games.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            {searchQuery
              ? `No games found for "${searchQuery}". Try a different search term.`
              : "No games found matching your criteria. Try adjusting your filters."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {!searchQuery && hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-purple-800 hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Games"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function GameCard({ game }) {
  const getReleaseStatus = () => {
    if (!game.released) return "TBD";

    const releaseDate = new Date(game.released);
    if (isNaN(releaseDate.getTime()) || releaseDate.getFullYear() < 1970) {
      return game.status === "discontinued" ? "Discontinued" : "TBD";
    }
    return new Date(game.released).toLocaleDateString();
  };

  return (
    <Link href={`/games/${game.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition-all duration-300 h-full flex flex-col">
        <div className="h-48 overflow-hidden relative">
          <img
            src={game.background_image || "/placeholder-game.jpg"}
            alt={game.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
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
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition">
            {game.name}
          </h3>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
            <div>{getReleaseStatus()}</div>
            <div className="flex items-center bg-purple-900/50 px-2 py-0.5 rounded">
              <Star className="h-3 w-3 mr-1" />
              {game.rating?.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {game.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="text-xs bg-purple-900/40 text-purple-300 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
