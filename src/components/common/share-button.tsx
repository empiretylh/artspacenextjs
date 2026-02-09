'use client'
import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Check,
   Facebook,
   Linkedin,
   Link as LinkIcon,
   Twitter
} from "lucide-react";
import * as React from "react";
import ShareIcon from "../icons/share-icon";
import { shareAnalytics } from "@/lib/analytics";
import { User } from "@/types";
import { useSource } from "@/lib/analytics-source";

type ShareButtonProps = {
   textButton?: boolean;
   url?: string;
   title?: string;
   item_id: string;
   item_name: string;
   content_type: "artwork" | "user" | "event";
   user_type?: User["user_type"];
   className?: string;
   size?: "sm" | "default" | "lg" | "icon" | null | undefined;
   variant?:
   | "default"
   | "link"
   | "destructive"
   | "outline"
   | "secondary"
   | "ghost"
   | null
   | undefined;
};

export function ShareButton({
   textButton = false,
   url = typeof window !== "undefined" ? window.location.href : "",
   title = "",
   item_id,
   item_name,
   content_type,
   user_type,
   className,
   size = "icon",
   variant = "ghost",
}: ShareButtonProps) {
   const [copied, setCopied] = React.useState(false);

   const encodedUrl = encodeURIComponent(url);
   const encodedTitle = encodeURIComponent(title);

   const shareLinks = [
      {
         name: "Facebook",
         icon: Facebook,
         href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
         name: "X",
         icon: Twitter,
         href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      },
      {
         name: "LinkedIn",
         icon: Linkedin,
         href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      },
   ];

   const handleCopy = async () => {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      shareAnalytics.share({ source, content_type, item_id, item_name, user_type, method: 'copy' })
      setTimeout(() => setCopied(false), 2000);
   };

   const { source } = useSource();

   const handleShareClick = (name: string) => {
      shareAnalytics.share({ source, content_type, item_id, item_name, user_type, method: name.toLowerCase() })
   }

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant={variant} size={size} className={className}>
               {textButton ? "Share" : <ShareIcon className="h-4 w-4" />}
            </Button>
         </PopoverTrigger>

         <PopoverContent className="w-40 p-1">
            <div className="flex flex-col gap-1">
               {shareLinks.map(({ name, icon: Icon, href }) => (
                  <Button
                     key={name}
                     variant="ghost"
                     className="justify-start gap-2"
                     asChild
                     onClick={() => handleShareClick(name)}
                  >
                     <a href={href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                        {name}
                     </a>
                  </Button>
               ))}

               <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={handleCopy}
               >
                  {copied ? (
                     <Check className="h-4 w-4 text-green-600" />
                  ) : (
                     <LinkIcon className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy link"}
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   );
}
