import * as React from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
   Facebook,
   Twitter,
   Linkedin,
   Link as LinkIcon,
   Share2,
   Check,
} from "lucide-react";
import ShareIcon from "../icons/share-icon";

type ShareButtonProps = {
   textButton?: boolean;
   url?: string;
   title?: string;
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
      setTimeout(() => setCopied(false), 2000);
   };

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
