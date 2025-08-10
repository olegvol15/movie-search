export default function Pagination({ page, totalResults, onPage }) {
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil((Number(totalResults) || 0) / PAGE_SIZE);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-xl border bg-white shadow-sm disabled:opacity-50 hover:shadow-md"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-xl border bg-white shadow-sm disabled:opacity-50 hover:shadow-md"
      >
        Next
      </button>
    </div>
  );
}
