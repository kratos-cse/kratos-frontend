import { EventsProvider } from "@/context/EventsProvider";
import { PROJECT_EXPO_HEADLINE, PROJECT_EXPO_TAGLINE } from "@/data/projectExpoContent";

export const metadata = {
  title: `${PROJECT_EXPO_HEADLINE} | KRATOS'26`,
  description: PROJECT_EXPO_TAGLINE,
  alternates: { canonical: "/project-expo" },
};

export default function ProjectExpoLayout({ children }) {
  return <EventsProvider>{children}</EventsProvider>;
}
