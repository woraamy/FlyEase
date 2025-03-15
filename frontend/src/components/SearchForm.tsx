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
import FlightList from '@/components/FlightList';

const SearchForm = () => {
  const [departureCity, setDepartureCity] = useState<string>("");
  const [arrivalCity, setArrivalCity] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [travelClass, setTravelClass] = useState<string>("");

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
    enabled: false,
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
    "Los Angeles",
    "Sydney",
    "Frankfurt",
    "Miami"
  ];

  return (
    <div className="max-w-6xl mx-auto -mt-20 relative z-20 px-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-brand-text">
          Book Your Flight
        </h2>
        {/* Departure City */}
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Departure City */}
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-700">From</label>
              <Select value={departureCity} onValueChange={setDepartureCity}>
                <SelectTrigger className="w-full h-14 rounded-2xl border-gray-200">
                  <Plane className="w-6 h-6 text-gray-400 mr-2" />
                  <SelectValue placeholder="Department City" />
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
              <label className="text-base font-medium text-gray-700">To</label>
              <Select value={arrivalCity} onValueChange={setArrivalCity}>
                <SelectTrigger className="w-full h-14 rounded-2xl border-gray-200">
                  <PlaneLanding className="w-6 h-6 text-gray-400 mr-2" />
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
              <label className="text-base font-medium text-gray-700">Departure</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full h-14 rounded-2xl border-gray-200 justify-start text-left font-normal ${
                      !departureDate && "text-gray-500"
                    }`}
                  >
                    <CalendarIcon className="w-6 h-6 text-gray-400 mr-2" />
                    {departureDate ? format(departureDate, "MMM dd, yyyy") : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Arrival Date */}
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-700">Return</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full h-14 rounded-2xl border-gray-200 justify-start text-left font-normal ${
                      !arrivalDate && "text-gray-500"
                    }`}
                  >
                    <CalendarIcon className="w-6 h-6 text-gray-400 mr-2" />
                    {arrivalDate ? format(arrivalDate, "MMM dd, yyyy") : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={arrivalDate} onSelect={setArrivalDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            {/* Class */}
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-700">Class</label>
              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger className="w-full h-14 rounded-2xl border-gray-200">
                  <Users className="w-6 h-6 text-gray-400 mr-2" />
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
              <label className="text-base font-medium text-gray-700 invisible">Search</label>
              <Button
                type="submit"
                className="w-full h-14 bg-[#3A7853] hover:bg-opacity-90 text-white rounded-2xl flex items-center justify-center gap-2 px-4 text-base font-medium whitespace-nowrap overflow-hidden"
              >
                <Search className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Search</span>
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
                <FlightList initialFlights={data} />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;

