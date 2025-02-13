const API_BASE_URL = process.env.API_BASE_URL

export const flightAPI = {
    getFlightById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/flights/${id}`);
      console.log(id)
      return res.json();
    },
  };
  