import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleRequest(request, path);
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
  const cookieStore = await cookies();
  const session = cookieStore.get("artspace_auth_session")?.value;

  let token = "";
  if (session) {
    const parsed = JSON.parse(session);
    token = parsed.accessToken;
  }

  // Build the target URL (pointing to your actual backend)
  const fullPath = pathSegments.join("/");
  const backendUrl = `${process.env.API_URL}/api/v1/${fullPath}${request.nextUrl.search}`;

  // Forward the request to the real backend
  const response = await fetch(backendUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      // Attach the Bearer token that the browser couldn't see!
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Only include body for non-GET requests
    body: request.method !== "GET" ? await request.text() : undefined,
  });

  const data = await response.json();

  return NextResponse.json(data);
}
