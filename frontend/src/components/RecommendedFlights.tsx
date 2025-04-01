"use client";
import { useState, useEffect, useRef } from 'react';
import { getRecommendedDestinations, getAirports, matchRecommendationsWithAirports } from '@/app/action';
import AirportCard from '../components/AirportCard';
import { Airport } from '@/types/flight';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SyncLoader from "react-spinners/SyncLoader";

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
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const scroll = (direction: 'left' | 'right', index: number) => {
    const container = scrollContainerRefs.current[index];
    if (container) {
      // Width of card (272px) + gap (now 24px)
      const scrollAmount = 296;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Group recommendations by categories
  const topRated = [...recommendations].sort((a, b) => b.avg_rating - a.avg_rating);
  const mostPopular = [...recommendations].sort((a, b) => b.booking_count - a.booking_count);
  const recommended = [...recommendations].sort((a, b) => b.score - a.score);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <SyncLoader color="#3B82F6" size={15} margin={2} />
    </div>
  );
  
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded">Error: {error}</div>;

  const renderRow = (title: string, items: Recommendation[], index: number) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative group">
        <button 
          onClick={() => scroll('left', index)} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div 
          ref={(el) => scrollContainerRefs.current[index] = el} 
          className="flex overflow-x-auto pb-4 scrollbar-hide space-x-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((rec, itemIndex) => (
            rec.airportDetails && (
              <div 
                key={`${rec.airportDetails.code}-${itemIndex}`} 
                className="flex-none" 
                style={{ width: '272px' }}
              >
                <AirportCard
                  code={rec.airportDetails.code}
                  name={rec.airportDetails.name}
                  city={rec.airportDetails.city}
                  country={rec.airportDetails.country}
                  image={rec.airportDetails.image}
                  score={rec.score}
                />
              </div>
            )
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right', index)} 
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-10">Discover Your Next Destination</h1>
      
      {renderRow("Recommended For You", recommended, 0)}
      {renderRow("Most Popular Destinations", mostPopular, 1)}
      {renderRow("Highest Rated Destinations", topRated, 2)}
    </div>
  );
}