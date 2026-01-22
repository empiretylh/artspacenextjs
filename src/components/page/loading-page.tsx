import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

const LoadingPage = ({ className }: { className?: string }) => {
   return (
      <div
         className={cn(
            "w-full h-[80vh] flex items-center justify-center",
            className
         )}
      >
         <Spinner className="w-10 h-10" />
      </div>
   );
};

export default LoadingPage;
