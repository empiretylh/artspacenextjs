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
import { useCreateArt, createArtInputSchema } from "../api/create-artwork";
import { useAuth } from "@/features/auth/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import YearPicker from "@/components/year-picker";
import { useGetCategories } from "@/features/service/artspace/get-categories";

// ✅ Zod schema inferred type
type FormData = z.infer<typeof createArtInputSchema>;

interface ArtworkCreateFormProps {
   onCreateSuccess?: () => void;
}

export const ArtworkCreateForm = ({
   onCreateSuccess,
}: Readonly<ArtworkCreateFormProps>) => {
   const { addNotification } = useNotifications();
   const { user } = useAuth();
   const { data: categoriesResponse, isLoading: isLoadingCategories } =
      useGetCategories();
   const categories = categoriesResponse?.data ?? [];

   const createArtMutation = useCreateArt({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Artwork created successfully",
            });
            onCreateSuccess?.();
            form.reset();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(createArtInputSchema),
      defaultValues: {
         category: 1,
         title: "",
         description: "",
         dimensions: "",
         price: 0,
         visibility: "PRIVATE",
         are_u_owner: true,
         current_owner: user?.id,
         current_owner_name: "",
         year: new Date().getFullYear(),
         status: "AVAILABLE",
         image: undefined,
      },
   });

   const onSubmit: SubmitHandler<FormData> = (values) => {
      const payload = {
         ...values,
         current_owner: values.are_u_owner ? user?.id : undefined,
      };
      createArtMutation.mutate({ data: payload });
   };

   return (
      <div className="mx-auto">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <Card className="border border-border shadow-sm">
                  <CardHeader>
                     <CardTitle>Create New Artwork</CardTitle>
                     <CardDescription>
                        Fill in the details below to showcase your artwork.
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                     {/* Responsive layout: two columns on md+ */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel htmlFor={field.name}>
                                    Category
                                 </FormLabel>
                                 <FormControl>
                                    <Select
                                       disabled={isLoadingCategories}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       value={field.value?.toString() ?? ""}
                                    >
                                       <SelectTrigger
                                          id={field.name}
                                          className="w-full"
                                       >
                                          <SelectValue
                                             placeholder={
                                                isLoadingCategories
                                                   ? "Loading..."
                                                   : "Select category"
                                             }
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
                                    {/* <Input
                                       type="date"
                                       {...field}
                                       onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                       }
                                    /> */}
                                    <div>
                                       <YearPicker
                                          id={field.name}
                                          value={field.value}
                                          onChange={(year) =>
                                             field.onChange(year)
                                          }
                                          minYear={1000}
                                          maxYear={new Date().getFullYear()}
                                          placeholder="Select year"
                                       />
                                    </div>
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
                                 <FormLabel htmlFor={field.name}>
                                    Status
                                 </FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value}
                                    >
                                       <SelectTrigger
                                          id={field.name}
                                          className="w-full"
                                       >
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

                     {/* Description (full width) */}
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

                     {/* Image Upload (centered) */}
                     <div className="flex flex-col md:flex-row md:items-start md:gap-6">
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
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                           control={form.control}
                           name="visibility"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel htmlFor={field.name}>
                                    Visibility
                                 </FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value}
                                    >
                                       <SelectTrigger
                                          id={field.name}
                                          className="w-full"
                                       >
                                          <SelectValue placeholder="Select status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="PUBLIC">
                                             Public
                                          </SelectItem>
                                          <SelectItem value="PRIVATE">
                                             Private
                                          </SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                           <FormField
                              control={form.control}
                              name="are_u_owner"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormControl>
                                       <div className="flex items-center gap-3">
                                          <Checkbox
                                             id="are_u_owner"
                                             checked={field.value}
                                             onCheckedChange={(value) =>
                                                field.onChange(value)
                                             }
                                          />
                                          <Label htmlFor="are_u_owner">
                                             Are you the owner?
                                          </Label>
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <div
                              className={
                                 form.getValues().are_u_owner === false
                                    ? "hidden"
                                    : ""
                              }
                           >
                              <FormLabel>Current Owner Name</FormLabel>
                              <Input
                                 placeholder="Current Owner Name"
                                 value={
                                    `${user?.first_name}` +
                                    ` ${user?.last_name}`
                                 }
                                 disabled
                              />
                           </div>

                           <FormField
                              control={form.control}
                              name="current_owner_name"
                              render={({ field }) => (
                                 <FormItem
                                    className={
                                       form.getValues().are_u_owner === true
                                          ? "hidden"
                                          : ""
                                    }
                                 >
                                    <FormLabel>Current Owner Name</FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="Current Owner Name"
                                          {...field}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>
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
                        disabled={createArtMutation.isPending}
                        className="w-full sm:w-auto"
                     >
                        {createArtMutation.isPending
                           ? "Creating..."
                           : "Create Artwork"}
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </Form>
      </div>
   );
};
