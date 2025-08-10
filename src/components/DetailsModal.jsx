export default function DetailsModal({ movie, onClose }) {
  if (!movie) return null
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-[1fr,2fr]">
          <div className="bg-gray-100 aspect-[2/3]">
            {movie.Poster && movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={`${movie.Title} poster`} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="p-5">
            <h2 className="text-2xl font-bold">{movie.Title}</h2>
            <p className="text-gray-600 mt-1">{movie.Year} • {movie.Type?.toUpperCase?.()}</p>
            {movie.imdbID && (
              <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm underline">View on IMDb</a>
            )}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <p className="mt-4 leading-relaxed">{movie.Plot}</p>
            )}
            <div className="flex justify-end mt-6">
              <button onClick={onClose} className="px-4 py-2 rounded-xl border hover:shadow">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}