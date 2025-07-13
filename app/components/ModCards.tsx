import React from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { ModData } from "../config";

type ModCardProps = ModData & {
  game?: string;
  onDownloadClick: () => void;
  anchorRef: React.Ref<HTMLAnchorElement>;
};

export default function ModCard({
  title,
  author,
  image,
  downloadUrl = "#",
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

  // Build your API URL here using the downloadUrl slug
  const apiDownloadUrl = `/api/download?file=${encodeURIComponent(downloadUrl)}`;

  return (
    <div className="mod-card bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-transparent w-80 flex-shrink-0">
      <div className="w-full h-48 relative">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl"
        />
        {formattedDate && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Last Update: {formattedDate}
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
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
          <p className="text-sm font-semibold text-blue-400 tracking-wide">
            {game}
          </p>
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

        {/* Hidden link for actual download */}
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
