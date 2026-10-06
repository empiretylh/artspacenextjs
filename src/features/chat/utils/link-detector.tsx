import React from "react";
import { cn } from "@/lib/utils";

// Regex to detect standard http/https URLs with word boundary protection
export const URL_REGEX = /(https?:\/\/[^\s<>"'{}|\\^`[\]]+)/gi;

/**
 * Extracts the first valid URL from a message text.
 */
export function extractFirstUrl(text: string): string | null {
   if (!text) return null;
   const match = text.match(URL_REGEX);
   if (!match || match.length === 0) return null;

   const rawUrl = match[0];
   // Strip trailing punctuation like '.', ',', ')', '!', '?'
   const cleanUrl = rawUrl.replace(/[.,)!?]+$/, "");
   
   try {
      new URL(cleanUrl);
      return cleanUrl;
   } catch {
      return null;
   }
}

/**
 * Parses a string and returns React nodes with clickable <a> links for any detected URLs.
 */
export function renderFormattedMessageText(text: string, isMine: boolean): React.ReactNode {
   if (!text) return null;

   const parts: React.ReactNode[] = [];
   let lastIndex = 0;
   let match: RegExpExecArray | null;

   // Reset global regex state
   URL_REGEX.lastIndex = 0;

   while ((match = URL_REGEX.exec(text)) !== null) {
      const matchIndex = match.index;
      let url = match[0];

      // Push text before the link
      if (matchIndex > lastIndex) {
         parts.push(text.substring(lastIndex, matchIndex));
      }

      // Clean trailing punctuation
      const trailingPunctuationMatch = url.match(/[.,)!?]+$/);
      let trailingPunctuation = "";
      if (trailingPunctuationMatch) {
         trailingPunctuation = trailingPunctuationMatch[0];
         url = url.slice(0, -trailingPunctuation.length);
      }

      parts.push(
         <a
            key={`link-${matchIndex}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
               "underline underline-offset-2 break-all transition-opacity hover:opacity-80 font-medium",
               isMine 
                  ? "text-primary-foreground decoration-primary-foreground/60 hover:decoration-primary-foreground" 
                  : "text-primary decoration-primary/50 hover:decoration-primary"
            )}
         >
            {url}
         </a>
      );

      if (trailingPunctuation) {
         parts.push(trailingPunctuation);
      }

      lastIndex = matchIndex + match[0].length;
   }

   if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
   }

   return parts;
}
