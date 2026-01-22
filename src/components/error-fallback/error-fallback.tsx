import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export const ErrorFallback = () => {
   return (
      <div
         role="alert"
         className="flex min-h-screen w-screen items-center justify-center bg-background px-4"
      >
         <Card className="w-full max-w-md text-center shadow-lg">
            <CardHeader className="flex flex-col items-center gap-2">
               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
               </div>

               <CardTitle className="text-xl font-semibold">
                  Something went wrong
               </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
               An unexpected error occurred. Please refresh the page or try
               again later.
            </CardContent>

            <CardFooter className="flex justify-center">
               <Button
                  onClick={() => window.location.assign(window.location.origin)}
                  className="gap-2"
               >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh page
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
};
