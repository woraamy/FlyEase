
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SignedOut, SignInButton } from "@clerk/nextjs"

export default function SignupPage() {

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/login-bg.jpg"
          alt="Forest"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Signup Card */}
      <Card className="w-full max-w-md z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Please login to continue</CardTitle>
          <CardDescription className="text-center">Enter your email to login to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button className="w-full px-4 py-2 font-semibold text-white bg-black rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Login to Continue 
            </button>
          </SignInButton>
        </SignedOut>

          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <Separator className="flex-1" />
          </div>

        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-gray-600">
            Doesn't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
