import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PJTECH Kasir UMKM",
    short_name: "PJTECH Kasir",
    description:
      "Aplikasi kasir (POS) multi-bisnis terlengkap untuk UMKM. Pantau laba rugi secara real-time.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon-192x192.png?v=4",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png?v=4",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["business", "finance", "productivity"],
    lang: "id",
    dir: "ltr",
  };
}
