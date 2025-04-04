import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface TravelPlanCardProps {
  title: string;
  from: string;
  to: string;
  description: string;
  imageUrl: string;
  href: string;
}

export function TravelPlanCard({
  title,
  from,
  to,
  description,
  imageUrl,
  href,
}: TravelPlanCardProps) {
  return (
    <Link href={href} className="group block outline-none" aria-label={`View details for ${title}`}>
      <Card
        className="
          h-full overflow-hidden rounded-lg border
          shadow-sm transition-all duration-300 ease-in-out
          hover:shadow-xl hover:scale-[1.02]
          bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100  /* --- Green Radiant Gradient --- */
          text-gray-800 /* Adjust text color for contrast if needed */
        "
        // Note: Removed bg-card as gradient takes precedence. Added text-gray-800 for potentially better contrast on light gradient.
      >
        <CardHeader className="relative h-48 w-full p-0">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`Image for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors"> {/* Adjusted hover color */}
            {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600"> {/* Adjusted muted color */}
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {from} <span className="mx-1">→</span> {to}
            </span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3"> {/* Adjusted description color */}
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}