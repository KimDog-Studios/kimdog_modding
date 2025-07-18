"use client";

import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "./components/NavBar/NavBar";
import ModsDisplay from "./components/ModManager";
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
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  const fadeDuration = 900;
  const displayDuration = 15000;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);
        window.location.href = "/api/login";
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }

  useEffect(() => {
    async function cycle() {
      await new Promise((res) => {
        timeoutRef.current = setTimeout(res, displayDuration);
      });

      const nextIndex = (currentIndex + 1) % backgroundImages.length;
      await preloadImage(backgroundImages[nextIndex]);

      setFadeOpacity(0);

      await new Promise((res) => {
        timeoutRef.current = setTimeout(res, fadeDuration);
      });

      setCurrentIndex(nextIndex);
      setFadeOpacity(1);
    }

    cycle();

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

  if (loading) {
    return null;
  }

  return (
    <>
      <Toaster position="top-center" />

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center filter blur-sm transition-opacity duration-2000 ease-in-out brightness-60"
        style={{
          backgroundImage: `url('${backgroundImages[currentIndex]}')`,
          opacity: fadeOpacity,
        }}
      ></div>

      <NavigationBar user={user} onLogout={handleLogout} />

      <main className="flex flex-col items-center py-10 px-6 min-h-screen bg-transparent text-white">
        {user && <ModsDisplay userId={user.uid} onDownload={handleDownload} />}
      </main>
    </>
  );
}