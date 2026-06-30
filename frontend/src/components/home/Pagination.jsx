import { memo, useCallback, useMemo } from 'react';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  const renderPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-bold transition-colors duration-150 ${
            i === currentPage
              ? 'bg-brand-700 text-white'
              : 'bg-white dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-700 border border-warm-200 dark:border-warm-600'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  }, [currentPage, totalPages, handlePageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 mt-10 flex-wrap">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 px-3 rounded-lg text-sm font-medium bg-white dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-700 disabled:opacity-50 disabled:cursor-not-allowed border border-warm-200 dark:border-warm-600 transition-colors duration-150"
      >
        قبلی
      </button>

      {renderPageNumbers}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 px-3 rounded-lg text-sm font-medium bg-white dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-700 disabled:opacity-50 disabled:cursor-not-allowed border border-warm-200 dark:border-warm-600 transition-colors duration-150"
      >
        بعدی
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
