import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import component
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AnimeList from "./components/AnimeList.jsx";
import AnimeAll from "./components/AnimeAll.jsx";
import Genre from "./components/Genre.jsx";
import AnimeDetail from "./components/AnimeDetail.jsx";

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                {/* di gabung */}
                  <Hero />
                  <AnimeList />
                </>
              }
            />
            <Route path="/anime" element={<AnimeList />} />
            <Route path="/animeall" element={<AnimeAll />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/detail" element={<AnimeDetail />} />
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
