
const API_BASE_URL = "http://flight/flights";
// console.log(API_BASE_URL);
export const travelPlanAPI = {
    getTravelPlanById: async (id: string) => {
      const url = `${API_BASE_URL}/${id}`;
      const res = await fetch(url);
      
      return res;
    },
  };