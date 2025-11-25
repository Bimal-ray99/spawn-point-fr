import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Logic to show a window of pages if there are too many
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) return [...pages.slice(0, 5), "...", totalPages];
    if (currentPage >= totalPages - 3)
      return [1, "...", ...pages.slice(totalPages - 5)];

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-spark-cyan hover:text-spark-cyan disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-all ${
              page === currentPage
                ? "bg-spark-cyan text-white shadow-lg"
                : page === "..."
                ? "cursor-default text-gray-400"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-spark-cyan hover:text-spark-cyan disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
