"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { modList } from "./config";
import ModCard from "./components/ModCards";

export default function Home() {
  const fullTitle = "Download Page";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // For loading delay
  const [loading, setLoading] = useState(true);

  // For download confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState<string | null>(null);

  // For continuous rainbow hue cycling
  const [hue, setHue] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Typewriter effect
    const tick = () => {
      const nextIndex = isDeleting ? indexRef.current - 1 : indexRef.current + 1;
      setDisplayedTitle(fullTitle.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (!isDeleting && nextIndex === fullTitle.length) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && nextIndex === 0) {
        setIsDeleting(false);
        timeoutRef.current = setTimeout(tick, 500);
      } else {
        timeoutRef.current = setTimeout(tick, isDeleting ? 100 : 150);
      }
    };

    timeoutRef.current = setTimeout(tick, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDeleting]);

  useEffect(() => {
    // Simulate loading delay on mods
    const loadTimeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(loadTimeout);
  }, []);

  useEffect(() => {
    // Animate hue continuously
    const animate = () => {
      setHue((prevHue) => (prevHue + 1) % 360);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Group mods by game name
  const groupedMods = modList.reduce((groups, mod) => {
    const game = mod.game ?? "Unknown Game";
    if (!groups[game]) groups[game] = [];
    groups[game].push(mod);
    return groups;
  }, {} as Record<string, typeof modList>);

  const sortedGameNames = Object.keys(groupedMods).sort();

  // Handler for download button click
  const handleDownloadClick = (downloadUrl: string) => {
    setPendingDownloadUrl(downloadUrl);
    setShowConfirm(true);
  };

  // Confirm download
  const confirmDownload = () => {
    if (pendingDownloadUrl) {
      window.location.href = pendingDownloadUrl;
    }
    setShowConfirm(false);
    setPendingDownloadUrl(null);
  };

  // Cancel download
  const cancelDownload = () => {
    setShowConfirm(false);
    setPendingDownloadUrl(null);
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen p-8 pt-0 gap-8 font-[family-name:var(--font-geist-sans)] text-black"
      style={{
        backgroundImage: 'url("/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Logo */}
      <div
        className="relative w-64 h-64 mb-4 rounded-xl overflow-hidden drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] animate-pulse"
        style={{ animationDuration: "4s", filter: "drop-shadow(0 0 10px red)" }}
      >
        {/* Tint the logo red */}
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          style={{
            objectFit: "contain",
            filter:
              "brightness(0) saturate(100%) invert(18%) sepia(96%) saturate(7421%) hue-rotate(350deg) brightness(94%) contrast(120%)",
          }}
          priority
        />
      </div>

      {/* Typewriter Title with continuous rainbow color cycling */}
      <h1
        className="text-5xl font-extrabold text-center mb-6 tracking-wide drop-shadow-lg font-mono"
        style={{
          color: `hsl(${hue}, 100%, 55%)`,
          transition: "color 1.0s linear",
        }}
      >
        {displayedTitle}
        <span className="inline-block w-3 h-10 bg-black animate-blink ml-1 align-bottom"></span>
      </h1>

      {loading ? (
        <div className="text-white text-2xl font-semibold mt-12 select-none">Loading mods...</div>
      ) : (
        <div className="flex gap-12 overflow-x-auto w-full max-w-[90vw] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900">
          {sortedGameNames.map((game) => (
            <div key={game} className="min-w-[20rem] flex flex-col gap-4">
              {/* Game Title */}
              <h2 className="text-3xl font-bold text-white drop-shadow-md text-center">{game}</h2>

              {/* Mod cards in 2 columns grid */}
              <div className="grid grid-cols-2 gap-4">
                {groupedMods[game].map((mod) => {
                  const anchorRef = React.createRef<HTMLAnchorElement>();
                  return (
                    <ModCard
                      key={mod.title}
                      title={mod.title}
                      author={mod.author}
                      image={mod.image}
                      downloadUrl="#" // dummy url to disable default link behavior
                      onDownloadClick={() =>
                        handleDownloadClick(`/api/download?file=${encodeURIComponent(mod.downloadUrl)}`)
                      }
                      lastUpdated={mod.lastUpdated}
                      game={mod.game}
                      anchorRef={anchorRef}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={cancelDownload}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Download</h3>
            <p className="mb-6">Do you want to continue downloading this mod?</p>
            <div className="flex justify-center gap-6">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={confirmDownload}
              >
                Continue
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={cancelDownload}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blink Cursor Animation */}
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </div>
  );
}
