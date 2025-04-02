"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const seatOptions = [
  { 
    name: "First Class", 
    multiplier: 2
  },
  { 
    name: "Business Class", 
    multiplier: 1.75
  },
  { 
    name: "Premium Economy Class", 
    multiplier: 1.5
  },
  { 
    name: "Economy Class", 
    multiplier: 1
  },
];

const mealOptions = ["Standard Meal", "Vegetarian Meal", "Halal Meal", "Gluten-Free Meal", "Seafood Meal"];
// const baggageOptions = ["No Extra Baggage", "Extra 10kg", "Extra 20kg", "Extra 30kg"];
const baggageOptions = [
    { 
        name: "NO Extra Baggage", 
        price: 0
    },
    { 
        name: "Extra 10kg", 
        price: 30
    },
    { 
        name: "Extra 20kg", 
        price: 55
    },
    { 
        name: "Extra 30kg", 
        price: 75
    }
];
const serviceOptions = ["No Assistance", "Wheelchair Assistance", "Priority Boarding", "Visual/Hearing Assistance", "Pets on Board"];



interface FlightPreferencesProps {
  onSeatChange?: (seat: { name: string; multiplier: number }) => void;
  onMealChange: (meal: string) => void;
  onBaggageChange?: (baggage: { name: string; price: number }) => void;
  onServiceChange?: (service: string) => void;
  selectedSeat?: string;
  selectedMeal?: string;
  selectedBaggage?: string;
  selectedService?: string;
}

export default function FlightPreferences({ 
  onSeatChange, 
  onMealChange, 
  onBaggageChange, 
  onServiceChange, 
  selectedSeat = "Economy Class",
  selectedMeal = "Standard Meal",
  selectedBaggage = "No Extra Baggage",
  selectedService = "No Assistance"
}: FlightPreferencesProps) {
  const [seatExpanded, setSeatExpanded] = useState(false);
  const [mealExpanded, setMealExpanded] = useState(false);
  const [baggageExpanded, setBaggageExpanded] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(false);

const handleSeatSelection = (seat: { name: string; multiplier: number }): void => {
    if (onSeatChange) {
        onSeatChange(seat);
    }
};

const handleBaggageSelection = (baggage: { name: string; price: number }): void => {
    if (onBaggageChange) {
        onBaggageChange(baggage);
    }
};

  return (
    <div className="pb-3 space-y-4">
      <p className="text-xl font-semibold">Additional Services</p>
      
      {/* Seat Preference */}
      <div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <div
            data-toggle="collapse"
            aria-expanded={seatExpanded}
            aria-controls="seatPref"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSeatExpanded(!seatExpanded)}
          >
            <ChevronDown
              id="seat preference"
              className={`transition-transform ${seatExpanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>
        
        {seatExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {seatOptions.map((seat) => (
              <div
                key={seat.name}
                className={`flex flex-col items-center space-y-2 border-[1px] rounded-xl p-4 cursor-pointer transition-all ${
                  selectedSeat === seat.name ? "border-[#31B372] bg-[#E9F1ED] shadow-md" : "border-gray-300"
                }`}
                onClick={() => handleSeatSelection(seat)}
              >
                <p className="text-sm font-semibold">{seat.name}</p>
                <p className="text-xs">x{seat.multiplier}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Preference */}
      <div>
        <div 
          className="flex justify-between cursor-pointer" 
          onClick={() => setMealExpanded(!mealExpanded)}
        >
          <span>
            <p className="font-bold">Meal Preference</p>
            <p>Choose your meal</p>
          </span>
          <ChevronDown className={`transition-transform ${mealExpanded ? "rotate-180" : ""}`} />
        </div>

        {mealExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mt-3">
            {mealOptions.map((meal) => (
              <div
                key={meal}
                className={`flex items-center justify-center border-[1px] rounded-xl p-3 cursor-pointer transition-all ${
                  selectedMeal === meal ? "border-[#31B372] bg-[#E9F1ED] shadow-md" : "border-gray-300"
                }`}
                onClick={() => onMealChange && onMealChange(meal)}
              >
                <p className="text-sm">{meal}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra Baggage */}
      <div>
        <div 
          className="flex justify-between cursor-pointer" 
          onClick={() => setBaggageExpanded(!baggageExpanded)}
        >
          <span>
            <p className="font-bold">Extra Baggage</p>
            <p>Add extra baggage</p>
          </span>
          <ChevronDown className={`transition-transform ${baggageExpanded ? "rotate-180" : ""}`} />
        </div>

        {baggageExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {baggageOptions.map((baggage) => (
              <div
                key={baggage.name}
                className={`flex flex-col items-center space-y-2 border-[1px] rounded-xl p-4 cursor-pointer transition-all ${
                  selectedBaggage === baggage.name ? "border-[#31B372] bg-[#E9F1ED] shadow-md" : "border-gray-300"
                }`}
                onClick={() => handleBaggageSelection(baggage)}
              >
                <p className="text-sm font-semibold">{baggage.name}</p>
                <p className="text-xs">additional ${baggage.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Assistance */}
      <div>
        <div 
          className="flex justify-between cursor-pointer" 
          onClick={() => setServiceExpanded(!serviceExpanded)}
        >
          <span>
            <p className="font-bold">Special Assistance</p>
            <p>Request assistance</p>
          </span>
          <ChevronDown className={`transition-transform ${serviceExpanded ? "rotate-180" : ""}`} />
        </div>

        {serviceExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mt-3">
            {serviceOptions.map((service) => (
              <div
                key={service}
                className={`flex items-center justify-center border-[1px] rounded-xl p-3 cursor-pointer transition-all ${
                  selectedService === service ? "border-[#31B372] bg-[#E9F1ED] shadow-md" : "border-gray-300"
                }`}
                onClick={() => onServiceChange && onServiceChange(service)}
              >
                <p className="text-sm">{service}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
    </div>
  );
}