import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const AnimeVideo = () => {
  const navigate = useNavigate();
  const { chapterUrlId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [selectedReso, setSelectedReso] = useState("480p");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // meampilkan video
    const fetchVideo = async () => {
      setLoading(true);
      try {
        // Tambahkan / di akhir jika tidak ada, sesuai pengalaman user di Postman/Curl
        const formattedId = chapterUrlId.endsWith("/")
          ? chapterUrlId
          : `${chapterUrlId}/`;

        const response = await fetch(
          `/sansekai-api/api/anime/getvideo?chapterUrlId=${encodeURIComponent(
            formattedId
          )}`
        );
        const data = await response.json();
        console.log("Video fetching with ID:", formattedId);
        console.log("Video response:", data);

        if (data && data.data && data.data.length > 0) {
          const mainData = data.data[0];
          setVideoData(mainData);

          // Cari stream 480p pertama sebagai default
          const defaultStream480p = mainData.stream.find(
            (s) => s.reso === "480p"
          );
          const defaultStream = defaultStream480p || mainData.stream[0];

          if (defaultStream) {
            setCurrentStream(defaultStream);
            setSelectedReso(defaultStream.reso);
            setSelectedProvider(defaultStream.provide);
          }
        } else {
          console.warn("No video data found for:", formattedId);
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data video:", error);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [chapterUrlId]);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoadingLatest(true);
      try {
        const response = await fetch("/sansekai-api/api/anime/latest?page=1");
        const data = await response.json();
        if (data && data.data) {
          setAnimeList(data.data);
        } else if (Array.isArray(data)) {
          setAnimeList(data);
        }
      } catch (error) {
        console.error("Gagal mengambil anime terbaru:", error);
      } finally {
        setLoadingLatest(false);
      }
    };
    fetchLatest();
  }, []);

  // Fungsi untuk mencegah download popup
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const changeReso = (reso) => {
    setSelectedReso(reso);

    // Filter semua stream dengan resolusi yang dipilih
    const streamsForReso = videoData.stream.filter((s) => s.reso === reso);

    if (streamsForReso.length > 0) {
      // Pilih provider yang sedang aktif, atau provider pertama
      const selectedStream =
        streamsForReso.find((s) => s.provide === selectedProvider) ||
        streamsForReso[0];
      setCurrentStream(selectedStream);
      setSelectedProvider(selectedStream.provide);
      setIsVideoLoading(true); // Reset loading state
    }
  };

  const changeProvider = (providerId) => {
    setSelectedProvider(providerId);
    const stream = videoData.stream.find(
      (s) => s.reso === selectedReso && s.provide === providerId
    );
    if (stream) {
      setCurrentStream(stream);
      setIsVideoLoading(true); // Reset loading state
    }
  };

  // Mendapatkan daftar provider unik untuk resolusi yang dipilih
  const getProvidersForSelectedReso = () => {
    if (!videoData) return [];
    return videoData.stream
      .filter((s) => s.reso === selectedReso)
      .map((s) => ({
        provide: s.provide,
        link: s.link,
        id: s.id,
      }));
  };

  // Fungsi untuk mengelompokkan download berdasarkan resolusi
  const getGroupedDownloads = () => {
    if (!videoData || !videoData.download) return [];

    const grouped = {};
    videoData.download.forEach((dl) => {
      if (!grouped[dl.reso]) {
        grouped[dl.reso] = [];
      }
      grouped[dl.reso].push(dl);
    });

    return Object.entries(grouped).map(([reso, downloads]) => ({
      reso,
      downloads,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="text-center py-20 text-white bg-[#0b0f19] h-screen">
        <h2 className="text-2xl font-bold">Video tidak ditemukan</h2>
        <Link
          onClick={() => navigate(-1)}
          className="text-indigo-400 mt-4 inline-block hover:underline"
        >
          Kembali ke Detail Anime
        </Link>
      </div>
    );
  }

  const groupedDownloads = getGroupedDownloads();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Video Player Section */}
      <div className="mb-8">
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
          {currentStream ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                key={`${currentStream.provide}-${currentStream.id}`}
                className="w-full h-full"
                controls
                controlsList
                onLoadStart={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                onError={() => {
                  setIsVideoLoading(false);
                  console.error("Video loading error");
                }}
                playsInline
                autoPlay
                preload="auto"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={currentStream.link} type="video/mp4" />
                Browser Anda tidak mendukung pemutaran video HTML5.
              </video>

              {/* Loading overlay */}
              {isVideoLoading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  <span className="ml-4 text-white">Memuat video...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Stream tidak tersedia untuk resolusi ini.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quality Selector & Stream Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {videoData.animeTitle || "Menonton Anime"}
                </h1>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Streaming {selectedReso} • Provider{" "}
                  {currentStream?.provide || "N/A"}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Quality Selector */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  {videoData.reso &&
                    videoData.reso.map((r) => (
                      <button
                        key={r}
                        onClick={() => changeReso(r)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedReso === r
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                            : "text-gray-500 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                </div>

                {/* Provider Selector */}
                {getProvidersForSelectedReso().length > 1 && (
                  <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                    <span className="text-xs text-gray-400 px-2 py-1">
                      Provider:
                    </span>
                    {getProvidersForSelectedReso().map((provider) => (
                      <button
                        key={provider.provide}
                        onClick={() => changeProvider(provider.provide)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedProvider === provider.provide
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "text-gray-500 hover:text-white bg-gray-800/50"
                        }`}
                      >
                        Provider {provider.provide}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* <div className="p-6 bg-indigo-600/5 rounded-2xl border border-indigo-500/20">
              {/* fitur like dan dislike */}
              {/* <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👍</span>
                  <span className="font-bold text-lg">
                    {videoData.likeCount || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <span className="text-xl">👎</span>
                  <span className="font-bold text-lg text-gray-500">
                    {videoData.dislikeCount || 0}
                  </span>
                </div>
              </div> 
            </div> */}
            {/* Kembali ke Detail Anime */}
            <div className="mt-8 flex justify-start">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/5 text-sm font-medium group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                Kembali ke Daftar Episode
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-4">Informasi Streaming</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Resolusi Aktif:</span>
                <span className="text-white font-medium">{selectedReso}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Provider Aktif:</span>
                <span className="text-white font-medium">
                  Provider {selectedProvider}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Provider:</span>
                <span className="text-white font-medium">
                  {getProvidersForSelectedReso().length} tersedia
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Link Download:</span>
                <span className="text-white font-medium">
                  {groupedDownloads.length > 0
                    ? `${videoData.download.length} tersedia`
                    : "Tidak tersedia"}
                </span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-4">Panduan Streaming</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <span className="text-green-500 mt-0.5">✓</span>
                Gunakan tombol provider jika video bermasalah
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <span className="text-green-500 mt-0.5">✓</span>
                Download hanya untuk penyimpanan offline
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                Hindari klik kanan untuk mencegah download popup
              </li>
            </ul>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
              Anime Terbaru
            </h3>
            <div className="space-y-5">
              {loadingLatest ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3">
                      <div className="w-16 h-20 bg-white/5 rounded-lg"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-white/5 rounded w-3/4"></div>
                        <div className="h-2 bg-white/5 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                animeList.slice(0, 5).map((anime) => (
                  <Link
                    key={anime.id || anime.url}
                    to={`/detail/${encodeURIComponent(anime.url)}`}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={anime.cover}
                        alt={anime.judul}
                        className="w-16 h-20 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                        {anime.judul}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                          {anime.type || "TV"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          ⭐ {anime.rating || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              to="/animeall"
              className="mt-6 block w-full py-3 rounded-xl border border-white/5 bg-white/5 text-center text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all group"
            >
              Lihat Semua Anime
              <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeVideo;
