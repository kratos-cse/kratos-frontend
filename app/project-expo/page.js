import { redirect } from "next/navigation";

/** Legacy URL — catalogue filter is the Project Expo entry point. */
export default function ProjectExpoPage() {
  redirect("/events?category=PROJECT_EXPO");
}
