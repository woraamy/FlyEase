"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFlightsByAirportCode, getAirports } from '@/app/actions';
import { Airport, Flight } from '@/types/flight';
import FlightCard from '@/components/FlightCard';
import Loading from '@/components/Loading';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft from lucide-react

interface AirportFlightsClientProps {
  code: string;
}

export default function AirportFlightsClient({ code }: AirportFlightsClientProps) {
  const router = useRouter();
  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      if (!code) return;
      
      const normalizedCode = code.toUpperCase();

      try {
        setLoading(true);
        
        // Fetch airports and flights in parallel
        const [airportsData, flightsData] = await Promise.all([
          getAirports(),
          getFlightsByAirportCode(normalizedCode)
        ]);
        
        console.log("Airports data:", airportsData);
        console.log("Raw flights data:", flightsData);
        
        if (!airportsData || airportsData.length === 0) {
          setError('Failed to load airports data');
          setLoading(false);
          return;
        }
        
        // Find the current airport
        const currentAirport = airportsData.find(a => a.code.toUpperCase() === normalizedCode);
        if (!currentAirport) {
          setError(`Airport with code ${code} not found`);
          setLoading(false);
          return;
        }
        
        setAirport(currentAirport);
        
        // Filter out any empty flight objects
        const validFlights = Array.isArray(flightsData) 
          ? flightsData.filter(flight => flight && Object.keys(flight).length > 0)
          : [];
        
        console.log(`Found ${validFlights.length} valid flights`);
        
        if (validFlights.length === 0) {
          setFlights([]);
          setLoading(false);
          return;
        }
        
        // Enhance flights with duration if needed
        const enhancedFlights = validFlights.map((flight) => {
          // Calculate flight duration if not already present
          if (!flight.duration) {
            const departureTime = new Date(flight.departure_time);
            const arrivalTime = new Date(flight.arrival_time);
            const durationMs = arrivalTime.getTime() - departureTime.getTime();
            const durationMinutes = Math.floor(durationMs / 60000);
            const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
            return {
              ...flight,
              duration: duration,
              image: flight.featured_image || "/images/default-flight.jpg"
            };
          }
          return flight;
        });
        
        // Filter out flights with missing airport data
        const completeFlights = enhancedFlights.filter(
          flight => flight.departure_airport && flight.arrival_airport
        );
        
        console.log(`Found ${completeFlights.length} complete flights out of ${enhancedFlights.length} total`);
        
        setFlights(completeFlights);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError('Failed to load flights');
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
        <ArrowLeft className="h-5 w-5" /> {/* Using Lucide React ArrowLeft icon */}
        Back
      </button>
      
      <div className="mb-8">
        <div className="relative h-64 w-full rounded-lg overflow-hidden">
          <img 
            src={airport.image || "/images/default-airport.jpg"} 
            alt={airport.name}
            className="object-cover w-full h-full"
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
            <FlightCard key={flight.id.toString()} flight={flight as any} />
          ))}
        </div>
      )}
    </div>
  );
}