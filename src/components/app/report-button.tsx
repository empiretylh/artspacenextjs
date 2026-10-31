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
import { useReportUser } from "@/features/service/artspace/report-user";
import { useNotifications } from "../ui/notifications";
import { BaseDialog } from "../common/dialogs/base-dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

export const DEFAULT_ARTWORK_REPORT_REASONS = [
   "Inappropriate content",
   "Copyright infringement",
   "Spam or misleading content",
   "Other",
];

export const DEFAULT_USER_REPORT_REASONS = [
   "Inappropriate behavior",
   "Harassment or bullying",
   "Spam or misleading content",
   "Impersonation",
   "Other",
];

interface ReportButtonProps {
   label?: string;
   icon?: React.ReactNode;
   reportType: "artwork" | "comment" | "profile" | "user";
   className?: string;
   itemId: string | number;
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
   reasons,
   onSuccess,
}) => {
   const isUserReport = reportType === "user" || reportType === "profile";
   const effectiveReasons =
      reasons ?? (isUserReport ? DEFAULT_USER_REPORT_REASONS : DEFAULT_ARTWORK_REPORT_REASONS);

   const [open, setOpen] = useState(false);
   const [selectedReason, setSelectedReason] = useState<string>(effectiveReasons[0]);
   const [details, setDetails] = useState("");
   const { addNotification } = useNotifications();
   const { user } = useAuth();
   const router = useRouter();

   const handleMutationSuccess = () => {
      setOpen(false);
      setSelectedReason(effectiveReasons[0]);
      setDetails("");
      addNotification({
         type: "success",
         title: "Success",
         message: "Report submitted successfully",
      });
      onSuccess?.();
   };

   const handleMutationError = (error: any) => {
      const message =
         error?.response?.data?.detail ||
         error?.response?.data?.message ||
         "Failed to submit report. Please try again.";
      addNotification({
         type: "error",
         title: "Error",
         message,
      });
   };

   const reportArtworkMutation = useReportArtwork({
      mutationConfig: {
         onSuccess: handleMutationSuccess,
         onError: handleMutationError,
      },
   });

   const reportUserMutation = useReportUser({
      mutationConfig: {
         onSuccess: handleMutationSuccess,
         onError: handleMutationError,
      },
   });

   const isPending = reportArtworkMutation.isPending || reportUserMutation.isPending;

   const handleSubmit = () => {
      if (!user) {
         router.push(paths.auth.login.path);
         return;
      }

      const reportReason = selectedReason === "Other" ? details.trim() : selectedReason;
      if (!reportReason) return;

      if (isUserReport) {
         reportUserMutation.mutate({
            userId: itemId,
            reason: reportReason,
         });
      } else {
         reportArtworkMutation.mutate({
            artworkId: String(itemId),
            report: reportReason,
         });
      }
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
                     {effectiveReasons.map((reason) => (
                        <div
                           key={reason}
                           className="flex items-center space-x-2"
                        >
                           <RadioGroupItem value={reason} id={`report-btn-${reason}`} />
                           <label htmlFor={`report-btn-${reason}`} className="text-sm cursor-pointer">
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
                        className="mt-3"
                     />
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                     <Button
                        variant="outline"
                        className="flex-1 w-full"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                     >
                        Cancel
                     </Button>
                     <Button
                        className="flex-1 w-full"
                        onClick={handleSubmit}
                        loading={isPending}
                        disabled={isPending || (selectedReason === "Other" && !details.trim())}
                     >
                        Submit
                     </Button>
                  </div>
               </div>
            </div>
         </BaseDialog>
      </>
   );
};
