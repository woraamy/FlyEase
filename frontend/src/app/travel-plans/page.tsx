import Image from "next/image";
import { TravelPlanCard } from "@/components/TravelPlanCard";
// Removed unused import: import mockTravelPlans from "@/data/mockTravelPlan.json"
import { getTravelPlans } from "../action"; // Assuming this action exists and works

// Define a type for the plan object for better type safety
interface Plan {
  _id: string;
  header_topic: string;
  departure_country: string;
  arrival_city: string;
  arrival_country: string;
  introduction: string;
  header_img: string;
}

export default async function TravelPlansPage() {
  let initialTravelPlans: Plan[] = []; // Use the Plan interface
  let fetchError: string | null = null;

  try {
    initialTravelPlans = await getTravelPlans();
  } catch (error) {
    console.error('Error loading travel plans:', error);
    fetchError = "Could not load travel plans at this time. Please try again later.";
    // In a real app, you might want to log this error more robustly
  }

  return (
    <main className="min-h-screen bg-gray-50"> {/* Changed bg slightly */}
      {/* Hero Banner */}
      <div className="relative h-[450px] w-full"> {/* Slightly taller */}
        <Image
          src="/images/travel-plan-bg.jpeg" // Ensure this image exists
          alt="Scenic view representing travel planning" // More descriptive alt
          fill
          priority
          className="object-cover"
        />
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 md:p-8">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-md sm:text-5xl lg:text-6xl">
              Discover Your Next Journey
            </h1>
            <h2 className="mt-3 text-xl font-medium text-gray-200 drop-shadow-sm sm:text-2xl">
              Explore travel plans shared by others!
            </h2>
          </div>
        </div>
      </div>

      {/* Travel Plans Grid Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"> {/* Added more padding */}
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Explore Inspiring Itineraries
        </h2>

        {/* Handle Loading Error */}
        {fetchError && (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-md border border-red-300">
                {fetchError}
            </div>
        )}

        {/* Handle No Plans Found */}
        {!fetchError && (!initialTravelPlans || initialTravelPlans.length === 0) && (
             <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-md border border-gray-300">
                No travel plans found at the moment. Check back later!
            </div>
        )}

        {/* Render Grid if plans exist */}
        {!fetchError && initialTravelPlans && initialTravelPlans.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {initialTravelPlans.map((plan) => (
              <TravelPlanCard
                key={plan._id}
                title={plan.header_topic}
                // --- FIXED from prop ---
                from={plan.departure_country}
                to={`${plan.arrival_city}, ${plan.arrival_country}`} // Combine city/country for 'to'
                description={plan.introduction}
                imageUrl={plan.header_img}
                href={`/travel-plans/${plan._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}