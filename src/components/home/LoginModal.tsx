import Link from "next/link";
import React from "react";

function LoginModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              e-mail
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
          <button
            type="submit"
            className="w-full rounded bg-black py-2 text-white transition duration-300 hover:bg-gray-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?
          <Link
            href="/signup"
            className="ml-2 font-bold text-black hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
export default LoginModal;
