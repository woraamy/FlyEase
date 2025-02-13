// app/action.ts
import { SearchParams } from '@/types/searchtype';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api' ;

export async function searchFlights(params: SearchParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/flights?${new URLSearchParams(params as Record<string, string>)}/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response.json())
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