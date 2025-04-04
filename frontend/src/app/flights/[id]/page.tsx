"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  Plane, Wifi, Tv, UtensilsCrossed, Star, LoaderCircle, PlaneTakeoff, PlaneLanding, CalendarArrowUp, CalendarArrowDown, Armchair
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, SignInButton } from "@clerk/nextjs";

import { flightAPI } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import EmbeddedCheckoutForm from "@/components/EmbeddedCheckoutForm";
import Preferences from "@/components/PreferencesCard";
import SeatMapPopup from "@/components/SeatMapPopup";
import { Badge } from "@/components/ui/badge";

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: { code: string; name: string; city: string };
  arrival_airport: { code: string; name: string; city: string };
  departure_time: string;
  arrival_time: string;
  // explicitly define base_price as potentially string from API
  base_price: number | string;
  available_seats: number;
  rating: number;
  featured_image: string;
  has_wifi: boolean;
  has_entertainment: boolean;
  has_meals: boolean;
}

const AIRCRAFT_URL = process.env.NEXT_PUBLIC_AIRCRAFT_URL;
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

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

type FlightSeatClass = 'first' | 'business' | 'economy';
type SeatClassDisplayName = "First Class" | "Business Class" | "Economy Class";


export default function FlightDetailsPage() {
  const { id: flightId } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, userId } = useAuth();

  const [selectedSeatClass, setSelectedSeatClass] = useState<SeatClassDisplayName>("Economy Class");
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState("Standard Meal");
  const [selectedBaggage, setSelectedBaggage] = useState("No Extra Baggage");
  const [selectedService, setSelectedService] = useState("No Assistance");
  const [updatedPrice, setUpdatedPrice] = useState<number | undefined>(undefined);

  const [passengerData, setPassengerData] = useState<PassengerFormData>({
    firstName: "", lastName: "", age: 0, gender: "prefer_not_to_say",
    contactNumber: "", email: "", passportNumber: "", nationality: ""
  });

  const [reservedSeats, setReservedSeats] = useState<string[]>([]);

  const openSeatMapHandler = () => setIsSeatMapOpen(true);

  // Helper to safely get base price as a number
  const getBasePriceAsNumber = (): number => {
    if (!flight) return 0;
    // Use parseFloat for potentially string values, default to 0 if invalid
    const price = parseFloat(String(flight.base_price));
    return isNaN(price) ? 0 : price;
  };


  const handleSeatClassChange = (seat: { name: SeatClassDisplayName; multiplier: number }) => {
    setSelectedSeatClass(seat.name);
    setSelectedSeatId(null);
    if (flight) {
      const baggagePrice = getBaggagePrice(selectedBaggage);
      // FIX: Use helper function for base price
      setUpdatedPrice(getBasePriceAsNumber() * seat.multiplier + baggagePrice);
    }
  };

  const handleSeatIdSelect = (seatId: string | null) => {
    setSelectedSeatId(seatId);
    setIsSeatMapOpen(false);
  };

  const getSeatClassMultiplier = (seatClassName: SeatClassDisplayName): number => {
    const seatMap = {
      "First Class": 2,
      "Business Class": 1.75,
      "Premium Economy Class": 1.5,
      "Economy Class": 1
    };
    return seatMap[seatClassName] || 1;
  };

  const getBaggagePrice = (baggageName: string): number => {
    const baggageOptions = {
      "No Extra Baggage": 0,
      "1 Extra Bag (23kg)": 50,
      "2 Extra Bags (23kg each)": 120,
    };
    return baggageOptions[baggageName as keyof typeof baggageOptions] || 0;
  };

  const handleBaggageSelection = (baggage: { name: string; price: number }) => {
    setSelectedBaggage(baggage.name);
    if (flight) {
      const seatMultiplier = getSeatClassMultiplier(selectedSeatClass);
      setUpdatedPrice(getBasePriceAsNumber() * seatMultiplier + baggage.price);
    }
  };

  const mapDisplayNameToInternalClass = (displayName: SeatClassDisplayName): FlightSeatClass => {
    switch (displayName) {
      case "First Class": return "first";
      case "Business Class": return "business";
      case "Economy Class":
      default: return "economy";
    }
  };

  const handleMealSelection = (meal: string) => setSelectedMeal(meal);
  const handleServiceSelection = (service: string) => setSelectedService(service);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues: passengerData,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setPassengerData(prev => ({ ...prev, ...value as PassengerFormData }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: PassengerFormData) => {
    console.log("Valid Data Submitted:", data);
    setPassengerData(data);
  };

  useEffect(() => {
    if (!flightId) {
      setError("Flight ID is missing.");
      setLoading(false);
      return;
    }

    async function fetchFlight() {
      setLoading(true);
      setError(null);
      try {
        console.log(`Workspaceing flight with ID: ${flightId}`);
        const res = await flightAPI.getFlightById(Number(flightId));

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const errorText = await res.text();
          console.error("Non-JSON Response:", errorText);
          throw new Error(`Invalid API response. Expected JSON but received ${contentType}.`);
        }

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Flight not found or empty response.");
        }

        // Ensure base_price is treated correctly before setting state
        const fetchedFlightData: Flight = {
          ...data,
          base_price: data.base_price
        };
        setFlight(fetchedFlightData);

        const basePriceNum = parseFloat(String(data.base_price));
        if (isNaN(basePriceNum)) {
          console.error("Fetched base_price is not a valid number:", data.base_price);
          throw new Error("Invalid base price received from API.");
        }

        const initialMultiplier = getSeatClassMultiplier("Economy Class");
        const initialBaggagePrice = getBaggagePrice(selectedBaggage);
        setUpdatedPrice(basePriceNum * initialMultiplier + initialBaggagePrice);

      } catch (err) {
        console.error("Error fetching flight:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred during flight fetch.");
        }
        setFlight(null); // Clear flight data on error
        setUpdatedPrice(undefined); // Clear price
      } finally {
        setLoading(false);
      }
    }

    fetchFlight();
  }, [flightId]);


  useEffect(() => {
    if (!flight || !flight.flight_number) {
      if (!flight) setReservedSeats([]);
      return;
    }

    const mockReservedSeats: string[] = [
      "1A", "3F",
      "6C", "8B", "10E",
      "12A", "15D", "15E", "18F", "21C", "25A", "29B"
    ];
    setReservedSeats(mockReservedSeats);
    setLoading(false);
    console.log("Mock reserved seats set:", mockReservedSeats);

    async function fetchReservedSeats() {
      setLoading(true);
      try {
        console.log(`Workspaceing reserved seats for flight: ${flight?.flight_number}`);
        const reservedRes = await fetch(`${BOOKING_URL}/booking/reserved-seats/${flight?.flight_number}`);

        if (!reservedRes.ok) {
          throw new Error(`API Error fetching reserved seats: ${reservedRes.status} ${reservedRes.statusText}`);
        }
        const contentType = reservedRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const errorText = await reservedRes.text();
          console.error("Non-JSON Response (Reserved Seats):", errorText);
          throw new Error(`Invalid API response for reserved seats.`);
        }
        const reservedJson = await reservedRes.json();
        if (Array.isArray(reservedJson)) {
          const seats = reservedJson
            .map((s: any) => s?.seat_number)
            .filter((seat): seat is string => typeof seat === 'string' && seat.length > 0);
          setReservedSeats(seats);
          console.log("Reserved seats fetched:", seats);
        } else {
          console.warn("Unexpected format for reserved seats response:", reservedJson);
          setReservedSeats([]);
          setError(prev => prev ? `${prev}\nCould not parse reserved seats.` : "Could not parse reserved seats.");
        }
      } catch (err) {
        console.error("Error fetching reserved seats:", err);
        setError(prev => prev ? `${prev}\n${err instanceof Error ? err.message : "Failed to fetch reserved seats."}` : (err instanceof Error ? err.message : "Failed to fetch reserved seats."));
        setReservedSeats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReservedSeats();

  }, [flight]);


  // --- Loading/Error/Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!loading && !flight && error) { // Specific condition for flight load failure
    return (
      <div className="text-center text-red-600 min-h-screen flex items-center justify-center p-4">
        <p className="text-lg font-semibold">Error loading flight details: {error}</p>
      </div>
    );
  }

  if (!flight) { // Fallback if loading is done, no error set, but flight is still null
    return (
      <div className="text-center text-gray-600 min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Flight data could not be loaded. Please try again later.</p>
      </div>
    );
  }

  // Calculate final total price safely
  // FIX: Use helper function for base price in fallback calculation
  const basePriceNumber = getBasePriceAsNumber();
  const currentPrice = updatedPrice ?? (basePriceNumber * getSeatClassMultiplier(selectedSeatClass) + getBaggagePrice(selectedBaggage));
  const tax = currentPrice * 0.1;
  const totalPrice = currentPrice + tax;

  return (
    <div className="flex flex-col lg:flex-row px-4 sm:px-6 py-4 gap-6">
      {/* Left Column */}
      <div className="flex-[3] space-y-6 p-4 border rounded-lg shadow-sm bg-white">
        {/* ... (Header, Flight Info Cards, Services remain the same) ... */}
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <p className="text-2xl md:text-3xl font-semibold text-center">Flight Details</p>
          <h1 className="text-lg md:text-xl text-center text-gray-700">From {flight.departure_airport.city} to {flight.arrival_airport.city}</h1>
          <p className="text-sm flex items-center justify-center"><Star className="text-yellow-500 mr-1 h-4 w-4" /> Ratings {flight.rating} / 5</p>
          {flight.featured_image && (
            <img
              src={flight.featured_image}
              alt={`Flight ${flight.flight_number} route`}
              className="w-full h-64 md:h-96 object-cover mt-4 rounded-lg shadow"
            />
          )}
          {/* Flight Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-4">
            {[
              { Icon: Plane, label: "Flight Number", value: flight.flight_number },
              { Icon: CalendarArrowUp, label: "Departure Time", value: format(new Date(flight.departure_time), "PPpp") },
              { Icon: CalendarArrowDown, label: "Arrival Time", value: format(new Date(flight.arrival_time), "PPpp") },
              { Icon: PlaneTakeoff, label: "Departure Airport", value: `${flight.departure_airport.name} (${flight.departure_airport.code})` },
              { Icon: PlaneLanding, label: "Arrival Airport", value: `${flight.arrival_airport.name} (${flight.arrival_airport.code})` },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center space-x-2 border rounded-lg p-3 text-sm bg-gray-50">
                <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="flex flex-col">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium">{value}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        {/* Services */}
        <div className="flex flex-col">
          <p className="text-xl font-semibold pb-4">Services on Flight</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {!flight.has_wifi && !flight.has_entertainment && !flight.has_meals && (
              <p className="text-gray-500 col-span-full">No special services listed for this flight.</p>
            )}
            {flight.has_wifi && <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200"><Wifi className="text-green-700 h-5 w-5" /><span>In-Flight WiFi</span></div>}
            {flight.has_entertainment && <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200"><Tv className="text-blue-700 h-5 w-5" /><span>In-Flight Entertainment</span></div>}
            {flight.has_meals && <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg border border-orange-200"><UtensilsCrossed className="text-orange-700 h-5 w-5" /><span>Complimentary Meal</span></div>}
          </div>
        </div>
        <Separator />

        {/* Preferences Component & Seat Selection Trigger */}
        <div>
          <Preferences
            // Handler for CLASS selection change
            onSeatClassChange={handleSeatClassChange}
            // Handler to open the SEAT MAP
            onOpenSeatMap={openSeatMapHandler} // The function you created: () => setIsSeatMapOpen(true)
            // Other handlers
            onMealChange={handleMealSelection}
            onBaggageChange={handleBaggageSelection}
            onServiceChange={handleServiceSelection}
            // Selected states
            selectedSeatClass={selectedSeatClass} // Pass the CLASS name
            selectedSeatId={selectedSeatId}     // Pass the specific SEAT ID
            selectedMeal={selectedMeal}
            selectedBaggage={selectedBaggage}
            selectedService={selectedService}
          />
          <div className="mt-4 pl-4">
            <Label className="text-md font-semibold">Seat Assignment</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsSeatMapOpen(true)}
                className="flex items-center gap-2"
              >
                <Armchair className="h-5 w-5" />
                {selectedSeatId ? `Change Seat Selection` : "Select Specific Seat"}
              </Button>
              {selectedSeatId && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Seat: {selectedSeatId}
                </Badge>
              )}
              {!selectedSeatId && (
                <p className="text-sm text-muted-foreground">No specific seat selected yet.</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 pl-1">Select your preferred seat within the chosen {selectedSeatClass}.</p>
          </div>
        </div>
        <Separator />

        {/* ... (Passenger Information form remains the same) ... */}
        <div>
          <p className="text-xl font-semibold pb-4">Passenger Information</p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" className="text-gray-600 bg-[#E9F1ED]" {...register("firstName")} placeholder="e.g. John" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="text-gray-600 bg-[#E9F1ED]" {...register("lastName")} placeholder="e.g. Doe" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" className="text-gray-600 bg-[#E9F1ED]" type="number" {...register("age", { valueAsNumber: true })} placeholder="e.g. 29" />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" {...register("gender")} className="text-gray-600 bg-[#E9F1ED] rounded-md p-2 w-full border h-[40px]"> {/* Consistent height */}
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unidentify">Prefer Not To Say</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" className="text-gray-600 bg-[#E9F1ED]" {...register("contactNumber")} placeholder="e.g. +123456789" />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" className="text-gray-600 bg-[#E9F1ED]" {...register("email")} type="email" placeholder="e.g. johndoe@gmail.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input id="passportNumber" className="text-gray-600 bg-[#E9F1ED]" {...register("passportNumber")} placeholder="e.g. X12345678" />
              {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" className="text-gray-600 bg-[#E9F1ED]" {...register("nationality")} placeholder="e.g. American" />
              {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 flex space-x-4">
              <Button type="submit">Save Details</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column (Checkout) */}
      <div className="flex-[1] lg:sticky lg:top-6 h-fit">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Checkout Summary</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-2 text-sm">
            {/* Show specific fetch/parse errors */}
            {error && (
              <p className="text-red-500 text-xs mb-2 p-2 bg-red-50 border border-red-200 rounded">
                {error.includes("reserved seats") ? "Error fetching reserved seat data." : error}
              </p>
            )}
            {/* --- Price Breakdown --- */}
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span>${basePriceNumber.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seat Class ({selectedSeatClass}):</span>
              <span>+${(basePriceNumber * getSeatClassMultiplier(selectedSeatClass) - basePriceNumber).toFixed(2)}</span>
            </div>
            {selectedSeatId && (
              <div className="flex justify-between pl-4 text-xs">
                <span className="text-gray-500">Selected Seat:</span>
                <span className="font-medium">{selectedSeatId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Baggage ({selectedBaggage}):</span>
              <span>+${getBaggagePrice(selectedBaggage).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {/* --- End Price Breakdown --- */}

            {isSignedIn ? (
              <>
                <div className="mt-4">
                  {(!passengerData.firstName || !passengerData.lastName || !passengerData.email || !passengerData.contactNumber || !passengerData.passportNumber || !passengerData.nationality || passengerData.age <= 0) && (
                  <p className="text-amber-600 mb-2 text-center text-xs font-medium bg-amber-50 p-2 rounded border border-amber-200">
                    Please complete and save passenger details to proceed.
                  </p>
                  )}
                  {!selectedSeatId && (
                  <p className="text-red-500 text-xs mt-2 text-center">Please select a specific seat before checkout.</p>
                  )}
                  {passengerData.firstName && passengerData.lastName && passengerData.email && passengerData.contactNumber && passengerData.passportNumber && passengerData.nationality && passengerData.age > 0 && selectedSeatId && (
                  <EmbeddedCheckoutForm
                    clerkUserId={userId}
                    price={Math.round(totalPrice * 100)}
                    firstName={passengerData.firstName}
                    lastName={passengerData.lastName}
                    selectedSeatClass={selectedSeatClass}
                    selectedSeatId={selectedSeatId}
                    selectedMeal={selectedMeal}
                    selectedService={selectedService}
                    SelectedBaggage={selectedBaggage}
                    id={Number(flightId)}
                    flight_number={flight.flight_number}
                    age={passengerData.age}
                    gender={passengerData.gender}
                    contactNumber={passengerData.contactNumber}
                    email={passengerData.email}
                    passportNumber={passengerData.passportNumber}
                    nationality={passengerData.nationality}
                  />
                  )}
                </div>
              </>
            ) : (
              <div className="mt-4 text-center flex flex-col items-center gap-3 border-t pt-4">
                <p className="text-red-600 mb-2 font-medium">Please sign in to book your flight</p>
                <SignInButton mode="modal">
                  <Button className="w-full rounded-lg">Sign In & Checkout</Button>
                </SignInButton>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Render Seat Map Popup */}
      <SeatMapPopup
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        onSeatSelect={handleSeatIdSelect}
        reservedSeats={reservedSeats}
        initialSelectedSeat={selectedSeatId}
        flightClass={mapDisplayNameToInternalClass(selectedSeatClass)}
        flight_number={flight.flight_number}
      />

    </div>
  );
}