"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface FlightCardProps {
  flight: {
    id: number
    title: string
    image: string
    badge?: string
  }
  className?: string
}

export function FlightCard({ flight, className }: FlightCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!flight.id) {
      console.error("Flight ID is missing:", flight);
      return;
    }
    router.push(`/flights/${flight.id}`);
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-md transition-transform duration-300 hover:scale-105",
        className,
      )}
      onClick={handleClick}
    >
      <div className="aspect-video relative">
        <Image src={flight.image || "/placeholder.svg"} alt={flight.title} fill className="object-cover" />
        {flight.badge && (
          <div
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${
              flight.badge === "TOP 10" ? "bg-red-600" : "bg-red-600"
            }`}
          >
            {flight.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-lg font-bold text-white drop-shadow-lg">{flight.title}</h3>
      </div>
    </div>
  )
}