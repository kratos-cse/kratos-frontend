import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";

export const metadata = {
  title: "Kratos'26",
  description: "KRATOS'26 participant frontend — redesign scaffold",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
