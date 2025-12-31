import React from "react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_100%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Temukan <span className="text-gradient">Anime Favoritmu</span> Di
            Sini
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Jelajahi ribuan judul anime terbaru dan terpopuler. Simpan daftar
            tontonanmu dan nikmati pengalaman menonton yang tak terlupakan.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              Mulai Eksplorasi
            </a>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-white group flex items-center gap-2"
            >
              Daftar Terbaru{" "}
              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
