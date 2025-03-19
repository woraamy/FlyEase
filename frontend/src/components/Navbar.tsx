"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaUser } from "react-icons/fa";
import { SignedIn, SignInButton, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="ml-8 text-2xl font-bold text-green-700">
        flyease
      </Link>
      <div className="flex space-x-6 text-gray-600 font-medium">
        <Link href="/" className={pathname === "/" ? "text-green-700 font-semibold" : "hover:text-green-700"}>Home</Link>
        <Link href="/flights" className={pathname === "/flights" ? "text-green-700 font-semibold" : "hover:text-green-700"}>Flights</Link>
        <Link href="/travel-plan" className={pathname === "/travel-plan" ? "text-green-700 font-semibold" : "hover:text-green-700"}>Travel Plan</Link>
        <Link href="/chat-bot" className={pathname === "/chat-bot" ? "text-green-700 font-semibold" : "hover:text-green-700"}>Chat Bot</Link>
      </div>
      <div className="flex space-x-4">
        <SignedOut>
          <Link href="/signup" className="hover:text-green-700">Sign Up</Link>
          <Link href="/login" className="hover:text-green-700">Sign In</Link>
        </SignedOut>
        <SignedIn>
          <UserButton userProfileUrl="/profile"/>
        </SignedIn>
      </div>
    </nav>
  );
}