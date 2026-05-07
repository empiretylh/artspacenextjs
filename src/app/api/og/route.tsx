import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export const alt = "Artwork Preview - Myanmar Art Space";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Direct environment fallback reading
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.myanmarartspace.net";
const IMAGE_HOSTNAME = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME || "api.myanmarartspace.net";

const resolveImageUrl = (src: string | undefined | null) => {
  if (!src) return `https://${IMAGE_HOSTNAME}/assets/logo.png`;
  if (src.startsWith("http")) return src;
  return `https://${IMAGE_HOSTNAME}${src}`;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Fallback to error/missing card if no id provided
  if (!id) {
    return new Response("Missing 'id' parameter", { status: 400 });
  }

  let artwork;
  try {
    const res = await fetch(`${API_URL}/api/v1/artworks/artworks/${id}`, {
      headers: {
        "Accept": "application/json",
      },
    });
    if (res.ok) {
      artwork = await res.json();
    } else {
      console.error(`Failed to fetch artwork for api/og: Status ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to fetch artwork for api/og:", error);
  }

  // Load fonts
  let fonts: any[] = [];
  try {
    const [outfitData, spaceGroteskData] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-400-normal.ttf").then((res) => {
        if (!res.ok) throw new Error("Outfit fetch failed");
        return res.arrayBuffer();
      }),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf").then((res) => {
        if (!res.ok) throw new Error("Space Grotesk fetch failed");
        return res.arrayBuffer();
      }),
    ]);
    fonts = [
      {
        name: "Outfit",
        data: outfitData,
        style: "normal",
        weight: 400,
      },
      {
        name: "Space Grotesk",
        data: spaceGroteskData,
        style: "normal",
        weight: 700,
      },
    ];
  } catch (fontError) {
    console.error("Failed to load fonts for OpenGraph image, using system fallbacks:", fontError);
  }

  if (!artwork) {
    // Return a generic fallback branding card (White/Minimalist gallery branding)
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "1200px",
            height: "630px",
            backgroundColor: "#ffffff",
            color: "#111111",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily: "Space Grotesk, sans-serif",
              color: "#111111",
            }}
          >
            Myanmar Art Space
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#737373",
              marginTop: "12px",
              letterSpacing: "0.15em",
            }}
          >
            DISCOVER CONTEMPORARY ARTWORK
          </span>
        </div>
      ),
      {
        ...size,
        fonts,
      }
    );
  }

  // Ensure absolute image URL
  const imageUrl = resolveImageUrl(artwork.image);

  const title = artwork.title || "Untitled";
  const artistName = artwork.artist_name || (artwork.current_owner_display?.first_name
    ? `${artwork.current_owner_display?.first_name} ${artwork.current_owner_display?.last_name || ""}`.trim()
    : "Unknown Artist");

  const medium = artwork.medium || "";
  const dimensions = artwork.dimensions || "";
  const year = artwork.year ? String(artwork.year) : "";

  // Map status
  let statusText = "Available";
  let statusColor = "#22c55e"; // Green
  if (artwork.status === "SOLD" || artwork.status === "SOLD_OUT") {
    statusText = artwork.status === "SOLD" ? "Sold" : "Sold Out";
    statusColor = "#ef4444"; // Red
  } else if (artwork.status === "NOT_FOR_SALE") {
    statusText = "Not for Sale";
    statusColor = "#737373"; // Grey
  }

  // Format price
  const symbol = artwork.currency?.symbol || "$";
  const formattedPrice = artwork.price
    ? Number(artwork.price).toLocaleString("en-US")
    : "";
  const priceDisplay = artwork.hide_price || !artwork.price
    ? "Contact Gallery"
    : `${symbol}${formattedPrice}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          backgroundColor: "#ffffff",
          color: "#111111",
          fontFamily: "Outfit, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* Left side: Artwork image frame (Luxury Studio Canvas representation) */}
        <div
          style={{
            display: "flex",
            width: "55%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fcfbf9",
            padding: "45px",
            borderRight: "1px solid #f0eee9",
            boxSizing: "border-box",
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "2px",
                border: "1px solid #e0ded9",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              }}
            />
          )}
        </div>

        {/* Right side: Exhibition placard info (Crisp Gallery White) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            height: "100%",
            justifyContent: "space-between",
            padding: "60px 50px",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          {/* Header Branding */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                letterSpacing: "0.25em",
                color: "#262626",
                textTransform: "uppercase",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              Myanmar Art Space
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#8c8a82",
                marginTop: "4px",
                letterSpacing: "0.15em",
              }}
            >
              EXHIBITION PREVIEW
            </span>
          </div>

          {/* Core metadata details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#111111",
                lineHeight: 1.15,
                margin: 0,
                fontFamily: "Space Grotesk, sans-serif",
                textTransform: "capitalize",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#404040",
                margin: "10px 0 0 0",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              by <span style={{ color: "#111111", fontWeight: "bold" }}>{artistName}</span>
            </p>

            {/* Accent divider - Charcoal MoMA-style brand line */}
            <div
              style={{
                width: "60px",
                height: "2px",
                backgroundColor: "#111111",
                margin: "24px 0",
              }}
            />

            {/* Info Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {medium && (
                <div style={{ display: "flex", fontSize: "14px", fontFamily: "Outfit, sans-serif" }}>
                  <span style={{ width: "100px", color: "#737373" }}>Medium:</span>
                  <span style={{ color: "#262626", fontWeight: 500 }}>{medium}</span>
                </div>
              )}
              {dimensions && (
                <div style={{ display: "flex", fontSize: "14px", fontFamily: "Outfit, sans-serif" }}>
                  <span style={{ width: "100px", color: "#737373" }}>Dimensions:</span>
                  <span style={{ color: "#262626", fontWeight: 500 }}>{dimensions}</span>
                </div>
              )}
              {year && (
                <div style={{ display: "flex", fontSize: "14px", fontFamily: "Outfit, sans-serif" }}>
                  <span style={{ width: "100px", color: "#737373" }}>Year:</span>
                  <span style={{ color: "#262626", fontWeight: 500 }}>{year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Placard - Status & Price */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #f0eee9",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: "#737373",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Status
              </span>
              <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: statusColor,
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111111",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {statusText}
                </span>
              </div>
            </div>

            {/* Price Badge - Pure Black High-Contrast Tag */}
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                backgroundColor: "#111111",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#ffffff",
                  fontFamily: "Space Grotesk, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {priceDisplay}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
