import { Plane } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO } from "date-fns"

interface FlightRecCardProps {
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  departureAirport: string
  arrivalAirport: string
  price: string
  airline?: string
}

// Format date to "dd MMM yyyy, h:mm a" (e.g., "15 Mar 2025, 2:30 PM")
function formatDateTime(dateString: string) {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy, h:mm a");
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
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
  airline,
}: FlightRecCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
      <CardContent className="p-0">
        <div className="bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <Plane className="h-4 w-4 rotate-45 text-emerald-600" />
            <h3 className="font-medium text-emerald-700">
              From {from} to {to}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Departure Date:</p>
              <p className="text-gray-600">{formatDateTime(departureTime)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Arrival Date:</p>
              <p className="text-gray-600">{formatDateTime(arrivalTime)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Departure Airport:</p>
              <p className="text-gray-600">{departureAirport}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Arrival Airport:</p>
              <p className="text-gray-600">{arrivalAirport}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500">Start from:</span>
              <span className="font-bold text-emerald-600">${price}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

