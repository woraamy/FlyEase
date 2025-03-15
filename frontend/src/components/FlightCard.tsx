"use client";

import { Star, Wifi, Utensils, Music } from "lucide-react";
import { Flight } from "@/types/searchtype";
import { useRouter } from "next/navigation";

export interface FlightCardProps {
  flight: Flight;  // Update the props interface to include flight
}

const FlightCard = ({ flight }: FlightCardProps) => {
  console.log(flight)
  const router = useRouter()

  const handleClick = () => {
    if (!flight.id) {
      console.error("Flight ID is missing:", flight);
      return; // Prevent navigation if flight.id is undefined
    }
    router.push(`/flights/${flight.id}`);
  };

  return (
    <div 
      className="bg-[#EAF0EC] text-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col gap-6 w-full"
      onClick={handleClick} // Make the card clickable 
    >
      <div className="flex items-start gap-6 justify-between w-full">
        <div className="flex gap-6">
          <img 
            src={flight.featured_image || flight.image} 
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
                  className={`w-4 h-4 ${i < flight.rating ? "text-[#3A7853] fill-current" : "text-black"}`}
                />
              ))}
            </div>
            {/* {JSON.stringify(flight)} */}
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
          <p className="text-lg font-bold">${parseFloat((flight.base_price * 0.8).toFixed(2))}</p>
          <p className="text-black line-through">${flight.base_price}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
