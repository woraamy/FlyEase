// app/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FlightSeatReservation() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [flightClass, setFlightClass] = useState<string>("economy");
  
  // Define seat classes and their colors
  const seatClasses = {
    first: { color: "bg-emerald-500", rows: [1, 2, 3, 4, 5] },
    business: { color: "bg-blue-600", rows: [6, 7, 8, 9, 10] },
    economy: { color: "bg-blue-500", rows: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
  };
  
  // Some already reserved seats
  const reservedSeats = ["1C", "2A", "3F", "7B", "7E", "10A", "10F", "15E", "18A", "23D", "26F"];
  
  const seats = ["A", "B", "C", "D", "E", "F"];
  // Define exit rows - these won't have seats
  const exitRows = [16, 27];

  const toggleSeat = (seat: string) => {
    if (reservedSeats.includes(seat)) return;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatColor = (row: number) => {
    if (seatClasses.first.rows.includes(row)) return "bg-emerald-500";
    if (seatClasses.business.rows.includes(row)) return "bg-blue-600";
    return "bg-blue-500";
  };

  const getTotalPrice = () => {
    let total = 0;
    selectedSeats.forEach(seat => {
      const row = parseInt(seat.slice(0, -1));
      if (seatClasses.first.rows.includes(row)) total += 350;
      else if (seatClasses.business.rows.includes(row)) total += 250;
      else total += 150;
    });
    return total;
  };

  // Check if we should render a seat or an exit space
  const shouldRenderSeat = (row: number) => {
    return !exitRows.includes(row);
  };

  const renderSeat = (row: number, seat: string) => {
    // If this is an exit row, don't render the seat
    if (!shouldRenderSeat(row)) {
      return <div key={`${row}${seat}`} className="w-8 h-8 m-1"></div>;
    }

    const seatId = `${row}${seat}`;
    const isReserved = reservedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <div 
        key={seatId}
        className={`
          w-8 h-8 m-1 rounded-t-lg flex items-center justify-center text-xs font-medium cursor-pointer
          ${isReserved ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
            isSelected ? 'bg-green-500 text-white' : 
            `${getSeatColor(row)} text-white hover:opacity-80`}
          transition-all
        `}
        onClick={() => toggleSeat(seatId)}
      >
        {seat}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Flight Seat Reservation</CardTitle>
          <CardDescription>
            Select your preferred seats for flight AC123
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex gap-4 mb-6">
                  <Select value={flightClass} onValueChange={setFlightClass}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Class</SelectItem>
                      <SelectItem value="business">Business Class</SelectItem>
                      <SelectItem value="economy">Economy Class</SelectItem>
                    </SelectContent>
                  </Select>
          
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pb-4">
                  <div className="inline-block">
                    {/* Seat labels at top */}
                    <div className="flex mb-2 pl-8">
                      <div className="flex-1 flex">
                        {seats.slice(0, 3).map(seat => (
                          <div key={`top-${seat}`} className="w-8 h-8 m-1 flex items-center justify-center text-xs font-bold">
                            {seat}
                          </div>
                        ))}
                      </div>
                      <div className="w-8"></div>
                      <div className="flex-1 flex">
                        {seats.slice(3).map(seat => (
                          <div key={`top-${seat}`} className="w-8 h-8 m-1 flex items-center justify-center text-xs font-bold">
                            {seat}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aircraft shape for the top */}
                    <div className="relative w-full h-16 flex justify-center">
                      <div className="absolute w-40 h-16 bg-blue-100 rounded-t-full"></div>
                    </div>

                    {/* Seat grid */}
                    <div className="flex flex-col">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(row => {
                        // Only show rows for the selected class
                        if (
                          (flightClass === "first" && row > seatClasses.first.rows[seatClasses.first.rows.length - 1]) ||
                          (flightClass === "business" && !seatClasses.business.rows.includes(row)) ||
                          (flightClass === "economy" && row < seatClasses.economy.rows[0])
                        ) {
                          return null;
                        }

                        return (
                          <div key={row} className="flex items-center mb-1">
                            <div className="w-8 flex items-center justify-center font-bold text-sm">
                              {row}
                            </div>
                            
                            {/* Left side seats */}
                            <div className="flex-1 flex">
                              {seats.slice(0, 3).map(seat => renderSeat(row, seat))}
                            </div>
                            
                            {/* Center aisle with EXIT sign */}
                            <div className="w-8 flex items-center justify-center">
                              {exitRows.includes(row) && (
                                <div className="text-xs font-bold text-red-500">EXIT</div>
                              )}
                            </div>
                            
                            {/* Right side seats */}
                            <div className="flex-1 flex">
                              {seats.slice(3).map(seat => renderSeat(row, seat))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Aircraft shape for the bottom */}
                    <div className="relative w-full h-24 flex justify-center">
                      <div className="absolute w-48 h-24 bg-blue-100 rounded-b-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-72">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Your Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Selected Seats</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSeats.length > 0 ? (
                          selectedSeats.sort().map(seat => (
                            <Badge key={seat} variant="outline" className="text-sm">
                              {seat}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No seats selected</p>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex justify-between">
                        <span className="text-sm">Selected:</span>
                        <span className="text-sm">{selectedSeats.length} seat(s)</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2">
                        <span>Total Price:</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={selectedSeats.length === 0}
                  >
                    Confirm Reservation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}