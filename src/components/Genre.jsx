import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Genre = () => {
  const { name } = useParams();
  const [genres, setGenres] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mode 1: Menampilkan daftar semua Genre
  useEffect(() => {
    if (!name) {
      const fetchGenres = async () => {
        setLoading(true);
        try {
          const pagesToFetch = [1, 2, 3];
          const responses = await Promise.all(
            pagesToFetch.map((p) =>
              fetch(`/sansekai-api/api/anime/latest?page=${p}`).then((res) =>
                res.json()
              )
            )
          );
          const allAnime = responses.flat();
          const genreSet = new Set();
          allAnime.forEach((anime) => {
            if (anime.genre && Array.isArray(anime.genre)) {
              anime.genre.forEach((g) => g && genreSet.add(g.trim()));
            }
          });
          setGenres(Array.from(genreSet).sort());
          setLoading(false);
        } catch (error) {
          console.error("Gagal ambil genre:", error);
          setLoading(false);
        }
      };
      fetchGenres();
    }
  }, [name]);

  // Mode 2: Menampilkan daftar Anime berdasarkan Genre tertentu
  useEffect(() => {
    if (name) {
      const fetchAnimeByGenre = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/sansekai-api/api/anime/search?query=${name}`
          );
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            setAnimeList(data.data[0].result || []);
          }
          setLoading(false);
        } catch (error) {
          console.error("Gagal ambil anime genre:", error);
          setLoading(false);
        }
      };
      fetchAnimeByGenre();
    }
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Tampilan List Anime per Genre
  if (name) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 text-white">
            <Link
              to="/genre"
              className="hover:text-indigo-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
            <h2 className="text-3xl font-bold tracking-tight">Genre: {name}</h2>
          </div>
        </div>

        {animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <div key={anime.id} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-900 shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-white/5">
                  <img
                    src={anime.cover}
                    alt={anime.judul}
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/95 to-transparent">
                    <h3 className="text-sm font-bold text-white line-clamp-2">
                      {anime.judul}
                    </h3>
                  </div>
                </div>
                <div className="mt-3">
                  <Link
                    to={`/detail/${encodeURIComponent(anime.url)}`}
                    className="text-sm font-medium text-gray-200 line-clamp-1 hover:text-indigo-400 transition-colors"
                  >
                    {anime.judul}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10 text-gray-500">
            Tidak ada anime ditemukan untuk genre ini.
          </div>
        )}
      </div>
    );
  }

  // Tampilan Daftar Semua Genre
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-10 bg-indigo-500 rounded-full inline-block"></span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Eksplorasi Genre
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl font-light">
          Pilih kategori favoritmu untuk menemukan ribuan judul anime menarik.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/genre/${genre}`}
            className="group glass p-5 rounded-2xl text-center hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all border border-white/5"
          >
            <span className="text-gray-200 font-bold text-sm tracking-wide group-hover:text-white transition-colors">
              {genre}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genre;
