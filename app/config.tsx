export interface ModData {
  productId: string;   // Add this line
  title: string;
  author: string;
  image: string;
  downloadUrl: string;
  lastUpdated?: string;
  game?: string;
  onDownloadClick?: () => void;
}

export const modList: ModData[] = [
  {
    productId: "kimdog-preset",
    title: "KimDog's Reshade Preset",
    author: "KimDog Studios",
    image: "/reshade.png",
    downloadUrl: "kimdog-preset",
    lastUpdated: "2025-07-12",
    game: "Reshade",
  },
  {
    productId: "kimdogs-drift-car-pack",
    title: "KimDog's Drift Car Pack",
    author: "KimDog Studios",
    image: "/drift-car-pack.jpg",
    downloadUrl: "ac-drift-car-pack",
    lastUpdated: "2025-06-06",
    game: "Assetto Corsa",
  },
  {
    productId: "ats-kimdog-mega-map",
    title: "KimDog's Mega Map",
    author: "KimDog Studios",
    image: "/kimdog.png",
    downloadUrl: "ats-kimdog-mega-map",
    lastUpdated: "2025-07-08",
    game: "American Truck Simulator",
  },
  {
    productId: "ats-kimdog-mega-mod",
    title: "KimDog's Mega Mod",
    author: "KimDog Studios",
    image: "/kimdog.png",
    downloadUrl: "ats-kimdog-mega-mod",
    lastUpdated: "2025-07-12",
    game: "American Truck Simulator",
  },
];
