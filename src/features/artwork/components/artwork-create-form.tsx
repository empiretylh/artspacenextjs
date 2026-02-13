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

import { useCreateArt, createArtInputSchema } from "../api/create-artwork";
import { useAuth } from "@/features/auth/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import YearPicker from "@/components/year-picker";
import MultipleSelector from "@/components/common/multi-select";
import { TagInput } from "@/components/common/tag-input";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";
import ImageDnd from "@/components/common/dnd-image-upload";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import RequiredAsterisk from "@/components/common/required-asterisk";
import { artworkAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

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
   const { data: genresResponse, isLoading: isLoadingGenres } = useGetGenres();
   const genres = genresResponse?.data ?? [];
   const { data: stylesResponse, isLoading: isLoadingStyles } = useGetStyles();
   const styles = stylesResponse?.data ?? [];

   const imageUploadMutation = useImageUpload();
   const { source } = useSource();

   const createArtMutation = useCreateArt({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Artwork created successfully",
            });
            form.reset();
            artworkAnalytics.create(source);
            onCreateSuccess?.();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(createArtInputSchema),
      defaultValues: {
         category: undefined,
         genre: undefined,
         styles_artwork_ids: [],
         title: "",
         hide_price: false,
         description: "",
         dimensions: "",
         price: 1,
         visibility: "PRIVATE",
         are_u_owner: true,
         current_owner: user?.id,
         current_owner_name: "",
         year: new Date().getFullYear(),
         status: "AVAILABLE",
         image: [],
         search_keywords: [],
      },
   });

   const onSubmit: SubmitHandler<FormData> = (values) => {
      const payload = {
         ...values,
         current_owner: values.are_u_owner ? user?.id : undefined,
         search_keywords:
            (values.search_keywords?.length ?? 0) > 0
               ? values.search_keywords
               : undefined,
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
                     {/* Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Title <RequiredAsterisk />
                              </FormLabel>
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

                     {/* Dimensions */}
                     <FormField
                        control={form.control}
                        name="dimensions"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Dimensions <RequiredAsterisk />
                              </FormLabel>
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

                     {/* Category */}
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Category <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={(value) =>
                                       field.onChange(Number(value))
                                    }
                                    value={field.value?.toString() ?? ""}
                                 >
                                    <SelectTrigger
                                       ref={field.ref}
                                       id={field.name}
                                       name={field.name}
                                       className="w-full"
                                    >
                                       <SelectValue placeholder="Select category" />
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
                                          <SelectItem disabled value="no-cat">
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

                     <FormField
                        control={form.control}
                        name="search_keywords"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>Search Keywords</FormLabel>
                              <FormControl>
                                 <TagInput
                                    id={field.name}
                                    name={field.name}
                                    value={field.value ?? []}
                                    onChange={(arr) => field.onChange(arr)}
                                    placeholder="Add keywords and press Enter"
                                    maxTags={20}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Add tags/keywords to improve search visibility
                                 — press Enter or comma to add.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Styles */}
                     <FormField
                        control={form.control}
                        name="styles_artwork_ids"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel aria-hidden htmlFor={field.name}>
                                 Styles <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <MultipleSelector
                                    ref={field.ref}
                                    id={field.name}
                                    name={field.name}
                                    label="Styles"
                                    options={styles.map((p) => ({
                                       label: p.name,
                                       value: String(p.id),
                                    }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select styles"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Assign one or more styles to this role.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Genre */}
                     <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Genre <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <Select
                                    disabled={isLoadingGenres}
                                    onValueChange={(value) =>
                                       field.onChange(Number(value))
                                    }
                                    value={field.value?.toString() ?? ""}
                                 >
                                    <SelectTrigger
                                       ref={field.ref}
                                       id={field.name}
                                       className="w-full"
                                    >
                                       <SelectValue
                                          placeholder={
                                             isLoadingGenres
                                                ? "Loading..."
                                                : "Select genre"
                                          }
                                       />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {genres.length > 0 ? (
                                          genres.map((cat) => (
                                             <SelectItem
                                                key={cat.id}
                                                value={cat.id.toString()}
                                             >
                                                {cat.name}
                                             </SelectItem>
                                          ))
                                       ) : (
                                          <SelectItem disabled value="no-cat">
                                             No genres found
                                          </SelectItem>
                                       )}
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Image <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <ImageDnd
                                    ref={field.ref}
                                    id={field.name}
                                    value={
                                       field?.value?.map((url) => url) || []
                                    }
                                    onRemoveImage={(newValue) => {
                                       field.onChange(newValue);
                                    }}
                                    maxFiles={1}
                                    loading={imageUploadMutation.isPending}
                                    onChange={(value) => {
                                       if (value) {
                                          imageUploadMutation.mutate(
                                             { data: { image: value } },
                                             {
                                                onSuccess: (response) => {
                                                   const newUrls =
                                                      response.data.map(
                                                         (item) => item.url
                                                      );
                                                   let newValues = undefined;
                                                   if (field.value) {
                                                      newValues = [
                                                         ...field.value,
                                                         ...newUrls,
                                                      ];
                                                   } else {
                                                      newValues = [...newUrls];
                                                   }
                                                   field.onChange(newValues);
                                                },
                                             }
                                          );
                                          // field.onChange(value);
                                       }
                                    }}
                                 />
                              </FormControl>
                              {/* <FormDescription>
                                 Upload a Image (max 5MB)
                              </FormDescription> */}
                              <FormMessage />
                           </FormItem>
                        )}
                     />



                     {/* Hide Price */}
                     <FormField
                        control={form.control}
                        name="hide_price"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <div className="flex items-center gap-3">
                                    <Checkbox
                                       id="hide_price"
                                       checked={field.value}
                                       onCheckedChange={(value) =>
                                          field.onChange(value)
                                       }
                                    />
                                    <Label htmlFor="hide_price">
                                       Hide Price?
                                    </Label>
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {!form.watch("hide_price") && (
                        <>
                           {/* Price */}
                           <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>
                                       Price (USD) <RequiredAsterisk />
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          type="number"
                                          placeholder="e.g., 5000"
                                          min={1}
                                          step={1}
                                          {...field}
                                          onChange={(e) =>
                                             field.onChange(
                                                Number(e.target.value)
                                             )
                                          }
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </>
                     )}

                     {/* Year */}
                     <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Year <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <YearPicker
                                    id={field.name}
                                    value={field.value}
                                    onChange={(year) => field.onChange(year)}
                                    minYear={1000}
                                    maxYear={new Date().getFullYear()}
                                    placeholder="Select year"
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
                              <FormLabel htmlFor={field.name}>
                                 Status <RequiredAsterisk />
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
                                       <SelectItem value="NOT_FOR_SALE">
                                          Not for sale
                                       </SelectItem>
                                       <SelectItem value="SOLD_OUT">
                                          Sold out
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
                     {/* <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Artwork Image</FormLabel>
                              <FormControl>
                                 <ImageDnd
                                    value={field.value as File | null}
                                    onChange={(file) => field.onChange(file)}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Upload a high-quality image (max 5MB).
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     /> */}



                     {/* Visibility */}
                     <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Visibility <RequiredAsterisk />
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
                                       <SelectValue />
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

                     {/* Are you owner? */}
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

                     {/* Owner name handling */}
                     {form.getValues().are_u_owner ? (
                        <div>
                           <FormLabel>Current Owner Name</FormLabel>
                           <Input
                              value={
                                 `${user?.first_name}` + ` ${user?.last_name}`
                              }
                              disabled
                           />
                        </div>
                     ) : (
                        <FormField
                           control={form.control}
                           name="current_owner_name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Current Owner Name <RequiredAsterisk />
                                 </FormLabel>
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
                     )}
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
