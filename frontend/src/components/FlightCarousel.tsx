// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
// import { FlightCard } from "@/components/CardRecom"

// interface FlightCarouselProps {
//   title: string
//   flights: Array<{
//     id: number
//     title: string
//     image: string
//     badge?: string
//   }>
// }

// export function FlightCarousel({ title, flights }: FlightCarouselProps) {
//   return (
//     <section className="mb-12">
//       <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
//       <Carousel
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//         className="w-full"
//       >
//         <CarouselContent className="-ml-2 md:-ml-4">
//           {flights.map((flight) => (
//             <CarouselItem key={flight.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
//               <FlightCard flight={flight} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <CarouselPrevious className="left-2 bg-black/50 text-white border-none hover:bg-black/80" />
//         <CarouselNext className="right-2 bg-black/50 text-white border-none hover:bg-black/80" />
//       </Carousel>
//     </section>
//   )
// }

