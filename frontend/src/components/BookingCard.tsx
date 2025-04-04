// // components/BookingCard.tsx
// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import QRCode from "react-qr-code";

// interface BookingCardProps {
//   name: string;
//   departureTime: string;
//   arrivalTime: string;
//   departureCity: string;
//   departureCountry: string;
//   departureAirport: string;
//   arrivalCity: string;
//   arrivalCountry: string;
//   arrivalAirport: string;
//   seatNumber: string;
//   qrCodeData: string;
//   status: "PENDING" | "CONFIRMED";
// }

// export function BookingCard({
//   name,
//   departureTime,
//   arrivalTime,
//   departureCity,
//   departureCountry,
//   departureAirport,
//   arrivalCity,
//   arrivalCountry,
//   arrivalAirport,
//   seatNumber,
//   qrCodeData,
//   status,
// }: BookingCardProps) {
//   return (
//     <Card className="overflow-hidden rounded-lg shadow-md bg-white border border-gray-200">
//       <CardContent className="p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="text-xl font-bold text-gray-900">{name}</h3>
//           <Badge
//             className={
//               status === "CONFIRMED" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
//             }
//           >
//             {status}
//           </Badge>
//         </div>
//         <div className="mb-2 text-sm text-gray-600">
//           <p>
//             <strong>Departure:</strong> {departureAirport} {departureCity}, {departureCountry}
//           </p>
//           <p>
//             <strong>Arrival:</strong> {arrivalAirport} {arrivalCity}, {arrivalCountry}
//           </p>
//           <p>
//             <strong>Departure Time:</strong> {departureTime}
//           </p>
//           <p>
//             <strong>Arrival Time:</strong> {arrivalTime}
//           </p>
//         </div>
//         <p className="mb-3 text-sm text-gray-700">
//           <strong>Seat:</strong> {seatNumber}
//         </p>
//         <div className="flex justify-center mt-4">
//           <QRCode
//             value={qrCodeData}
//             size={120}
//             style={{ height: "120px", width: "120px" }}
//             className="rounded-md border border-gray-300"
//           />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
// components/BookingCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QRCode from "react-qr-code";
import { Plane } from 'lucide-react';
import { motion } from "framer-motion";

interface BookingCardProps {
  id?: number;
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
  status: "CONFIRMED" | "PENDING";
  bookingCode?: string;
  qrCodeData?: string;
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
  status,
  bookingCode,
  qrCodeData,
}: BookingCardProps) {
  // Generate QR code data if not provided
  // const qrData = qrCodeData || JSON.stringify({
  //   booking: bookingCode,
  //   seat: seatNumber,
  //   passenger: name,
  //   flight: {
  //     from: {
  //       code: departureAirport,
  //       city: departureCity,
  //       country: departureCountry
  //     },
  //     to: {
  //       code: arrivalAirport,
  //       city: arrivalCity,
  //       country: arrivalCountry
  //     },
  //     departure: departureTime,
  //     arrival: arrivalTime
  //   }
  // });
  const qrData = qrCodeData || 
  `✈️ FLIGHT BOARDING PASS ✈️  \n` +
  `Passenger:      ${name}  \n` +
  `Booking Code:   ${bookingCode}  \n` +
  `Seat:           ${seatNumber}  \n\n` +
  `FROM:  ${departureAirport} (${departureCity}, ${departureCountry})  \n` +
  `TO:    ${arrivalAirport} (${arrivalCity}, ${arrivalCountry})  \n\n` +
  `Departure:      ${departureTime}  \n` +
  `Arrival:        ${arrivalTime}  \n\n` +
  `Thank you for flying with us!`;



  
  // Normalize status for display
  let displayStatus = "";

  if (status === "CONFIRMED") {
    displayStatus = "CONFIRMED";
  } else if (status === "PENDING") {
    displayStatus = "PENDING";
  } else {
    displayStatus = status;
  }
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden rounded-xl shadow-md bg-white border border-gray-100 h-full transition-all hover:shadow-lg">
        <div className={`h-1 ${status === "CONFIRMED" ? "bg-emerald-500" : "bg-amber-500"}`} />
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">{name}</h3>
            <Badge
              variant="outline"
              className={`
                px-2 py-0.5 text-xs font-medium rounded-full uppercase
                ${status === "CONFIRMED" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-amber-50 text-amber-700 border-amber-200"}
              `}
            >
              {displayStatus.replace(/-/g, ' ')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{departureAirport}</p>
              <p className="text-xs font-medium text-gray-500">{departureCity}</p>
              <p className="text-xs text-gray-400">{departureTime}</p>
            </div>
            
            <div className="flex-1 mx-2 relative">
              <div className="border-t border-dashed border-gray-300 absolute w-full top-1/2 -translate-y-1/2"></div>
              <Plane className="text-primary w-4 h-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{arrivalAirport}</p>
              <p className="text-xs font-medium text-gray-500">{arrivalCity}</p>
              <p className="text-xs text-gray-400">{arrivalTime}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500">Seat</p>
              <p className="text-sm font-bold text-gray-900">{seatNumber}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-500">Booking Code</p>
              <p className="text-sm font-bold text-gray-900">{bookingCode}</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-3 bg-gray-50 p-2 rounded-lg">
            <div className="bg-white p-1 rounded-lg shadow-sm">
              <QRCode
                value={qrData}
                size={90}
                style={{ height: "90px", width: "90px" }}
                className="rounded-md"
                fgColor="#1a1a1a"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}