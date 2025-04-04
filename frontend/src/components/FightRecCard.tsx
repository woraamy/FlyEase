import { Plane, CalendarClock, Milestone } from "lucide-react"; // Added more icons
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge"; // Import Badge

interface FlightRecCardProps {
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  price: string;
  airline?: string; // Keep optional airline prop
}

// Keep existing date formatting function
function formatDateTime(dateString: string) {
  try {
    const date = parseISO(dateString);
    // Example: 04 Apr 2025, 10:50 AM
    return format(date, "dd MMM yyyy, h:mm a");
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Invalid Date"; // Return clearer error indication
  }
}

export function FlightRecCard({
  from,
  to,
  departureTime,
  arrivalTime,
  departureAirport,
  arrivalAirport,
  price,
  airline, // Added airline usage (optional)
}: FlightRecCardProps) {
  const formattedDeparture = formatDateTime(departureTime);
  const formattedArrival = formatDateTime(arrivalTime);

  // Helper to safely parse price
  const numericPrice = parseFloat(price);
  const displayPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : "N/A";

  return (
    // Use standard Card appearance, subtle hover
    <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary/50">
      <CardContent className="p-4 space-y-3"> {/* Add vertical spacing */}
        {/* Header: From -> To */}
        <div className="flex items-center justify-between text-sm font-medium text-primary">
          <span className="flex items-center gap-1.5">
            <Milestone className="h-4 w-4" /> {from} ({departureAirport})
          </span>
          <Plane className="h-4 w-4 text-muted-foreground" />
          <span className="flex items-center gap-1.5">
             {to} ({arrivalAirport}) <Milestone className="h-4 w-4 rotate-90" />
          </span>
        </div>

        {/* Date/Time Info */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground border-t pt-3">
           <div className="flex items-center gap-1.5">
             <CalendarClock className="h-3.5 w-3.5"/>
             <span>Depart: {formattedDeparture}</span>
           </div>
           <div className="flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5"/>
             <span>Arrive: {formattedArrival}</span>
           </div>
        </div>

        {/* Price and Optional Airline */}
        <div className="flex items-center justify-between pt-2">
           {airline && <Badge variant="outline">{airline}</Badge>}
           <div className={`flex items-baseline gap-1 ${!airline ? 'ml-auto' : ''}`}> {/* Push to right if no airline */}
             <span className="text-sm font-medium text-muted-foreground">From:</span>
             <span className="text-lg font-bold text-primary">${displayPrice}</span>
           </div>
         </div>

      </CardContent>
    </Card>
  );
}