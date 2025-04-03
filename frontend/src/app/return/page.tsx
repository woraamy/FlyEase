// import { stripe } from "@/lib/stripe";

// async function getSession(sessionId: string) {
//   const session = await stripe.checkout.sessions.retrieve(sessionId!);
//   return session;
// }

// export default async function CheckoutReturn({ searchParams }: { searchParams: { session_id: string } }) {
//     const { session_id } = await searchParams;
//     const session = await getSession(session_id);

//     console.log(session);

//     if (session?.status === "open") {
//         return <p>Payment did not work.</p>;
//     }

//     if (session?.status === "complete") {
//         return (
//         <h3>
//             We appreciate your business! Your invoice will be sent to
//             <strong> {session?.customer_details?.email as string}</strong>
//         </h3>
//         );
//     }

//     return null;
// }


import { CheckCircle, XCircle, ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { stripe } from "@/lib/stripe"

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer"],
  })
  return session
}

export default async function CheckoutReturn({ searchParams}: { searchParams: Promise<{ session_id: string }> }) {
  const { session_id } = await searchParams

    // console.log(session);

  const session = await getSession(session_id)

  if (session?.status === "open") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <CardTitle>Payment Unsuccessful</CardTitle>
            <CardDescription>Your payment could not be processed. Please try again.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Store
              </Link>
            </Button>
            <Button asChild>
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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription className="mt-2 text-base">
              Thank you for your purchase. We've sent a confirmation to{" "}
              <span className="font-medium">{session?.customer_details?.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-b py-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium">{session.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: session.currency || "USD",
                  }).format((session.amount_total || 0) / 100)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild>
              <Link href="/account/orders">
                <Package className="mr-2 h-4 w-4" />
                View Order
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>We're checking the status of your payment...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
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

