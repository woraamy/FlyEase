import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PreferencesProps {
  basePrice: number;
}

const Preferences = ({ basePrice }: PreferencesProps) => {
  // State Management
  const [seatExpanded, setSeatExpanded] = useState(false);
  const [mealExpanded, setMealExpanded] = useState(false);
  const [baggageExpanded, setBaggageExpanded] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState("Economy");
  const [selectedMeal, setSelectedMeal] = useState("Standard Meal");
  const [selectedBaggage, setSelectedBaggage] = useState("No Extra Baggage");
  const [selectedService, setSelectedService] = useState("No Assistance");

  const [updatedPrice, setUpdatedPrice] = useState(basePrice);

  // Options Data
  const seatOptions = [
    { name: "First Class", multiplier: 2, perks: ["Luxury Seating", "Gourmet Meals", "Extra Legroom", "Priority Boarding"] },
    { name: "Business Class", multiplier: 1.75, perks: ["Reclining Seats", "Premium Meals", "Lounge Access", "Extra Baggage"] },
    { name: "Premium Economy", multiplier: 1.5, perks: ["Wider Seats", "Better Meals", "Priority Check-in", "More Legroom"] },
    { name: "Economy", multiplier: 1, perks: ["Standard Seating", "Basic Meals", "Carry-On Baggage"] },
  ];

  const mealOptions = ["Standard Meal", "Vegetarian Meal", "Halal Meal", "Gluten-Free Meal"];
  const baggageOptions = {
    "No Extra Baggage": 0,
    "Extra 10kg": 30,
    "Extra 20kg": 55,
    "Extra 30kg": 75,
  };
  const serviceOptions = ["No Assistance", "Wheelchair Assistance", "Priority Boarding", "Visual/Hearing Assistance"];

  // Handlers
  const handleSeatSelection = (seat: any) => {
    setSelectedSeat(seat.name);
    setUpdatedPrice(basePrice * seat.multiplier);
  };

  const handleBaggageSelection = (baggageOption: string) => {
      setSelectedBaggage(baggageOption);
      setUpdatedPrice(basePrice + (baggageOptions[baggageOption])); // Add the baggage price
  };

  return (
    <div className="space-y-6">
      {/* Seat Preference */}
      <div>
        <div className="flex justify-between cursor-pointer" onClick={() => setSeatExpanded(!seatExpanded)}>
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Choose your seat</p>
          </span>
          <ChevronDown className={`transition-transform ${seatExpanded ? "rotate-180" : ""}`} />
        </div>

        {seatExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {seatOptions.map((seat) => (
              <div
                key={seat.name}
                className={`flex flex-col items-center space-y-2 border-[1px] rounded-xl p-4 cursor-pointer transition-all ${
                  selectedSeat === seat.name ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300"
                }`}
                onClick={() => handleSeatSelection(seat)}
              >
                <p className="text-sm font-semibold">{seat.name}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {seat.perks.map((perk, index) => <li key={index}>• {perk}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Preference */}
      <div>
        <div className="flex justify-between cursor-pointer" onClick={() => setMealExpanded(!mealExpanded)}>
          <span>
            <p className="font-bold">Meal Preference</p>
            <p>Choose your meal</p>
          </span>
          <ChevronDown className={`transition-transform ${mealExpanded ? "rotate-180" : ""}`} />
        </div>

        {mealExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {mealOptions.map((meal) => (
              <div
                key={meal}
                className={`flex items-center justify-center border-[1px] rounded-xl p-3 cursor-pointer transition-all ${
                  selectedMeal === meal ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300"
                }`}
                onClick={() => setSelectedMeal(meal)}
              >
                <p className="text-sm">{meal}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra Baggage */}
      <div>
        <div className="flex justify-between cursor-pointer" onClick={() => setBaggageExpanded(!baggageExpanded)}>
          <span>
            <p className="font-bold">Extra Baggage</p>
            <p>Add extra baggage</p>
          </span>
          <ChevronDown className={`transition-transform ${baggageExpanded ? "rotate-180" : ""}`} />
        </div>

        {baggageExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {Object.keys(baggageOptions).map((baggageOption) => (
              <div
                key={baggageOption}
                className={`flex items-center justify-center border-[1px] rounded-xl p-3 cursor-pointer transition-all ${
                  selectedBaggage === baggageOption ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300"
                }`}
                onClick={() => handleBaggageSelection(baggageOption)}
              >
                <p className="text-sm">{baggageOption}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Special Assistance */}
      <div>
        <div className="flex justify-between cursor-pointer" onClick={() => setServiceExpanded(!serviceExpanded)}>
          <span>
            <p className="font-bold">Special Assistance</p>
            <p>Request assistance</p>
          </span>
          <ChevronDown className={`transition-transform ${serviceExpanded ? "rotate-180" : ""}`} />
        </div>

        {serviceExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-3">
            {serviceOptions.map((service) => (
              <div
                key={service}
                className={`flex items-center justify-center border-[1px] rounded-xl p-3 cursor-pointer transition-all ${
                  selectedService === service ? "border-blue-500 bg-blue-100 shadow-md" : "border-gray-300"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <p className="text-sm">{service}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Updated Price */}
      <div className="mt-3 font-semibold">Updated Price: ${updatedPrice.toFixed(2)}</div>
    </div>
  );
};

export default Preferences;
