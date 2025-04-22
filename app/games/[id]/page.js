"use client";
import { useState, useEffect, use } from "react";
import { ChevronLeft, ExternalLink, Star, Gamepad2, Code, ShoppingCart, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GameDetails({ params }) {
  // Unwrap the params promise
  const { id } = use(params);
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      try {
        // Fetch game details
        const gameResponse = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        if (!gameResponse.ok) throw new Error("Failed to fetch game details");
        const gameData = await gameResponse.json();

        // Fetch screenshots
        const screenshotsResponse = await fetch(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        if (!screenshotsResponse.ok) throw new Error("Failed to fetch screenshots");
        const screenshotsData = await screenshotsResponse.json();

        setGame(gameData);
        setScreenshots(screenshotsData.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]); 

  if (loading) {
    return (
      <div className="min-h-screen text-gray-200 bg-gray-900 flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-gray-200 bg-gray-900 flex justify-center items-center">
        <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen text-gray-200 bg-gray-900 flex justify-center items-center">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          Game not found
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white">{game.name}</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game Hero Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="relative h-64 md:h-96">
            <img
              src={game.background_image || game.background_image_additional || "/placeholder-game.jpg"}
              alt={game.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-900/80 px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span>{game.rating?.toFixed(1)}</span>
                </div>
                {game.released && (
                  <div className="bg-gray-700/80 px-3 py-1 rounded-full flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(game.released).toLocaleDateString()}</span>
                  </div>
                )}
                {game.playtime > 0 && (
                  <div className="bg-gray-700/80 px-3 py-1 rounded-full flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>~{game.playtime} hours</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Info */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <div 
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </section>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {screenshots.slice(0, 6).map((screenshot) => (
                    <div key={screenshot.id} className="rounded-lg overflow-hidden">
                      <img
                        src={screenshot.image}
                        alt={`${game.name} screenshot`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div>
            {/* Platforms */}
            <section className="bg-gray-800 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Gamepad2 size={18} /> Platforms
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((platform) => (
                  <span
                    key={platform.platform.id}
                    className="text-sm bg-gray-700/50 text-white px-3 py-1 rounded"
                  >
                    {platform.platform.name}
                  </span>
                ))}
              </div>
            </section>

            {/* Developers */}
            {game.developers?.length > 0 && (
              <section className="bg-gray-800 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Code size={18} /> Developers
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.developers.map((developer) => (
                    <span
                      key={developer.id}
                      className="text-sm bg-gray-700/50 text-white px-3 py-1 rounded"
                    >
                      {developer.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Genres */}
            {game.genres?.length > 0 && (
              <section className="bg-gray-800 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <ShoppingCart size={18} /> Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-sm bg-purple-900/40 text-purple-300 px-3 py-1 rounded"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Stores */}
            {game.stores?.length > 0 && (
              <section className="bg-gray-800 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Available On
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.stores.map((store) => (
                    <a
                      key={store.id}
                      href={`https://${store.store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                    >
                      {store.store.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Website */}
            {game.website && (
              <section className="bg-gray-800 rounded-lg p-4">
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-purple-900 hover:bg-purple-800 text-white px-3 py-2 rounded flex items-center justify-center gap-2 transition"
                >
                  <span>Official Website</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}