import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface TravelPlanCardProps {
  title: string
  from: string
  to: string
  description: string
  imageUrl: string
  href: string
}

export function TravelPlanCard({ title, from, to, description, imageUrl, href }: TravelPlanCardProps) {
    return (
      <Link href={href} className="block transition-all hover:shadow-lg">
        <Card className="overflow-hidden rounded-lg shadow-md" style={{ background: "linear-gradient(90deg, rgba(161,191,159,1) 0%, rgba(219,239,218,1) 57%, rgba(222,242,221,1) 100%)" }}>
          <CardHeader className="relative h-60 w-full overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </CardHeader>
          <CardContent className="bg-[#e8f0e8] p-6">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            </div>
            <p className="mb-3 text-sm text-gray-600">From {from} to {to}</p>
            <p className="text-gray-700">{description}</p>
          </CardContent>
        </Card>
      </Link>
    );
  }
  