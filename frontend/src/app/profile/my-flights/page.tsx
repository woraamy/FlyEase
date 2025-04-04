// // app/profile/my-flights/page.tsx
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { BookingsList } from "@/components/BookingList";

// async function getBookings(userId: string) {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_URL}/booking/mybook`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ clerkUserId: userId }),
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch bookings");
//     }

//     return response.json();
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     return [];
//   }
// }

// export default async function MyFlightsPage() {
//   const { userId } = await auth();
  
//   if (!userId) {
//     redirect("/sign-in");
//   }
  
//   const bookings = await getBookings(userId);
  
//   return (
//     <div>
//       <div className="p-6 text-3xl font-extrabold mt-5">
//         <p>My Flights</p>
//       </div>
//       <BookingsList bookings={bookings} />
//     </div>
//   );
// }

import { BookingCard } from "@/components/BookingCard";
import { getBookingsWithFlightDetails } from "@/app/action";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function BookingsList() {
  try {
    const bookings = await getBookingsWithFlightDetails();
    
    if (bookings.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">You don't have any bookings yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            {...booking}
          />
        ))}
      </div>
    );
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