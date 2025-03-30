
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_TRAVEL_PLANS;
// console.log(API_BASE_URL);
export const travelPlanAPI = {
    getTravelPlanById: async (id: string) => {
      const url = `${API_BASE_URL}/${id}`;
      const res = await fetch(url);
      
      return res;
    },
  };