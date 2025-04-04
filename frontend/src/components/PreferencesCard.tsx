"use client";

import { useState } from "react";
import { Armchair } from "lucide-react"; // Using Armchair icon for seat selection button
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Import Button
import { Badge } from "@/components/ui/badge"; // Import Badge

// Original options
const originalSeatOptions = [
  { name: "First Class", multiplier: 2 },
  { name: "Business Class", multiplier: 1.75 },
  { name: "Premium Economy Class", multiplier: 1.5 }, 
  { name: "Economy Class", multiplier: 1 },
];

const seatOptions = originalSeatOptions.filter(
  seat => seat.name !== "Premium Economy Class"
);

type SeatClassDisplayName = "First Class" | "Business Class" | "Economy Class"; 

const mealOptions = ["Standard Meal", "Vegetarian Meal", "Halal Meal", "Gluten-Free Meal", "Seafood Meal"];
const baggageOptions = [
    { name: "NO Extra Baggage", price: 0 },
    { name: "Extra 10kg", price: 30 },
    { name: "Extra 20kg", price: 55 },
    { name: "Extra 30kg", price: 75 }
];
const serviceOptions = ["No Assistance", "Wheelchair Assistance", "Priority Boarding", "Visual/Hearing Assistance", "Pets on Board"];

interface FlightPreferencesProps {
  onSeatClassChange: (seat: { name: SeatClassDisplayName; multiplier: number }) => void;
  onOpenSeatMap: () => void;
  onMealChange: (meal: string) => void;
  onBaggageChange: (baggage: { name: string; price: number }) => void;
  onServiceChange: (service: string) => void;

  selectedSeatClass: SeatClassDisplayName; 
  selectedSeatId: string | null; 
  selectedMeal: string;
  selectedBaggage: string;
  selectedService: string;
}

