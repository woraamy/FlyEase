"use server"

import { auth } from "@clerk/nextjs/server";
import { SearchParams } from '@/types/searchtype';
import { Airport, Recommendation, RecommendationRequest, Flight, RecommendedDestination} from '@/types/flight';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api' ;
const RECOMMENDATION_URL = process.env.RECOMMENDATION_URL || 'http://localhost:5000';


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

export async function getAirports(): Promise<Airport[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/airports/`);
    
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

export async function getAllFlights() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Allflights`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
}

export async function getFlightsByAirportCode(code: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/airport/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flights for airport ${code}:`, error);
    
    // Fallback: If the endpoint doesn't exist, we'll fetch all flights and filter client-side
    const allFlights = await getFlights();
    const airports = await getAirports();
    
    // Find airport ID by code
    const airport = airports.find((airport: Airport) => airport.code === code);
    
    if (!airport) {
      throw new Error(`Airport with code ${code} not found`);
    }
    
    // Filter flights that arrive at or depart from this airport
    return allFlights.filter((flight: Flight) => 
      flight.arrival_airport_id === airport.id || 
      flight.departure_airport_id === airport.id
    );
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

