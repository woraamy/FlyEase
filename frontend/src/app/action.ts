"use server"
import { auth } from "@clerk/nextjs/server";
import { SearchParams } from '@/types/searchtype';
import { Airport, Recommendation, RecommendationRequest, Flight, RecommendedDestination} from '@/types/flight';
import { ApiResponse } from '@/types/chatbot';
import { PaginationResponse } from '@/types/flight';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE_URL_AIRPORTS = process.env.NEXT_PUBLIC_API_BASE_URL_AIRPORTS;

const API_BASE_URL_TRAVEL_PLANS = process.env.NEXT_PUBLIC_API_BASE_URL_TRAVEL_PLANS;

const API_BASE_URL_CHAT_BOT = process.env.NEXT_PUBLIC_API_BASE_URL_CHAT_BOT;
// export async function searchFlights(params: SearchParams) {
//   try {
//     // Filter the params to remove any null or empty values
//     const filteredParams = Object.fromEntries(
//       Object.entries(params).filter(([_, value]) => value != null && value !== "")
//     );

//     // Make the GET request using axiosInstance and pass the filtered parameters as query params
//     const { data } = await axiosInstance.get('/search', {
//       params: filteredParams, // Axios automatically serializes params into query string
//     });

//     return data;

//   } catch (error) {
//     console.error('Error searching flights:', error);
//     return [];
//   }
// }

export async function searchFlights(params: SearchParams) {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null && value !== "")
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    const response = await fetch(`${API_BASE_URL}/search/?${queryString}`, );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

// export async function searchFlights(params: SearchParams) {
//   try {
//     // Get the Clerk token
//     const { getToken } = await auth();
//     const token = await getToken(); // Retrieve the token from Clerk

//     // Filter out null or empty values from params
//     const filteredParams = Object.fromEntries(
//       Object.entries(params).filter(([_, value]) => value != null && value !== "")
//     );

//     // Create the query string from filtered parameters
//     const queryString = new URLSearchParams(filteredParams).toString();

//     // Set headers with Authorization Bearer token if available
//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//       ...(token ? { "Authorization": `Bearer ${token}` } : {}),
//     };

//     // Make the GET request with the headers
//     const response = await fetch(`${API_BASE_URL}/search/?${queryString}`, {
//       method: 'GET',
//       headers: headers, // Include the Authorization header
//     });

//     // Handle non-ok responses
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Parse and return the JSON response
//     return response.json();

//   } catch (error) {
//     console.error('Error searching flights:', error);
//     return [];
//   }
// }

