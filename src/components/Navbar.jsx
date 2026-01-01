import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigationLinks = [
  { name: "Home", to: "/" },
  { name: "Daftar Anime", to: "/animeall" },
  { name: "Genre", to: "/genre" },
  { name: "Dukungan", to: "/dukungan" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [animeSearch, setAnimeSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch data search anime
  const fetchAnime = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(
        `/sansekai-api/api/anime/search?query=${search}`
      );
      const data = await response.json();

      // Mapping berdasarkan data Postman: data.data[0].result
      if (data?.data?.[0]?.result) {
        setAnimeSearch(data.data[0].result);
      } else if (Array.isArray(data)) {
        setAnimeSearch(data);
      } else if (data?.data) {
        setAnimeSearch(data.data);
      } else {
        setAnimeSearch([]);
      }
    } catch (error) {
      console.error("Error fetching anime:", error);
      setAnimeSearch([]);
    } finally {
      setLoading(false);
    }
  };

  const isCurrent = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 glass-dark">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="/assets/wira.jpg"
                className="h-8 w-auto rounded"
              />
            </Link>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-1">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      isCurrent(item.to)
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-gray-300 hover:bg-white/5 hover:text-white",
                      "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Search */}
            <div
              ref={searchRef}
              className="relative mx-4 flex-1 max-w-xs group hidden sm:block"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                name="search"
                autoComplete="off"
                className="block w-full rounded-full border-0 bg-white/5 py-1.5 pl-10 pr-3 text-gray-100 ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-300 ease-in-out"
                placeholder="Search anime..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAnime()}
                onFocus={() => search && setShowResults(true)}
              />

              {/* Search Results Dropdown Desktop */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] glass-dark max-h-[400px] overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      <div className="animate-spin inline-block w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
                      Searching...
                    </div>
                  ) : animeSearch.length > 0 ? (
                    <div className="py-2">
                      {animeSearch.map((anime, index) => (
                        <Link
                          key={index}
                          to={`/detail/${encodeURIComponent(anime.url)}`}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
                        >
                          <img
                            src={anime.cover}
                            alt={anime.judul}
                            className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-200 group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {anime.judul}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Detail Anime
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    search && (
                      <div className="p-4 text-center text-gray-400 text-sm italic">
                        Anime tidak ditemukan
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            {/* <button className="hidden sm:block ml-4 px-6 py-1.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              Masuk
            </button> */}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <div className="px-3 pb-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {/* search anime */}
              <input
                type="text"
                className="block w-full rounded-full border-0 bg-white/5 py-2 pl-10 pr-3 text-gray-100 ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm transition-all duration-300"
                placeholder="Search anime..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAnime()}
              />
            </div>
            {/* Search Results Mobile */}
            {search && (
              <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <p className="text-center text-gray-500 text-sm py-4 italic">
                    Loading...
                  </p>
                ) : animeSearch.length > 0 ? (
                  animeSearch.map((anime, index) => (
                    <Link
                      key={index}
                      to={`/detail/${encodeURIComponent(anime.url)}`}
                      className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 active:bg-white/10 transition-colors"
                    >
                      <img
                        src={anime.cover}
                        alt={anime.judul}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-200 line-clamp-1">
                        {anime.judul}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4 italic">
                    Anime tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>
          {navigationLinks.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.to}
              className={classNames(
                isCurrent(item.to)
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
