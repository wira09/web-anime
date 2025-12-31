import React, { useEffect, useState } from "react";

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        // "Mengakali" data genre dengan mengambil dari beberapa halaman anime terbaru
        const pagesToFetch = [1, 2, 3, 4, 5];
        const responses = await Promise.all(
          pagesToFetch.map((p) =>
            fetch(`/sansekai-api/api/anime/latest?page=${p}`).then((res) =>
              res.json()
            )
          )
        );

        // Gabungkan semua data anime dari semua halaman
        const allAnime = responses.flat();

        // Kumpulkan semua genre unik menggunakan Set
        const genreSet = new Set();
        allAnime.forEach((anime) => {
          if (anime.genre && Array.isArray(anime.genre)) {
            anime.genre.forEach((g) => {
              if (g) genreSet.add(g.trim());
            });
          }
        });

        // Konversi Set kembali ke Array dan urutkan sesuai abjad
        const sortedGenres = Array.from(genreSet).sort();
        setGenres(sortedGenres);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data genre:", error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-10 bg-indigo-500 rounded-full inline-block"></span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Eksplorasi Genre
          </h2>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Berikut adalah daftar genre yang dikumpulkan secara otomatis dari
          koleksi anime terbaru kami.
        </p>
      </div>

      {genres.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <div
              key={genre}
              className="group relative glass p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden text-center"
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                {genre}
              </h3>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-500">
            Tidak ada genre yang ditemukan saat ini.
          </p>
        </div>
      )}

      <div className="mt-20 p-8 rounded-3xl glass-dark border border-white/5 text-center">
        <p className="text-gray-500 text-sm">
          Data genre ini diperbarui secara otomatis berdasarkan daftar tontonan
          terbaru.
        </p>
      </div>
    </div>
  );
};

export default Genre;
