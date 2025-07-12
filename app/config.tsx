export interface ModData {
  title: string;
  author: string;
  image: string;
  downloadUrl: string;
  lastUpdated?: string;  // <-- optional
}


export const modList: ModData[] = [
  {
    title: "KimDog's Reshade Preset",
    author: "KimDog Studios",
    image: "/reshade.png",
    downloadUrl: "kimdog-preset",
    lastUpdated: "2025-07-12", // or "July 12, 2025"
  },
  {
    title: "KimDog's Drift Car Pack",
    author: "KimDog Studios",
    image: "/drift-car-pack.jpg",
    downloadUrl: "ac-drift-car-pack",
    lastUpdated: "2025-06-6",
  },
];
// This file defines the mod data structure and a list of mods for the KimDog modding website.
// Each mod has a title, author, image, download URL (file key), and last