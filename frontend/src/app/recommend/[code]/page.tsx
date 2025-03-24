
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFlightsByAirportCode, getAirports } from '@/app/action';
import { Airport, Flight } from '@/types/flight';
import Image from 'next/image';
import FlightCard from '@/components/FlightCard';
import Loading from '@/components/Loading';

export default function AirportFlights() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      if (!code) return;
      
      try {
        setLoading(true);
        
        const [flightsData, airportsData] = await Promise.all([
          getFlightsByAirportCode(code),
          getAirports()
        ]);
        
        // Enhance flight data with airport information
        const enhancedFlights = flightsData.map((flight: Flight) => {
          const departureAirport = airportsData.find(a => a.id === flight.departure_airport_id);
          const arrivalAirport = airportsData.find(a => a.id === flight.arrival_airport_id);
          
          // Calculate flight duration
          const departureTime = new Date(flight.departure_time);
          const arrivalTime = new Date(flight.arrival_time);
          const durationMs = arrivalTime.getTime() - departureTime.getTime();
          const durationMinutes = Math.floor(durationMs / 60000);
          const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
          
          return {
            ...flight,
            departure_airport: departureAirport || null,
            arrival_airport: arrivalAirport || null,
            duration: duration,
            image: flight.image || "/images/default-flight.jpg" // Provide a default image path
          };
        });
        
        setFlights(enhancedFlights);
        setAirports(airportsData);
        
        const currentAirport = airportsData.find(a => a.code === code);
        setAirport(currentAirport || null);
      } catch (err) {
        setError('Failed to load flights');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [code]);
  
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!airport) return <div className="p-4">Airport not found</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      
      <div className="mb-8">
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <Image 
            src={airport.image} 
            alt={airport.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold">{airport.name} ({airport.code})</h1>
              <p className="text-xl">{airport.city}, {airport.country}</p>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Flights to and from {airport.code}</h2>
      
      {flights.length === 0 ? (
        <p className="text-gray-600">No flights found for this airport.</p>
      ) : (
        <div className="grid gap-6">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}

