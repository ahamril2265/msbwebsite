"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-darkCard p-6 rounded-lg shadow max-w-lg">
        <p className="mb-4">
          <span className="font-semibold">Name:</span> John Doe
        </p>
        <p className="mb-4">
          <span className="font-semibold">Email:</span> johndoe@email.com
        </p>
        <p className="mb-6">
          <span className="font-semibold">Member Since:</span> Jan 2024
        </p>

        <div className="flex space-x-4">
          <Link
            href="/settings"
            className="px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accentDark transition"
          >
            Edit Profile
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition"
          >
            My Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
