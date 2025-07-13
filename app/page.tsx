"use client";

import React, { useState, useEffect } from "react";
import NavigationBar from "./components/NavBar";
import { modList } from "./config";
import ModsDisplay from "./components/ModsDisplay";
import AuthForm from "./components/AuthForm";
import toast, { Toaster } from "react-hot-toast";

import { firestore } from "./lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

type ModType = typeof modList[number];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [ownedMods, setOwnedMods] = useState<ModType[]>([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchUserOwnedMods(firebaseUser.uid);
      } else {
        setOwnedMods([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchUserOwnedMods(uid: string) {
    setLoading(true);
    try {
      const q = query(collection(firestore, "purchases"), where("userId", "==", uid));
      const snapshot = await getDocs(q);

      const ownedProductIds = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.productId) {
          ownedProductIds.add(data.productId);
        }
      });

      const filteredMods = modList.filter((mod) => ownedProductIds.has(mod.productId));

      setOwnedMods(filteredMods);
    } catch (error) {
      toast.error("Failed to load owned mods.");
      console.error("Error fetching owned mods:", error);
    }
    setLoading(false);
  }

  function handleDownload(mod: ModType) {
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
          <ModsDisplay ownedMods={ownedMods} loading={loading} onDownload={handleDownload} />
        )}
      </main>
    </>
  );
}
