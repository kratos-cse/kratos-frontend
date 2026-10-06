import { EventsProvider } from "@/context/EventsProvider";

export const metadata = {
  title: "Register",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }) {
  return <EventsProvider>{children}</EventsProvider>;
}
