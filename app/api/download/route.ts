import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileKey = url.searchParams.get("file");

  // Safe mapping of file keys to environment-based URLs + filenames
  const downloadMap: Record<string, { url: string; filename: string }> = {
    "kimdog-preset": {
      url: process.env.FILE_KIMDOG_PRESET!,
      filename: "KimDog_Personal.ini",
    },
    "ac-drift-car-pack": {
      url: process.env.FILE_DRIFT_PACK!,
      filename: "KimDog's-Car-Pack.rar",
    },
    // Add more as needed
  };

  if (!fileKey || !(fileKey in downloadMap)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { url: downloadUrl, filename } = downloadMap[fileKey];

  try {
    const response = await fetch(downloadUrl);

    if (!response.ok || !response.body) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
// Ensure that the environment variables FILE_KIMDOG_PRESET and FILE_DRIFT_PACK are set
// in your environment for this to work correctly.