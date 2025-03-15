const API_BASE_URL = process.env.API_BASE_URL

export const flightAPI = {
    getFlightById: async (id: number) => {
      console.log(typeof id)
      console.log("fetching ja")
      const res = await fetch(`http://localhost:8000/api/flights/${id}`);
      // const data = await res.json()
      console.log("fetch laew")
      console.log(res)
      return res;
    },
  };
  