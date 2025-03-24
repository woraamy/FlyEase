export interface Airport {
    id: string;
    code: string;
    name: string;
    city: string;
    country: string;
    image: string;
  }
  
  export interface Recommendation {
    destination: string;
    avg_rating: number;
    booking_count: number;
    popularity_score: number;
    score: number;
  }
  
  export interface EnrichedRecommendation extends Airport {
    score: number;
    popularity_score: number;
    avg_rating: number;
  }
  
  export interface FlightCardData {
    id: number;
    title: string;
    image: string;
    badge?: string;
  }

  export interface Flight {
    id: string;
    flight_number: string;
    departure_time: string;
    arrival_time: string;
    base_price: number;
    available_seats: number;
    rating: number;
    featured_image: string;
    image?: string;
    has_wifi: boolean;
    has_entertainment: boolean;
    has_meals: boolean;
    arrival_airport_id: string;
    departure_airport_id: string;
    departure_airport?: Airport | null;
    arrival_airport?: Airport | null;
  }

  export interface RecommendationRequest {
    wants_extra_baggage: number;
    wants_preferred_seat: number;
    wants_in_flight_meals: number;
    num_passengers: number;
    length_of_stay: number;
  }

  export interface RecommendedDestination {
    avg_rating: number;
    booking_count: number;
    destination: string;
    popularity_score: number;
    score: number;
  }