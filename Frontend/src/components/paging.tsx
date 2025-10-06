interface PagingProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  maxPages?: number;
}

const Paging = ({ currentPage, totalPages, onPageChange }: PagingProps) => {
  const getPaginationPages = (
    currentPage: number,
    totalPages: number,
    maxPages: number = 10
  ): number[] => {
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPages + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only 1 page or no pages
  }

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <div className="flex space-x-1">
        {getPaginationPages(currentPage, totalPages).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-2 border rounded-md ${
              pageNum === currentPage
                ? "bg-gray-100 border-gray-300"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Paging;
