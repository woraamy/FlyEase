"use server"
import { auth } from "@clerk/nextjs/server";
import { SearchParams } from '@/types/searchtype';
import { Airport, Recommendation, RecommendationRequest, Flight, RecommendedDestination} from '@/types/flight';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE_URL_AIRPORTS = process.env.NEXT_PUBLIC_API_BASE_URL_AIRPORTS;

const API_BASE_URL_TRAVEL_PLANS = process.env.NEXT_PUBLIC_API_BASE_URL_TRAVEL_PLANS;
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

export async function getFlightsByAirportCode(code: string) {
  try {
    console.log(`Fetching flights for airport code: ${code}`);
    const response = await axios.get(`${API_BASE_URL}/airport/${code}`);
    
    if (!response.data) {
      console.log(`No flights found for airport ${code} from API`);
      return [];
    }
    
    console.log(`Retrieved ${Array.isArray(response.data) ? response.data.length : 0} flights from API`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flights for airport ${code}:`, error);
    
    // Fallback: If the endpoint doesn't exist, we'll fetch all flights and filter client-side
    console.log("Attempting fallback: fetching all flights and filtering client-side");
    const allFlights = await getFlights();
    const airports = await getAirports();
    
    if (!allFlights || !airports) {
      console.error("Fallback failed: could not fetch flights or airports");
      return [];
    }
    
    // Find airport by code
    const airport = airports.find((airport: Airport) => airport.code === code);
    
    if (!airport) {
      console.error(`Airport with code ${code} not found`);
      return [];
    }
    
    console.log(`Found airport with code ${code}:`, airport);
    
    // Check the structure of the first flight
    if (!allFlights.length) {
      console.log("No flights available");
      return [];
    }
    
    const firstFlight = allFlights[0];
    console.log("First flight structure:", Object.keys(firstFlight));
    
    // Based on the logs, it seems flights already have departure_airport and arrival_airport objects
    // Filter flights that arrive at or depart from this airport based on the airport code
    const filteredFlights = allFlights.filter((flight: any) => {
      const departureMatch = flight.departure_airport && flight.departure_airport.code === code;
      const arrivalMatch = flight.arrival_airport && flight.arrival_airport.code === code;
      return departureMatch || arrivalMatch;
    });
    
    console.log(`Filtered ${filteredFlights.length} flights for airport ${code}`);
    return filteredFlights;
  }
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