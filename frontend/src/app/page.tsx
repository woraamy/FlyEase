// app/page.tsx
import { Suspense } from 'react';
import { getFlights } from '@/app/action';
import FlightList from '@/components/FlightList';
import SearchForm from '@/components/SearchForm';
import Loading from '@/components/Loading';
import { FlightCarousel } from '@/components/FlightCarousel';
import RecommendedFlights from '@/components/RecommendedFlights';



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
          <div className="max-w-6xl mx-auto mt-8">
            <SearchForm />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6">
          <section className="py-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Recommend Flights
            </h2>
            {/* <Suspense fallback={<Loading />}>
              <FlightList initialFlights={initialFlights} />
            </Suspense> */}
              {/* <FlightCarousel title="Featured Destinations" flights={featuredFlights} />
              <FlightCarousel title="New Releases" flights={newReleases} />
              <FlightCarousel title="Top Destinations" flights={topDestinations} /> */}
              <RecommendedFlights />
          </section>
        </div>
      </main>
    </div>
  );
}


// const featuredFlights = [
//   {
//     id: 1,
//     title: "PARIS",
//     image: "https://i0.wp.com/secretsofparis.com/wp-content/uploads/2019/11/Roissy-Airport.jpg?resize=990%2C556&ssl=1",
//     badge: "TOP 10",
//   },
//   {
//     id: 2,
//     title: "BALI",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "Flash Sale",
//   },
//   {
//     id: 3,
//     title: "NEW YORK",
//     image: "/placeholder.svg?height=400&width=600",
//   },
//   {
//     id: 4,
//     title: "TOKYO",
//     image: "/placeholder.svg?height=400&width=600",
//   },
//   {
//     id: 13,
//     title: "VENICE",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "TOP 10",
//   },
//   {
//     id: 14,
//     title: "CAIRO",
//     image: "/placeholder.svg?height=400&width=600",
//   },
// ]

// const newReleases = [
//   {
//     id: 5,
//     title: "SANTORINI",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "New Route",
//   },
//   {
//     id: 6,
//     title: "DUBAI",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "TOP 10",
//   },
//   {
//     id: 7,
//     title: "MALDIVES",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "New Season",
//   },
//   {
//     id: 8,
//     title: "BARCELONA",
//     image: "/placeholder.svg?height=400&width=600",
//   },
//   {
//     id: 15,
//     title: "SEOUL",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "New Route",
//   },
//   {
//     id: 16,
//     title: "CAPE TOWN",
//     image: "/placeholder.svg?height=400&width=600",
//   },
// ]

// const topDestinations = [
//   {
//     id: 9,
//     title: "LONDON",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "TOP 10",
//   },
//   {
//     id: 10,
//     title: "SINGAPORE",
//     image: "/placeholder.svg?height=400&width=600",
//   },
//   {
//     id: 11,
//     title: "SYDNEY",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "New Route",
//   },
//   {
//     id: 12,
//     title: "ROME",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "TOP 10",
//   },
//   {
//     id: 17,
//     title: "AMSTERDAM",
//     image: "/placeholder.svg?height=400&width=600",
//   },
//   {
//     id: 18,
//     title: "BANGKOK",
//     image: "/placeholder.svg?height=400&width=600",
//     badge: "TOP 10",
//   },
// ]

