// components/SeatMapPopup.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose // Import DialogClose for the Cancel button
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const seatClasses = {
  first: { color: "bg-emerald-500", rows: [1, 2, 3, 4, 5] },
  business: { color: "bg-blue-600", rows: [6, 7, 8, 9, 10] },
  economy: { color: "bg-blue-500", rows: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
};
const seats = ["A", "B", "C", "D", "E", "F"];
const exitRows = [16, 27]; 

interface SeatMapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSeatSelect: (seatId: string | null) => void; 
  reservedSeats: string[];
  initialSelectedSeat: string | null;
  flightClass: 'first' | 'business' | 'economy'; 
}

export default function SeatMapPopup({
  isOpen,
  onClose,
  onSeatSelect,
  reservedSeats = [],
  initialSelectedSeat,
  flightClass
}: SeatMapPopupProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSelectedSeat);

  useEffect(() => {
    setSelectedSeat(initialSelectedSeat);
  }, [initialSelectedSeat, isOpen]);

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

  const getSeatColor = (row: number) => {
    if (seatClasses.first.rows.includes(row)) return "bg-[#69347E]";
    if (seatClasses.business.rows.includes(row)) return "bg-[#523E8C]";
    return "bg-blue-500";
  };

   const getClassRows = () => {
    switch (flightClass) {
      case 'first': return seatClasses.first.rows;
      case 'business': return seatClasses.business.rows;
      case 'economy': return seatClasses.economy.rows;
      default: return []; 
    }
  };
  const visibleRows = getClassRows();
  const allRows = Array.from({ length: 30 }, (_, i) => i + 1); 

  
  const shouldRenderSeat = (row: number) => !exitRows.includes(row);

  const renderSeat = (row: number, seat: string) => {
    
    if (!shouldRenderSeat(row)) {
      return <div key={`${row}${seat}`} className="w-8 h-8 m-1"></div>;
    }

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
            `${getSeatColor(row)} text-white hover:opacity-80 cursor-pointer`}
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
           {/* Legend */}
          <div className="flex gap-4 text-sm pt-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${getSeatColor(visibleRows[0] ?? 11)} rounded mr-2`}></div>
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

        {/* Seat Map Grid */}
        <div className="overflow-x-auto pb-4 max-h-[60vh] overflow-y-auto">
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

        
            <div className="flex flex-col">
              {allRows.map(row => {
                
                if (!visibleRows.includes(row)) {
                    return null;
                }

                return (
                  <div key={row} className="flex items-center mb-1">
                    <div className="w-8 flex items-center justify-center font-bold text-sm pr-2">
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

            
          </div>
        </div>

        <DialogFooter className="sm:justify-between items-center">
           <div>
                {selectedSeat ? (
                    <p>Selected Seat: <Badge variant="outline" className="text-lg">{selectedSeat}</Badge></p>
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