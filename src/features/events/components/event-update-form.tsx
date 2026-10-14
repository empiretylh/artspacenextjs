'use client';

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { keepPreviousData } from "@tanstack/react-query";

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";
import ImageDnd from "@/components/common/dnd-image-upload";
import AsyncMultipleSelector from "@/components/common/async-multi-select";
import RequiredAsterisk from "@/components/common/required-asterisk";
import { FormDialog, FormSection } from "@/components/common/dialogs/form-dialog";

import { getDirtyValues, handleFormError, slugify } from "@/lib/utils";
import { useNotifications } from "@/components/ui/notifications";
import {
   eventUpdateInputSchema,
   useEventUpdate,
   type EventUpdateInput,
} from "@/features/service/artspace/event-update";
import { useGetArtistsInfinite } from "@/features/service/artspace/get-artists";
import { useGetArtworksInfinite } from "@/features/service/artspace/get-artworks";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import { eventAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import type { Event } from "@/types";
import {
   CalendarDays,
   ImageIcon,
   Sparkles,
   Users,
   Globe,
   Pencil,
} from "lucide-react";

export interface EventUpdateFormProps {
   event: Event;
   isOpen: boolean;
   onClose: () => void;
   onSuccess?: () => void;
}

export const EventUpdateForm: React.FC<EventUpdateFormProps> = ({
   event,
   isOpen,
   onClose,
   onSuccess,
}) => {
   const { addNotification } = useNotifications();
   const { source } = useSource();

   const form = useForm<EventUpdateInput>({
      resolver: zodResolver(eventUpdateInputSchema),
      defaultValues: {
         title: event.title,
         slug: event.slug,
         about: event.about,
         event_type: event.event_type,
         cover_photo: event.cover_photo ? [event.cover_photo] : [],
         event_logo: event.event_logo ? [event.event_logo] : [],
         images: event.images ? event.images.map((each) => each.url) : [],
         artists_ids: event.artists.map((a) => ({
            label: `${a.first_name || ""} ${a.last_name || ""}`.trim() || a.username || "Artist",
            value: String(a.id),
         })),
         artworks_ids: event.artworks.map((a) => ({
            label: a.title,
            value: String(a.id),
         })),
         start_date: new Date(event.start_date),
         end_date: new Date(event.end_date),
         show_popup: event.show_popup,
         popup_start: event.popup_start
            ? new Date(event.popup_start)
            : undefined,
         popup_end: event.popup_end ? new Date(event.popup_end) : undefined,
         is_published: event.is_published,
      },
   });

   const updateMutation = useEventUpdate({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Updated",
               message: "Event updated successfully",
            });
            eventAnalytics.update(event.id, source);
            onSuccess?.();
         },
      },
   });

   const onSubmit: SubmitHandler<EventUpdateInput> = (values) => {
      const dirtyValues = getDirtyValues<EventUpdateInput>(
         form.formState.dirtyFields,
         values
      );

      updateMutation.mutate({
         id: event.id,
         data: {
            ...dirtyValues,
         },
      });
   };

   /* ------------------------------
      Async artists / artworks
   -------------------------------- */
   const [artistSearch, setArtistSearch] = useState("");
   const [artworkSearch, setArtworkSearch] = useState("");

   const artistsQuery = useGetArtistsInfinite({
      search: artistSearch,
      limit: 10,
      queryConfig: { placeholderData: keepPreviousData },
   });

   const artworksQuery = useGetArtworksInfinite({
      search: artworkSearch,
      limit: 10,
      queryConfig: { placeholderData: keepPreviousData },
   });

   const artists =
      artistsQuery.data?.pages.flatMap((p) => p.results) ?? [];

   const artworks =
      artworksQuery.data?.pages.flatMap((p) => p.results) ?? [];

   /* ------------------------------
      Slug auto-generation
   -------------------------------- */
   const titleValue = form.watch("title");
   const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

   useEffect(() => {
      if (!titleValue || isSlugManuallyEdited) return;

      form.setValue("slug", slugify(titleValue), {
         shouldDirty: true,
         shouldValidate: true,
      });
   }, [titleValue, isSlugManuallyEdited, form]);

   const imageUploadMutation = useImageUpload();

   return (
      <FormDialog
         isOpen={isOpen}
         onClose={onClose}
         title="Update Event"
         description="Modify exhibition details, schedule dates, participating artists and artworks."
         icon={<Pencil className="w-4 h-4" />}
         size="3xl"
         formId="event-update-form"
         submitText="Save Changes"
         cancelText="Cancel"
         isSubmitting={updateMutation.isPending}
      >
         <Form {...form}>
            <form
               id="event-update-form"
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-8"
            >
               {/* Section 1: General Information */}
               <FormSection
                  icon={<Sparkles className="w-4 h-4" />}
                  title="General Information"
                  description="Event title, URL identifier, and exhibition category."
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
                                       placeholder="e.g. Modern Expressions 2026"
                                       className="h-10 text-sm bg-background border-border/80"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Slug */}
                     <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Slug <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="unique-event-slug"
                                    className="h-10 text-sm bg-background border-border/80"
                                    onChange={(e) => {
                                       setIsSlugManuallyEdited(true);
                                       field.onChange(e);
                                    }}
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Used in public URL: /events/{field.value || "slug"}
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Event Type */}
                     <FormField
                        control={form.control}
                        name="event_type"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 Event Type <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                 >
                                    <SelectTrigger className="h-10 text-sm bg-background border-border/80 w-full">
                                       <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="SOLO">Solo Exhibition</SelectItem>
                                       <SelectItem value="GROUP">Group Exhibition</SelectItem>
                                       <SelectItem value="COLLECTOR">Collector Showcase</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* About / Description */}
                     <div className="sm:col-span-2">
                        <FormField
                           control={form.control}
                           name="about"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    About / Curatorial Concept <RequiredAsterisk />
                                 </FormLabel>
                                 <FormControl>
                                    <Textarea
                                       placeholder="Provide an overview, theme, and background of this event (min 10 characters)..."
                                       className="min-h-24 resize-y text-sm bg-background border-border/80 leading-relaxed"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>
               </FormSection>

               {/* Section 2: Media & Branding */}
               <FormSection
                  icon={<ImageIcon className="w-4 h-4" />}
                  title="Media & Branding"
                  description="Update banner, logo, and supplementary gallery photographs."
               >
                  <div className="space-y-5">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {/* Cover Photo */}
                        <FormField
                           control={form.control}
                           name="cover_photo"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel htmlFor={field.name}>
                                    Cover Banner <RequiredAsterisk />
                                 </FormLabel>
                                 <FormControl>
                                    <ImageDnd
                                       ref={field.ref}
                                       id={field.name}
                                       name={field.name}
                                       value={field.value?.map((url) => url) || []}
                                       onRemoveImage={(newValue) => field.onChange(newValue)}
                                       maxFiles={1}
                                       loading={imageUploadMutation.isPending}
                                       onChange={(value) => {
                                          if (value) {
                                             imageUploadMutation.mutate(
                                                { data: { image: value } },
                                                {
                                                   onSuccess: (response) => {
                                                      const newUrls = response.data.map((item) => item.url);
                                                      const newValues = field.value ? [...field.value, ...newUrls] : [...newUrls];
                                                      field.onChange(newValues);
                                                   },
                                                }
                                             );
                                          }
                                       }}
                                    />
                                 </FormControl>
                                 <FormDescription className="text-[11px] text-muted-foreground">
                                    Recommended: 2:1 widescreen banner image
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Event Logo */}
                        <FormField
                           control={form.control}
                           name="event_logo"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel htmlFor={field.name}>
                                    Event Logo <RequiredAsterisk />
                                 </FormLabel>
                                 <FormControl>
                                    <ImageDnd
                                       ref={field.ref}
                                       id={field.name}
                                       name={field.name}
                                       value={field.value?.map((url) => url) || []}
                                       onRemoveImage={(newValue) => field.onChange(newValue)}
                                       maxFiles={1}
                                       loading={imageUploadMutation.isPending}
                                       onChange={(value) => {
                                          if (value) {
                                             imageUploadMutation.mutate(
                                                { data: { image: value } },
                                                {
                                                   onSuccess: (response) => {
                                                      const newUrls = response.data.map((item) => item.url);
                                                      const newValues = field.value ? [...field.value, ...newUrls] : [...newUrls];
                                                      field.onChange(newValues);
                                                   },
                                                }
                                             );
                                          }
                                       }}
                                    />
                                 </FormControl>
                                 <FormDescription className="text-[11px] text-muted-foreground">
                                    Square or emblem format logo
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Supplementary Gallery Images */}
                     <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>Additional Event Photos</FormLabel>
                              <FormControl>
                                 <ImageDnd
                                    ref={field.ref}
                                    id={field.name}
                                    name={field.name}
                                    value={field.value?.map((url: string) => url) || []}
                                    onRemoveImage={(newValue) => field.onChange(newValue)}
                                    loading={imageUploadMutation.isPending}
                                    onChange={(value) => {
                                       if (value) {
                                          imageUploadMutation.mutate(
                                             { data: { image: value } },
                                             {
                                                onSuccess: (response) => {
                                                   const newUrls = response.data.map((item) => item.url);
                                                   const newValues = field.value ? [...field.value, ...newUrls] : [...newUrls];
                                                   field.onChange(newValues);
                                                },
                                             }
                                          );
                                       }
                                    }}
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Upload exhibition photos, installation views, or venue pictures.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </FormSection>

               {/* Section 3: Schedule & Dates */}
               <FormSection
                  icon={<CalendarDays className="w-4 h-4" />}
                  title="Schedule & Timing"
                  description="Opening and closing dates for the exhibition."
               >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                     {/* Start Date */}
                     <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 Start Date <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <DatePicker
                                    id={field.name}
                                    name={field.name}
                                    ref={field.ref}
                                    value={field.value}
                                    onChange={field.onChange}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* End Date */}
                     <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>
                                 End Date <RequiredAsterisk />
                              </FormLabel>
                              <FormControl>
                                 <DatePicker
                                    id={field.name}
                                    name={field.name}
                                    ref={field.ref}
                                    value={field.value}
                                    onChange={field.onChange}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </FormSection>

               {/* Section 4: Curation (Artists & Artworks) */}
               <FormSection
                  icon={<Users className="w-4 h-4" />}
                  title="Featured Artists & Artworks"
                  description="Link participating artist profiles and specific artworks exhibited."
               >
                  <div className="space-y-4">
                     {/* Artists */}
                     <FormField
                        control={form.control}
                        name="artists_ids"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Participating Artists</FormLabel>
                              <FormControl>
                                 <AsyncMultipleSelector
                                    onUserScrollToEnd={() => {
                                       if (
                                          artistsQuery.hasNextPage &&
                                          !artistsQuery.isFetchingNextPage
                                       ) {
                                          artistsQuery.fetchNextPage();
                                       }
                                    }}
                                    options={artists.map((a) => ({
                                       label: `${a.first_name || ""} ${a.last_name || ""}`.trim() || a.username || "Artist",
                                       value: String(a.id),
                                    }))}
                                    onSearchChange={(value) => {
                                       setArtistSearch(value);
                                    }}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search artists by name..."
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Tagged artists will receive exhibition invitations and be linked on the event page.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Artworks */}
                     <FormField
                        control={form.control}
                        name="artworks_ids"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Exhibited Artworks</FormLabel>
                              <FormControl>
                                 <AsyncMultipleSelector
                                    onUserScrollToEnd={() => {
                                       if (
                                          artworksQuery.hasNextPage &&
                                          !artworksQuery.isFetchingNextPage
                                       ) {
                                          artworksQuery.fetchNextPage();
                                       }
                                    }}
                                    options={artworks.map((a) => ({
                                       label: a.title,
                                       value: String(a.id),
                                    }))}
                                    onSearchChange={(value) => {
                                       setArtworkSearch(value);
                                    }}
                                    loading={artworksQuery.isFetching}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search artworks by title..."
                                 />
                              </FormControl>
                              <FormDescription className="text-[11px] text-muted-foreground">
                                 Featured artworks presented in this exhibition catalogue.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </FormSection>

               {/* Section 5: Promotion & Visibility */}
               <FormSection
                  icon={<Globe className="w-4 h-4" />}
                  title="Promotion & Publishing"
                  description="Visibility, status, and homepage announcement popup options."
               >
                  <div className="space-y-4">
                     {/* Published Toggle */}
                     <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => (
                           <FormItem className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-0">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-0.5">
                                    <Label
                                       htmlFor="is_published"
                                       className="text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                       Publish Event
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground">
                                       Make this event publicly visible in the gallery events calendar immediately.
                                    </p>
                                 </div>
                                 <FormControl>
                                    <Checkbox
                                       id="is_published"
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                 </FormControl>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Popup Toggle */}
                     <FormField
                        control={form.control}
                        name="show_popup"
                        render={({ field }) => (
                           <FormItem className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-0">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-0.5">
                                    <Label
                                       htmlFor="show_popup"
                                       className="text-xs font-semibold text-foreground cursor-pointer"
                                    >
                                       Promote as Homepage Announcement Popup
                                    </Label>
                                    <p className="text-[11px] text-muted-foreground">
                                       Highlight this event in a prominent modal popup for site visitors.
                                    </p>
                                 </div>
                                 <FormControl>
                                    <Checkbox
                                       id="show_popup"
                                       checked={field.value}
                                       onCheckedChange={field.onChange}
                                    />
                                 </FormControl>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Popup Dates (Conditional) */}
                     {form.watch("show_popup") && (
                        <div className="p-4 rounded-xl border border-border/60 bg-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="popup_start"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel htmlFor={field.name}>
                                       Popup Active From <RequiredAsterisk />
                                    </FormLabel>
                                    <FormControl>
                                       <DatePicker
                                          id={field.name}
                                          name={field.name}
                                          ref={field.ref}
                                          value={field.value}
                                          onChange={field.onChange}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="popup_end"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel htmlFor={field.name}>
                                       Popup Active Until <RequiredAsterisk />
                                    </FormLabel>
                                    <FormControl>
                                       <DatePicker
                                          id={field.name}
                                          name={field.name}
                                          ref={field.ref}
                                          value={field.value}
                                          onChange={field.onChange}
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
            </form>
         </Form>
      </FormDialog>
   );
};
