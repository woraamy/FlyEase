"use client"

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
import { LoaderCircle } from "lucide-react";

// In SeatMapPopup.tsx
interface SeatMapPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSeatSelect: (seatId: string | null) => void; // Passes back "1A" format
  reservedSeats: string[]; // Expects ["A1", "B2"] format from parent
  initialSelectedSeat: string | null; // Expects "1A" format from parent
  flightClass: 'first' | 'business' | 'economy';
  flight_number: string;
  // Add the missing property:
  // reservedSeats: string[];
}

// Constants and Color definitions (remain the same)
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;
const AIRCRAFT_URL = process.env.NEXT_PUBLIC_AIRCRAFT_URL;
const EXIT_ROWS = [8, 15]; // Example
const SEAT_COLORS = { first: 'bg-purple-600 hover:bg-purple-700', business: 'bg-blue-600 hover:bg-blue-700', economy: 'bg-sky-500 hover:bg-sky-600', };
const LEGEND_COLORS = { first: 'bg-purple-600', business: 'bg-blue-600', economy: 'bg-sky-500', }
// ... (Env checks remain same) ...
if (!BOOKING_URL) throw new Error('Env BOOKING_URL is not defined');
if (!AIRCRAFT_URL) throw new Error('Env AIRCRAFT_URL is not defined');


