import React from "react";

interface SeatProps {
  seatId: string;
  isReserved: boolean;
  isSelected: boolean;
  onSelect: (seatId: string) => void;
}

const Seat: React.FC<SeatProps> = ({ seatId, isReserved, isSelected, onSelect }) => {
  return (
    <div
      className={`w-8 h-8 m-1 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer
        ${isReserved ? "bg-gray-300 text-gray-500 cursor-not-allowed" : 
          isSelected ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:opacity-80"}
      `}
      onClick={() => !isReserved && onSelect(seatId)}
    >
      {seatId.slice(-1)}
    </div>
  );
};

export default Seat;
