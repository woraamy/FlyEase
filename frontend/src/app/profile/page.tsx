"use client"

import { UserProfile } from '@clerk/nextjs'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  if (!isLoaded || !isSignedIn) {
    return null
  }

  console.log(user)

  return (
    <div className="container mx-auto pt-6">
      <div className="flex">
        <div className="mx-4">
          <Image
            src={user.imageUrl}
            width={250}
            height={250}
            alt="account"
            className="rounded-lg"
          />
        </div>
        <div className="ml-4">
          <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
            <div className="inline-block w-full overflow-hidden rounded-lg shadow-md">
              <table className="w-full leading-normal">
                <tbody>
                  {/* Firstname */}
                  <tr>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      First Name
                    </td>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      {user.firstName}
                    </td>
                  </tr>
                  {/* Last Name */}
                  <tr>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      Last Name
                    </td>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      {user.lastName}
                    </td>
                  </tr>
                  {/* Emails */}
                  <tr>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      Emails
                    </td>
                    <td className="whitespace-no-wrap border-b border-gray-200 bg-white px-5 py-5 text-sm text-gray-900">
                      {user.emailAddresses.map((email) => (
                        <div key={email.emailAddress}>{email.emailAddress}, </div>
                      ))}
                    </td>
                  </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile