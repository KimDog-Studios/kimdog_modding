"use client";

import Image from "next/image";
import Button from "@mui/material/Button";
import { ModData } from "../config";

export default function ModCard({ title, author, image, downloadUrl }: ModData) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-80 flex-shrink-0">
      <div className="w-full h-48 relative">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">
          by <span className="font-medium">{author}</span>
        </p>

        <a
          href={downloadUrl}
          style={{ textDecoration: "none" }}
          // open in same tab to avoid redirect
          download
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "12px", textTransform: "none", borderRadius: "8px" }}
          >
            Download
          </Button>
        </a>
      </div>
    </div>
  );
}
