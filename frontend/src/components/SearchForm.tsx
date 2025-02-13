// import { Calendar, Users, ChevronDown, Search } from "lucide-react";

// const SearchForm = () => {
//   return (
//     <div className="max-w-4xl mx-auto -mt-20 relative z-20 px-6">
//       <div className="bg-white rounded-lg shadow-xl p-6">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-brand-text">
//           Book Your Flight
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-600">Date</label>
//             <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
//               <Calendar className="w-5 h-5 text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Select Date"
//                 className="outline-none w-full text-sm"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-600">Passengers</label>
//             <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
//               <Users className="w-5 h-5 text-gray-400 mr-2" />
//               <select className="outline-none w-full text-sm bg-transparent">
//                 <option>1 Adult</option>
//                 <option>2 Adults</option>
//                 <option>3 Adults</option>
//               </select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-600">Class</label>
//             <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
//               <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
//               <select className="outline-none w-full text-sm bg-transparent">
//                 <option>Economy</option>
//                 <option>Business</option>
//                 <option>First Class</option>
//               </select>
//             </div>
//           </div>

//           {/* Search Button Styled as an Input */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-600 invisible">Search</label>
//             <button className="flex items-center border bg-[#3A7853] border rounded-md p-3 bg-brand-primary text-white hover:bg-opacity-90 transition-colors w-full">
//               <Search className="w-5 h-5 text-white mr-2" />
//               Search Flights
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchForm;

"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Users, ChevronDown, Search, Plane, PlaneLanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { searchFlights} from "@/app/action";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchForm = () => {
  const [departureCity, setDepartureCity] = useState<string>("");
  const [arrivalCity, setArrivalCity] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [travelClass, setTravelClass] = useState<string>("Economy");

  // React Query
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ["flights", departureCity, arrivalCity, departureDate, arrivalDate, travelClass],
    queryFn: () =>
      searchFlights({
        departure_airport_city: departureCity,
        arrival_airport_city: arrivalCity,
        departure_time: departureDate ? format(departureDate, "yyyy-MM-dd") : "",
        arrival_time: arrivalDate ? format(arrivalDate, "yyyy-MM-dd") : "",
        travel_class_name: travelClass,
      }),
    enabled: false, // ✅ Prevent auto-fetching
  });

  // Function to trigger search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Fetching flights...");
    await refetch(); // ✅ Manually trigger query
  };


  // Sample cities - replace with your actual city data
  const cities = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Dubai",
    "Singapore",
    "Hong Kong",
  ];

  return (
    <div className="max-w-6xl mx-auto -mt-20 relative z-20 px-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-brand-text">
          Book Your Flight
        </h2>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Departure City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">From</label>
              <Select value={departureCity} onValueChange={setDepartureCity}>
                <SelectTrigger className="w-full">
                  <Plane className="w-5 h-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Departure City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrival City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">To</label>
              <Select value={arrivalCity} onValueChange={setArrivalCity}>
                <SelectTrigger className="w-full">
                  <PlaneLanding className="w-5 h-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Arrival City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Departure</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !departureDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    {departureDate ? format(departureDate, "MMM dd, yyyy") : <span>Departure Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Arrival Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Return</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !arrivalDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    {arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : <span>Return Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={setArrivalDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Travel Class */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Class</label>
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger className="w-full">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 invisible">
                Search
              </label>
              <Button
                type="submit"
                className="w-full bg-[#3A7853] hover:bg-opacity-90 text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Results Section */}
        <div className="mt-6">
          {isLoading && <p>Loading flights...</p>}
          {error && (
            <p className="text-red-500">Error fetching flights: {error.message}</p>
          )}
          {data && (
            <div>
              <h3 className="text-lg font-semibold">Available Flights:</h3>
              <pre className="bg-gray-100 p-4 rounded-md mt-2">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;