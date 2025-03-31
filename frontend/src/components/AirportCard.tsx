"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

interface AirportCardProps {
  code: string;
  name: string;
  city: string;
  country: string;
  image: string;
  score?: number;
}

const AirportCard: React.FC<AirportCardProps> = ({
  code,
  name,
  city,
  country,
  image,
  score,
}) => {
  const router = useRouter();

  // Convert score to a rating out of 5 (assuming score is on a scale of 0-20)
  const rating = score ? Math.min(5, Math.max(0, score / 3)) : 0;

  const handleClick = () => {
    router.push(`/recommend/${code}`);
  };

  return (
    <div
      className="cursor-pointer w-72 h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
      onClick={handleClick}
    >
      <div className="relative w-full h-40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {score && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
            Popular
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between h-[calc(100%-10rem)]">
        <div>
          <h3 className="font-bold text-lg text-gray-900 truncate">
            {name} ({code})
          </h3>
          <p className="text-gray-600 truncate">
            {city}, {country}
          </p>

          {/* Star rating display */}
          <div className="flex mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-[#3A7853] fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-600 font-medium">View Flights</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AirportCard;
