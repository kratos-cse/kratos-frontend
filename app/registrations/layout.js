import { EventsProvider } from "@/context/EventsProvider";

export const metadata = {
  title: "My registrations",
  robots: { index: false, follow: false },
};

export default function RegistrationsLayout({ children }) {
  return <EventsProvider>{children}</EventsProvider>;
}
