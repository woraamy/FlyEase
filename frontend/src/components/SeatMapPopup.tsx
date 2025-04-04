"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SeatMapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSeatSelect: (seatId: string | null) => void;
  initialSelectedSeat: string | null;
  flightClass: 'first' | 'business' | 'economy';
  flight_number: string;
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;
const AIRCRAFT_URL = process.env.NEXT_PUBLIC_AIRCRAFT_URL;

if (!BOOKING_URL) {
  throw new Error('Env BOOKING_URL is not defined');
}
if (!AIRCRAFT_URL) {
  throw new Error('Env AIRCRAFT_URL is not defined');
}

export default function SeatMapPopup({
  isOpen,
  onClose,
  onSeatSelect,
  initialSelectedSeat,
  flightClass,
  flight_number
}: SeatMapPopupProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSelectedSeat);
  const [seatConfig, setSeatConfig] = useState<{ row_total: number; column_total: number , start_row: number}>();
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSeat(initialSelectedSeat);
  }, [initialSelectedSeat, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchSeatConfig();
      fetchReservedSeats();
    }
  }, [isOpen]);

  const fetchSeatConfig = async () => {
    // Replace with actual API call
    const response = await fetch(`${AIRCRAFT_URL}/aircraft/layout/${flight_number}`);
    const seatConfigMap =  await response.json();
    setSeatConfig(seatConfigMap[flightClass]);

  };

  const fetchReservedSeats = async () => {
    // Replace with actual API call
    const response = await fetch(`${BOOKING_URL}/booking/reserved-seats/${flight_number}`);
    const data = await response.json();
    setReservedSeats(data);
  }; 

  const toggleSeat = (seatId: string) => {
    if (reservedSeats.includes(seatId)) return;

    if (selectedSeat === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatId);
    }
  };

  const handleConfirm = () => {
    onSeatSelect(selectedSeat);
    onClose();
  };

  const getSeatLabel = (index: number) => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return labels[index] || '';
  };

  if (!seatConfig) {
    return null; // or a loading spinner
  }

  const rows = Array.from({ length: seatConfig.row_total }, (_, i) => i + seatConfig.start_row);
  const columns = Array.from({ length: seatConfig.column_total }, (_, i) => getSeatLabel(i));
  const halfColumns = Math.ceil(columns.length / 2);

  const renderSeat = (row: number, seat: string) => {
    const seatId = `${row}${seat}`;
    const isReserved = reservedSeats.includes(seatId);
    const isSelected = selectedSeat === seatId;

    return (
      <div
        key={seatId}
        className={`
          w-8 h-8 m-1 rounded-t-lg flex items-center justify-center text-xs font-medium
          ${isReserved ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
            isSelected ? 'bg-green-500 text-white ring-2 ring-green-700 ring-offset-1' :
              'bg-blue-500 text-white hover:opacity-80 cursor-pointer'}
          transition-all
        `}
        onClick={() => toggleSeat(seatId)}
      >
        {seat}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Your Seat ({flightClass.charAt(0).toUpperCase() + flightClass.slice(1)} Class)</DialogTitle>
          <div className="flex gap-4 text-sm pt-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span>Reserved</span>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-x-auto pb-4 max-h-[60vh] overflow-y-auto">
          <div className="inline-block">
            <div className="flex mb-2 pl-8">
              {/* {columns.map(seat => (
                <div key={`top-${seat}`} className="w-8 h-8 m-1 flex items-center justify-center text-xs font-bold">
                  {seat}
                </div>
              ))} */}
            </div>

            <div className="flex flex-col">
              {rows.map(row => (
                <div key={row} className="flex items-center mb-1">
                  <div className="w-8 flex items-center justify-center font-bold text-sm pr-2">
                    {row}
                  </div>
                  {/* Left side seats */}
                  <div className="flex-1 flex">
                    {columns.slice(0, halfColumns).map(seat => renderSeat(row, seat))}
                  </div>

                  {/* Center aisle for walking path */}
                  <div className="w-8 flex items-center justify-center"></div>

                  {/* Right side seats */}
                  <div className="flex-1 flex">
                    {columns.slice(halfColumns).map(seat => renderSeat(row, seat))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between items-center">
          <div>
            {selectedSeat ? (
              <div className="flex items-center gap-2">
                <span>Selected Seat:</span>
                <Badge variant="outline" className="text-lg">{selectedSeat}</Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No seat selected</p>
            )}
          </div>
          <div>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirm} disabled={!selectedSeat && !!initialSelectedSeat}>
              Confirm Selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
