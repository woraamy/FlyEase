import Image from "next/image"
import { TravelPlanCard } from "@/components/TravelPlanCard"
import mockTravelPlans from "@/data/mockTravelPlan.json"

export default function TravelPlansPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full">
        <Image 
            src="/images/travel-plan-bg.jpeg" 
            alt="Coastal town view" 
            fill priority className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <h1 className="max-w-4xl px-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Discover Your Next Vacation Plan
            </h1>
            <h2 className="mt-2 max-w-4xl px-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              From the Eyes of Others!
            </h2>
          </div>
        </div>
      </div>

      {/* Travel Plans Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockTravelPlans.map((plan) => (
            <TravelPlanCard
              key={plan.id}
              title={plan.header_topic}
              from={plan.departure_country + ", " + plan.departure_country}
              to={plan.arrival_city + ", " + plan.arrival_country}
              author={plan.user_id}
              description={plan.introduction}
              imageUrl={plan.header_img}
              href={`/travel-plans/${plan.id}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
