"use client";

import React, { useState, useEffect } from "react";
import NavigationBar from "./components/NavBar";
import ModsDisplay from "./components/ModsDisplay";
import AuthForm from "./components/AuthForm";
import toast, { Toaster } from "react-hot-toast";

import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  function handleDownload(mod: any) {
    // Open your API endpoint with 'file' query param set to productId
    const apiUrl = `/api/download?file=${encodeURIComponent(mod.productId)}`;
    window.open(apiUrl, "_blank");
  }

  function handleLogout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => toast.success("Logged out"))
      .catch(() => toast.error("Failed to logout"));
  }

  return (
    <>
      <Toaster position="top-center" />
      <NavigationBar user={user} onLogout={handleLogout} />

      <main className="flex flex-col items-center py-10 px-6 min-h-screen bg-gray-900 text-white">
        {!user && <AuthForm onLoginSuccess={() => {}} />}

        {user && (
          // Pass userId and onDownload, ModsDisplay will fetch purchases itself
          <ModsDisplay userId={user.uid} onDownload={handleDownload} />
        )}
      </main>
    </>
  );
}
