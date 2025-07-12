export interface ModData {
  title: string;
  author: string;
  image: string;
  downloadUrl: string; // this is now the file key for the API
}

export const modList: ModData[] = [
  {
    title: "KimDog's Reshade Preset",
    author: "KimDog Studios",
    image: "/mods/mod1.jpg",
    downloadUrl: "kimdog-preset", // key matching API map
  },
  {
    title: "KimDog's Drift Car Pack",
    author: "KimDog Studios",
    image: "/mods/mod2.jpg",
    downloadUrl: "ac-drift-car-pack", // add in API downloadMap if used
  },
];
