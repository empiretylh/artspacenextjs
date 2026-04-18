import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
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

            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground">
                  An unexpected error occurred. Please refresh the page or try
                  again later.
               </p>
               
               {!!error && (
                  <div className="rounded-md bg-destructive/5 p-3 text-left">
                     <p className="font-mono text-xs font-medium text-destructive break-words">
                        {error instanceof Error
                           ? error.message
                           : typeof error === "string"
                             ? error
                             : "An unknown error occurred"}
                     </p>
                  </div>
               )}
            </CardContent>

            <CardFooter className="flex justify-center gap-3">
               <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="gap-2"
               >
                  <RefreshCcw className="h-4 w-4" />
                  Reload Page
               </Button>
               <Button
                  onClick={resetErrorBoundary}
                  className="gap-2"
               >
                  Try Again
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
};
