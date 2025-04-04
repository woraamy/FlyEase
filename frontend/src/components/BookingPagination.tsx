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
    onPageChange 
  }: BookingPaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = []
      
      // Always show first page
      pages.push(1)
      
      // Add current page and surrounding pages
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (pages[pages.length - 1] !== i - 1) {
          // Add ellipsis if there's a gap
          pages.push(-1)
        }
        pages.push(i)
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        if (pages[pages.length - 1] !== totalPages - 1) {
          // Add ellipsis if there's a gap
          pages.push(-1)
        }
        if (pages[pages.length - 1] !== totalPages) {
          pages.push(totalPages)
        }
      }
      
      return pages
    }
  
    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {getPageNumbers().map((page, index) => (
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
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }