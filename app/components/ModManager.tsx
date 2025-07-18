// ModsDisplay.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

type ModType = {
  productId: string;
  game?: string;
  downloadUrl?: string;
  name: string;
  author: string;
  image: string;
  description?: string;
  lastUpdated?: string;
};

type ModsDisplayProps = {
  userId: string;
  onDownload: (mod: ModType) => void;
};

function sanitizeImageUrl(url: string | undefined): string {
  if (!url) return "/default-mod-icon.png";

  if (
    url.startsWith("https://firebasestorage.googleapis.com") ||
    url.startsWith("https://upload.wikimedia.org") ||
    url.startsWith("https://raw.githubusercontent.com") ||
    url.startsWith("https://lh3.googleusercontent.com")
  ) {
    return url;
  }

  return url.startsWith("http") ? url : `/default-mod-icon.png`;
}

const productCache: Record<string, any> = {}; // 🔄 Cache to avoid duplicate Firestore reads

export default function ModsDisplay({ userId, onDownload }: ModsDisplayProps) {
  const [ownedMods, setOwnedMods] = useState<ModType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserPurchases() {
      setLoading(true);

      try {
        const purchasesRef = collection(db, "purchases");
        const q = query(purchasesRef, where("userId", "==", userId));
        const purchasesSnapshot = await getDocs(q);

        if (purchasesSnapshot.empty) {
          setOwnedMods([]);
          return;
        }

        const productIds = Array.from(
          new Set(purchasesSnapshot.docs.map((doc) => doc.data().id).filter(Boolean))
        );

        const chunkSize = 10;
        for (let i = 0; i < productIds.length; i += chunkSize) {
          const chunk = productIds
            .slice(i, i + chunkSize)
            .filter((id) => !(id in productCache)); // Skip cached

          if (chunk.length > 0) {
            const productsRef = collection(db, "products");
            const productQuery = query(productsRef, where("__name__", "in", chunk));
            const productSnapshot = await getDocs(productQuery);

            productSnapshot.forEach((doc) => {
              productCache[doc.id] = doc.data();
            });
          }
        }

        const modsFromPurchases: ModType[] = purchasesSnapshot.docs.map((doc) => {
          const purchase = doc.data();
          const productId = purchase.id ?? "unknown-product-id";
          const product = productCache[productId] ?? {};

          return {
            productId,
            game: purchase.game ?? product.game ?? "Unknown Game",
            downloadUrl: purchase.downloadUrl ?? product.downloadUrl ?? "",
            name: purchase.name ?? product.name ?? "Untitled Mod",
            author: purchase.author ?? product.author ?? "Unknown Author",
            image: sanitizeImageUrl(product.image),
            description: purchase.description ?? product.description,
            lastUpdated: purchase.lastUpdated ?? product.lastUpdated,
          };
        });

        setOwnedMods(modsFromPurchases);
      } catch (error) {
        console.error("Error fetching user purchases:", error);
        setOwnedMods([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPurchases();
  }, [userId]);

  const uniqueMods = useMemo(() => {
    const seen = new Set<string>();
    return ownedMods.filter((mod) => {
      if (seen.has(mod.productId)) return false;
      seen.add(mod.productId);
      return true;
    });
  }, [ownedMods]);

  const groupedMods = useMemo(() => {
    return uniqueMods.reduce<Record<string, ModType[]>>((groups, mod) => {
      const gameName = mod.game || "Unknown Game";
      if (!groups[gameName]) groups[gameName] = [];
      groups[gameName].push(mod);
      return groups;
    }, {});
  }, [uniqueMods]);

  const sortedGameNames = useMemo(() => Object.keys(groupedMods).sort(), [groupedMods]);

  const anchorRefs = useRef<Record<string, React.RefObject<HTMLAnchorElement | null>>>({});

  sortedGameNames.forEach((game) => {
    groupedMods[game].forEach((mod) => {
      if (!anchorRefs.current[mod.productId]) {
        anchorRefs.current[mod.productId] = React.createRef<HTMLAnchorElement>();
      }
    });
  });

  if (loading) {
    return <div className="text-center text-gray-600 text-xl">Loading your mods...</div>;
  }

  if (!loading && ownedMods.length === 0) {
    return <div className="text-center text-gray-600 text-xl">You don't own any mods yet.</div>;
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
                  name={mod.name}
                  author={mod.author}
                  image={mod.image}
                  game={mod.game}
                  downloadUrl={mod.downloadUrl ?? ""}
                  lastUpdated={mod.lastUpdated}
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

// ---------- ModCard Component ----------

type ModCardProps = {
  name: string;
  author: string;
  image: string;
  downloadUrl: string;
  game?: string;
  lastUpdated?: string;
  onDownloadClick: () => void;
  anchorRef: React.RefObject<HTMLAnchorElement | null>;
};

function ModCard({
  name,
  author,
  image,
  downloadUrl,
  lastUpdated,
  game,
  onDownloadClick,
  anchorRef,
}: ModCardProps) {
  let formattedDate = "";
  if (lastUpdated) {
    const dateObj = new Date(lastUpdated);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const isKimDog = author === "KimDog Studios";
  const apiDownloadUrl = `/api/download?file=${encodeURIComponent(downloadUrl)}`;

  return (
    <div className="mod-card bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-transparent w-80 flex-shrink-0">
      <div className="w-full h-48 relative">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl"
          unoptimized={false}
          priority={false}
        />
        {formattedDate && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Last Update: {formattedDate}
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-white">{name}</h2>
        <p className="text-sm text-gray-400 flex items-center gap-1">
          by <span className="font-medium">{author}</span>
          {isKimDog && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
            </svg>
          )}
        </p>
        {game && (
          <p className="text-sm font-semibold text-blue-400 tracking-wide">{game}</p>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{
            marginTop: 12,
            textTransform: "none",
            borderRadius: 8,
          }}
          onClick={onDownloadClick}
        >
          Download
        </Button>

        <a
          href={apiDownloadUrl}
          download
          ref={anchorRef}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            box-shadow:
              0 0 10px #a855f7,
              inset 0 0 10px #a855f7;
          }
          50% {
            box-shadow:
              0 0 20px #d8b4fe,
              inset 0 0 20px #d8b4fe;
          }
          100% {
            box-shadow:
              0 0 10px #a855f7,
              inset 0 0 10px #a855f7;
          }
        }

        .mod-card {
          border: 2px solid transparent;
          border-radius: 1rem;
          transition: border-color 0.4s ease;
          box-shadow:
            0 0 12px rgba(168, 85, 247, 0.6),
            inset 0 0 10px rgba(168, 85, 247, 0.5);
          will-change: box-shadow;
        }

        .mod-card:hover {
          border-color: #a855f7;
          animation: pulseGlow 2s infinite ease-in-out;
          cursor: pointer;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}