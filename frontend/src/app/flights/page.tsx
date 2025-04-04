// app/flights/page.tsx
import { Suspense } from 'react';
import { getFlights } from '@/app/actions';
import FlightList from '@/components/FlightList';
import SearchForm from '@/components/SearchForm';
import Loading from '@/components/Loading';


export const dynamic = "force-dynamic";

export default async function Flights() {
  let initialFlights = [];
  try {
    initialFlights = await getFlights() || [];
  } catch (error) {
    console.error('Error loading flights:', error);
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6">
          <section className="py-8">
            <SearchForm />
          </section>
          <section className="py-8">
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