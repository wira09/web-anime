import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

const AnimeVideo = () => {
  const { chapterUrlId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReso, setSelectedReso] = useState("480p");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/sansekai-api/api/anime/getvideo?chapterUrlId=${chapterUrlId}`
        );
        const data = await response.json();
        console.log("Video data received:", data); // Debug log

        if (data && data.data && data.data.length > 0) {
          const mainData = data.data[0];
          console.log("Main video data:", mainData); // Debug log

          // Cek apakah ada data download
          const hasDownloadData =
            mainData.download && mainData.download.length > 0;
          console.log("Has download data:", hasDownloadData); // Debug log

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
          console.warn("No video data found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data video:", error);
        setLoading(false);
      }
    };

    fetchVideo();
  }, [chapterUrlId]);

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
          to="/"
          className="text-indigo-400 mt-4 inline-block hover:underline"
        >
          Kembali ke Beranda
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

            <div className="p-6 bg-indigo-600/5 rounded-2xl border border-indigo-500/20">
              <div className="flex items-center gap-4 text-white">
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

          {/* Episode Navigation (Placeholder)
          <div className="glass p-6 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-4">Navigasi Episode</h3>
            <div className="flex justify-between">
              <button className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors text-sm">
                ← Episode Sebelumnya
              </button>
              <button className="px-4 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300 transition-colors text-sm">
                Episode Selanjutnya →
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AnimeVideo;
