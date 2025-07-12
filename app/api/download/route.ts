import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const fileKey = request.nextUrl.searchParams.get("file");

  const downloadMap: Record<string, { url: string; filename: string }> = {
    "kimdog-preset": {
      url: "https://www.dropbox.com/scl/fi/lq0ym8h9hn4ljc5cvc5b5/KimDog_Personal.ini?rlkey=pdai9vbt11ns7dcpw48ggbkex&st=9am2td53&dl=1",
      filename: "KimDog_Personal.ini",
    },
    "ac-drift-car-pack": {
      url: "https://www.dropbox.com/scl/fi/emsk38q7melrbe459f0zy/KimDog-s-Car-Pack.rar?rlkey=27n4vz55me0ex9vt1gflz86g0&st=cgiocfs7&dl=1",
      filename: "KimDog-Car-Pack.rar", // fixed apostrophe issue
    },
  };

  if (!fileKey || !(fileKey in downloadMap)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { url: downloadUrl, filename } = downloadMap[fileKey];

  try {
    const response = await fetch(downloadUrl);

    if (!response.ok || !response.body) {
      console.error("Fetch failed:", response.statusText);
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
// This code handles file downloads for the KimDog modding website.
// It uses a mapping of file keys to their download URLs and filenames.