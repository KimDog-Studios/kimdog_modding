export interface ModData {
  title: string;
  author: string;
  image: string;
  downloadUrl: string;
  lastUpdated?: string;
  game?: string;
  onDownloadClick?: () => void; // add this line
}

export const modList: ModData[] = [
  {
    title: "KimDog's Reshade Preset",
    author: "KimDog Studios",
    image: "/reshade.png",
    downloadUrl: "kimdog-preset",
    lastUpdated: "2025-07-12",
    game: "Reshade",  // example game
  },
  {
    title: "KimDog's Drift Car Pack",
    author: "KimDog Studios",
    image: "/drift-car-pack.jpg",
    downloadUrl: "ac-drift-car-pack",
    lastUpdated: "2025-06-06",
    game: "Assetto Corsa",  // example game
  },
  {
    title: "KimDog's Mega Map",
    author: "KimDog Studios",
    image: "/kimdog.png",
    downloadUrl: "ats-kimdog-mega-map",
    lastUpdated: "2025-07-08",
    game: "American Truck Simulator",  // example game
  },
  {
    title: "KimDog's Mega Mod",
    author: "KimDog Studios",
    image: "/kimdog.png",
    downloadUrl: "ats-kimdog-mega-mod",
    lastUpdated: "2025-07-12",
    game: "American Truck Simulator",  // example game
  },
];
