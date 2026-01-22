import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { generateFormdata } from "@/lib/utils";
import { queryKeys } from "@/config/query-keys";
import type { AxiosResponse } from "axios";

export const imageUploadInputSchema = z.object({
   image: z.array(z.instanceof(File)),
});

export type ImageUploadInput = z.infer<typeof imageUploadInputSchema>;

export const imageUpload = async ({
   data,
}: {
   data: ImageUploadInput;
}): Promise<AxiosResponse<{ url: string }[]>> => {
   //  const formData = generateFormdata(data);
   const newFormData = new FormData();

   data.image.map((image) => {
      newFormData.append("image", image);
   });

   return api.post("/artworks/upload-image/", newFormData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
};

type UseImageUploadOptions = {
   mutationConfig?: MutationConfig<typeof imageUpload>;
};

export const useImageUpload = ({
   mutationConfig,
}: UseImageUploadOptions = {}) => {
   const { onSuccess, ...restConfig } = mutationConfig || {};
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: imageUpload,
      onSuccess: (...args) => {
         //  queryClient.invalidateQueries({ queryKey: queryKeys.event.list() });
         //  queryClient.invalidateQueries({
         //     queryKey: queryKeys.event.infinite(),
         //  });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
