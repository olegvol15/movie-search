import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFavorites } from "../store/favorites.jsx";

export default function MovieDetails() {
  const { id } = useParams(); // imdbID из роутера
  const { isFav, toggle } = useFavorites();

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setErr("");
      try {
        const params = new URLSearchParams({
          apikey: API_KEY ?? "",
          i: id,
          plot: "full",
        });
        const res = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
        const json = await res.json();
        if (ignore) return;
        if (json.Response === "True") setData(json);
        else setErr(json.Error || "Not found");
      } catch {
        if (!ignore) setErr("Network error. Try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [id, API_KEY]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid md:grid-cols-[1fr,2fr] gap-6">
          <div className="aspect-[2/3] bg-gray-200 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-6">{err}</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl border bg-white shadow-sm hover:shadow-md"
        >
          ← Back
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const {
    Title,
    Year,
    Poster,
    Plot,
    Genre,
    Actors,
    Director,
    Writer,
    Released,
    Runtime,
    Country,
    imdbRating,
    Ratings = [],
    Type,
    imdbID,
  } = data;

  const fav = isFav(imdbID);

  return (
    <div>
      <Link
        to="/"
        className="inline-block mb-6 px-4 py-2 rounded-xl border bg-white shadow-sm hover:shadow-md"
      >
        ← Back to search
      </Link>

      <div className="grid md:grid-cols-[1fr,2fr] gap-6">
        {/* Poster */}
        <div className="rounded-2xl overflow-hidden border bg-white">
          <div className="aspect-[2/3] bg-gray-100">
            {Poster && Poster !== "N/A" ? (
              <img
                src={Poster}
                alt={`${Title} poster`}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {Title}
              </h2>
              <p className="text-gray-600 mt-1">
                {Year} • {Type?.toUpperCase?.()} {Runtime ? `• ${Runtime}` : ""}{" "}
                {Country ? `• ${Country}` : ""}
              </p>
            </div>

            {/* Favorites button */}
            <button
              onClick={() => toggle(data)}
              className={`px-4 py-2 rounded-xl border bg-white shadow-sm hover:shadow-md ${
                fav ? "text-red-600" : "text-gray-700"
              }`}
              title={fav ? "Remove from favorites" : "Add to favorites"}
            >
              {fav ? "Remove ♥" : "Add ♥"}
            </button>
          </div>

          {/* IMDb badge */}
          {imdbRating && imdbRating !== "N/A" && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm rounded-full border px-3 py-1 bg-gray-50">
              <span className="font-semibold">IMDb</span>
              <span>{imdbRating}/10</span>
            </div>
          )}

          {/* Other ratings */}
          {Array.isArray(Ratings) && Ratings.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {Ratings.map((r) => (
                <span
                  key={r.Source}
                  className="rounded-full border px-3 py-1 bg-gray-50"
                >
                  {r.Source}: {r.Value}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          {Released && Released !== "N/A" && (
            <p className="mt-4 text-sm text-gray-700">
              <span className="font-semibold">Released:</span> {Released}
            </p>
          )}
          {Genre && Genre !== "N/A" && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Genres:</span> {Genre}
            </p>
          )}
          {Director && Director !== "N/A" && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Director:</span> {Director}
            </p>
          )}
          {Writer && Writer !== "N/A" && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Writer:</span> {Writer}
            </p>
          )}
          {Actors && Actors !== "N/A" && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Actors:</span> {Actors}
            </p>
          )}

          {/* Plot */}
          {Plot && Plot !== "N/A" && (
            <p className="mt-6 leading-relaxed">{Plot}</p>
          )}

          {imdbID && (
            <a
              href={`https://www.imdb.com/title/${imdbID}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 text-sm underline"
            >
              View on IMDb
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

