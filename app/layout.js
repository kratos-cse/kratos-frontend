import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { AuthProvider } from "@/context/AuthProvider";
import BackgroundCanvas from "@/components/BackgroundCanvas";

export const metadata = {
  title: "Kratos'26 — ACE National Symposium",
  description:
    "Kratos'26 — the ACE National Symposium at SRM Easwari Engineering College. Enter the timeline, choose your branch, reach the nexus.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ModalProvider>
            <BackgroundCanvas />
            <div className="grid-bg" />
            <div className="grain" />
            {children}
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