export default function SeatMapPopup({
  isOpen,
  onClose,
  onSeatSelect,
  reservedSeats = [], // Default to empty array
  initialSelectedSeat,
  flightClass,
  flight_number
}: SeatMapPopupProps) {
  // Internal selectedSeat state uses "1A" format
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSelectedSeat);
  const [seatConfig, setSeatConfig] = useState<{ row_total: number; column_total: number; start_row: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Note: reservedSeats prop is now directly used, no internal state needed for it here

  useEffect(() => {
    // Update internal selection if initial prop changes
    setSelectedSeat(initialSelectedSeat);
  }, [initialSelectedSeat, isOpen]);

  // Fetch config data (reserved seats are now passed via props)
  useEffect(() => {
    if (isOpen && flight_number) {
      fetchSeatConfig(); // Only fetch config now
    } else if (!isOpen) {
      setSeatConfig(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, flight_number]);

  const fetchSeatConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const configResponse = await fetch(`${AIRCRAFT_URL}/aircraft/layout/${flight_number}`);
      if (!configResponse.ok) throw new Error(`Failed to fetch seat config: ${configResponse.statusText}`);
      const seatConfigMap = await configResponse.json();
      if (!seatConfigMap || !seatConfigMap[flightClass]) throw new Error(`Seat configuration not found for class: ${flightClass}`);
      setSeatConfig(seatConfigMap[flightClass]);
    } catch (err) {
      console.error("Error fetching seat config:", err);
      setError(err instanceof Error ? err.message : "Failed to load seat configuration.");
      setSeatConfig(null);
    } finally {
      setIsLoading(false);
    }
  };

  // toggleSeat uses internal format "1A"
  const toggleSeat = (seatIdInternal: string) => {
     // --- Check reservation using the API format ---
     const seatLetter = seatIdInternal.slice(-1); // Get last char (letter)
     const rowNum = seatIdInternal.slice(0, -1); // Get chars before last (row)
     const seatIdApiFormat = `${seatLetter}${rowNum}`; // Construct "A1" format

     if (reservedSeats.includes(seatIdApiFormat)) return; // Check using API format
     // --- End reservation check ---

    setSelectedSeat(prev => prev === seatIdInternal ? null : seatIdInternal);
  };

  // handleConfirm passes back internal format "1A"
  const handleConfirm = () => {
    onSeatSelect(selectedSeat);
    onClose();
  };

  const getSeatLabel = (index: number): string => String.fromCharCode(65 + index);
  const getSeatColorClass = () => SEAT_COLORS[flightClass] || 'bg-gray-500 hover:bg-gray-600';
  const getLegendColorClass = () => LEGEND_COLORS[flightClass] || 'bg-gray-500';

  // --- renderSeat ---
  const renderSeat = (row: number, seatLetter: string) => {
    // Internal format for state, keys, selection, toggling
    const seatIdInternal = `${row}${seatLetter}`;
    // API format for checking reservation status from props
    const seatIdApiFormat = `${seatLetter}${row}`;

    // --- Check reservation using the API format ---
    const isReserved = reservedSeats.includes(seatIdApiFormat);
    // --- Selection uses internal format ---
    const isSelected = selectedSeat === seatIdInternal;
    const availableSeatColor = getSeatColorClass();

    return (
      <div
        key={seatIdInternal} // Use internal format for key
        className={`
          w-7 h-7 m-1 rounded flex items-center justify-center text-xs font-medium cursor-pointer
          transition-all duration-150 ease-in-out transform hover:scale-105
          ${isReserved ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' :
            isSelected ? 'bg-green-500 text-white ring-2 ring-green-300 ring-offset-1 scale-105 shadow-md' :
            `${availableSeatColor} text-white`}
        `}
        // Pass internal format to toggleSeat
        onClick={() => toggleSeat(seatIdInternal)}
        title={`Seat ${seatIdInternal}`}
        role="button"
        aria-pressed={isSelected}
        aria-label={`Seat ${seatIdInternal}${isReserved ? ' (Reserved)' : isSelected ? ' (Selected)' : ' (Available)'}`}
      >
        {seatLetter}
      </div>
    );
  };

  // Rows and columns generation (remains same)
  const rows = seatConfig ? Array.from({ length: seatConfig.row_total }, (_, i) => i + seatConfig.start_row) : [];
  const columns = seatConfig ? Array.from({ length: seatConfig.column_total }, (_, i) => getSeatLabel(i)) : [];
  const halfColumns = seatConfig ? Math.ceil(seatConfig.column_total / 2) : 0;

  // --- RETURN JSX (Structure remains the same) ---
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
           <DialogTitle>Select Your Seat ({flightClass.charAt(0).toUpperCase() + flightClass.slice(1)} Class)</DialogTitle>
           {/* Legend */}
           <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm pt-2"> <div className="flex items-center"> <div className={`w-4 h-4 ${getLegendColorClass()} rounded mr-1.5`}></div> <span>Available</span> </div> <div className="flex items-center"> <div className="w-4 h-4 bg-green-500 rounded mr-1.5"></div> <span>Selected</span> </div> <div className="flex items-center"> <div className="w-4 h-4 bg-gray-300 rounded mr-1.5"></div> <span>Reserved</span> </div> </div>
        </DialogHeader>

        {/* Centered Seat Map Area */}
        <div className="mt-4 text-center overflow-x-auto pb-4 max-h-[60vh] overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-40"><LoaderCircle className="h-6 w-6 animate-spin text-primary"/></div>}
          {error && <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200">{error}</div>}

          {!isLoading && !error && seatConfig && (
             <div className="inline-block text-left bg-gray-50 p-4 rounded-lg border">
                {/* Column Labels */}
                <div className="flex mb-2"> <div className="w-8 flex-shrink-0"></div> <div className="flex flex-1 justify-around"> {columns.slice(0, halfColumns).map(seat => ( <div key={`top-${seat}`} className="w-7 flex items-center justify-center text-xs font-bold text-gray-500">{seat}</div> ))} </div> <div className="w-8 flex-shrink-0"></div> <div className="flex flex-1 justify-around"> {columns.slice(halfColumns).map(seat => ( <div key={`top-${seat}`} className="w-7 flex items-center justify-center text-xs font-bold text-gray-500">{seat}</div> ))} </div> </div>
               {/* Seat Rows */}
               <div className="flex flex-col">
                 {rows.map(row => (
                   EXIT_ROWS.includes(row) ? ( <div key={`exit-${row}`} className="flex items-center h-10 my-1 bg-yellow-100 border-y border-yellow-300 rounded"> <div className="w-8 flex items-center justify-center font-bold text-sm text-yellow-700">{row}</div> <div className="flex-1 text-center font-semibold text-yellow-800 text-xs tracking-wider">E X I T</div> <div className="w-8"></div> </div> ) : ( <div key={row} className="flex items-center mb-0.5"> <div className="w-8 flex items-center justify-center font-bold text-sm pr-2 text-gray-600 flex-shrink-0">{row}</div> <div className="flex flex-1 justify-start">{columns.slice(0, halfColumns).map(seat => renderSeat(row, seat))}</div> <div className="w-8 flex-shrink-0"></div> <div className="flex flex-1 justify-start">{columns.slice(halfColumns).map(seat => renderSeat(row, seat))}</div> </div> )
                 ))}
               </div>
             </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between items-center mt-4">
           {/* Footer content remains same */}
            <div> {selectedSeat ? ( <div className="flex items-center gap-2"> <span className="text-sm">Selected Seat:</span> <Badge variant="outline" className="text-base px-2.5 py-0.5">{selectedSeat}</Badge> </div> ) : ( <p className="text-sm text-muted-foreground">No seat selected</p> )} </div> <div> <DialogClose asChild><Button type="button" variant="secondary" className="mr-2">Cancel</Button></DialogClose> <Button type="button" onClick={handleConfirm} disabled={!selectedSeat || (selectedSeat === initialSelectedSeat && selectedSeat !== null)}>Confirm Selection</Button> </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}