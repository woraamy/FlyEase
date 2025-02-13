// app/page.tsx
import { Suspense } from 'react';
import { getFlights } from '@/app/action';
import FlightList from '@/components/FlightList';
import SearchForm from '@/components/SearchForm';
import Loading from '@/components/Loading';



export default async function Home() {
  const initialFlights = await getFlights();

  return (
    <div className="bg-white min-h-screen">
      <main className="pt-16">
        <section className="text-center py-1">
          <h1 className="text-5xl font-bold text-gray-900">
            Discover the World with Ease
          </h1>
          <p className="mb-8 text-lg text-gray-600 mt-4">
            Your journey begins with a single click
          </p>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80"
            alt="Beach"
            className="w-full h-96 object-cover mt-6 rounded-lg"
          />
          <div className="max-w-4xl mx-auto mt-8">
            <SearchForm />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6">
          <section className="py-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Available Flights
            </h2>
            <Suspense fallback={<Loading />}>
              <FlightList initialFlights={initialFlights} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}