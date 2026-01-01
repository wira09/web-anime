import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import component
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AnimeList from "./components/AnimeList.jsx";
import AnimeAll from "./components/AnimeAll.jsx";
import Genre from "./components/Genre.jsx";
import AnimeDetail from "./components/AnimeDetail.jsx";
import AnimeVideo from "./components/AnimeVideo.jsx";
import Dukungan from "./components/Dukungan.jsx";

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0b0f19]">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <AnimeList />
                </>
              }
            />
            <Route path="/animeall" element={<AnimeAll />} />
            <Route path="/dukungan" element={<Dukungan />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/genre/:name" element={<Genre />} />
            <Route path="/detail/:urlId" element={<AnimeDetail />} />
            <Route path="/video/:chapterUrlId" element={<AnimeVideo />} />
          </Routes>
        </main>

        <footer className="border-t border-white/5 py-12 glass-dark">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>© {currentYear} Wira Anime. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
