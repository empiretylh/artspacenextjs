import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { JSX } from "react";

const CustomLink = ({ children, className, to, ...rest }: { children?: React.ReactNode, className?: string, to: any, onClick?: (e: any) => any }): JSX.Element => {
   return (
      <Link
         href={to}
         className={cn("cursor-pointer transition-colors", className)}
         // scroll={true}
         {...rest}
      >
         {children}
      </Link>
   );
};

export default CustomLink;