export async function getFlights() {
  try {
    const response = await fetch(`${API_BASE_URL}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('Error loading flight:', error);
    return null;
  }
}

export async function getAirports(): Promise<Airport[]> {
  try {
    const response = await fetch(`${API_BASE_URL_AIRPORTS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
}

export async function getRecommendedDestinations(preferences: RecommendationRequest) {
  try {
    // Updated to use the Django Ninja API endpoint
    const response = await axios.post(`${API_BASE_URL}/recommend`, preferences);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

export async function getFlightsByAirportCode(airportCode: string): Promise<Flight[]> {
  // Normalize the airport code to uppercase
  const normalizedCode = airportCode.toUpperCase();

  // Replace with your actual API endpoint
  const response = await fetch(`${API_BASE_URL}/by-airport/${normalizedCode}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch flights for airport ${normalizedCode}: ${response.status}`);
  }

  return response.json();
}

export async function matchRecommendationsWithAirports(
  recommendations: RecommendedDestination[],
  airports: Airport[]
) {
  return recommendations.map(rec => {
    const airport = airports.find(airport => airport.code === rec.destination);
    return {
      ...rec,
      airportDetails: airport || null
    };
  }).filter(rec => rec.airportDetails !== null);

}


export async function getTravelPlans() {
  try {
    const response = await fetch(`${API_BASE_URL_TRAVEL_PLANS}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('Error loading flight:', error);
    return null;
  }
}


export async function getFlightByArrCity(arrivalCity: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/travel-rec/${arrivalCity}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error loading flights by arrival city:', error);
    return null;
  }
}

// export async function sendMessage(message: string, sessionId: string | null): Promise<ApiResponse> {
//   try {
//     // Use the correct endpoint structure for LangGraph
//     // For a new conversation without a thread ID
//     const endpoint = sessionId 
//       ? `http://127.0.0.1:2024/threads/${sessionId}/runs` 
//       : 'http://127.0.0.1:2024/runs';
    
//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         assistant_id: 'graph', // This should match the ID in your langgraph.json
//         input: {
//           query: message
//         },
//         stream_mode: 'updates'
//       }),
//     });
    
//     if (!response.ok) {
//       console.log(`Backend server responded with status: ${response.status}`);
//       throw new Error(`Failed to fetch from backend: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     return {
//       message: data.output?.response || data.output?.answer || "No response received",
//       sessionId: data.thread_id || sessionId || '',
//       contexts: data.output?.similar_contexts || [],
//       searchResults: data.output?.search_results || []
//     };
//   } catch (error) {
//     console.error('Error in chat action:', error);
//     return {
//       message: 'Sorry, I encountered an error processing your request. Please check if the backend server is running.',
//       sessionId: sessionId || '',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     };
//   }
// }

// export async function sendMessage(query: string, messages: any[] = [], sessionId?: string) {
//   try {
//     const response = await fetch(`${API_BASE_URL_CHAT_BOT}/api/chat`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         query,
//         messages,
//         session_id: sessionId  // Include session ID if available
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `API error: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Ensure we have a response even if the backend fails
//     if (!data.response) {
//       data.response = "Sorry, I couldn't process your request at this time.";
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error sending message:', error);
//     // Return a fallback response object instead of throwing
//     return {
//       response: "Sorry, I couldn't connect to the backend service. Please check if the server is running.",
//       context: [],
//       search_results: [],
//       session_id: sessionId
//     };
//   }
// }

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL_CHAT_BOT}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}


export const fetchQuery = async (query: string, sessionId: string | undefined) => {
  try {
    const response = await fetch('http://localhost:8000/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id: sessionId || undefined })
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error: Could not process your request');
  }
};


// import { PaginationResponse } from "@/types/flight";

// export async function fetchFlights(page: number, pageSize: number = 5): Promise<PaginationResponse> {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/?page=${page}&pageSize=${pageSize}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       cache: 'no-store',
//     });
    
//     if (!response.ok) {
//       throw new Error(`API error with status: ${response.status}`);
//     }
    
//     const data: PaginationResponse = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching flights:", error);
//     // Return default empty state that matches the expected type
//     return {
//       data: [],
//       pagination: {
//         page: page,
//         total: 0,
//         pageSize: pageSize
//       }
//     };
//   }
// }


interface BookingFlight {
  id: number;
  flight_number: string;
  departure_airport: Airport;
  arrival_airport: Airport;
  departure_time: string;
  arrival_time: string;
  base_price: string;
  available_seats: number;
  rating: number;
  featured_image: string;
  has_wifi: boolean;
  has_entertainment: boolean;
  has_meals: boolean;
  travel_classes: Array<{
    id: number;
    name: string;
    price_multiplier: string;
  }>;
  class_details: Array<{
    id: number;
    available_seats: number;
  }>;
}

interface Passenger {
  id: number;
  first_name: string;
  last_name: string;
  passport: string;
  email: string;
  phone: string;
  nationality: string;
  age: number;
  Gender: string;
}

interface Booking {
  id: number;
  flight_number: string;
  seat_id: string;
  seat_class: string;
  booking_code: string;
  clerkId: string;
  status: string;
  created_at: string;
  selected_meal: string;
  selected_service: string;
  selected_baggage: string;
  passenger: Passenger;
}

export interface BookingCardData {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  departureCountry: string;
  departureAirport: string;
  arrivalCity: string;
  arrivalCountry: string;
  arrivalAirport: string;
  seatNumber: string;
  status: "checked-in" | "waiting for check-in";
  bookingCode: string;
}

export async function getFlightByNumber(flightNumber: string): Promise<BookingFlight | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/by-number/${flightNumber}`;
  // console.log(`Fetching flight from: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    console.log(`Flight API response status: ${response.status}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Flight ${flightNumber} not found`);
        return null;
      }
      throw new Error(`Failed to fetch flight: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Flight data received:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching flight ${flightNumber}:`, error);
    return null;
  }
}

export async function getUserBookings(): Promise<Booking[]> {
  const { userId } = await auth();
  console.log(`User ID from auth: ${userId}`);
  if (!userId) {
    console.log("No user ID found");
    return [];
  }

  const bookingUrl = `${process.env.NEXT_PUBLIC_BOOKING_URL}/booking/mybook`;
  // console.log(`Fetching bookings from: ${bookingUrl} for user: ${userId}`);
  
  try {
    const response = await fetch(bookingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerkUserId: userId }),
      cache: 'no-store'
    });

    console.log(`Booking API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Bookings received:`, data);
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
}

export async function getBookingsWithFlightDetails(): Promise<BookingCardData[]> {
  // console.log("Starting to fetch bookings with flight details");
  const bookings = await getUserBookings();
  
  if (!bookings || !bookings.length) {
    console.log("No bookings found");
    return [];
  }

  console.log(`Found ${bookings.length} bookings, fetching flight details`);
  
  const bookingsWithDetails = await Promise.all(
    bookings.map(async (booking) => {
      // console.log(`Processing booking for flight: ${booking.flight_number}`);
      const flight = await getFlightByNumber(booking.flight_number);
      
      if (!flight) {
        // console.log(`No flight details found for ${booking.flight_number}`);
        return null;
      }

      // Format dates
      const departureDate = new Date(flight.departure_time);
      const arrivalDate = new Date(flight.arrival_time);
      
      const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      const bookingData = {
        id: booking.id,
        name: `${booking.passenger.first_name} ${booking.passenger.last_name}`,
        departureTime: formatDate(departureDate),
        arrivalTime: formatDate(arrivalDate),
        departureCity: flight.departure_airport.city,
        departureCountry: flight.departure_airport.country,
        departureAirport: flight.departure_airport.name,
        arrivalCity: flight.arrival_airport.city,
        arrivalCountry: flight.arrival_airport.country,
        arrivalAirport: flight.arrival_airport.name,
        seatNumber: booking.seat_id,
        qrCodeUrl: `/api/qrcode?code=${booking.booking_code}`, // Assuming you have a QR code API
        status: booking.status === "CONFIRMED" ? "checked-in" : "waiting for check-in",
        bookingCode: booking.booking_code
      };
      
      console.log(`Successfully mapped booking data:`, bookingData);
      return bookingData;
    })
  );

  // Filter out null values (flights that couldn't be found)
  const validBookings = bookingsWithDetails.filter(Boolean) as BookingCardData[];
  console.log(`Returning ${validBookings.length} valid bookings with flight details`);
  return validBookings;
}