import React, { useState, useEffect } from "react";
import Seat from "./Seat";

interface SeatMapProps {
  flightData: any;
  reservedSeats: string[];
}

const SeatMap: React.FC<SeatMapProps> = ({ flightData, reservedSeats }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  return (
    <div className="space-y-4">
      {flightData.aircraft.classes.map((cls: any) => (
        <div key={cls.travel_class} className="mb-4">
          <h3 className="text-lg font-bold">{cls.travel_class} Class</h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: cls.total_rows }).map((_, row) =>
              ["A", "B", "C", "D", "E", "F"].slice(0, cls.total_columns).map((col) => {
                const seatId = `${col}${row + 1}`;
                return (
                  <Seat
                    key={seatId}
                    seatId={seatId}
                    isReserved={reservedSeats.includes(seatId)}
                    isSelected={selectedSeats.includes(seatId)}
                    onSelect={toggleSeat}
                  />
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatMap;
