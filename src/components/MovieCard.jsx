import { Link } from "react-router-dom";
import { useFavorites } from "../store/favorites.jsx";

export default function MovieCard({ movie }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(movie.imdbID);

  return (
    <div className="group relative">
      <Link
        to={`/movie/${movie.imdbID}`}
        className="block rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        <div className="aspect-[2/3] bg-gray-100 overflow-hidden">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No poster</div>
          )}
        </div>
        <div className="p-3">
          <div className="font-semibold leading-snug line-clamp-2">{movie.Title}</div>
          <div className="text-sm text-gray-600 mt-1">{movie.Year} • {movie.Type}</div>
        </div>
      </Link>

    
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(movie); }}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-2 right-2 rounded-full border bg-white/90 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md transition
          ${fav ? "text-red-600" : "text-gray-700"}`}
        title={fav ? "In favorites" : "Add to favorites"}
      >
        {fav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}


