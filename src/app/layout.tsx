import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Precio de la luz hoy por horas | Precio Luz",
    template: "%s | Precio Luz",
  },
  description:
    "Consulta el precio de la luz hoy por horas, identifica las franjas más baratas y calcula el coste estimado de tus electrodomésticos.",
  applicationName: "Precio Luz",
  authors: [
    { name: "doscientos", url: "https://doscientos.es" },
    { name: "Pol Gubau", url: "https://pogubau.com" },
  ],
  creator: "doscientos",
  publisher: "doscientos",
  category: "Utilities",
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Precio Luz",
    title: "Precio de la luz hoy por horas",
    description: "Consulta las horas más baratas y calcula el coste estimado de tus usos.",
    ...(siteUrl ? { url: "/", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Precio de la luz hoy por horas",
    description: "Consulta las horas más baratas y calcula el coste estimado de tus usos.",
    ...(siteUrl ? { images: ["/opengraph-image"] } : {}),
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Precio Luz",
    statusBarStyle: "default",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Precio Luz",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  description: "Consulta el precio de la luz por horas y calcula el coste estimado de usos domésticos.",
  publisher: {
    "@type": "Organization",
    name: "doscientos",
    url: "https://doscientos.es",
  },
  author: {
    "@type": "Person",
    name: "Pol Gubau",
    url: "https://pogubau.com",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-950`}>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  );
}
