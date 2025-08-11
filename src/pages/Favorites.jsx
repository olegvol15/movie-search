import { useFavorites } from "../store/favorites.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { items } = useFavorites();

  if (items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-6">Your favorites list is empty.</p>
        <Link to="/" className="inline-block px-4 py-2 rounded-xl border bg-white shadow-sm hover:shadow-md">
          ← Back to search
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">My Favorites</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div>
    </div>
  );
}
