import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskZen AI – Calendar-Powered Smart Todo App",
  description:
    "TaskZen AI is your all-in-one productivity hub: calendar-integrated tasks, powerful analytics, AI suggestions, and beautiful design. Organize, schedule, and conquer your day effortlessly.",
  keywords: [
    "todo app",
    "AI productivity",
    "calendar",
    "Next.js 15",
    "task manager",
    "Google login",
    "scheduling",
    "task analytics",
    "reminders",
    "modern UI",
  ],
  openGraph: {
    title: "TaskZen – Calendar-Powered Smart Todo App",
    description:
      "Boost productivity with TaskZen AI. Drag, drop, and schedule todos. Visualize progress, unlock streaks, and level up your workflow with a beautiful modern UI.",
    url: "https://your-domain.com",
    siteName: "TaskZen AI",
    images: [
      {
        url: "/og-image.png", // Make a cool Open Graph image!
        width: 1200,
        height: 630,
        alt: "TaskZen AI – modern calendar todo app",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskZen AI – Calendar-Powered Smart Todo App",
    description:
      "Calendar + todo, analytics, and AI in one beautiful dashboard. Try TaskZen AI for free!",
    images: ["/og-image.png"],
    site: "@yourbrand",
    creator: "@yourbrand",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
