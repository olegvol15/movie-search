import { useEffect, useMemo, useState } from "react";
// скорректируй пути, если компоненты в другой папке:
import SearchBar from "../components/SearchBar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import DetailsModal from "../components/DetailsModal.jsx";

/* --- маленький хук для дебаунса ввода --- */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* --- скелетон карточки на время загрузки --- */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white">
      <div className="aspect-[2/3] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null); // для модалки деталей

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY; // <-- берём из .env
  const debounced = useDebounce(query, 500);

  // сбрасываем страницу при изменении запроса
  useEffect(() => {
    setPage(1);
  }, [debounced]);

  // строим URL поиска
  const searchUrl = useMemo(() => {
    const params = new URLSearchParams({
      apikey: API_KEY ?? "",
      s: debounced.trim(),
      page: String(page),
      type: "movie", // можно убрать, чтобы искать всё
    });
    return `https://www.omdbapi.com/?${params.toString()}`;
  }, [API_KEY, debounced, page]);

  // загрузка списка
  useEffect(() => {
    let ignore = false;
    const ctrl = new AbortController();

    async function run() {
      if (!debounced.trim()) {
        setResults([]);
        setTotal(0);
        setError("");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(searchUrl, { signal: ctrl.signal });
        const data = await res.json();
        if (ignore) return;
        if (data.Response === "True") {
          setResults(data.Search || []);
          setTotal(Number(data.totalResults) || 0);
        } else {
          setResults([]);
          setTotal(0);
          setError(data.Error || "No results");
        }
      } catch (e) {
        if (!ignore && e.name !== "AbortError") {
          setError("Network error. Try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
      ctrl.abort();
    };
  }, [searchUrl, debounced]);

  // загрузка полных деталей по клику (для модалки)
  async function openDetails(m) {
    try {
      const params = new URLSearchParams({
        apikey: API_KEY ?? "",
        i: m.imdbID,
        plot: "full",
      });
      const res = await fetch(`https://www.omdbapi.com/?${params.toString()}`);
      const data = await res.json();
      setActive(data);
    } catch {
      setActive(m);
    }
  }

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setTotal(0);
    setPage(1);
    setError("");
  };

  return (
    <>
      <SearchBar
        value={query}
        onChange={(v) => setQuery(v)}
        onClear={clearSearch}
      />

      {/* стартовое сообщение */}
      {!loading && !results.length && !debounced && (
        <div className="mt-12 text-center text-gray-500">
          Start typing to search for movies…
        </div>
      )}

      {/* загрузка */}
      {loading && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ошибка */}
      {error && !loading && debounced && (
        <p className="mt-10 text-center text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* результаты */}
      {!loading && results.length > 0 && (
        <>
          <div className="mt-6 text-sm text-gray-600">
            Found {total.toLocaleString()} results
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((m) => (
              <MovieCard key={m.imdbID} movie={m} onOpen={openDetails} />
            ))}
          </div>
          <Pagination page={page} totalResults={total} onPage={setPage} />
        </>
      )}

      {/* пусто по запросу */}
      {!loading && debounced && results.length === 0 && !error && (
        <div className="mt-12 text-center text-gray-500">
          No movies found. Try another search.
        </div>
      )}

      <DetailsModal movie={active} onClose={() => setActive(null)} />
    </>
  );
}

