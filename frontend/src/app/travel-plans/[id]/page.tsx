import Image from "next/image"
import { notFound } from "next/navigation"
import { CalendarDays, MapPin } from "lucide-react"

import { FlightRecCard } from "@/components/FightRecCard"
import mockFlights from "@/data/mockFlights.json"
import mockTravelPlans from "@/data/mockTravelPlan.json"
import { travelPlanAPI } from "./action"
import { getFlightByArrCity } from "@/app/action"
import Link from "next/link"

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: { code: string; name: string; city: string };
  arrival_airport: { code: string; name: string; city: string};
  departure_time: string;
  arrival_time: string;
  base_price: string;
  available_seats: number;
  rating: number;
  featured_image: string;
  has_wifi: boolean;
  has_entertainment: boolean;
  has_meals: boolean;
}


// Mock data for a single travel plan
const getTravelPlan = (id: string) => {

  const plan = mockTravelPlans.find((plan) => plan.id === Number(id))
  return plan
}

export default async function TravelPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const plan = await travelPlanAPI.getTravelPlanById(id)
  const travelPlan = await plan.json()
  if (!travelPlan) {
    notFound()
  }
  // Fetch flights data based on the travel plan's arrival city
  const flights = await getFlightByArrCity(travelPlan.arrival_city);

  // Convert paragraphs object to array for easier mapping
  const paragraphEntries = Object.entries(travelPlan.paragraphs)


  return (
    <main className="min-h-screen bg-gradient-to-r from-[rgba(161,191,159,1)] via-[rgba(219,239,218,1)] to-[rgba(222,242,221,1)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl bg-white shadow-xl">
              {/* Header Image */}
              <div className="relative h-[300px] w-full">
                <Image
                  src={travelPlan.header_img}
                  alt={travelPlan.header_topic}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{travelPlan.header_topic}</h1>

                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>
                      From {travelPlan.departure_city}, {travelPlan.departure_country} to {travelPlan.arrival_city},{" "}
                      {travelPlan.arrival_country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-emerald-600" />
                    <span>{new Date(travelPlan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="mb-8 text-lg leading-relaxed text-gray-700">{travelPlan.introduction}</p>

                {/* Paragraphs with images */}
                <div className="space-y-12">
                  {paragraphEntries.map(([imagePath, text], index) => (
                    <div key={index} className={`grid gap-6 ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                      <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
                        <Image
                          src={imagePath || "/placeholder.svg"}
                          alt={`Image ${index + 1} for ${travelPlan.header_topic}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-base leading-relaxed text-gray-700 md:text-lg">{String(text)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Recommended Flights</h2>
              <div className="space-y-4">
                {flights && flights.length > 0 ? (
                  flights.map((flight: Flight) => (
                    <Link href={`/flights/${flight.id}`} key={flight.id}>
                      <div className="my-3">
                        <FlightRecCard
                          from={flight.departure_airport.city}
                          to={flight.arrival_airport.city}
                          departureTime={flight.departure_time}
                          arrivalTime={flight.arrival_time}
                          departureAirport={flight.departure_airport.code}
                          arrivalAirport={flight.arrival_airport.code}
                          price={flight.base_price}
                        />
                        </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No flights available for this destination.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}