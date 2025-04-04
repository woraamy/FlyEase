import { ClientBookingsList } from "@/components/ClientBookingsList";
import { getBookingsWithFlightDetails } from "@/app/action";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic'

async function BookingsList() {
  try {
    const bookings = await getBookingsWithFlightDetails();
    
    return <ClientBookingsList bookings={bookings} />;
  } catch (error) {
    console.error("Error in BookingsList:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading bookings. Please try again later.</p>
        <p className="text-gray-500 text-sm mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
}

function BookingsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg shadow-md p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-20 mx-auto mt-4" />
        </div>
      ))}
    </div>
  );
}

export default function MyFlightsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="p-4 text-2xl font-extrabold mt-3">
        <p>My Flights</p>
      </div>
      <div className="p-4">
        <Suspense fallback={<BookingsListSkeleton />}>
          <BookingsList />
        </Suspense>
      </div>
    </div>
  );
}