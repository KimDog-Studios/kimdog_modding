"use client";

import Image from "next/image";
import Button from "@mui/material/Button";
import { ModData } from "../config";

export default function ModCard({
  title,
  author,
  image,
  downloadUrl,
  lastUpdated,
}: ModData) {
  // Format lastUpdated date string into "Month Day, Year" e.g. July 12, 2025
  let formattedDate = "";
  if (lastUpdated) {
    const dateObj = new Date(lastUpdated);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="w-80 flex-shrink-0 rounded-3xl bg-gray-900 bg-opacity-80 backdrop-blur-md border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden">
      <div className="relative w-full h-48 rounded-t-3xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-3xl transition-transform duration-500 hover:scale-105"
        />
        {formattedDate && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs font-semibold px-3 py-1 rounded-lg select-none shadow-md">
            Last Update: {formattedDate}
          </div>
        )}
      </div>
      <div className="p-6 space-y-3">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-gray-300">
          by <span className="font-semibold">{author}</span>
        </p>

        <a href={downloadUrl} download style={{ textDecoration: "none" }}>
  <Button
    variant="contained"
    fullWidth
    sx={{
      marginTop: 2,
      borderRadius: 3,
      textTransform: "none",
      fontWeight: "bold",
      fontSize: "1rem",
      boxShadow: "0 0 8px 0 rgba(0, 123, 255, 0.7)",
      transition: "all 0.4s ease",
      backgroundColor: "#1976d2",
      "&:hover": {
        backgroundColor: "#115293",
        boxShadow:
          "0 0 15px 3px rgba(25, 118, 210, 0.8), 0 0 25px 8px rgba(25, 118, 210, 0.4)",
        transform: "scale(1.05)",
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    }}
  >
    Download
  </Button>
</a>
      </div>
    </div>
  );
}
