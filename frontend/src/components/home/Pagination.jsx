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
          className={`min-w-[40px] h-10 px-3 rounded-xl font-bold transition-all duration-200 ${
            i === currentPage
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
              : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-gray-600'
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
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 px-4 rounded-xl font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 transition-all duration-200"
      >
        قبلی
      </button>

      {renderPageNumbers}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 px-4 rounded-xl font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-600 transition-all duration-200"
      >
        بعدی
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
