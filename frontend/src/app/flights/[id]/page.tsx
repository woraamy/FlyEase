"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { 
  Plane, Clock, Wifi, Tv, UtensilsCrossed, Star, LoaderCircle 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { flightAPI } from "./action";

interface Flight {
  id: string;
  flight_number: string;
  departure_airport: { code: string; name: string };
  arrival_airport: { code: string; name: string };
  departure_time: string;
  arrival_time: string;
  base_price: number;
  available_seats: number;
  rating: number;
  featured_image: string;
  has_wifi: boolean;
  has_entertainment: boolean;
  has_meals: boolean;
}

export default function FlightDetailsPage() {
  const { id: flightId } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlight() {
      try {
        console.log(`Fetching flight with ID: ${flightId}`);
        
        const res = await flightAPI.getFlightById(flightId);

        // Check if the response is valid JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response. The API might be returning an error page.");
        }

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Flight not found.");
        }

        setFlight(data);
      } catch (err: any) {
        console.error("Error fetching flight:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlight();
  }, [flightId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="text-center text-red-600 min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">{error || "Flight not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-green-600 text-white">
      <main className="container grid gap-6 px-6 py-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Flight Details</h1>

          {/* Flight Image */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img src={flight.featured_image} alt="Flight" className="w-full h-64 object-cover" />
          </div>

          {/* Flight Info Card */}
          <Card className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Plane className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Flight {flight.flight_number}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {flight.rating} Rating
                    </div>
                  </div>
                </div>

                {/* Flight Time Details */}
                <div className="grid gap-2">
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="font-semibold">{flight.departure_airport.code}</div>
                      <div className="text-sm text-gray-500">{format(new Date(flight.departure_time), "h:mm a")}</div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      {format(new Date(flight.arrival_time), "h:mm a")}
                    </div>
                    <div>
                      <div className="font-semibold">{flight.arrival_airport.code}</div>
                      <div className="text-sm text-gray-500">{format(new Date(flight.arrival_time), "h:mm a")}</div>
                    </div>
                  </div>
                </div>

                {/* Flight Amenities */}
                <div className="flex gap-4">
                  {flight.has_wifi && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Wifi className="h-4 w-4 text-green-600" />
                      WiFi
                    </div>
                  )}
                  {flight.has_entertainment && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Tv className="h-4 w-4 text-green-600" />
                      Entertainment
                    </div>
                  )}
                  {flight.has_meals && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <UtensilsCrossed className="h-4 w-4 text-green-600" />
                      Meals
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Checkout Sidebar */}
        <div className="space-y-4">
          <Card className="p-6 bg-white text-gray-900 rounded-xl shadow-lg">
            <h2 className="mb-4 font-semibold text-lg">Booking</h2>
            <p className="text-lg font-semibold text-gray-900">Price: ${flight.base_price.toFixed(2)}</p>
            <p className="text-gray-600">Seats Available: {flight.available_seats}</p>
            <Button className="w-full bg-green-600 text-white hover:bg-green-700 mt-4" size="lg">
              Book Now
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
