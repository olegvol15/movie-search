import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import DetailsModal from "../components/DetailsModal.jsx";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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
  const [active, setActive] = useState(null);

  // filters
  const [type, setType] = useState(""); // '', 'movie', 'series', 'episode'
  const [year, setYear] = useState(""); // '2014'
  const [sort, setSort] = useState("relevance"); // relevance | year_desc | year_asc | title_asc | title_desc

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  const debounced = useDebounce(query, 500);

  // reset page when query or filters change
  useEffect(() => { setPage(1); }, [debounced, type, year]);

  const searchUrl = useMemo(() => {
    const params = new URLSearchParams({
      apikey: API_KEY ?? "",
      s: debounced.trim(),
      page: String(page),
    });
    if (type) params.set("type", type);
    if (year) params.set("y", year.trim());
    return `https://www.omdbapi.com/?${params.toString()}`;
  }, [API_KEY, debounced, page, type, year]);

  useEffect(() => {
    let ignore = false;
    const ctrl = new AbortController();

    async function run() {
      if (!debounced.trim()) {
        setResults([]); setTotal(0); setError(""); setLoading(false); return;
      }
      setLoading(true); setError("");
      try {
        const res = await fetch(searchUrl, { signal: ctrl.signal });
        const data = await res.json();
        if (ignore) return;
        if (data.Response === "True") {
          let items = data.Search || [];
          // client-side sort
          const byYear = (x) => {
            const y = parseInt(String(x.Year).slice(0, 4), 10);
            return isNaN(y) ? -Infinity : y;
          };
          if (sort === "year_desc") items = [...items].sort((a, b) => byYear(b) - byYear(a));
          if (sort === "year_asc") items = [...items].sort((a, b) => byYear(a) - byYear(b));
          if (sort === "title_asc") items = [...items].sort((a, b) => a.Title.localeCompare(b.Title));
          if (sort === "title_desc") items = [...items].sort((a, b) => b.Title.localeCompare(a.Title));

          setResults(items);
          setTotal(Number(data.totalResults) || 0);
        } else {
          setResults([]); setTotal(0); setError(data.Error || "No results");
        }
      } catch (e) {
        if (!ignore && e.name !== "AbortError") setError("Network error. Try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => { ignore = true; ctrl.abort(); };
  }, [searchUrl, sort, debounced]);

  async function openDetails(m) {
    
    setActive(m);
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
      <SearchBar value={query} onChange={(v) => setQuery(v)} onClear={clearSearch} />
      <FiltersBar
        type={type} onTypeChange={setType}
        year={year} onYearChange={setYear}
        sort={sort} onSortChange={setSort}
        disabled={loading}
      />

      {!loading && !results.length && !debounced && (
        <div className="mt-12 text-center text-gray-500">Start typing to search for movies…</div>
      )}

      {loading && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && debounced && (
        <p className="mt-10 text-center text-red-600" role="alert">{error}</p>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="mt-6 text-sm text-gray-600">
            Found {total.toLocaleString()} results
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
          <Pagination page={page} totalResults={total} onPage={setPage} />
        </>
      )}

      {!loading && debounced && results.length === 0 && !error && (
        <div className="mt-12 text-center text-gray-500">No movies found. Try another search.</div>
      )}

      <DetailsModal movie={active} onClose={() => setActive(null)} />
    </>
  );
}


