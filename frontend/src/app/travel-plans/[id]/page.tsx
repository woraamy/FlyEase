import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Plane } from "lucide-react";
import Link from "next/link";

import { FlightRecCard } from "@/components/FightRecCard"; // Ensure correct path
import { travelPlanAPI } from "./action";
import { getFlightByArrCity } from "@/app/action"; // Ensure correct path

// Interfaces (Airport, Flight, TravelPlan) remain the same as before
interface Airport { code: string; name: string; city: string; }
interface Flight { id: number; flight_number: string; departure_airport: Airport; arrival_airport: Airport; departure_time: string; arrival_time: string; base_price: string; available_seats: number; rating: number; featured_image: string; has_wifi: boolean; has_entertainment: boolean; has_meals: boolean; }
interface TravelPlan { _id: string; header_topic: string; departure_city: string; departure_country: string; arrival_city: string; arrival_country: string; introduction: string; header_img: string; paragraphs: Record<string, string>; createdAt: string; }


export default async function TravelPlanDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let travelPlan: TravelPlan | null = null;
  let flights: Flight[] = [];
  let fetchError: string | null = null;

  try {
    // ... (Data fetching logic remains the same) ...
    const planResponse = await travelPlanAPI.getTravelPlanById(id);
    if (!planResponse.ok) {
        if (planResponse.status === 404) notFound();
        throw new Error(`Failed to fetch travel plan: ${planResponse.statusText}`);
    }
    travelPlan = await planResponse.json();
    if (!travelPlan) notFound();
    flights = await getFlightByArrCity(travelPlan.arrival_city);

  } catch (error) {
    console.error("Error loading travel plan details:", error);
    fetchError = "Could not load travel plan details. Please try again later.";
  }

  // ... (Error handling render remains the same) ...
   if (fetchError || !travelPlan) {
     return (
       <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gray-100 p-4"> {/* Keep error page background simple */}
         <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg border border-red-200 shadow-md">
           <h1 className="text-xl font-semibold mb-2">Error Loading Plan</h1>
           <p>{fetchError || "The requested travel plan could not be loaded."}</p>
           <Link href="/travel-plans" className="mt-4 inline-block text-blue-600 hover:underline">
             Back to Travel Plans
           </Link>
         </div>
       </main>
     );
   }

  const paragraphEntries = Object.entries(travelPlan.paragraphs || {});

  return (
    // --- Apply Green Gradient Background Here ---
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">

          {/* Main Content - 2/3 width */}
          {/* Card now uses bg-white, providing contrast against the gradient */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg bg-white shadow-xl border"> {/* Added shadow-xl */}
              {/* Header Image */}
              <div className="relative h-[350px] w-full sm:h-[400px]">
                <Image
                  src={travelPlan.header_img || "/placeholder.svg"}
                  alt={travelPlan.header_topic}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                        {travelPlan.header_topic}
                    </h1>
                 </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 lg:p-10 space-y-6">
                 {/* Meta Info */}
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-x-6 gap-y-2 text-sm text-muted-foreground border-b pb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>
                      {travelPlan.departure_city}, {travelPlan.departure_country}{" "}
                      <Plane className="inline h-4 w-4 mx-1" />{" "}
                      {travelPlan.arrival_city}, {travelPlan.arrival_country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>Created: {new Date(travelPlan.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Introduction */}
                <p className="text-base leading-relaxed text-foreground sm:text-lg">
                  {travelPlan.introduction}
                </p>

                {/* Paragraphs with images */}
                <div className="space-y-10 pt-6 border-t">
                   <h2 className="text-2xl font-semibold text-gray-800 mb-4">Plan Details</h2>
                   {/* ... (Paragraph mapping logic remains the same) ... */}
                   {paragraphEntries.map(([imagePath, text], index) => (
                    <div key={index} className={`flex flex-col md:flex-row md:items-start gap-6 md:gap-8 ${ index % 2 !== 0 ? "md:flex-row-reverse" : "" }`}>
                      <div className="relative h-64 w-full md:w-1/2 flex-shrink-0 overflow-hidden rounded-lg shadow-md border">
                         <Image src={imagePath || "/placeholder.svg"} alt={`Detail image ${index + 1} for ${travelPlan.header_topic}`} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                      <div className="md:w-1/2">
                         <p className="text-base leading-relaxed text-gray-700">{String(text)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> {/* End Content Padding */}
            </div> {/* End Main Content Card */}
          </div> {/* End Main Content Col */}

          {/* Sidebar - 1/3 width */}
           {/* Card uses bg-white, contrasting against gradient */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg bg-white p-6 shadow-xl border"> {/* Added shadow-xl */}
              <h2 className="mb-5 text-xl font-semibold text-gray-800 border-b pb-3">
                Recommended Flights
              </h2>
              <div className="space-y-4">
                 {/* ... (Flight mapping logic remains the same) ... */}
                  {flights && flights.length > 0 ? (
                  flights.map((flight) => (
                    <Link href={`/flights/${flight.id}`} key={flight.id} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                        <FlightRecCard
                          from={flight.departure_airport.city}
                          to={flight.arrival_airport.city}
                          departureTime={flight.departure_time}
                          arrivalTime={flight.arrival_time}
                          departureAirport={flight.departure_airport.code}
                          arrivalAirport={flight.arrival_airport.code}
                          price={flight.base_price}
                          // airline={flight.airline_name}
                        />
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-md border">
                    No direct flights currently recommended for this destination via our partners.
                  </p>
                )}
              </div>
            </div>
          </div> {/* End Sidebar Col */}

        </div> {/* End Grid */}
      </div> {/* End Container */}
    </main>
  );
}