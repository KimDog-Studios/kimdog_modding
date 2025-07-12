"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);

  // Sign In states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up states
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signed in as ${email}`);
    router.push("/");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }
    alert(`Account created for ${signupEmail}`);
    router.push("/");
  };

  // Discord login handler: for now, just redirect
  const handleDiscordLogin = () => {
    window.location.href = "/auth/discord"; // Adjust to your OAuth URL
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-md shadow-md max-w-md w-full">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 text-center font-semibold transition-colors ${
              isSignIn
                ? "border-b-2 border-purple-500 text-purple-400"
                : "text-gray-400 hover:text-purple-400"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 text-center font-semibold transition-colors ${
              !isSignIn
                ? "border-b-2 border-purple-500 text-purple-400"
                : "text-gray-400 hover:text-purple-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {isSignIn ? (
          <form onSubmit={handleSignIn}>
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-6 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded font-semibold"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <label className="block mb-2" htmlFor="signupEmail">
              Email
            </label>
            <input
              id="signupEmail"
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="block mb-2" htmlFor="signupPassword">
              Password
            </label>
            <input
              id="signupPassword"
              type="password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="block mb-2" htmlFor="signupConfirm">
              Confirm Password
            </label>
            <input
              id="signupConfirm"
              type="password"
              required
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              className="w-full p-2 mb-6 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded font-semibold"
            >
              Sign Up
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center my-6 text-gray-400">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-3 text-sm">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Discord Login */}
        <button
          onClick={handleDiscordLogin}
          className="w-full py-2 rounded border border-gray-600 flex items-center justify-center space-x-3 hover:bg-gray-700 transition"
          aria-label="Continue with Discord"
        >
          <DiscordLogo className="h-6 w-6" />
          <span>Continue with Discord</span>
        </button>
      </div>
    </div>
  );
}

function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 71 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M60.104 4.5A58.346 58.346 0 0046.852 0l-2.121 4.32a54.72 54.72 0 0111.484 2.444L60.104 4.5zm-11.2 7.99a50.68 50.68 0 00-12.92-2.44l-2.11-4.3a57.504 57.504 0 00-12.1 2.36c-10.3 6.7-15.1 17.52-15.3 31.2a71.014 71.014 0 0010.1 10.7 56.572 56.572 0 012.37-3.76 47.387 47.387 0 01-5.42-2.42 44.493 44.493 0 004.76-3.06c-1.58-1.1-3.1-2.24-4.62-3.3 4.4-1.22 8.8-2.44 13.2-3.66 7.17 4.25 14.34 8.5 21.5 12.75 7.6-5.2 15.3-10.3 22.9-15.4-5.34-3.47-10.68-6.95-16.02-10.42zm-13.57 17.7c-3.3 0-5.98-3-5.98-6.68 0-3.7 2.7-6.68 6-6.68s6 3 6 6.7c-.03 3.68-2.68 6.66-6 6.66zm22.16 0c-3.3 0-5.98-3-5.98-6.68 0-3.7 2.7-6.68 6-6.68s6 3 6 6.7c0 3.68-2.7 6.66-6 6.66z"
        fill="#5865F2"
      />
    </svg>
  );
}
