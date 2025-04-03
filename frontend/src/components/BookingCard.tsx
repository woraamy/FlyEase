import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookingCardProps {
    name: string;
    departureTime: string;
    arrivalTime: string;
    departureCity: string;
    departureCountry: string;
    departureAirport: string;
    arrivalCity: string;
    arrivalCountry: string;
    arrivalAirport: string;
    seatNumber: string;
    qrCodeUrl: string;
    status: "PENDING" | "CONFIRMED";
}

export function BookingCard({
  name,
  departureTime,
  arrivalTime,
  departureCity,
  departureCountry,
  departureAirport,
  arrivalCity,
  arrivalCountry,
  arrivalAirport,
  seatNumber,
  qrCodeUrl,
  status,
}: BookingCardProps) {
  return (
    <Card className="overflow-hidden rounded-lg shadow-md bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <Badge
            className={
              status === "CONFIRMED" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
            }
          >
            {status}
          </Badge>
        </div>
        <div className="mb-2 text-sm text-gray-600">
          <p>
            <strong>Departure Airport:</strong>  {departureAirport} {departureCity}, {departureCountry}
          </p>
          <p>
            <strong>Arrival Airport:</strong>  {arrivalAirport} {arrivalCity}, {arrivalCountry}
          </p>
          <p>
            <strong>Departure Time:</strong> {departureTime}
          </p>
          <p>
            <strong>Arrival Time:</strong> {arrivalTime}
          </p>
        </div>
        <p className="mb-3 text-sm text-gray-700">
          <strong>Seat:</strong> {seatNumber}
        </p>
        <div className="flex justify-center mt-4">
          <Image
            src={qrCodeUrl || "/placeholder.svg"}
            alt="QR Code for Check-in"
            width={120}
            height={120}
            className="rounded-md border border-gray-300"
          />
        </div>
      </CardContent>
    </Card>
  );
}
