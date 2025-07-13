import React, { useEffect, useMemo, useRef, useState } from "react";
import ModCard from "./ModCards";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

type ModType = {
  productId: string; // maps from Firestore 'id'
  game?: string;     // from Firestore 'game'
  downloadUrl?: string; // from Firestore 'downloadUrl'
  title: string;     // from Firestore 'name'
  author: string;    // from Firestore 'author'
  image: string;     // from Firestore 'image'
  description?: string;  // from Firestore 'description'
};

type ModsDisplayProps = {
  userId: string;
  onDownload: (mod: ModType) => void;
};

export default function ModsDisplay({ userId, onDownload }: ModsDisplayProps) {
  const [ownedMods, setOwnedMods] = useState<ModType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserPurchases() {
      setLoading(true);
      try {
        const purchasesRef = collection(db, "purchases"); // your Firestore collection
        const q = query(purchasesRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);

        const modsFromPurchases: ModType[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          if (!data.name || !data.image || !data.game) {
            console.warn(
              `Purchase doc ${doc.id} missing fields (name, image, or game):`,
              data
            );
          }

          return {
            productId: data.id ?? "unknown-product-id",
            game: data.game ?? "Unknown Game",
            downloadUrl: data.downloadUrl ?? "",
            title: data.name ?? "Untitled Mod",
            author: data.author ?? "Unknown Author",
            image: data.image ?? "/default-mod-icon.png",
            description: data.description,
          };
        });

        setOwnedMods(modsFromPurchases);
      } catch (error) {
        console.error("Error fetching user purchases:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPurchases();
  }, [userId]);

  // Deduplicate mods by productId
  const uniqueMods = useMemo(() => {
    const seen = new Set<string>();
    return ownedMods.filter((mod) => {
      if (seen.has(mod.productId)) return false;
      seen.add(mod.productId);
      return true;
    });
  }, [ownedMods]);

  // Group mods by game
  const groupedMods = useMemo(() => {
    return uniqueMods.reduce<Record<string, ModType[]>>((groups, mod) => {
      const gameName = mod.game || "Unknown Game";
      if (!groups[gameName]) groups[gameName] = [];
      groups[gameName].push(mod);
      return groups;
    }, {});
  }, [uniqueMods]);

  const sortedGameNames = useMemo(() => Object.keys(groupedMods).sort(), [
    groupedMods,
  ]);

  const anchorRefs = useRef<Record<string, React.RefObject<HTMLAnchorElement | null>>>({});

  sortedGameNames.forEach((game) => {
    groupedMods[game].forEach((mod) => {
      if (!anchorRefs.current[mod.productId]) {
        anchorRefs.current[mod.productId] = React.createRef<HTMLAnchorElement>();
      }
    });
  });

  if (loading) {
    return (
      <div className="text-center text-gray-600 text-xl">
        Loading your mods...
      </div>
    );
  }

  if (!loading && ownedMods.length === 0) {
    return (
      <div className="text-center text-gray-600 text-xl">
        You don't own any mods yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl flex flex-col gap-12">
      <h1 className="text-4xl font-bold text-center mb-8">Your Mods</h1>

      {sortedGameNames.map((game) => (
        <section key={game}>
          <h2 className="text-2xl font-semibold mb-4">{game}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groupedMods[game].map((mod) => {
              const anchorRef = anchorRefs.current[mod.productId];

              return (
                <ModCard
                  key={mod.productId}
                  productId={mod.productId}
                  game={mod.game}
                  downloadUrl={mod.downloadUrl ?? ""}
                  title={mod.title}
                  author={mod.author}
                  image={mod.image}
                  onDownloadClick={() => onDownload(mod)}
                  anchorRef={anchorRef}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
