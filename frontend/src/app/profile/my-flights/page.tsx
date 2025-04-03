import mockBookings from "@/data/mockBookings.json"
import { BookingCard } from "@/components/BookingCard";

export default function MyFlightsPage() {
    return (
        <div>
            <div className="p-6 text-3xl font-extrabold mt-5">
                <p>My Flights</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBookings.map((booking, index) => (
                    <BookingCard
                        key={index}
                        {...booking}
                        status={booking.status as "PENDING" | "CONFIRMED"}
                    />
                ))}
            </div>
        </div>
    );
  }
  