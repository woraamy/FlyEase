"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Airport } from '@/types/flight';
import { useRef } from 'react';
import { Recommendation } from '@/types/recommendation';
import { EnhancedAirportCard } from "@/components/EnhancedAirportCard";

interface RenderRowProps {
  title: string;
  items: Recommendation[];
  index: number;
}

export const RenderRow = ({ title, items, index }: RenderRowProps) => {
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const scroll = (direction: 'left' | 'right', index: number) => {
    const container = scrollContainerRefs.current[index];
    if (container) {
      // Width of card (264px) + gap (24px)
      const scrollAmount = 288;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="mb-12">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="group relative">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll('left', index)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div 
          ref={(el) => { scrollContainerRefs.current[index] = el; }} 
          className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth" 
          style={{ 
            scrollbarWidth: 'none',  /* Firefox */
            msOverflowStyle: 'none',  /* IE and Edge */
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {items.map((rec, itemIndex) => (
            rec.airportDetails && (
              <div 
                key={`${rec.airportDetails.code}-${itemIndex}`} 
                className="flex-none" 
              >
                <EnhancedAirportCard
                  code={rec.airportDetails.code}
                  name={rec.airportDetails.name}
                  city={rec.airportDetails.city}
                  country={rec.airportDetails.country}
                  image={rec.airportDetails.image}
                  score={rec.score}
                />
              </div>
            )
          ))}
        </div>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={() => scroll('right', index)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}