import { ChevronDown } from "lucide-react";

export const FilterSection = ({ title, children, isOpen, onToggle }: any) => (
   <div className="border-b border-border py-4">
      <button
         onClick={onToggle}
         className="w-full flex justify-between items-center text-lg font-semibold text-foreground hover:text-primary transition-colors"
      >
         {title}
         <ChevronDown
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
         />
      </button>
      <div
         className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 mt-4" : "max-h-0"}`}
      >
         <div className="space-y-3">{children}</div>
      </div>
   </div>
);
