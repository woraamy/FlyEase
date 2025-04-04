import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BookingSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg border-t-2 border-t-gray-200 border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <Skeleton className="h-5 w-12 mb-1" />
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="text-right">
            <Skeleton className="h-5 w-12 ml-auto mb-1" />
            <Skeleton className="h-3 w-20 ml-auto mb-1" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <Skeleton className="h-3 w-8 mb-1" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-[90px] w-[90px]" />
        </div>
      </CardContent>
    </Card>
  )
}