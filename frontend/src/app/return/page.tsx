import { CheckCircle, XCircle, ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { stripe } from "@/lib/stripe"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"

// Helper function to format the order ID
function formatOrderId(id: string) {
  // Take first 8 and last 4 characters
  return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`
}

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer"],
  })
  return session
}

export default async function CheckoutReturn({ searchParams }: { searchParams: Promise<{ session_id: string }> }) {
  const { session_id } = await searchParams
  const session = await getSession(session_id)

  if (session?.status === "open") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md shadow-lg border-red-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto rounded-full bg-red-50 p-3 mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Payment Unsuccessful</CardTitle>
            <CardDescription className="mt-2 text-base">
              Your payment could not be processed. Please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4 pt-6 pb-6">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Store
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/checkout">Try Again</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (session?.status === "complete") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md shadow-lg border-green-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto rounded-full bg-green-50 p-4 mb-4 shadow-sm">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
            <CardDescription className="mt-2 text-base">
              Thank you for your purchase. {" "}
              <span className="font-medium">{session?.customer_details?.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-b py-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="px-3 py-1 text-xs font-mono">
                          {formatOrderId(session.id)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs font-mono">{session.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <CopyButton textToCopy={session.id} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: session.currency || "USD",
                  }).format((session.amount_total || 0) / 100)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 pt-6 pb-6">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/profile/my-flights">
                <Package className="mr-2 h-4 w-4" />
                My Booking
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Default fallback for other statuses
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>We're checking the status of your payment...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Store
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

