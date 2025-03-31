"use server"
import { auth } from "@clerk/nextjs/server";
import { SearchParams } from '@/types/searchtype';
import { Airport, Recommendation, RecommendationRequest, Flight, RecommendedDestination} from '@/types/flight';
import { ApiResponse } from '@/types/chatbot';
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

export async function sendMessage(query: string, messages: any[] = [], sessionId?: string) {
  try {
    const response = await fetch(`${API_BASE_URL_CHAT_BOT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        messages,
        session_id: sessionId  // Include session ID if available
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we have a response even if the backend fails
    if (!data.response) {
      data.response = "Sorry, I couldn't process your request at this time.";
    }
    
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    // Return a fallback response object instead of throwing
    return {
      response: "Sorry, I couldn't connect to the backend service. Please check if the server is running.",
      context: [],
      search_results: [],
      session_id: sessionId
    };
  }
}

export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL_CHAT_BOT}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}