export interface SearchParams {
    departure_airport_city?: string;
    arrival_airport_city?: string;
    departure_time?: string;
    arrival_time?: string;
    travel_class_name?: string;
  }

export interface Airport {
    id: number | string;
    code: string;
    name: string;
    city: string;
    country: string;
    image?: string;
}
  
export interface Flight {
    id: number | string;
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