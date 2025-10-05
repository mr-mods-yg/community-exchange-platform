"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-white">
          Welcome Back 👋
        </h1>
        <p className="mb-8 text-center text-gray-300">
          Sign in to continue
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 font-medium text-gray-800 shadow-lg transition hover:bg-gray-100"
        >
          {/* Google Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.8-6.8C35.6 2.9 30.3 0 24 0 14.6 0 6.4 5.8 2.5 14.1l7.9 6.1C12.4 13.4 17.7 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.5c-.6 3-2.4 5.6-5.1 7.3l7.9 6.1c4.6-4.2 6.8-10.3 6.8-17.7z"
            />
            <path
              fill="#FBBC05"
              d="M10.4 28.2c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 15.7 0 19.7 0 23.5s1 7.8 2.6 11.1l7.8-6.4z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.3 0 11.6-2.1 15.5-5.8l-7.9-6.1c-2.2 1.5-5 2.3-7.6 2.3-6.3 0-11.6-4.3-13.5-10.1l-7.9 6.1C6.4 42.2 14.6 48 24 48z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}
