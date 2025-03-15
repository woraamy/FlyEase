"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { 
  Plane, Clock, Wifi, Tv, UtensilsCrossed, Star, LoaderCircle, PlaneTakeoff, PlaneLanding, CalendarArrowUp, CalendarArrowDown, ChevronDown
} from "lucide-react";

import { flightAPI } from "./action";
import { Apple } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaChevronDown } from "react-icons/fa";

interface Flight {
  id: number;
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
  const [seatExpanded, setSeatExpanded] = useState(false);
  const [mealExpanded, setMealExpanded] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(false);
  const [baggageExpanded, setBaggageExpanded] = useState(false);

  useEffect(() => {
    if (!flightId) {
      setError("Flight ID is missing.");
      setLoading(false);
      return;
    }

    async function fetchFlight() {
      try {
        console.log(`Fetching flight with ID: ${flightId}`);

        
        const res = await flightAPI.getFlightById(Number(flightId));

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

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
    <div className="flex px-6 py-4">
    {/* Left */}
    <div className="flex-[3] items-center justify-center p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <p className="text-3xl font-semibold text-center">Flight Details</p>
        <h1 className="text-xl text-center">from {flight.departure_airport.name} to {flight.arrival_airport.name}</h1>
        <p className="text-sm flex items-center"><Star className="text-yellow-500 mr-1" /> Ratings {flight.rating} / 5</p>
        {/* Container for cards and button */}
        <img
            src={flight.featured_image}
            alt="Beach"
            className="w-full h-96 object-cover mt-6 rounded-lg"
          />
        <div className="flex justify-between items-center space-x-4">
          {/* Cards */}
          <div className="grid grid-cols-5 gap-4 w-full">
            {/* {[
              { name: "Alaska Airlines", icon: Apple },
              { name: "Delta Airlines", icon: Plane },
              { name: "United Airlines", icon: Apple },
              { name: "American Airlines", icon: Apple },
            ].map((_, index) => ( */}
              <div className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <Plane />
                <span className="flex flex-col">
                  <p className="text-xs">Flight Number</p>
                  <p className="text-sm">{flight.flight_number}</p>
                </span>
              </div>
              <div className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <CalendarArrowUp />
                <span className="flex flex-col">
                  <p className="text-xs">Departure Time</p>
                  <p className="text-sm">{format(new Date(flight.departure_time), "EE, MMMM d, yyyy h:mm a")}</p>
                </span>
              </div>
              <div className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <CalendarArrowDown />
                <span className="flex flex-col">
                  <p className="text-xs">Arrival Time</p>
                  <p className="text-sm">{format(new Date(flight.arrival_time), "EE, MMMM d, yyyy h:mm a")}</p>
                </span>
              </div>
              <div className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <PlaneTakeoff />
                <span className="flex flex-col">
                  <p className="text-xs">Departure Airport</p>
                  <p className="text-sm">{flight.departure_airport.name}</p>
                </span>
              </div>
              <div className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <PlaneLanding />
                <span className="flex flex-col">
                  <p className="text-xs">Arrival Airport</p>
                  <p className="text-sm">{flight.arrival_airport.name}</p>
                </span>
              </div>
            {/* ))} */}
          </div>
        </div>
      </div>
      <Separator className="m-4" />
      {/* Service on Flight */}
      {/* Services on Flight */}
      <div className="flex flex-col">
            <p className="text-2xl font-semibold pb-6">Services on Flight</p>
            <div className="grid grid-cols-3 gap-4">
              {flight.has_wifi && <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-xl"><Wifi className="text-green-700" /><span>In-Flight WiFi</span></div>}
              {flight.has_entertainment && <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-xl"><Tv className="text-green-700" /><span>In-Flight Entertainment</span></div>}
              {flight.has_meals && <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-xl">< UtensilsCrossed className="text-green-700" /><span>Complimentary Meal</span></div>}
            </div>
          </div>
      <Separator className="m-4" />
      {/* Additonal Services */}
      <div className="pb-3 space-y-4">
        <p className="text-xl font-semibold">Additional Services</p>
        {/* Services List */}
        {/* <ChevronDown className={`cursor-pointer transition-transform ${expanded ? "rotate-180" : ""}`} onClick={() => setExpanded(!expanded)} /> */}
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <ChevronDown id="seat preference" className={`cursor-pointer transition-transform ${seatExpanded ? "rotate-180" : ""}`} onClick={() => setSeatExpanded(!seatExpanded)} />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Meal Preference</p>
            <p>Choose your Meal</p>
          </span>
          <ChevronDown id="meal preference" className={`cursor-pointer transition-transform ${mealExpanded ? "rotate-180" : ""}`} onClick={() => setMealExpanded(!mealExpanded)} />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Extra Bagage</p>
            <p>Add extra baggage</p>
          </span>
          <ChevronDown id="seat preference" className={`cursor-pointer transition-transform ${baggageExpanded ? "rotate-180" : ""}`} onClick={() => setBaggageExpanded(!baggageExpanded)} />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Special Assistance</p>
            <p>Request Assistance</p>
          </span>
          <ChevronDown id="seat preference" className={`cursor-pointer transition-transform ${serviceExpanded ? "rotate-180" : ""}`} onClick={() => setServiceExpanded(!serviceExpanded)} />
        </div>
      </div>
      <Separator className="m-8" />
      {/* Passenger Information */}
      <div>
        <p className="text-xl font-semibold pb-4">Passenger Information</p>
        <div className="grid grid-cols-2 gap-4">
          <span className="space-y-2">
            <p className="font-semibold">First Name</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="firstName" placeholder="e.g. John" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Last Name</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="lastName" placeholder="e.g. Doe" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="age" placeholder="e.g. 29" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Gender</p>
            <select className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="prefer_not_to_say">Prefer Not To Say</option>
            </select>
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Contact Number</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="contactNumber" placeholder="e.g. +12345678" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Email</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="email" placeholder="e.g. johndoe@gmail.com" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Passport Number</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="passportNumber" placeholder="e.g. X12345678" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Nationality</p>
            <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl" type="nationality" placeholder="e.g. American" />
          </span>
        </div>
        <Separator className="m-8" />
      </div>
      {/* Buttons */}
      <div className="flex space-x-4">
        <Button>Save Details</Button>
        <Button>Cancle</Button>
      </div>
    </div>
    {/* Right */}
    <div className="flex-[1] justify-center p-5">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <span className="flex justify-between">
            <p className="text-gray-500">Subtotal</p>
            <p>100$</p>
          </span>
          <span className="flex justify-between">
            <p className="text-gray-500">Shipping</p>
            <p>100$</p>
          </span>
          <span className="flex justify-between">
            <p className="text-gray-500">Tax</p>
            <p>100$</p>
          </span>
          <span className="flex justify-between">
            <p className="text-gray-500">Total</p>
            <p className="font-bold">100$</p>
          </span>
          <Button className="w-full rounded-xl mt-3">Place order</Button>
        </CardContent>
        <Separator className="m-4" />
        <CardFooter className="flex justify-between pt-2">
          <span className="flex flex-col space-y-2">
            <Label htmlFor="email">Promo code</Label>
            <Input type="email" id="email" placeholder="Enter code" />
          </span>
          <Button>Apply</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
);
}