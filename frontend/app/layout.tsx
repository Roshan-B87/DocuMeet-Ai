import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocuMeet AI — Multi-Agent Document Debate",
  description:
    "Upload your documents, assign them AI personas, and watch them collaborate and debate to solve your toughest problems. Powered by NVIDIA NIM.",
  keywords: ["AI", "document analysis", "multi-agent", "debate", "NVIDIA NIM"],
  openGraph: {
    title: "DocuMeet AI",
    description: "Multi-agent document debate powered by deep AI reasoning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
