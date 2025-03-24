"use client";

import { Star, Wifi, Utensils, Music } from "lucide-react";
import { Flight } from "@/types/searchtype";
import { useRouter } from "next/navigation";

export interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  const router = useRouter();

  // Check if flight object is empty or missing critical data
  if (!flight || Object.keys(flight).length === 0) {
    console.error("Invalid flight data:", flight);
    return null; // Don't render anything for empty flight objects
  }

  // Check if departure_airport or arrival_airport is null
  if (!flight.departure_airport || !flight.arrival_airport) {
    console.error("Missing airport data:", flight);
    return (
      <div className="bg-[#EAF0EC] text-black rounded-lg shadow-md p-6">
        <p>Flight information incomplete</p>
        <p className="text-sm text-gray-600">Flight: {flight.flight_number || "Unknown"}</p>
      </div>
    );
  }

  const handleClick = () => {
    if (!flight.id) {
      console.error("Flight ID is missing:", flight);
      return;
    }
    router.push(`/flights/${flight.id}`);
  };

  // Convert base_price to number if it's a string
  const basePrice = typeof flight.base_price === 'string' 
    ? parseFloat(flight.base_price) 
    : (flight.base_price || 0);
  
  const discountPrice = (basePrice * 0.8).toFixed(2);

  return (
    <div 
      className="bg-[#EAF0EC] text-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col gap-6 w-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-6 justify-between w-full">
        <div className="flex gap-6">
          <img 
            src={flight.featured_image || flight.image || "/images/default-flight.jpg"} 
            alt={`${flight.departure_airport.city} to ${flight.arrival_airport.city}`} 
            className="w-32 h-32 object-cover rounded-lg" 
          />
          <div className="flex flex-col items-start">
            <h3 className="text-black font-semibold mb-2">
              {flight.departure_airport.city} to {flight.arrival_airport.city}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Flight: {flight.flight_number}</p>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (flight.rating || 0) ? "text-[#3A7853] fill-current" : "text-black"}`}
                />
              ))}
            </div>
            <div className="flex flex-col text-sm text-black gap-1">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" /> 
                {flight.has_wifi ? "Wifi Available" : "No Wifi"}
              </div>
              <div className="flex items-center gap-1">
                <Utensils className="w-4 h-4" />
                {flight.has_meals ? "Meals Included" : "No Meals"}
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-4 h-4" />
                {flight.has_entertainment ? "Entertainment Available" : "No Entertainment"}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${discountPrice}</p>
          <p className="text-black line-through">${basePrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;