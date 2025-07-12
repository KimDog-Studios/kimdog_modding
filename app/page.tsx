"use client";

import Image from "next/image";
import Button from "@mui/material/Button";
import { modList } from "./config"; // adjust path if needed
import ModCard from "./components/ModCards"; // create this component

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 gap-4 font-[family-name:var(--font-geist-sans)]">
      <Image
        src="/logo.png"
        alt="Logo"
        width={400}
        height={400}
        priority
      />
      <h1 className="text-4xl font-black text-center mb-8">Download Page</h1>

      {/* Cards container: horizontal scroll on small screens */}
      <div className="flex flex-row gap-6 overflow-x-auto px-4 w-full max-w-[90vw]">
        {modList.map(({ title, author, image, downloadUrl }) => (
          <ModCard
            key={title}
            title={title}
            author={author}
            image={image}
            // update downloadUrl to API route with file key (assumes downloadUrl is key string)
            downloadUrl={`/api/download?file=${downloadUrl}`}
          />
        ))}
      </div>
    </div>
  );
}
