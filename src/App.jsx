import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";

export default function App() {
  return (
    <FavoritesProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/art/:id" element={<DetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="*"
          element={
            <div className="max-w-5xl mx-auto p-6">
              <p>
                Halaman tidak ditemukan.{" "}
                <Link className="text-sky-600" to="/">
                  Kembali
                </Link>
              </p>
            </div>
          }
        />
      </Routes>
    </FavoritesProvider>
  );
}
