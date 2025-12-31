import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AnimeAll = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/sansekai-api/api/anime/latest?page=${page}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setAnimeList(data);
        } else if (data && data.data) {
          setAnimeList(data.data);
        }
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching anime:", error);
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  if (loading && animeList.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-2 h-10 bg-indigo-500 rounded-full inline-block"></span>
            Semua Anime
          </h2>
          <p className="text-gray-400 mt-2">Menampilkan halaman {page}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-6 py-2 rounded-full glass border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-semibold"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all font-semibold"
          >
            Next Page
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
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
      )}

      <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
        {/* <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-8 py-3 rounded-full glass border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all font-semibold"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all font-semibold"
        >
          Next Page (Halaman {page + 1})
        </button> */}
        <ul className="flex justify-center gap-2 text-white">
          <li>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="grid size-9 place-content-center rounded-lg border border-white/10 glass transition-all hover:bg-indigo-600 hover:border-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed group"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 transition-transform group-hover:-translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>

          {[...Array(5)].map((_, index) => {
            const pageNum = Math.max(1, page - 2) + index;
            const isActive = pageNum === page;
            return (
              <li key={pageNum}>
                <button
                  onClick={() => setPage(pageNum)}
                  className={`block size-9 rounded-lg border text-center text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transform scale-110"
                      : "border-white/10 glass hover:bg-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          <li>
            <button
              onClick={handleNextPage}
              className="grid size-9 place-content-center rounded-lg border border-white/10 glass transition-all hover:bg-indigo-600 hover:border-indigo-600 group"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AnimeAll;
