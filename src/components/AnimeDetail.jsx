import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const AnimeDetail = () => {
  const { urlId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/sansekai-api/api/anime/detail?urlId=${urlId}`
        );
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          setDetail(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil detail anime:", error);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [urlId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold">Anime tidak ditemukan</h2>
        <Link
          to="/"
          className="text-indigo-400 mt-4 inline-block hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Image & Basic Info */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <img
                src={detail.cover}
                alt={detail.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg">
                  {detail.status || "Ongoing"}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                  Informasi
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Skor</dt>
                    <dd className="text-yellow-400 font-bold">
                      ⭐ {detail.rating || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Studio</dt>
                    <dd className="text-gray-200">{detail.author || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Rilis</dt>
                    <dd className="text-gray-200">
                      {detail.published || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="text-gray-200">{detail.type || "N/A"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Synopsis, Episodes */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            {detail.judul}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {detail.genre &&
              detail.genre.map((g) => (
                <span
                  key={g}
                  className="px-4 py-1.5 rounded-full bg-white/5 text-gray-300 text-xs font-medium border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {g}
                </span>
              ))}
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Sinopsis
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg font-light italic">
              {detail.sinopsis || "Tidak ada sinopsis tersedia."}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Daftar Episode / Movie
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {(() => {
                const items = detail.episode || detail.chapter || [];
                return items.length > 0 ? (
                  items.map((ep) => (
                    <Link
                      key={ep.id}
                      to={`/video/${ep.url}`}
                      className="flex items-center justify-between p-4 rounded-xl glass border border-white/5 hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all text-xs">
                          {ep.ch.toLowerCase().includes("movie")
                            ? "MV"
                            : ep.ch.replace(/Episode/i, "").trim()}
                        </span>
                        <span className="text-gray-200 font-medium group-hover:text-white">
                          {ep.ch.toLowerCase().includes("movie")
                            ? ep.ch
                            : `Episode ${ep.ch}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{ep.date}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5 text-gray-600 group-hover:text-indigo-400 transition-all"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center glass rounded-xl border border-dashed border-white/10 text-gray-500">
                    Belum ada episode atau movie tersedia.
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
