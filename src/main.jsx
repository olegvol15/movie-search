import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import FavoritesPage from "./pages/Favorites.jsx";

import { AuthProvider } from "./store/auth.jsx";
import { FavoritesProvider } from "./store/favorites.jsx";

function Root() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="movie/:id" element={<MovieDetails />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="*" element={<div className="p-8">Not found</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><Root /></React.StrictMode>
);



