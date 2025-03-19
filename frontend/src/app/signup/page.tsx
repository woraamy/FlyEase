import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SignedIn, SignInButton, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2244&auto=format&fit=crop"
          alt="City skyline"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Signup Card */}
      <Card className="w-full max-w-md z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <SignedOut>
            <SignUpButton mode="modal">
            <button className="w-full px-4 py-2 font-semibold text-white bg-black rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Sign up to continue
            </button>
            </SignUpButton>
          </SignedOut>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

