// const API_BASE_URL = process.env.API_BASE_URL; // || 'http://localhost:3000/flights/[id]' ;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// console.log(API_BASE_URL);
export const flightAPI = {
    getFlightById: async (id: number) => {
      const url = `${API_BASE_URL}/${id}`;
      const res = await fetch(url);
      return res;
    },
  };