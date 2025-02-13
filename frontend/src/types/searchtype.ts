export interface SearchParams {
    from_city?: string;
    to_city?: string;
    min_price?: string;
    max_price?: string;
    min_rating?: string;
}

export interface Airport {
    id: number;
    code: string;
    name: string;
    city: string;
    country: string;
    image?: string;
}
  
export interface Flight {
    id: number;
    flight_number: string;
    departure_airport: Airport;
    arrival_airport: Airport;
    departure_time: string;
    arrival_time: string;
    base_price: number;
    available_seats: number;
    rating: number;
    featured_image: string;
    duration: string | null;
    image: string;
    has_wifi: boolean;
    has_meals: boolean;
    has_entertainment: boolean;
}