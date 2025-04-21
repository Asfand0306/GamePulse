// app/bestofyear/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, ChevronLeft, ExternalLink } from "lucide-react";

export default function BestOfYear() {
  const [gamesByYear, setGamesByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const router = useRouter();

  // Generate years from current year back to 2000
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (selectedYear) {
      fetchGamesForYear(selectedYear);
    }
  }, [selectedYear]);

  const fetchGamesForYear = async (year) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
          `&dates=${year}-01-01,${year}-12-31` +
          "&ordering=-rating" + // Sort by rating descending
          "&page_size=10"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch games for ${year}`);
      }
      const data = await response.json();
      setGamesByYear(prev => ({
        ...prev,
        [year]: data.results
      }));
      setLoading(false);
    } catch (err) {
      setError(`Failed to load games for ${year}. Please try again later.`);
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Award className="h-6 w-6 mr-2" />
              Best Games by Year
            </h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedYear ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="bg-gray-800 hover:bg-purple-800 text-white text-xl font-bold py-12 rounded-lg transition-all transform hover:scale-105"
              >
                {year}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Top Games of {selectedYear}
              </h2>
              <button
                onClick={() => setSelectedYear(null)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition"
              >
                Back to Years
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
                {gamesByYear[selectedYear]?.map((game) => (
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
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/30 transition">
      <div className="h-48 overflow-hidden">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
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
          className="inline-flex items-center text-purple-400 hover:text-purple-300"
        >
          View Details <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}