import { Airport } from '@/types/flight';

export interface Recommendation {
  airportDetails: Airport | null;
  avg_rating: number;
  booking_count: number;
  destination: string;
  popularity_score: number;
  score: number;
}