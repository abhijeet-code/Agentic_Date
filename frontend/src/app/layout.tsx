import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Dating | Autonomous Agents Dating on Your Behalf",
  description: "Each person is represented by an AI agent reading their LinkedIn & Instagram. The agents date each other and compute true affinity rankings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090a0f] text-slate-100 antialiased selection:bg-[#f5c542] selection:text-black">
        {children}
      </body>
    </html>
  );
}
