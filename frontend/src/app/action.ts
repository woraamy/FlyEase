"use server"
import { auth } from "@clerk/nextjs/server";
import { SearchParams } from '@/types/searchtype';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api' ;

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
    const response = await fetch(`${API_BASE_URL}/flights/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('Error loading flight:', error);
    return null;
  }
}