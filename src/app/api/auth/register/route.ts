import { env } from "@/config/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    // 1. Call your real backend register endpoint
    const res = await fetch(env.API_URL + "/api/v1/users/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data: any;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = { message: "Unexpected response format from server" };
      }
    } else {
      const text = await res.text();
      // Check if backend returned a Django/server HTML debug or error page
      if (text.includes("<!DOCTYPE") || text.includes("<html") || text.includes("<body")) {
        const titleMatch = text.match(/<title>(.*?)<\/title>/i);
        const exceptionMatch = text.match(/<pre class="exception_value">([\s\S]*?)<\/pre>/i);
        const extractedTitle = titleMatch ? titleMatch[1].trim() : "";
        const extractedException = exceptionMatch ? exceptionMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        
        const cleanMessage = extractedException || extractedTitle || "Backend server error. Please try again later.";
        data = { message: cleanMessage, detail: cleanMessage, error: cleanMessage };
      } else {
        data = { message: text || "Registration failed" };
      }
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Registration proxy error:", error);
    const message = error?.message || "Registration failed";
    return NextResponse.json({ message, detail: message }, { status: 500 });
  }
}
