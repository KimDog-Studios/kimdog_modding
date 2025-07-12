"use client";

import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "./components/NavBar"; // Adjust path if needed
import { modList } from "./config";
import ModCard from "./components/ModCards";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const fullTitle = "Download Page";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(true);
  const [hue, setHue] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  const [downloadSpeedMbps, setDownloadSpeedMbps] = useState<number | null>(null);

  // Typewriter effect for title
  useEffect(() => {
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

  // Loading mods simulation
  useEffect(() => {
    const loadTimeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(loadTimeout);
  }, []);

  // Animate hue for background effects if needed
  useEffect(() => {
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

  // Measure real download speed once on mount
  useEffect(() => {
    const testImage = new window.Image();
    const imageSizeBytes = 500 * 1024; // Approx 500KB
    const startTime = performance.now();

    testImage.src =
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg?" +
      startTime;

    testImage.onload = () => {
      const endTime = performance.now();
      const durationSeconds = (endTime - startTime) / 10;
      const bitsLoaded = imageSizeBytes * 8;
      const speedBps = bitsLoaded / durationSeconds;
      const speedMbps = speedBps / (1024 * 1024);
      setDownloadSpeedMbps(speedMbps);
    };

    testImage.onerror = () => {
      setDownloadSpeedMbps(null);
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

  // Real-time download simulation based on detected speed
  const simulateDownloadToast = (downloadUrl: string) => {
    const toastId = toast.loading("Getting Download Link...");

    const speed = downloadSpeedMbps ?? 10;
    const totalDurationMs = 500;
    const stepInterval = Math.max(100, totalDurationMs / (speed * 2));
    let progress = 0;

    const interval = setInterval(() => {
      progress += 5;
      if (progress > 100) progress = 100;

      toast.loading(`Getting Download Link... ${progress}%`, { id: toastId });

      if (progress >= 100) {
        clearInterval(interval);
        toast.success("✅ Download started!", { id: toastId });
        window.location.href = downloadUrl;
      }
    }, stepInterval);
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen p-8 pt-[80px] gap-8 font-[family-name:var(--font-geist-sans)] text-black"
      style={{
        backgroundImage: 'url("/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NavigationBar />

      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      {/* Typewriter Title */}
      <h1 className="text-5xl font-extrabold text-center mb-6 tracking-wide drop-shadow-lg font-mono mt-20">
        {displayedTitle}
        <span className="inline-block w-3 h-10 bg-black animate-blink ml-1 align-bottom"></span>
      </h1>

      {loading ? (
        <div className="text-white text-2xl font-semibold mt-12 select-none">
          Loading mods...
        </div>
      ) : (
        <div className="flex gap-12 overflow-x-auto w-full max-w-[90vw] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900">
          {sortedGameNames.map((game) => (
            <div key={game} className="min-w-[20rem] flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-md text-center">
                {game}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {groupedMods[game].map((mod) => {
                  const anchorRef = React.createRef<HTMLAnchorElement>();
                  return (
                    <ModCard
                      key={mod.title}
                      title={mod.title}
                      author={mod.author}
                      image={mod.image}
                      downloadUrl="#"
                      onDownloadClick={() =>
                        simulateDownloadToast(
                          `/api/download?file=${encodeURIComponent(mod.downloadUrl)}`
                        )
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

        /* Stronger glow effect for mod cards on hover, no movement */
        .mod-card {
          border: 2px solid transparent;
          border-radius: 12px;
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
          box-shadow:
            0 0 10px rgba(128, 0, 255, 0.6),
            inset 0 0 8px rgba(128, 0, 255, 0.4);
          cursor: pointer;
          will-change: box-shadow;
        }
        .mod-card:hover {
          border-color: #a855f7; /* brighter violet */
          box-shadow:
            0 0 25px #a855f7,
            0 0 50px #a855f7,
            inset 0 0 25px #a855f7;
          /* No transform here, so no scaling or movement */
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
