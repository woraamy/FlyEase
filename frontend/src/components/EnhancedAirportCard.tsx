import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function EnhancedAirportCard({ 
  code, 
  name, 
  city, 
  country, 
  image, 
  score 
}: { 
  code: string;
  name: string;
  city: string;
  country: string;
  image?: string;
  score: number;
}) {
  return (
    <Card className="w-64 h-80 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
    <Link href={`/recommend/${code}`}>
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={image || "/images/default-airport.jpg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <Badge className="absolute right-2 top-2 bg-blue-600">
          Popular
        </Badge>
      </div>
      <CardHeader className="pb-2 flex-none">
        <CardTitle className="text-lg line-clamp-2 h-14">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-none">
        <p className="text-sm text-muted-foreground line-clamp-1">{city}, {country}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        {/* <Button asChild variant="outline" className="w-full">
        </Button> */}
       </CardFooter>
        </Link>
    </Card>
  );
}