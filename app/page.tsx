"use client";

import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "./components/NavBar/NavBar";
import ModsDisplay from "./components/Mods/ModsDisplay";
import AuthForm from "./components/AuthForm";
import toast, { Toaster } from "react-hot-toast";

import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

const backgroundImages = [
  "/backgrounds/270880_20250520182538_1.png",
  "/backgrounds/270880_20250522190035_1.png",
  "/backgrounds/270880_20250526162805_1.png",
  "/backgrounds/270880_20250526162819_1.png",
  "/backgrounds/270880_20250526192618_1.png",
  "/backgrounds/270880_20250526195004_1.png",
  "/backgrounds/270880_20250530012140_1.png",
  "/backgrounds/270880_20250628212113_1.png",
  "/backgrounds/270880_20250629181826_1.png",
  "/backgrounds/270880_20250702105908_1.png",
  "/backgrounds/background.png",
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const fadeDuration = 900; // 0.90 seconds fade
  const displayDuration = 15000; // 15 seconds display

  // Timeout ref to clear when component unmounts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Preload image helper
  function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // resolve on error too, so it doesn't block
    });
  }

  // The main cycle: wait displayDuration, fade out, switch image, fade in
  useEffect(() => {
    async function cycle() {
      // Wait display duration (image fully visible)
      await new Promise((res) => {
        timeoutRef.current = setTimeout(res, displayDuration);
      });

      // Preload next image
      const nextIndex = (currentIndex + 1) % backgroundImages.length;
      await preloadImage(backgroundImages[nextIndex]);

      // Start fade out
      setFadeOpacity(0);

      // Wait fade duration
      await new Promise((res) => {
        timeoutRef.current = setTimeout(res, fadeDuration);
      });

      // Switch image
      setCurrentIndex(nextIndex);

      // Fade back in
      setFadeOpacity(1);
    }

    cycle();

    // Clear timeout on unmount or currentIndex/fadeOpacity changes
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  function handleDownload(mod: any) {
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

      {/* Background image with fade */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center filter blur-sm transition-opacity duration-2000 ease-in-out brightness-60"
        style={{
          backgroundImage: `url('${backgroundImages[currentIndex]}')`,
          opacity: fadeOpacity,
        }}
      ></div>

      <NavigationBar user={user} onLogout={handleLogout} />

      <main className="flex flex-col items-center py-10 px-6 min-h-screen bg-transparent text-white">
        {!user && <AuthForm onLoginSuccess={() => {}} />}

        {user && (
          <ModsDisplay userId={user.uid} onDownload={handleDownload} />
        )}
      </main>
    </>
  );
}
