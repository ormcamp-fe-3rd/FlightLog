import Link from "next/link";
import React from "react";

function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="org-code"
              className="block text-sm font-medium text-gray-700"
            >
              Organization Code
            </label>
            <input
              type="text"
              id="org-code"
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:ring focus:ring-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-black py-2 text-white transition duration-300 hover:bg-gray-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?
          <Link href="/" className="ml-2 font-bold text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
