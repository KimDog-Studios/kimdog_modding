import { NextRequest, NextResponse } from "next/server";

type DownloadInfo = { url: string; filename: string };

const DOWNLOAD_MAP: Record<string, DownloadInfo> = {
  "kimdog-preset": {
    url: "https://www.dropbox.com/scl/fi/lq0ym8h9hn4ljc5cvc5b5/KimDog_Personal.ini?rlkey=pdai9vbt11ns7dcpw48ggbkex&st=9am2td53&dl=1",
    filename: "KimDog_Personal.ini",
  },
  "kimdogs-drift-car-pack": {
    url: "https://www.dropbox.com/scl/fi/emsk38q7melrbe459f0zy/KimDog-s-Car-Pack.rar?rlkey=27n4vz55me0ex9vt1gflz86g0&st=cgiocfs7&dl=1",
    filename: "KimDog-Car-Pack.rar",
  },
  "ats-kimdog-mega-map": {
    url: "https://www.dropbox.com/scl/fi/tkqk4zraz2ro6nkboyzdz/KimDog-s-Network-Mega-Map.scs?rlkey=20lz0i79pujo5lv2z69m3axcy&st=60o3s2ra&dl=1",
    filename: "[KimDog's-Network] Mega Map.scs",
  },
  "ats-kimdog-mega-mod": {
    url: "https://www.dropbox.com/scl/fi/erymilk3j8hy7milnde2o/KimDog-s-Network-Mega-Mod.scs?rlkey=pptqjx1q0sveihi3g2uox2kgt&st=bgror5lw&dl=1",
    filename: "[KimDog's-Network] Mega Mod.scs",
  },
};

export async function GET(request: NextRequest): Promise<Response> {
  const fileKey = request.nextUrl.searchParams.get("file");

  if (!fileKey) {
    return NextResponse.json({ error: "Missing 'file' query parameter." }, { status: 400 });
  }

  const fileData = DOWNLOAD_MAP[fileKey];
  if (!fileData) {
    return NextResponse.json({ error: `No download found for key: '${fileKey}'` }, { status: 404 });
  }

  try {
    const fetchResponse = await fetch(fileData.url);

    if (!fetchResponse.ok || !fetchResponse.body) {
      console.error(`[DOWNLOAD ERROR] Failed to fetch ${fileKey}:`, fetchResponse.statusText);
      return NextResponse.json({ error: "Failed to fetch the requested file." }, { status: 502 });
    }

    return new Response(fetchResponse.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileData.filename}"`,
        "Content-Type": "application/octet-stream",
        // Optional security headers:
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error(`[SERVER ERROR] Exception while downloading '${fileKey}':`, error);
    return NextResponse.json({ error: "Internal server error while processing your request." }, { status: 500 });
  }
}
