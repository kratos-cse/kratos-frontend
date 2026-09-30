import { NextResponse } from "next/server";

/**
 * Returns browser-needed config from server-only env.
 * GOOGLE_CLIENT_ID is not NEXT_PUBLIC_ — it is read only on the server here.
 * (GSI still needs the id in the browser after this response; the secret must never be returned.)
 */
export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";

  if (!googleClientId) {
    return NextResponse.json(
      { error: { code: "CONFIG", message: "GOOGLE_CLIENT_ID is not configured" } },
      { status: 503 }
    );
  }

  return NextResponse.json({
    googleClientId,
  });
}
