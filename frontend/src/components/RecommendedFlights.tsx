// // components/RecommendedFlights.tsx
// "use client"

// import { useState, useEffect } from 'react';
// import FlightCard from '@/components/FlightCard';
// import { Flight } from '@/types/searchtype';
// import { getRecommendations } from '@/app/action';

// export default function RecommendedFlights() {
//     const [recommendedFlights, setRecommendedFlights] = useState<Flight[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
  
//     useEffect(() => {
//       async function loadRecommendedFlights() {
//         try {
//           setLoading(true);
          
//           // 1. Get recommendations from your recommendation service
//           const recommendations = await getRecommendations();
          
//           // 2. Extract airport codes from recommendations
//           const airportCodes = recommendations.map(rec => rec.destination);
          
//           if (airportCodes.length === 0) {
//             setRecommendedFlights([]);
//             return;
//           }
          
//           // 3. Use your existing search endpoint with airport codes as parameters
//           const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
          
//           // Create a query string with all airport codes
//           const queryParams = new URLSearchParams();
//           airportCodes.forEach(code => {
//             queryParams.append('airport_code', code);
//           });
          
//           const response = await fetch(`${API_BASE_URL}/search/?${queryParams.toString()}`);
          
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to fetch recommended flights: ${errorText}`);
//           }
          
//           const flights = await response.json();
//           setRecommendedFlights(flights);
//         } catch (err) {
//           setError(err instanceof Error ? err.message : 'Failed to load recommended flights');
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       }
  
//       loadRecommendedFlights();
//     }, []);

//   if (loading) return <div className="container mx-auto p-4">Loading recommended flights...</div>;
//   if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
//   if (recommendedFlights.length === 0) return <div className="container mx-auto p-4">No recommended flights found</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Recommended Flights</h2>
//       <div className="grid grid-cols-1 gap-6">
//         {recommendedFlights.map((flight) => (
//           <FlightCard key={flight.id} flight={flight} />
//         ))}
//       </div>
//     </div>
//   );
// }

// components/RecommendedFlights.tsx
// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getRecommendedDestinations, getAirports, matchRecommendationsWithAirports } from '@/app/action';
import AirportCard from '../components/AirportCard';
import { Airport } from '@/types/flight';
interface Recommendation {
  airportDetails: Airport | null;
  avg_rating: number;
  booking_count: number;
  destination: string;
  popularity_score: number;
  score: number;
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Default preferences (can be customized via form)
        const preferences = {
          wants_extra_baggage: 10,
          wants_preferred_seat: 20,
          wants_in_flight_meals: 30,
          num_passengers: 50,
          length_of_stay: 10
        };
        
        const [recommendationsData, airportsData] = await Promise.all([
          getRecommendedDestinations(preferences),
          getAirports()
        ]);
        
        const matchedRecommendations = await matchRecommendationsWithAirports(
          recommendationsData,
          airportsData
        );
        
        setRecommendations(matchedRecommendations);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recommended Destinations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          rec.airportDetails && (
            <AirportCard
              key={rec.airportDetails.code}
              code={rec.airportDetails.code}
              name={rec.airportDetails.name}
              city={rec.airportDetails.city}
              country={rec.airportDetails.country}
              image={rec.airportDetails.image}
              score={rec.score}
            />
          )
        ))}
      </div>
    </div>
  );
}