import { SearchParams } from '@/types/searchtype';

const API_BASE_URL = process.env.API_BASE_URL

export const flightAPI = {
    getFlights: async (params?: SearchParams) => {
      try {
        const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/flights/`, {
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log('response:', response);


        return await response.json();
        // return await response.json();
      } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
      }
    }
};