"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { 
  Plane, Wifi, Tv, UtensilsCrossed, Star, LoaderCircle, PlaneTakeoff, PlaneLanding, CalendarArrowUp, CalendarArrowDown, ChevronDown
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { flightAPI } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: { code: string; name: string; city: string };
  arrival_airport: { code: string; name: string; city: string};
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

const passengerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female", "prefer_not_to_say"]),
  contactNumber: z
    .string()
    .regex(/^\+\d{7,15}$/, "Invalid phone number. Example: +123456789"),
  email: z.string().email("Invalid email address"),
  passportNumber: z.string().min(6, "Invalid passport number"),
  nationality: z.string().min(3, "Nationality must be valid"),
});

type PassengerFormData = z.infer<typeof passengerSchema>;

export default function FlightDetailsPage() {
  const { id: flightId } = useParams<{ id: string }>(); 
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seatExpanded, setSeatExpanded] = useState(false);
  const [mealExpanded, setMealExpanded] = useState(false);
  const [serviceExpanded, setServiceExpanded] = useState(false);
  const [baggageExpanded, setBaggageExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
  });

  const onSubmit = (data: PassengerFormData) => {
    console.log("Valid Data Submitted:", data);
  };

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
        <h1 className="text-xl text-center">from {flight.departure_airport.city} to {flight.arrival_airport.city}</h1>
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
              <p className="font-bold">Extra Baggage</p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("firstName")} placeholder="e.g. John" />
              {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("lastName")} placeholder="e.g. Doe" />
              {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label>Age</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" type="number" {...register("age", { valueAsNumber: true })} placeholder="e.g. 29" />
              {errors.age && <p className="text-red-500">{errors.age.message}</p>}
            </div>
            <div>
              <Label>Gender</Label>
              <select {...register("gender")} className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer Not To Say</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("contactNumber")} placeholder="e.g. +123456789" />
              {errors.contactNumber && <p className="text-red-500">{errors.contactNumber.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("email")} type="email" placeholder="e.g. johndoe@gmail.com" />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Passport Number</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("passportNumber")} placeholder="e.g. X12345678" />
              {errors.passportNumber && <p className="text-red-500">{errors.passportNumber.message}</p>}
            </div>
            <div>
              <Label>Nationality</Label>
              <Input className="text-gray-600 bg-[#E9F1ED] rounded-xl p-2 w-full" {...register("nationality")} placeholder="e.g. American" />
              {errors.nationality && <p className="text-red-500">{errors.nationality.message}</p>}
            </div>
            <Separator className="col-span-2 my-4" />
            <div className="col-span-2 flex space-x-4">
              <Button type="submit">Save Details</Button>
              <Button type="button">Cancel</Button>
            </div>
          </form>
        <Separator className="m-8" />
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