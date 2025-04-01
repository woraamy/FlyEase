"use client";
import { useState, useEffect, useRef } from 'react';
import { getRecommendedDestinations, getAirports, matchRecommendationsWithAirports } from '@/app/action';
import { Airport } from '@/types/flight';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

interface Recommendation {
  airportDetails: Airport | null;
  avg_rating: number;
  booking_count: number;
  destination: string;
  popularity_score: number;
  score: number;
}

// Enhanced AirportCard using shadcn/ui components
function EnhancedAirportCard({ 
  code, 
  name, 
  city, 
  country, 
  image, 
  score 
}: { 
  code: string;
  name: string;
  city: string;
  country: string;
  image?: string;
  score: number;
}) {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={image || "/images/default-airport.jpg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge className="absolute right-2 top-2 bg-blue-600">
          Score: {score.toFixed(1)}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{city}, {country}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/recommend/${code}`}>
            Explore Flights
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
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
    <div className="flex h-64 items-center justify-center">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="flex space-x-4">
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
          <Skeleton className="h-32 w-32" />
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="mx-auto my-8 max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <p className="font-medium">Error: {error}</p>
    </div>
  );

  const renderRow = (title: string, items: Recommendation[], index: number) => (
    <div className="mb-12">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="group relative">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll('left', index)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div 
          ref={(el) => { scrollContainerRefs.current[index] = el; }} 
          className="scrollbar-hide flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
        >
          {items.map((rec, itemIndex) => (
            rec.airportDetails && (
              <div 
                key={`${rec.airportDetails.code}-${itemIndex}`} 
                className="w-[272px] flex-none" 
              >
                <EnhancedAirportCard
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
        
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll('right', index)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-10 text-3xl font-bold">Discover Your Next Destination</h1>
      
      {renderRow("Recommended For You", recommended, 0)}
      {renderRow("Most Popular Destinations", mostPopular, 1)}
      {renderRow("Highest Rated Destinations", topRated, 2)}
    </div>
  );
}