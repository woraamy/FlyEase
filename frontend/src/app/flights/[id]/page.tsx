"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { 
  Plane, Clock, Wifi, Tv, UtensilsCrossed, Star, LoaderCircle 
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
        <p className="text-3xl font-semibold text-center">Flight Booking Details</p>
        {/* Container for cards and button */}
        <div className="flex justify-between items-center space-x-4">
          {/* Cards */}
          <div className="grid grid-cols-4 gap-4 w-full">
            {[
              { name: "Alaska Airlines", icon: Apple },
              { name: "Delta Airlines", icon: Apple },
              { name: "United Airlines", icon: Apple },
              { name: "American Airlines", icon: Apple },
            ].map((_, index) => (
              <div key={index} className="flex items-center space-x-2 border-[1px] rounded-xl p-3">
                <Apple />
                <span className="flex flex-col">
                  <p className="text-xs">Airline</p>
                  <p className="text-sm">Alaska Airline</p>
                </span>
              </div>
            ))}
          </div>

          {/* Button */}
          <Button className="bg-green-500 text-white font-semibold px-4 py-5 h-full rounded-xl hover:bg-green-600">
            Process to Payment
          </Button>
        </div>
      </div>
      <Separator className="m-4" />
      {/* Passenger Detail */}
      <div className="flex flex-col">
        <p className="text-2xl font-semibold pb-6">Passenger Detail</p>
        <div className="flex items-center space-x-3">
          <Avatar className="h-[100px] w-[100px]">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="w-full">
            <p className="text-sm">Full Name</p>
            <div className="text-gray-400 bg-gray-200 p-2 rounded-2xl">e.g. Elara Kinsley</div>
          </span>
        </div>
      </div>
      <Separator className="m-4" />
      {/* Additonal Services */}
      <div className="pb-3 space-y-4">
        <p className="text-xl font-semibold">Additional Services</p>
        {/* Services List */}
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <Switch id="something" />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <Switch id="something" />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <Switch id="something" />
        </div>
        <div className="flex justify-between">
          <span>
            <p className="font-bold">Seat Preference</p>
            <p>Select your preferred seat</p>
          </span>
          <Switch id="something" />
        </div>
      </div>
      <Separator className="m-8" />
      {/* Passenger Information */}
      <div>
        <p className="text-xl font-semibold pb-4">Passenger Information</p>
        <div className="grid grid-cols-2 gap-4">
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
          </span>
          <span className="space-y-2">
            <p className="font-semibold">Age</p>
            <Input className="text-gray-600 bg-gray-200 rounded-xl" type="email" placeholder="Email" />
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