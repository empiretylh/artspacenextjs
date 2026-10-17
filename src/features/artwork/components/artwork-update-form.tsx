"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { keepPreviousData } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/components/ui/notifications";
import { getDirtyValues, handleFormError } from "@/lib/utils";
import YearPicker from "@/components/year-picker";
import MultipleSelector from "@/components/common/multi-select";
import { TagInput } from "@/components/common/tag-input";
import ImageDnd from "@/components/common/dnd-image-upload";
import RequiredAsterisk from "@/components/common/required-asterisk";
import AsyncMultipleSelector from "@/components/common/async-multi-select";
import { FormDialog, FormSection } from "@/components/common/dialogs/form-dialog";

import { updateArtInputSchema, useUpdateArt } from "../api/update-artwork";
import { useAuth } from "@/features/auth/store";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import { useGetCurrencies } from "@/features/service/artspace/get-currencies";
import { useGetArtistsInfinite } from "@/features/service/artspace/get-artists";
import type { Artwork, ListApiResponse, User } from "@/types";
import {
   ImageIcon,
   Sparkles,
   Tag,
   User as UserIcon,
   FileText,
   Pencil,
} from "lucide-react";

type FormData = z.infer<typeof updateArtInputSchema>;

export interface ArtworkUpdateFormProps {
   artwork: Artwork;
   isOpen: boolean;
   onClose: () => void;
   onUpdateSuccess?: () => void;
}

