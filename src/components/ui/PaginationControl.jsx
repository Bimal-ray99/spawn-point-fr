import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first, last, current, and adjacent pages
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${
                  currentPage === page
                    ? "bg-spark-cyan text-white shadow-lg shadow-spark-cyan/25"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          } else if (
            (page === currentPage - 2 && page > 1) ||
            (page === currentPage + 2 && page < totalPages)
          ) {
            return (
              <span key={page} className="px-1 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
