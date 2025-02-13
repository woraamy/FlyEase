'use client';

import { useState } from 'react';
import FlightCard from './FlightCard';
import { Flight } from '@/types/searchtype';

interface FlightListProps {
  initialFlights: Flight[];
}

export default function FlightList({ initialFlights }: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>(initialFlights);

  return (
    <div className="flex flex-col gap-8">
        {flights.map((flight, index) => (
        <FlightCard key={flight.id || index} flight={flight} />
        ))}
    </div>
  );
}