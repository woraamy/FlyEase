"use client"

import { BookingCard } from "@/components/BookingCard"
import { BookingSkeleton } from "@/components/BookingSkeleton"
import { BookingPagination } from "@/components/BookingPagination"
import { useEffect, useState } from "react"

interface Booking {
  id: number
  flight_number: string
  seat_id: string
  seat_class: string
  booking_code: string
  status: "PENDING" | "CONFIRMED"
  created_at: string
  selected_meal: string
  selected_service: string
  selected_baggage: string
  passenger: {
    id: number
    first_name: string
    last_name: string
    passport: string
    email: string
    phone: string
    nationality: string
    age: number
  }
  flight: {
    id: number
    flight_number: string
    departure_airport: {
      id: number
      code: string
      name: string
      city: string
      country: string
    }
    arrival_airport: {
      id: number
      code: string
      name: string
      city: string
      country: string
    }
    departure_time: string
    arrival_time: string
    base_price: number
    rating: number
    has_wifi: boolean
    has_entertainment: boolean
    has_meals: boolean
  }
}

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    // Simulate a short loading time for the QR code generation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the list
    window.scrollTo({
      top: document.getElementById('bookings-list')?.offsetTop || 0,
      behavior: 'smooth'
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(Math.min(itemsPerPage, 3))].map((_, index) => (
          <BookingSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">You don't have any flight bookings yet.</p>
      </div>
    )
  }

  const currentBookings = getCurrentPageItems()

  return (
    <div id="bookings-list">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            id={booking.id}
            name={`${booking.passenger.first_name} ${booking.passenger.last_name}`}
            departureTime={new Date(booking.flight.departure_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            arrivalTime={new Date(booking.flight.arrival_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            departureCity={booking.flight.departure_airport.city}
            departureCountry={booking.flight.departure_airport.country}
            departureAirport={booking.flight.departure_airport.code}
            arrivalCity={booking.flight.arrival_airport.city}
            arrivalCountry={booking.flight.arrival_airport.country}
            arrivalAirport={booking.flight.arrival_airport.code}
            seatNumber={booking.seat_id}
            status={booking.status}
            bookingCode={booking.booking_code}
            qrCodeData={`FLIGHT:${booking.flight.flight_number},BOOKING:${booking.booking_code},SEAT:${booking.seat_id},PASSENGER:${booking.passenger.first_name} ${booking.passenger.last_name}`}
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