export default function FlightPreferences({
  onSeatClassChange,
  onOpenSeatMap, // Receive the handler to open the modal
  onMealChange,
  onBaggageChange,
  onServiceChange,
  selectedSeatClass = "Economy Class", // Default class
  selectedSeatId, // The specific chosen seat ID
  selectedMeal = "Standard Meal",
  selectedBaggage = "NO Extra Baggage", // Match new default name exactly
  selectedService = "No Assistance"
}: FlightPreferencesProps) {
  // State for expanding sections (excluding seat section now)
  const [mealExpanded, setMealExpanded] = useState(false);
  const [baggageExpanded, setBaggageExpanded] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(false);

  // Handler for clicking a SEAT CLASS card
  const handleSeatClassSelection = (seat: { name: SeatClassDisplayName; multiplier: number }): void => {
      onSeatClassChange(seat); // Call the prop passed from parent
  };

  // Handler for clicking a BAGGAGE card
  const handleBaggageSelection = (baggage: { name: string; price: number }): void => {
      onBaggageChange(baggage); // Call the prop passed from parent
  };

  return (
    <div className="pb-3 space-y-4">
      <p className="text-xl font-semibold">Additional Services & Preferences</p>

      {/* Seat Preference Section */}
      <div className="border p-4 rounded-lg bg-white shadow-sm"> {/* Added styling */}
        <p className="font-bold mb-1">Seat Preference</p>
        <p className="text-sm text-gray-600 mb-3">First, choose your desired cabin class.</p>

        {/* Step 1: Select Seat CLASS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {seatOptions.map((seat) => (
            <div
              key={seat.name}
              // Type assertion needed as filter might not narrow type sufficiently for TS
              // Or ensure seatOptions type is narrowed correctly earlier
              onClick={() => handleSeatClassSelection(seat as { name: SeatClassDisplayName; multiplier: number })}
              className={`flex flex-col items-center space-y-1 border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedSeatClass === seat.name
                  ? "border-green-500 bg-green-50 ring-1 ring-green-300 shadow-md" // Enhanced selected style
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <p className="text-sm font-semibold">{seat.name}</p>
              <p className="text-xs text-gray-500">Price Multiplier: x{seat.multiplier}</p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Step 2: Select Specific Seat (Trigger Button) */}
         <div>
            <p className="text-sm text-gray-600 mb-2">Next, select your specific seat within the <span className="font-medium">{selectedSeatClass}</span> cabin.</p>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={onOpenSeatMap} // Call the handler passed from parent
                    className="flex items-center gap-2"
                >
                    <Armchair className="h-5 w-5" />
                    {selectedSeatId ? `Change Specific Seat` : "Select Specific Seat"}
                </Button>
                {selectedSeatId ? (
                    <Badge variant="secondary" className="text-md px-3 py-1">
                        Selected: {selectedSeatId}
                    </Badge>
                ) : (
                    <p className="text-sm text-muted-foreground">No specific seat selected</p>
                )}
            </div>
         </div>
      </div>


      {/* Meal Preference */}
      <div className="border p-4 rounded-lg bg-white shadow-sm"> {/* Added styling */}
        <div
          className="flex justify-between cursor-pointer items-center" // Added items-center
          onClick={() => setMealExpanded(!mealExpanded)}
        >
          <span>
            <p className="font-bold">Meal Preference</p>
            <p className="text-sm text-gray-600">Choose your complimentary meal option</p>
          </span>
           {/* Display selected meal */}
           <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700 hidden sm:inline">{selectedMeal}</span>
              <Armchair className={`h-5 w-5 transition-transform ${mealExpanded ? "rotate-180" : ""}`} />
           </div>
        </div>

        {mealExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full mt-3 pt-3 border-t">
            {mealOptions.map((meal) => (
              <div
                key={meal}
                className={`flex items-center justify-center text-center border rounded-lg p-3 cursor-pointer transition-all text-sm hover:shadow-md ${
                  selectedMeal === meal
                  ? "border-green-500 bg-green-50 ring-1 ring-green-300 shadow-md"
                  : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => onMealChange(meal)} // Direct call
              >
                {meal}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra Baggage */}
      <div className="border p-4 rounded-lg bg-white shadow-sm"> {/* Added styling */}
        <div
          className="flex justify-between cursor-pointer items-center"
          onClick={() => setBaggageExpanded(!baggageExpanded)}
        >
          <span>
            <p className="font-bold">Extra Baggage</p>
            <p className="text-sm text-gray-600">Add extra checked baggage allowance</p>
          </span>
           {/* Display selected baggage */}
           <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-700 hidden sm:inline">{selectedBaggage} (+${baggageOptions.find(b => b.name === selectedBaggage)?.price ?? 0})</span>
              <Armchair className={`h-5 w-5 transition-transform ${baggageExpanded ? "rotate-180" : ""}`} />
            </div>
        </div>

        {baggageExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-3 pt-3 border-t">
            {baggageOptions.map((baggage) => (
              <div
                key={baggage.name}
                 className={`flex flex-col text-center items-center space-y-1 border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedBaggage === baggage.name
                    ? "border-green-500 bg-green-50 ring-1 ring-green-300 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleBaggageSelection(baggage)}
              >
                <p className="text-sm font-semibold">{baggage.name}</p>
                <p className="text-xs text-gray-500">Additional: ${baggage.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Assistance */}
      <div className="border p-4 rounded-lg bg-white shadow-sm"> {/* Added styling */}
        <div
          className="flex justify-between cursor-pointer items-center"
          onClick={() => setServiceExpanded(!serviceExpanded)}
        >
          <span>
            <p className="font-bold">Special Assistance</p>
            <p className="text-sm text-gray-600">Request additional assistance if needed</p>
          </span>
          {/* Display selected service */}
          <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-green-700 hidden sm:inline">{selectedService}</span>
             <Armchair className={`h-5 w-5 transition-transform ${serviceExpanded ? "rotate-180" : ""}`} />
          </div>
        </div>

        {serviceExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full mt-3 pt-3 border-t">
            {serviceOptions.map((service) => (
              <div
                key={service}
                className={`flex items-center justify-center text-center border rounded-lg p-3 cursor-pointer transition-all text-sm hover:shadow-md ${
                  selectedService === service
                   ? "border-green-500 bg-green-50 ring-1 ring-green-300 shadow-md"
                   : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => onServiceChange(service)} // Direct call
              >
                {service}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}