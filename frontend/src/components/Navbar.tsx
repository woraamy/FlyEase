"use client";

import Link from "next/link";
import { FaSearch, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="ml-8 text-2xl font-bold text-green-700">
        flyease
      </Link>
      <div className="flex space-x-6 text-gray-600 font-medium">
        <Link href="/" className="hover:text-green-700">Home</Link>
        <Link href="/flights" className="hover:text-green-700">Flights</Link>
        <Link href="/travel-plan" className="hover:text-green-700">Travel Plan</Link>
        <Link href="/chat-bot" className="hover:text-green-700">Chat Bot</Link>
      </div>
      <div className="flex space-x-4">
        <FaSearch className="text-gray-600 cursor-pointer hover:text-green-700" />
        <FaUser className="text-gray-600 cursor-pointer hover:text-green-700" />
      </div>
    </nav>
  );
}
