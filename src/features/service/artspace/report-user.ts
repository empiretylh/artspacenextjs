import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Report } from "@/types";
import type { MutationConfig } from "@/lib/react-query";

export interface ReportUserInput {
   userId: number | string;
   reason: string;
}

export const reportUser = async ({
   userId,
   reason,
}: ReportUserInput): Promise<Report> => {
   const res = await api.post(`/reports/user/`, {
      reported_user: Number(userId),
      reason,
   });
   return res.data;
};

type UseReportUserOptions = {
   mutationConfig?: MutationConfig<typeof reportUser>;
};

export const useReportUser = ({
   mutationConfig,
}: UseReportUserOptions = {}) => {
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: reportUser,
      ...restConfig,
      onSuccess: (...args) => {
         onSuccess?.(...args);
      },
   });
};
