"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotifications } from "@/components/ui/notifications";
import { handleFormError } from "@/lib/utils";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import ImageDnd from "@/components/image-dnd";
import { updateArtInputSchema, useUpdateArt } from "../api/update-artwork";
import type { Artwork } from "@/types";
import { useGetCategories } from "@/features/service/artspace/get-categories";

type FormData = z.infer<typeof updateArtInputSchema>;

interface ArtworkEditFormProps {
   artwork: Artwork;
   onUpdateSuccess?: () => void;
}

export const ArtworkEditForm = ({
   artwork,
   onUpdateSuccess,
}: Readonly<ArtworkEditFormProps>) => {
   const { addNotification } = useNotifications();

   const categoriesQuery = useGetCategories();
   const categories = categoriesQuery.data?.data ?? [];

   const updateArtMutation = useUpdateArt({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Artwork updated successfully",
            });
            onUpdateSuccess?.();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(updateArtInputSchema),
      values: {
         category: artwork?.category ?? 1,
         title: artwork?.title ?? "",
         description: artwork?.description ?? "",
         dimensions: artwork?.dimensions ?? "",
         price: artwork?.price ? Number(artwork.price) : 0,
         year: artwork?.year ?? new Date().getFullYear(),
         status: artwork?.status ?? "AVAILABLE",
         image: undefined,
      },
   });

   const onSubmit: SubmitHandler<FormData> = (values) => {
      if (!artwork) return;
      updateArtMutation.mutate({ id: artwork.id, data: values });
   };

   return (
      <div className="mx-auto">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <Card className="border border-border shadow-sm">
                  <CardHeader>
                     <CardTitle>Edit Artwork</CardTitle>
                     <CardDescription>
                        Update the details of your artwork below.
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Category</FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       value={field.value?.toString() ?? "1"}
                                       disabled={categoriesQuery.isLoading}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue
                                             placeholder={"Select category"}
                                          />
                                       </SelectTrigger>
                                       <SelectContent>
                                          {categories.length > 0 ? (
                                             categories.map((cat) => (
                                                <SelectItem
                                                   key={cat.id}
                                                   value={cat.id.toString()}
                                                >
                                                   {cat.name}
                                                </SelectItem>
                                             ))
                                          ) : (
                                             <SelectItem
                                                disabled
                                                value="no-cat"
                                             >
                                                No categories found
                                             </SelectItem>
                                          )}
                                       </SelectContent>
                                    </Select>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Title */}
                        <FormField
                           control={form.control}
                           name="title"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Title</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Artwork title"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Dimension */}
                        <FormField
                           control={form.control}
                           name="dimensions"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Dimensions</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="e.g., 44 x 56 cm"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Price */}
                        <FormField
                           control={form.control}
                           name="price"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Price (USD)</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       placeholder="e.g., 5000"
                                       {...field}
                                       onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                       }
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Year */}
                        <FormField
                           control={form.control}
                           name="year"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Year</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       {...field}
                                       onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                       }
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Status */}
                        <FormField
                           control={form.control}
                           name="status"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Status</FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="AVAILABLE">
                                             Available
                                          </SelectItem>
                                          <SelectItem value="SOLD">
                                             Sold
                                          </SelectItem>
                                          <SelectItem value="COMING_SOON">
                                             Coming Soon
                                          </SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Description */}
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder="Describe your artwork..."
                                    className="min-h-32 resize-y"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Image Upload */}
                     {/* <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                        <div className="flex-1">
                           <FormField
                              control={form.control}
                              name="image"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Artwork Image</FormLabel>
                                    <FormControl>
                                       <ImageDnd
                                          value={field.value as File | null}
                                          onChange={(file) =>
                                             field.onChange(file)
                                          }
                                       />
                                    </FormControl>
                                    <FormDescription>
                                       Upload a high-quality image (max 5MB).
                                    </FormDescription>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div> */}
                  </CardContent>

                  <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                     <Button
                        onClick={() => form.reset()}
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        disabled={updateArtMutation.isPending}
                        className="w-full sm:w-auto"
                     >
                        {updateArtMutation.isPending
                           ? "Updating..."
                           : "Update Artwork"}
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </Form>
      </div>
   );
};
