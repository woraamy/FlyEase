import Image from "next/image"
import Link from "next/link"

interface TravelPlanCardProps {
  title: string
  from: string
  to: string
  author: string
  description: string
  imageUrl: string
  href: string
}

export function TravelPlanCard({ title, from, to, author, description, imageUrl, href }: TravelPlanCardProps) {
  return (
    <Link href={href} className="block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="bg-[#e8f0e8] p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-600">Written By: {author}</div>
        </div>
        <p className="mb-3 text-sm text-gray-600">
          From {from} to {to}
        </p>
        <p className="text-gray-700">{description}</p>
      </div>
    </Link>
  )
}

