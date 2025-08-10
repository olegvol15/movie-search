export default function MovieCard({ movie, onOpen }) {
  return (
    <button
      onClick={() => onOpen(movie)}
      className="group text-left rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-black/20"
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
    </button>
  );
}
