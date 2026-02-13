import React, { useState } from "react";
import {
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useReportArtwork } from "@/features/service/artspace/report-artwork";
import { useNotifications } from "../ui/notifications";
import { BaseDialog } from "../common/dialogs/base-dialog";
import { cn } from "@/lib/utils";

interface ReportButtonProps {
   label?: string;
   icon?: React.ReactNode;
   reportType: "artwork" | "comment" | "profile";
   className?: string;
   itemId: string;
   reasons?: string[];
   variant?: "default" | "outline" | "ghost";
   onSuccess?: () => void;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
   label = "Report",
   icon,
   reportType,
   itemId,
   className,
   variant = "outline",
   reasons = [
      "Inappropriate content",
      "Copyright infringement",
      "Spam or misleading content",
      "Other",
   ],
   onSuccess,
}) => {
   const [open, setOpen] = useState(false);
   const [selectedReason, setSelectedReason] = useState<string>(reasons[0]);
   const [details, setDetails] = useState("");
   const { addNotification } = useNotifications();
   const reportArtworkMutation = useReportArtwork({
      mutationConfig: {
         onSuccess: () => {
            setOpen(false);
            setSelectedReason(reasons[0]);
            setDetails("");
            addNotification({
               type: "success",
               title: "Success",
               message: "Report submitted successfully",
            });
            onSuccess?.();
         },
      },
   });

   const handleSubmit = () => {
      const report = selectedReason === "Other" ? details : selectedReason;

      reportArtworkMutation.mutate({
         artworkId: itemId,
         report: report,
      });
   };

   return (
      <>
         <Button
            variant={variant}
            size="sm"
            onClick={() => setOpen(true)}
            className={cn("flex items-center space-x-2", className)}
         >
            {icon}
            <span>{label}</span>
         </Button>

         <BaseDialog isOpen={open} onClose={() => setOpen(false)} headerOff>
            <div className="space-y-6 p-4">
               <DialogHeader>
                  <DialogTitle>Report this {reportType}</DialogTitle>
                  <DialogDescription>
                     Please select a reason for reporting this {reportType}.
                  </DialogDescription>
               </DialogHeader>
               <div>
                  <RadioGroup
                     value={selectedReason}
                     onValueChange={setSelectedReason}
                     className="flex flex-col space-y-2"
                  >
                     {reasons.map((reason) => (
                        <div
                           key={reason}
                           className="flex items-center space-x-2"
                        >
                           <RadioGroupItem value={reason} id={reason} />
                           <label htmlFor={reason} className="text-sm">
                              {reason}
                           </label>
                        </div>
                     ))}
                  </RadioGroup>

                  {selectedReason === "Other" && (
                     <Textarea
                        placeholder="Please provide more details..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="mt-2"
                     />
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                     <Button
                        variant="outline"
                        className="flex-1 w-full"
                        onClick={() => setOpen(false)}
                     >
                        Cancel
                     </Button>
                     <Button
                        className="flex-1 w-full"
                        onClick={handleSubmit}
                        loading={reportArtworkMutation.isPending}
                        disabled={reportArtworkMutation.isPending}
                     >
                        Submit
                     </Button>
                  </div>
               </div>
            </div>
         </BaseDialog>

         {/* <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xs sm:max-w-lg rounded-lg">
               <DialogHeader>
                  <DialogTitle>Report this {reportType}</DialogTitle>
                  <DialogDescription>
                     Please select a reason for reporting this {reportType}.
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-4 mt-4">
                  <RadioGroup
                     value={selectedReason}
                     onValueChange={setSelectedReason}
                     className="flex flex-col space-y-2"
                  >
                     {reasons.map((reason) => (
                        <div
                           key={reason}
                           className="flex items-center space-x-2"
                        >
                           <RadioGroupItem value={reason} id={reason} />
                           <label htmlFor={reason} className="text-sm">
                              {reason}
                           </label>
                        </div>
                     ))}
                  </RadioGroup>

                  {selectedReason === "Other" && (
                     <Textarea
                        placeholder="Please provide more details..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="mt-2"
                     />
                  )}
               </div>

               <div className="mt-4 flex justify-end space-x-2">
                  <Button
                     variant="outline"
                     className="flex-1 w-full"
                     onClick={() => setOpen(false)}
                  >
                     Cancel
                  </Button>
                  <Button
                     className="flex-1 w-full"
                     onClick={handleSubmit}
                     loading={reportArtworkMutation.isPending}
                     disabled={reportArtworkMutation.isPending}
                  >
                     Submit
                  </Button>
               </div>
            </DialogContent>
         </Dialog> */}
      </>
   );
};

// Fake API function for demonstration
async function fakeReportApi(data: any) {
   return new Promise((resolve) => setTimeout(resolve, 1000));
}
