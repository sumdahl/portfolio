import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Updated font
import "./globals.css";
import { Analytics } from "@/components/shared/Analytics";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Added weights for Poppins
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sumiran Dahal - Full-Stack Software Engineer",
    template: "%s | Sumiran Dahal",
  },
  description:
    "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web development. Explore my projects, blog, and technical writing.",
  keywords: [
    "Sumiran Dahal",
    "Full-Stack Developer",
    "Software Engineer",
    "TypeScript",
    "React",
    "Next.js",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Sumiran Dahal", url: "https://github.com/sumdahl" }],
  creator: "Sumiran Dahal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sumirandahal.com.np",
    siteName: "Sumiran Dahal Portfolio",
    title: "Sumiran Dahal - Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web development.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sumiran Dahal Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumiran Dahal - Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web development.",
    creator: "@sumiran_dahal",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased font-sans`} suppressHydrationWarning>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}


