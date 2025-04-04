// Update the server component to use our client component
import { ClientBookingsList } from "@/components/ClientBookingsList"
import { getBookingsWithFlightDetails } from "@/app/action"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

async function BookingsList() {
  try {
    const bookings = await getBookingsWithFlightDetails()
    return <ClientBookingsList bookings={bookings} />
  } catch (error) {
    console.error("Error in BookingsList:", error)
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading bookings. Please try again later.</p>
        <p className="text-gray-500 text-sm mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    )
  }
}