import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Precio Luz",
    short_name: "Precio Luz",
    description: "Consulta el precio horario PVPC de la electricidad.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#f8fafc",
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
