import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Always show first page, last page, current page, and pages adjacent to current page
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      (i >= currentPage - 1 && i <= currentPage + 1) // Current page and adjacent pages
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      // Add ellipsis
      pages.push('...');
    }
  }
  
  // Remove duplicates and ellipsis next to each other
  const uniquePages = pages.filter((page, index, self) => {
    return page !== '...' || (page === '...' && self[index - 1] !== '...');
  });
  
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6 pt-4">
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
            currentPage === 1 
              ? 'cursor-not-allowed text-gray-300' 
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <ChevronLeft className="mr-3 h-5 w-5" aria-hidden="true" />
          Previous
        </button>
      </div>
      
      <div className="hidden md:flex">
        {uniquePages.map((page, index) => (
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`inline-flex items-center px-4 pt-4 text-sm font-medium ${
                page === currentPage
                  ? 'border-t-2 border-indigo-500 text-indigo-600'
                  : 'border-t-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
            currentPage === totalPages 
              ? 'cursor-not-allowed text-gray-300' 
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Next
          <ChevronRight className="ml-3 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;