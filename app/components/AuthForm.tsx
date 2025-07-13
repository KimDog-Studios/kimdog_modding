"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

type AuthFormProps = {
  onLoginSuccess?: () => void;
};

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    const auth = getAuth();

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created and logged in!");
      }
      setEmail("");
      setPassword("");
      onLoginSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Authentication failed.");
    }
    setAuthLoading(false);
  }

  async function handleGoogleSignIn() {
    setAuthLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google!");
      onLoginSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed.");
    }
    setAuthLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <form
        onSubmit={handleAuthSubmit}
        className="bg-gray-900 p-6 rounded-xl text-white max-w-sm w-full flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {authMode === "login" ? "Login" : "Sign Up"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={authMode === "login" ? "current-password" : "new-password"}
          minLength={6}
        />

        <button
          type="submit"
          disabled={authLoading}
          className="bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded font-semibold"
        >
          {authLoading
            ? authMode === "login"
              ? "Logging in..."
              : "Signing up..."
            : authMode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <button
          type="button"
          disabled={authLoading}
          onClick={handleGoogleSignIn}
          className="mt-3 bg-red-600 hover:bg-red-700 transition-colors py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          {/* Google SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C34.4 32.7 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 2.9l5.7-5.7C33.6 7.6 28.9 6 24 6 12.9 6 4 14.9 4 26s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.9l6.6 4.8C14.2 17 18.6 14 24 14c3.1 0 5.9 1.1 8 2.9l5.7-5.7C33.6 7.6 28.9 6 24 6c-7.7 0-14.3 4.6-17.7 11.4z"
            />
            <path
              fill="#4CAF50"
              d="M24 42c5.5 0 10.3-2.2 13.8-5.8l-6.5-5.4c-2 1.7-4.6 2.7-7.3 2.7-4.7 0-8.7-3.1-10.1-7.3l-6.7 5.2C9.9 37.4 16.4 42 24 42z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-4.1 6-7.8 6-4.7 0-8.7-3.1-10.1-7.3l-6.7 5.2C9.9 37.4 16.4 42 24 42c11.1 0 20-9 20-20 0-1.3-.1-2.5-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-4 text-gray-400">
          {authMode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className="text-purple-400 underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="text-purple-400 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
