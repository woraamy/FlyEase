// components/BookingPagination.tsx
"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface BookingPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function BookingPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BookingPaginationProps) {
  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pages[pages.length - 1] !== i - 1) {
        pages.push(-1) // Add ellipsis
      }
      pages.push(i)
    }
    
    // Always show last page if not already included and if there are more pages
    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      if (pages[pages.length - 1] !== totalPages - 1) {
        pages.push(-1) // Add ellipsis
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            href="#"
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => (
          page === -1 ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}