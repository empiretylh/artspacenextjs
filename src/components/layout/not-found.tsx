import { paths } from "@/config/paths";
import Link from "../common/link";
import { Button } from "../ui/button";

const NotFound = ({ description }: { description?: string }) => {
   return (
      <div className="grid min-h-[80vh]">
         <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
            <h3 className="mb-1.5 text-3xl font-semibold">
               Something went wrong
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
               {description ||
                  "The page you are looking for does not exist or has been moved."}
            </p>
            <Button size="lg" className="rounded-lg text-base">
               <Link to={paths.root.path}>Back to home page</Link>
            </Button>
         </div>
      </div>
   );
};

export default NotFound;
