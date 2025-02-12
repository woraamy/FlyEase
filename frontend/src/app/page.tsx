"use client";

import Hero from "@/components/Hero";
import SearchForm from "@/components/SearchForm";
import FlightCard from "@/components/FlightCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const flights = [
    {
      from: "New York",
      to: "Paris",
      price: 350,
      rating: 5,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
    },
    {
      from: "Los Angeles",
      to: "Tokyo",
      price: 450,
      rating: 4,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80",
    },
    {
      from: "Chicago",
      to: "London",
      price: 400,
      rating: 5,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80",
    },
    {
      from: "Miami",
      to: "Madrid",
      price: 380,
      rating: 4,
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80", // Plaza Mayor, Madrid
    },
    {
      from: "San Francisco",
      to: "Sydney",
      price: 600,
      rating: 5,
      image: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80", // Sydney Opera House
    },
    {
      from: "Seattle",
      to: "Vancouver",
      price: 150,
      rating: 4,
      image: "https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?auto=format&fit=crop&q=80", // Vancouver skyline
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <main className="pt-16">
        <section className="text-center py-1">
          <h1 className="text-5xl font-bold text-gray-900">Discover the World with Ease</h1>
          <p className="mb-8 text-lg text-gray-600 mt-4">Your journey begins with a single click</p>
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80" alt="Beach" className="w-full h-96 object-cover mt-6 rounded-lg" />
          <div className="max-w-4xl mx-auto mt-8">
            <SearchForm />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6">
          <section className="py-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Available Flights</h2>
            <div className="flex flex-col gap-8">
              {flights.map((flight, index) => (
                <FlightCard key={index} {...flight} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}