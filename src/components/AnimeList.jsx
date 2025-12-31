import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const response = await fetch(
          `/sansekai-api/api/anime/latest?page=${randomPage}`
        );
        const data = await response.json();
        // Cek jika data adalah array (API Sansekai mengembalikan array langsung)
        if (Array.isArray(data)) {
          setAnimeList(data);
        } else if (data && data.data) {
          setAnimeList(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching anime:", error);
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
          Anime Terpopuler
        </h2>
        <Link
          to="/animeall"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <div key={anime.id} className="group relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-900 shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-white/5">
              <img
                src={anime.cover}
                alt={anime.judul}
                className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold text-white uppercase tracking-wider">
                    {anime.status || "Ongoing"}
                  </span>
                  <span className="text-xs text-yellow-400 flex items-center gap-1 font-bold">
                    ⭐ {anime.score || "N/A"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                  {anime.judul}
                </h3>
                {anime.lastup && (
                  <p className="text-[10px] text-gray-400 font-medium">
                    {anime.lastup}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Link
                className="text-sm font-medium text-gray-200 line-clamp-1 group-hover:text-indigo-400 transition-colors"
                to={`/detail/${anime.id}`}
              >
                {anime.judul}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeList;
