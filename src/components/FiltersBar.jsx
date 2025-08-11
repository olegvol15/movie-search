export default function FiltersBar({
  type, onTypeChange,
  year, onYearChange,
  sort, onSortChange,
  disabled
}) {
  return (
    <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      {/* Type */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Type</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          disabled={disabled}
          className="px-3 py-2 rounded-xl border bg-white shadow-sm disabled:opacity-50"
        >
          <option value="">All</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>
      </div>

      {/* Year */}
      <div className="flex items-center gap-2">
        <label htmlFor="year" className="text-sm text-gray-600">Year</label>
        <input
          id="year"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 2014"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          disabled={disabled}
          className="w-32 px-3 py-2 rounded-xl border bg-white shadow-sm disabled:opacity-50"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-white shadow-sm"
        >
          <option value="relevance">Relevance (API)</option>
          <option value="year_desc">Year ↓</option>
          <option value="year_asc">Year ↑</option>
          <option value="title_asc">Title A→Z</option>
          <option value="title_desc">Title Z→A</option>
        </select>
      </div>
    </div>
  );
}
