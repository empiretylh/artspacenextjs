import { cn } from "@/lib/utils";
import Link from "next/link";
import type { JSX } from "react";

const CustomLink = ({ children, className, to, ...rest }: { children?: React.ReactNode, className?: string, to: string, onClick?: (e: any) => any }): JSX.Element => {
   return (
      <Link
         href={to}
         className={cn("cursor-pointer transition-colors", className)}
         {...rest}
      >
         {children}
      </Link>
   );
};

export default CustomLink;
