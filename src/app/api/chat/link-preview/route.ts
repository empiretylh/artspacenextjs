import { NextRequest, NextResponse } from "next/server";

// SSRF Protection: Check if hostname or IP belongs to private / internal network
function isPrivateHost(hostname: string): boolean {
   const lower = hostname.toLowerCase().trim();
   if (
      lower === "localhost" ||
      lower === "127.0.0.1" ||
      lower === "::1" ||
      lower === "0.0.0.0" ||
      lower.endsWith(".local") ||
      lower.endsWith(".internal")
   ) {
      return true;
   }

   // Check private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
   const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
   const match = lower.match(ipv4Regex);
   if (match) {
      const [_, b1, b2] = match.map(Number);
      if (b1 === 10) return true;
      if (b1 === 127) return true;
      if (b1 === 169 && b2 === 254) return true;
      if (b1 === 172 && b2 >= 16 && b2 <= 31) return true;
      if (b1 === 192 && b2 === 168) return true;
      if (b1 === 0) return true;
   }

   return false;
}

function decodeHtmlEntities(text: string): string {
   return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/")
      .replace(/&nbsp;/g, " ")
      .trim();
}

function extractMetaContent(html: string, pattern: RegExp): string | null {
   const match = html.match(pattern);
   return match && match[1] ? decodeHtmlEntities(match[1]) : null;
}

function resolveUrl(relativeUrl: string | null | undefined, baseUrl: string): string | null {
   if (!relativeUrl) return null;
   try {
      return new URL(relativeUrl, baseUrl).href;
   } catch {
      return null;
   }
}

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url);
   const targetUrl = searchParams.get("url");

   if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
   }

   let parsedUrl: URL;
   try {
      parsedUrl = new URL(targetUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
         return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
      }
   } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
   }

   if (isPrivateHost(parsedUrl.hostname)) {
      return NextResponse.json({ error: "Access to private addresses is restricted" }, { status: 403 });
   }

   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 4000);

   try {
      const response = await fetch(parsedUrl.href, {
         signal: controller.signal,
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; ArtSpaceBot/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
         },
         redirect: "follow",
         cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
         return NextResponse.json({
            url: parsedUrl.href,
            title: parsedUrl.hostname,
            siteName: parsedUrl.hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
         });
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
         return NextResponse.json({
            url: parsedUrl.href,
            title: parsedUrl.hostname,
            siteName: parsedUrl.hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
         });
      }

      // Read at most 100KB to extract head tags without downloading heavy pages
      const reader = response.body?.getReader();
      let html = "";
      if (reader) {
         let receivedBytes = 0;
         const maxBytes = 102400; // 100 KB
         while (receivedBytes < maxBytes) {
            const { done, value } = await reader.read();
            if (done) break;
            receivedBytes += value.length;
            html += new TextDecoder("utf-8").decode(value, { stream: true });
            if (html.includes("</head>") || html.includes("<body")) break;
         }
         reader.cancel().catch(() => {});
      } else {
         html = await response.text();
      }

      // Extract Open Graph & fallback tags
      const title =
         extractMetaContent(html, /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i) ||
         extractMetaContent(html, /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<title[^>]*>([^<]*)<\/title>/i) ||
         parsedUrl.hostname;

      const description =
         extractMetaContent(html, /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i) ||
         extractMetaContent(html, /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
         null;

      const rawImage =
         extractMetaContent(html, /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i) ||
         extractMetaContent(html, /<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']*)["']/i) ||
         null;

      const siteName =
         extractMetaContent(html, /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:site_name["']/i) ||
         parsedUrl.hostname.replace(/^www\./, "");

      const rawFavicon =
         extractMetaContent(html, /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i) ||
         extractMetaContent(html, /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i) ||
         extractMetaContent(html, /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']*)["']/i) ||
         null;

      const image = resolveUrl(rawImage, response.url || parsedUrl.href);
      const favicon = resolveUrl(rawFavicon, response.url || parsedUrl.href) || `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;

      return NextResponse.json(
         {
            url: parsedUrl.href,
            title: title ? title.slice(0, 150) : null,
            description: description ? description.slice(0, 250) : null,
            image,
            siteName,
            favicon,
         },
         {
            headers: {
               "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
         }
      );
   } catch {
      clearTimeout(timeoutId);
      // Return a graceful fallback preview with the hostname
      return NextResponse.json({
         url: parsedUrl.href,
         title: parsedUrl.hostname,
         siteName: parsedUrl.hostname,
         favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
      });
   }
}
