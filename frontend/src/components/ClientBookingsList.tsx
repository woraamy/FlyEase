// components/ClientBookingsList.tsx
"use client"

import { useState } from "react"
import { BookingCard } from "@/components/BookingCard"
import { BookingPagination } from "@/components/BookingPagination"

interface BookingCardData {
  id: number
  name: string
  departureTime: string
  arrivalTime: string
  departureCity: string
  departureCountry: string
  departureAirport: string
  arrivalCity: string
  arrivalCountry: string
  arrivalAirport: string
  seatNumber: string
  status: "CONFIRMED" | "PENDING"
  bookingCode: string
  qrCodeData?: string
}

export function ClientBookingsList({ bookings }: { bookings: BookingCardData[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage))
  
  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return bookings.slice(startIndex, endIndex)
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the list
    window.scrollTo({
      top: document.getElementById('bookings-list')?.offsetTop || 0,
      behavior: 'smooth'
    })
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">You don't have any bookings yet.</p>
      </div>
    )
  }
  
  const currentBookings = getCurrentPageItems()
  
  return (
    <div id="bookings-list">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            {...booking}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <BookingPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}