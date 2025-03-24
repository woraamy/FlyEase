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