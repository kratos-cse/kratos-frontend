import { NextResponse } from "next/server";
import { DEFAULT_EVENTS } from "@/data/defaultEvents";

export async function GET(request, { params }) {
  const { eventId } = params;
  const event = DEFAULT_EVENTS.find((e) => String(e.id) === String(eventId));
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}
