// 'use client';

// import { useState } from 'react';
// import FlightCard from './FlightCard';
// import { Flight } from '@/types/searchtype';

// interface FlightListProps {
//   initialFlights: Flight[];
// }

// export default function FlightList({ initialFlights }: FlightListProps) {
//   const [flights, setFlights] = useState<Flight[]>(initialFlights);

//   return (
//     <div className="flex flex-col gap-8">
//         {flights.map((flight, index) => (
//         <FlightCard key={flight.id || index} flight={flight} />
//         ))}
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import FlightCard from './FlightCard';
import { Flight } from '@/types/searchtype';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface FlightListProps {
  initialFlights: Flight[];
}

export default function FlightList({ initialFlights }: FlightListProps) {
  const [flights] = useState<Flight[]>(initialFlights);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 flights per page

  // Calculate total pages
  const totalPages = Math.ceil(flights.length / itemsPerPage);
  
  // Get current flights to display
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Flight list */}
      {currentFlights.map((flight, index) => (
        <FlightCard key={flight.id || index} flight={flight} />
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {/* Previous page button */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }} 
                />
              </PaginationItem>
            )}
            
            {/* Page numbers */}
            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink 
                  href="#" 
                  isActive={number === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(number);
                  }}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {/* Next page button */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }} 
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
