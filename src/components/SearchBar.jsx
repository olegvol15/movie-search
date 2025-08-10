export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <label htmlFor="q" className="sr-only">Search movies</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>
        </div>
        <input
          id="q"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search movies, series… (e.g. Inception)"
          className="w-full pl-12 pr-28 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:border-gray-300 focus:ring-2 focus:ring-black/10 text-lg"
          autoComplete="off"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl border bg-white shadow-sm hover:shadow-md text-sm"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
