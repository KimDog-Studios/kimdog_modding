"use client";

import React, { useMemo, useRef } from "react";
import ModCard from "./ModCards";

type ModType = {
  productId: string;
  game?: string;
  downloadUrl: string;
  title: string;
  author: string;
  image: string;
};

type ModsDisplayProps = {
  ownedMods: ModType[];
  loading: boolean;
  // Change here: onDownload receives the full mod
  onDownload: (mod: ModType) => void;
};

export default function ModsDisplay({
  ownedMods,
  loading,
  onDownload,
}: ModsDisplayProps) {
  const groupedMods = useMemo(() => {
    return ownedMods.reduce<Record<string, ModType[]>>((groups, mod) => {
      const gameName = mod.game || "Unknown Game";
      if (!groups[gameName]) groups[gameName] = [];
      groups[gameName].push(mod);
      return groups;
    }, {});
  }, [ownedMods]);

  const sortedGameNames = useMemo(() => Object.keys(groupedMods).sort(), [groupedMods]);

  if (loading) {
    return <div className="text-center text-gray-600 text-xl">Loading your mods...</div>;
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
              const anchorRef = useRef<HTMLAnchorElement>(null);

              const handleDownloadClick = () => {
                // Pass the whole mod to onDownload
                onDownload(mod);
              };

              return (
                <ModCard
                  key={mod.productId}
                  productId={mod.productId}
                  game={mod.game}
                  downloadUrl={mod.downloadUrl}
                  title={mod.title}
                  author={mod.author}
                  image={mod.image}
                  onDownloadClick={handleDownloadClick}
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
