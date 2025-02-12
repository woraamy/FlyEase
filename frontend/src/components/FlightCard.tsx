import { Star, Wifi, Utensils, Music } from "lucide-react";

interface FlightCardProps {
  from: string;
  to: string;
  price: number;
  rating: number;
  image: string;
}

const FlightCard = ({ from, to, price, rating, image }: FlightCardProps) => {
  return (
    <div className="bg-[#D4EBDD] text-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col gap-6 w-full">
      <div className="flex items-start gap-6 justify-between w-full">
        <div className="flex gap-6">
          <img src={image} alt={`${from} to ${to}`} className="w-32 h-32 object-cover rounded-lg" />
          <div className="flex flex-col items-start">
            <h3 className="text-black font-semibold mb-2">{from} to {to}</h3>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? "text-[#3A7853] fill-current" : "text-black"}`}
                />
              ))}
            </div>
            <div className="flex flex-col text-sm text-black gap-1">
              <div className="flex items-center gap-1"><Wifi className="w-4 h-4" /> Free WiFi</div>
              <div className="flex items-center gap-1"><Utensils className="w-4 h-4" /> In-flight Meals</div>
              <div className="flex items-center gap-1"><Music className="w-4 h-4" /> Entertainment</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${price}</p>
          <p className="text-black line-through">${price * 2}</p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
