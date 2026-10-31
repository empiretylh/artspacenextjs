"use client";

import React, { useState } from "react";
import {
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useReportUser } from "@/features/service/artspace/report-user";
import { useNotifications } from "@/components/ui/notifications";
import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

export const DEFAULT_USER_REPORT_REASONS = [
   "Inappropriate behavior",
   "Harassment or bullying",
   "Spam or misleading content",
   "Impersonation",
   "Other",
];

interface ReportUserDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   userId: number | string;
   userName?: string;
   reasons?: string[];
   onSuccess?: () => void;
}

export const ReportUserDialog: React.FC<ReportUserDialogProps> = ({
   open,
   onOpenChange,
   userId,
   userName,
   reasons = DEFAULT_USER_REPORT_REASONS,
   onSuccess,
}) => {
   const [selectedReason, setSelectedReason] = useState<string>(reasons[0]);
   const [details, setDetails] = useState("");
   const { addNotification } = useNotifications();
   const { user } = useAuth();
   const router = useRouter();

   const reportUserMutation = useReportUser({
      mutationConfig: {
         onSuccess: () => {
            onOpenChange(false);
            setSelectedReason(reasons[0]);
            setDetails("");
            addNotification({
               type: "success",
               title: "Success",
               message: "Report submitted successfully",
            });
            onSuccess?.();
         },
         onError: (error: any) => {
            const message =
               error?.response?.data?.detail ||
               error?.response?.data?.message ||
               "Failed to submit report. Please try again.";
            addNotification({
               type: "error",
               title: "Error",
               message,
            });
         },
      },
   });

   const handleSubmit = () => {
      if (!user) {
         router.push(paths.auth.login.path);
         return;
      }

      const reportReason = selectedReason === "Other" ? details.trim() : selectedReason;
      if (!reportReason) return;

      reportUserMutation.mutate({
         userId,
         reason: reportReason,
      });
   };

   return (
      <BaseDialog isOpen={open} onClose={() => onOpenChange(false)} headerOff>
         <div className="space-y-6 p-4">
            <DialogHeader>
               <DialogTitle>
                  Report User{userName ? ` (${userName})` : ""}
               </DialogTitle>
               <DialogDescription>
                  Please select a reason for reporting this user.
               </DialogDescription>
            </DialogHeader>
            <div>
               <RadioGroup
                  value={selectedReason}
                  onValueChange={setSelectedReason}
                  className="flex flex-col space-y-2"
               >
                  {reasons.map((reason) => (
                     <div key={reason} className="flex items-center space-x-2">
                        <RadioGroupItem
                           value={reason}
                           id={`user-report-${reason}`}
                        />
                        <label
                           htmlFor={`user-report-${reason}`}
                           className="text-sm cursor-pointer"
                        >
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
                     onClick={() => onOpenChange(false)}
                     disabled={reportUserMutation.isPending}
                  >
                     Cancel
                  </Button>
                  <Button
                     className="flex-1 w-full"
                     onClick={handleSubmit}
                     loading={reportUserMutation.isPending}
                     disabled={
                        reportUserMutation.isPending ||
                        (selectedReason === "Other" && !details.trim())
                     }
                  >
                     Submit
                  </Button>
               </div>
            </div>
         </div>
      </BaseDialog>
   );
};
