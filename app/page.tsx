"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { modList } from "./config";
import ModCard from "./components/ModCards";

export default function Home() {
  const fullTitle = "Download Page";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!isDeleting) {
        indexRef.current += 1;
        setDisplayedTitle(fullTitle.slice(0, indexRef.current));

        if (indexRef.current === fullTitle.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), 1000);
          return;
        }

        timeoutRef.current = setTimeout(tick, 150);
      } else {
        indexRef.current -= 1;
        setDisplayedTitle(fullTitle.slice(0, indexRef.current));

        if (indexRef.current === 0) {
          setIsDeleting(false);
          timeoutRef.current = setTimeout(tick, 500);
          return;
        }

        timeoutRef.current = setTimeout(tick, 100);
      }
    };

    timeoutRef.current = setTimeout(tick, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDeleting]);

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen p-8 pt-0 gap-4 font-[family-name:var(--font-geist-sans)] text-black"
      style={{
        backgroundImage: 'url("/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Logo */}
      <div
        className="relative w-64 h-64 mb-6 rounded-xl overflow-hidden drop-shadow-[0_0_12px_rgba(0,0,0,0.7)] animate-pulse"
        style={{ animationDuration: "4s" }}
      >
        {/* Replace logo.png with black-logo.png */}
        <Image
          src="/logo.png" 
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Typewriter title */}
      <h1 className="text-5xl font-extrabold text-center mb-8 tracking-wide drop-shadow-lg font-mono">
        {displayedTitle}
        <span className="inline-block w-3 h-10 bg-black animate-blink ml-1 align-bottom"></span>
      </h1>

      {/* Cards container */}
      <div className="flex flex-row gap-6 overflow-x-auto px-4 w-full max-w-[90vw] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900">
        {modList.map(({ title, author, image, downloadUrl, lastUpdated }) => (
          <ModCard
            key={title}
            title={title}
            author={author}
            image={image}
            downloadUrl={`/api/download?file=${downloadUrl}`}
            lastUpdated={lastUpdated}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% {
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
