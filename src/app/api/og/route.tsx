import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.myanmarartspace.net";
const IMAGE_HOSTNAME = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "api.myanmarartspace.net";

const resolveImageUrl = (src: string | undefined | null) => {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;
  return `https://${IMAGE_HOSTNAME}${cleanSrc}`;
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Gallery canvas background (pure white #ffffff)
const BG_COLOR = { r: 255, g: 255, b: 255, alpha: 1 };

async function createFallbackImage(): Promise<Buffer> {
  return await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .png({ quality: 85 })
    .toBuffer();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const headers = {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
  };

  if (!id) {
    const fallback = await createFallbackImage();
    return new Response(fallback as unknown as BodyInit, { status: 200, headers });
  }

  try {
    let artwork: any = null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_URL}/api/v1/artworks/artworks/${id}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        artwork = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch artwork for OG image:", e);
    }

    const imageUrl = resolveImageUrl(artwork?.image);
    if (!imageUrl) {
      const fallback = await createFallbackImage();
      return new Response(fallback as unknown as BodyInit, { status: 200, headers });
    }

    // Fetch the remote artwork image (WebP, PNG, JPEG, etc.)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const imgRes = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!imgRes.ok) {
      const fallback = await createFallbackImage();
      return new Response(fallback as unknown as BodyInit, { status: 200, headers });
    }

    const imgArrayBuffer = await imgRes.arrayBuffer();
    const inputBuffer = Buffer.from(imgArrayBuffer);

    // Resize artwork to fit cleanly inside 1100x560 with aspect ratio preserved
    const resizedArtwork = await sharp(inputBuffer)
      .resize(1100, 560, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    // Composite centered on the 1200x630 studio canvas
    const finalImageBuffer = await sharp({
      create: {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .composite([
        {
          input: resizedArtwork,
          gravity: "center",
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    return new Response(finalImageBuffer as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating OG image with sharp:", error);
    const fallback = await createFallbackImage();
    return new Response(fallback as unknown as BodyInit, { status: 200, headers });
  }
}

