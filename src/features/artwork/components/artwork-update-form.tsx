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
import { getDirtyValues, handleFormError } from "@/lib/utils";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/features/auth/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import YearPicker from "@/components/year-picker";
import { updateArtInputSchema, useUpdateArt } from "../api/update-artwork";
import type { Artwork, ListApiResponse, User } from "@/types";
import MultipleSelector from "@/components/common/multi-select";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";
import { TagInput } from "@/components/common/tag-input";
import ImageDnd from "@/components/common/dnd-image-upload";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import RequiredAsterisk from "@/components/common/required-asterisk";
import { Spinner } from "@/components/ui/spinner";
import { artworkAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import AsyncMultipleSelector from "@/components/common/async-multi-select";
import { useGetArtistsInfinite } from "@/features/service/artspace/get-artists";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useGetCurrencies } from "@/features/service/artspace/get-currencies";

// import your update API hook & schema

// inferred type
type FormData = z.infer<typeof updateArtInputSchema>;

interface ArtworkUpdateFormProps {
   artwork: Artwork; // Replace with your Artwork type
   onUpdateSuccess?: () => void;
}

export const ArtworkUpdateForm = ({
   artwork,
   onUpdateSuccess,
}: Readonly<ArtworkUpdateFormProps>) => {
   const { addNotification } = useNotifications();
   const { user } = useAuth();
   const imageUploadMutation = useImageUpload();
   const { data: categoriesResponse, isLoading: isLoadingCategories } =
      useGetCategories();
   const categories = categoriesResponse?.data ?? [];
   const { data: genresResponse, isLoading: isLoadingGenres } = useGetGenres();
   const genres = genresResponse?.data ?? [];
   const { data: stylesResponse, isLoading: isLoadingStyles } = useGetStyles();
   const styles = stylesResponse?.data ?? [];
   const { source } = useSource();
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [artistSearch, setArtistSearch] = useState("");
   const [artistsOldData, setArtistsOldData] = useState<ListApiResponse<User>[]
   >([]);

   const artistsInfiniteQuery = useGetArtistsInfinite({
      page,
      search: artistSearch,
      limit,
      queryConfig: { placeholderData: keepPreviousData },
   });


   useEffect(() => {
      if (!artistsInfiniteQuery.isLoading && artistsInfiniteQuery.data)
         setArtistsOldData(artistsInfiniteQuery.data.pages);
   }, [artistsInfiniteQuery.data, artistsInfiniteQuery.isLoading]);

   const artistsPagesToRender = artistsInfiniteQuery.isLoading
      ? artistsOldData
      : artistsInfiniteQuery.data?.pages || [];

   const artists =
      artistsPagesToRender.flatMap((page) => page.results) ?? [];

   const { data: currencyQuery, isLoading: isLoadingCurrencies } = useGetCurrencies();

   const currencies = currencyQuery?.data ?? [];


   const updateArtMutation = useUpdateArt({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Artwork updated successfully",
            });
            artworkAnalytics.update(artwork.id, source);
            onUpdateSuccess?.();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(updateArtInputSchema),
      values: {
         id: artwork.id,
         category: artwork.category.id,
         title: artwork.title,
         genre: artwork.genre.id,
         styles_artwork_ids: artwork.styles.map((styleId) => ({
            label: styles.find((s) => s.id === styleId)?.name || "Unknown",
            value: String(styleId),
         })),
         artist: artwork.artist_profile ? [{
            label: artwork.artist_profile.first_name + " " + artwork.artist_profile.last_name, value: String(artwork.artist_profile.id)
         }] : [],
         description: artwork.description ?? "",
         dimensions: artwork.dimensions ?? "",
         medium: artwork.medium ?? "",
         hide_price: artwork.hide_price ?? false,
         price: artwork.price ? Number(artwork.price) : 1,
         currency: artwork.currency.code ?? "MMK",
         visibility: artwork.visibility ?? "PRIVATE",
         are_u_owner: artwork.current_owner === user?.id,
         current_owner: artwork.current_owner,
         current_owner_name: artwork.current_owner_name ?? "",
         year: artwork.year ?? new Date().getFullYear(),
         status: artwork.status ?? "AVAILABLE",
         // image: undefined, // user may update image or leave empty
         image: artwork.image ? [artwork.image] : [],
         search_keywords: artwork.search_keywords ?? [],
      },
   });

   const onSubmit: SubmitHandler<FormData> = (values) => {
      const dirtyValues = getDirtyValues<FormData>(
         form.formState.dirtyFields,
         values
      );

      const payload = {
         ...dirtyValues,
         current_owner: values.are_u_owner ? user?.id : undefined,
         // artist: values.artist,
         // artist_name: values.artist_name,
         id: artwork.id,
      };

      updateArtMutation.mutate({ data: payload });
   };

   return (
      <div className="mx-auto">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-5"
            >
               <Card className="border border-border shadow-sm">
                  <CardHeader>
                     <CardTitle>Update Artwork</CardTitle>
                     <CardDescription>
                        Modify the details and save your changes.
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
                                 <Input placeholder="44 x 56 cm" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Medium */}
                     <FormField
                        control={form.control}
                        name="medium"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Medium <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <Input placeholder="e.g., Oil on canvas, Acrylic, Digital, etc." {...field} />
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
                                    name={field.name}
                                    disabled={isLoadingCategories}
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
                     {
                        isLoadingStyles || styles.length === 0 ? (
                           <div className="flex items-center justify-center">
                              <Spinner />
                           </div>
                        ) : (
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
                        )
                     }

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
                                       name={field.name}
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

                     {!form.watch("hide_price") && (
                        <>
                           {/* Currency */}
                           <FormField
                              control={form.control}
                              name="currency"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel htmlFor={field.name}>
                                       Currency <RequiredAsterisk />
                                    </FormLabel>
                                    <FormControl>
                                       <Select
                                          disabled={isLoadingCurrencies}
                                          onValueChange={(value) =>
                                             field.onChange(value)
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
                                                   isLoadingCurrencies
                                                      ? "Loading..."
                                                      : "Select currency"
                                                }
                                             />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {currencies.length > 0 ? (
                                                currencies.map((cat) => (
                                                   <SelectItem
                                                      key={cat.code}
                                                      value={cat.code}
                                                   >
                                                      {cat.name}
                                                   </SelectItem>
                                                ))
                                             ) : (
                                                <SelectItem disabled value="no-cat">
                                                   No currencies found
                                                </SelectItem>
                                             )}
                                          </SelectContent>
                                       </Select>
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
                                    <FormLabel>
                                       Price <RequiredAsterisk />
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

                     {/* Artwork Image */}
                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Artwork Image <RequiredAsterisk />
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
                                       console.log(typeof value);
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
                                 Upload Artwork Image (max 5MB)
                              </FormDescription> */}
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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


                     <FormField
                        control={form.control}
                        name="artist"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Artist</FormLabel>
                              <FormControl>
                                 <AsyncMultipleSelector
                                    maxSelected={1}
                                    onUserScrollToEnd={() => {
                                       if (
                                          artistsInfiniteQuery.hasNextPage &&
                                          !artistsInfiniteQuery.isFetchingNextPage
                                       ) {
                                          artistsInfiniteQuery.fetchNextPage();
                                       }
                                       // load next page / fetch more
                                    }}
                                    options={artists.map((a) => ({
                                       label: `${a.first_name} ${a.last_name}`,
                                       value: String(a.id),
                                    }))}
                                    onSearchChange={(value) => {
                                       setArtistSearch(value);
                                    }}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select artists"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {
                        (form.watch("artist")?.length === 0 || !form.watch("artist")) && (
                           <FormField
                              control={form.control}
                              name="artist_name"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>
                                       Artist Name
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          placeholder="Artist Name"
                                          {...field}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )
                     }

                     {/* Owner fields */}
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

                        {/* If user is owner */}
                        {form.getValues().are_u_owner && (
                           <div>
                              <FormLabel>Current Owner Name</FormLabel>
                              <Input
                                 disabled
                                 value={
                                    `${user?.first_name}` +
                                    ` ${user?.last_name}`
                                 }
                              />
                           </div>
                        )}

                        {/* If NOT owner */}
                        {!form.getValues().are_u_owner && (
                           <FormField
                              control={form.control}
                              name="current_owner_name"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>
                                       Current Owner Name <RequiredAsterisk />
                                    </FormLabel>
                                    <FormControl>
                                       <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}
                     </div>
                  </CardContent>

                  <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                     <Button
                        onClick={() => form.reset()}
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                     >
                        Reset Changes
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
      </div >
   );
};
