"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Polling App
          </Link>
          <div className="space-x-4">
            {session ? (
              <>
                <Link
                  href="/create-poll"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Create Poll
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