export const ArtworkUpdateForm: React.FC<ArtworkUpdateFormProps> = ({
   artwork,
   isOpen,
   onClose,
   onUpdateSuccess,
}) => {
   const { addNotification } = useNotifications();
   const { user } = useAuth();

   // Data queries
   const { data: categoriesResponse } = useGetCategories();
   const categories = categoriesResponse?.data ?? [];

   const { data: genresResponse, isLoading: isLoadingGenres } = useGetGenres();
   const genres = genresResponse?.data ?? [];

   const { data: stylesResponse } = useGetStyles();
   const styles = stylesResponse?.data ?? [];

   const { data: currencyQuery, isLoading: isLoadingCurrencies } = useGetCurrencies();
   const currencies = currencyQuery?.data ?? [];

   // Artists infinite query
   const [artistSearch, setArtistSearch] = useState("");
   const [artistsOldData, setArtistsOldData] = useState<ListApiResponse<User>[]>([]);

   const artistsInfiniteQuery = useGetArtistsInfinite({
      page: 1,
      search: artistSearch,
      limit: 10,
      queryConfig: { placeholderData: keepPreviousData },
   });

   useEffect(() => {
      if (!artistsInfiniteQuery.isLoading && artistsInfiniteQuery.data) {
         setArtistsOldData(artistsInfiniteQuery.data.pages);
      }
   }, [artistsInfiniteQuery.data, artistsInfiniteQuery.isLoading]);

   const artistsPagesToRender = artistsInfiniteQuery.isLoading
      ? artistsOldData
      : artistsInfiniteQuery.data?.pages || [];

   const artists =
      artistsPagesToRender
         .flatMap((page) => (page && 'results' in page && Array.isArray((page as any).results) ? (page as any).results : (Array.isArray(page) ? page : [])))
         .filter(Boolean) ?? [];

   // Mutations
   const imageUploadMutation = useImageUpload();

   const updateArtMutation = useUpdateArt({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Artwork Updated",
               message: "Changes have been saved successfully.",
            });
            onUpdateSuccess?.();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(updateArtInputSchema),
      defaultValues: {
         id: String(artwork.id),
         category: artwork.category?.id,
         genre: artwork.genre?.id,
         styles_artwork_ids: (artwork.styles || []).map((styleId) => ({
            label: styles.find((s) => s.id === styleId)?.name || "Unknown",
            value: String(styleId),
         })),
         artist: artwork.artist_profile
            ? [
                 {
                    label:
                       `${artwork.artist_profile.first_name || ""} ${artwork.artist_profile.last_name || ""}`.trim() ||
                       artwork.artist_profile.username ||
                       "Artist",
                    value: String(artwork.artist_profile.id),
                 },
              ]
            : [],
         title: artwork.title ?? "",
         description: artwork.description ?? "",
         dimensions: artwork.dimensions ?? "",
         medium: artwork.medium ?? "",
         hide_price: artwork.hide_price ?? false,
         price: artwork.price ? Number(artwork.price) : 1,
         currency: artwork.currency?.code ?? "MMK",
         visibility: artwork.visibility ?? "PRIVATE",
         are_u_owner: artwork.current_owner === user?.id,
         current_owner: artwork.current_owner,
         current_owner_name: artwork.current_owner_name ?? "",
         year: artwork.year ?? new Date().getFullYear(),
         status: artwork.status ?? "AVAILABLE",
         image: artwork.image ? [artwork.image] : [],
         search_keywords: artwork.search_keywords ?? [],
         artist_name: artwork.artist_name ?? "",
      },
   });

   const onError = (errors: any) => {
      console.error("[ArtworkUpdateForm] Form Validation Errors:", errors);
   };

   const onSubmit: SubmitHandler<FormData> = (values) => {
      console.log("[ArtworkUpdateForm] Form valid. Values:", values);
      const dirtyValues = getDirtyValues<FormData>(
         form.formState.dirtyFields,
         values
      );

      const payload = {
         ...dirtyValues,
         current_owner: values.are_u_owner ? user?.id : undefined,
         id: artwork.id,
      };

      updateArtMutation.mutate({ data: payload });
   };

   return (
      <FormDialog
         isOpen={isOpen}
         onClose={onClose}
         title="Update Artwork"
         description="Modify the artwork details and save your changes."
         icon={<Pencil className="w-4 h-4" />}
         size="3xl"
         formId="artwork-update-form"
         submitText="Save Changes"
         cancelText="Cancel"
         isSubmitting={updateArtMutation.isPending}
      >
         <Form {...form}>
            <form
               id="artwork-update-form"
               onSubmit={form.handleSubmit(onSubmit, onError)}
               className="space-y-8"
            >
            {/* Section 1: Media Upload */}
            <FormSection
               icon={<ImageIcon className="w-4 h-4" />}
               title="Artwork Media"
               description="Update the photograph or digital image of this artwork."
            >
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
                              value={field?.value?.map((url) => url) || []}
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
                                             const newUrls = response.data.map(
                                                (item) => item.url
                                             );
                                             let newValues: string[];
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
                                 }
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </FormSection>

            {/* Section 2: General Information */}
            <FormSection
               icon={<Sparkles className="w-4 h-4" />}
               title="General Information"
               description="Core identification, classification, and physical dimensions."
            >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Title */}
                  <div className="sm:col-span-2">
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
                                    className="h-10 text-sm bg-background border-border/80"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

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
                                    className="h-10 text-sm bg-background border-border/80 w-full"
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
                                    className="h-10 text-sm bg-background border-border/80 w-full"
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
                              <Input
                                 placeholder="e.g. Oil on canvas, Acrylic, Digital"
                                 className="h-10 text-sm bg-background border-border/80"
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
                                 placeholder="e.g. 44 x 56 cm"
                                 className="h-10 text-sm bg-background border-border/80"
                                 {...field}
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
                           <FormLabel>
                              Creation Year <RequiredAsterisk />
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

                  {/* Styles (Multi-select) */}
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="styles_artwork_ids"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
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
                                    placeholder="Select styles (e.g. Contemporary, Impressionism)..."
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Assign one or more visual styles to categorize your piece.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </div>
            </FormSection>

            {/* Section 3: Pricing & Marketplace */}
            <FormSection
               icon={<Tag className="w-4 h-4" />}
               title="Pricing & Marketplace"
               description="Manage availability status, pricing display, and collector visibility."
            >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                                    className="h-10 text-sm bg-background border-border/80 w-full"
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
                                    className="h-10 text-sm bg-background border-border/80 w-full"
                                 >
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="PUBLIC">
                                       Public (Visible to everyone)
                                    </SelectItem>
                                    <SelectItem value="PRIVATE">
                                       Private (Only you)
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Hide Price Box */}
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="hide_price"
                        render={({ field }) => (
                           <FormItem className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-0">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-0.5">
                                    <Label
                                       htmlFor="hide_price"
                                       className="text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                       Hide Price from Public
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground">
                                       Keep price private. Collectors will be prompted to inquire directly.
                                    </p>
                                 </div>
                                 <FormControl>
                                    <Checkbox
                                       id="hide_price"
                                       checked={field.value}
                                       onCheckedChange={(value) =>
                                          field.onChange(value)
                                       }
                                    />
                                 </FormControl>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Price & Currency (conditional) */}
                  {!form.watch("hide_price") && (
                     <>
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
                                       value={field.value?.toString() ?? "MMK"}
                                    >
                                       <SelectTrigger
                                          ref={field.ref}
                                          id={field.name}
                                          className="h-10 text-sm bg-background border-border/80 w-full"
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
                                                   {cat.name} ({cat.code})
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
                                       placeholder="Enter artwork price"
                                       min={1}
                                       step={1}
                                       className="h-10 text-sm bg-background border-border/80 font-mono"
                                       {...field}
                                       value={field.value ?? ""}
                                       onChange={(e) =>
                                          field.onChange(
                                             e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value)
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
               </div>
            </FormSection>

            {/* Section 4: Attribution & Ownership */}
            <FormSection
               icon={<UserIcon className="w-4 h-4" />}
               title="Attribution & Custody"
               description="Specify the creating artist and current artwork custodian."
            >
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Registered Artist Selector */}
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="artist"
                        render={({ field }) => (
                           <FormItem>
                              <div className="flex items-center justify-between"><FormLabel>Registered Artist</FormLabel><span className="text-[11px] text-muted-foreground font-normal">Only 1 artist selectable</span></div>
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
                                    }}
                                    options={artists.map((a) => ({
                                       label: `${a.first_name || ""} ${a.last_name || ""}`.trim() || a.username || "Artist",
                                       value: String(a.id),
                                    }))}
                                    onSearchChange={(value: string) => {
                                       setArtistSearch(value);
                                    }}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search and select artist (only 1 selectable)..."
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Select only 1 registered artist profile (or enter custom name below if unlisted).
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Custom Artist Name (if no artist selected) */}
                  {(form.watch("artist")?.length === 0 || !form.watch("artist")) && (
                     <div className="sm:col-span-2">
                        <FormField
                           control={form.control}
                           name="artist_name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Artist Name <RequiredAsterisk />
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Artist's full name"
                                       className="h-10 text-sm bg-background border-border/80"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription className="text-[11px] text-muted-foreground">
                                    Display name for artists without an Artspace profile.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  )}

                  {/* Are you the owner? */}
                  <div className="sm:col-span-2">
                     <FormField
                        control={form.control}
                        name="are_u_owner"
                        render={({ field }) => (
                           <FormItem className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-0">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-0.5">
                                    <Label
                                       htmlFor="are_u_owner"
                                       className="text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                       I am the current owner
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground">
                                       Confirm if you currently hold custody/ownership of this physical artwork.
                                    </p>
                                 </div>
                                 <FormControl>
                                    <Checkbox
                                       id="are_u_owner"
                                       checked={field.value}
                                       onCheckedChange={(value) =>
                                          field.onChange(value)
                                       }
                                    />
                                 </FormControl>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Owner name handling */}
                  {form.watch("are_u_owner") ? (
                     <div className="sm:col-span-2 space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">
                           Current Owner Name
                        </Label>
                        <div className="h-10 px-3 flex items-center rounded-lg border border-border/60 bg-muted/40 text-xs text-muted-foreground font-medium">
                           {`${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "You"} (Account Owner)
                        </div>
                     </div>
                  ) : (
                     <div className="sm:col-span-2">
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
                                       placeholder="Name of owner or holding gallery"
                                       className="h-10 text-sm bg-background border-border/80"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  )}
               </div>
            </FormSection>

            {/* Section 5: Story & Discovery */}
            <FormSection
               icon={<FileText className="w-4 h-4" />}
               title="Story & Discovery"
               description="Provide curatorial description and tags to improve search discoverability."
            >
               <div className="space-y-4">
                  {/* Description */}
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description / Curatorial Notes</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Describe the background, inspiration, or story behind this artwork..."
                                 className="min-h-28 resize-y text-sm bg-background border-border/80 leading-relaxed"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Search Keywords */}
                  <FormField
                     control={form.control}
                     name="search_keywords"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel htmlFor={field.name}>Search Keywords & Tags</FormLabel>
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
                           <FormDescription className="text-[11px] text-muted-foreground">
                              Press Enter or comma to add tags. Max 20 tags to help collectors discover your artwork.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </FormSection>
         </form>
      </Form>
   </FormDialog>
);
};
