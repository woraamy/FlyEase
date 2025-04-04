"use client";
import { useState, useEffect } from 'react';
import { getRecommendedDestinations, getAirports, matchRecommendationsWithAirports } from '@/app/actions';
import { RenderRow } from "@/components/RenderRow"; 
import { Recommendation } from '@/types/recommendation';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

  // Group recommendations by categories
  const topRated = [...recommendations].sort((a, b) => b.avg_rating - a.avg_rating);
  const mostPopular = [...recommendations].sort((a, b) => b.booking_count - a.booking_count);
  const recommended = [...recommendations].sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="space-y-10">
        <div>
          <Skeleton className="h-10 w-2/3 mb-6" />
          <div className="space-y-10">
            {[...Array(3)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="flex space-x-6 overflow-x-auto pb-4">
                  {[...Array(4)].map((_, cardIndex) => (
                    <Card key={cardIndex} className="w-64 flex-shrink-0">
                      <CardContent className="p-0">
                        <Skeleton className="h-40 w-full rounded-t-lg" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex justify-between items-center mt-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-500 text-lg">Error: {error}</div>
    </div>
  );

  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-8">Discover Your Next Destination</h1> */}
      <RenderRow title="Recommended For You" items={recommended} index={0} />
      <RenderRow title="Most Popular Destinations" items={mostPopular} index={1} />
      <RenderRow title="Highest Rated Destinations" items={topRated} index={2} />
    </div>
  );
}