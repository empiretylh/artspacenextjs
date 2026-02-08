"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/date-picker";
import ImageDnd from "@/components/common/dnd-image-upload";
import AsyncMultipleSelector from "@/components/common/async-multi-select";

import { getDirtyValues, getImage, handleFormError, slugify } from "@/lib/utils";
import { useNotifications } from "@/components/ui/notifications";

import { keepPreviousData } from "@tanstack/react-query";

import {
   eventUpdateInputSchema,
   useEventUpdate,
   type EventUpdateInput,
} from "@/features/service/artspace/event-update";
import { useGetArtistsInfinite } from "@/features/service/artspace/get-artists";
import { useGetArtworksInfinite } from "@/features/service/artspace/get-artworks";
import type { Event } from "@/types";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { eventAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

interface EventUpdateFormProps {
   event: Event;
   onSuccess?: () => void;
}

export const EventUpdateForm = ({ event, onSuccess }: EventUpdateFormProps) => {
   const { addNotification } = useNotifications();

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
            label: `${a.first_name} ${a.last_name}`,
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

   const { source } = useSource();

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
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Update Event</CardTitle>
               </CardHeader>

               <CardContent className="space-y-6">
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Title</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="slug"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Slug</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 onChange={(e) => {
                                    setIsSlugManuallyEdited(true);
                                    field.onChange(e);
                                 }}
                              />
                           </FormControl>
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
                           <FormLabel>Event Type</FormLabel>
                           <FormControl>
                              <Select
                                 onValueChange={field.onChange}
                                 value={field.value}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="SOLO">Solo</SelectItem>
                                    <SelectItem value="GROUP">Group</SelectItem>
                                    <SelectItem value="COLLECTOR">
                                       Collector
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
                     name="about"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>About</FormLabel>
                           <FormControl>
                              <Textarea {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Cover image */}
                  <FormField
                     control={form.control}
                     name="cover_photo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel htmlFor={field.name}>Cover Photo</FormLabel>
                           <FormControl>
                              <ImageDnd
                                 ref={field.ref}
                                 id={field.name}
                                 name={field.name}
                                 value={field?.value?.map((url) => url) || []}
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
                           <FormDescription>
                              Upload a cover logo (max 5MB)
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
                           <FormLabel htmlFor={field.name}>Event Logo</FormLabel>
                           <FormControl>
                              <ImageDnd
                                 ref={field.ref}
                                 id={field.name}
                                 name={field.name}
                                 value={field?.value?.map((url) => url) || []}
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
                           <FormDescription>
                              Upload a event logo (max 5MB)
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Artists */}
                  <FormField
                     control={form.control}
                     name="artists_ids"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Artists</FormLabel>
                           <FormControl>
                              <AsyncMultipleSelector
                                 options={artists.map((a) => ({
                                    label: `${a.first_name} ${a.last_name}`,
                                    value: String(a.id),
                                 }))}
                                 value={field.value}
                                 onChange={field.onChange}
                                 onSearchChange={setArtistSearch}
                              />
                           </FormControl>
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
                           <FormLabel>Artworks</FormLabel>
                           <FormControl>
                              <AsyncMultipleSelector
                                 options={artworks.map((a) => ({
                                    label: a.title,
                                    value: a.id,
                                 }))}
                                 value={field.value}
                                 onChange={field.onChange}
                                 onSearchChange={setArtworkSearch}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="images"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel htmlFor={field.name}>Images</FormLabel>
                           <FormControl>
                              <ImageDnd
                                 ref={field.ref}
                                 id={field.name}
                                 name={field.name}
                                 value={
                                    field?.value?.map((url: string) => url) ||
                                    []
                                 }
                                 onRemoveImage={(newValue) => {
                                    console.log(
                                       "Removing image, new value:",
                                       newValue
                                    );
                                    field.onChange(newValue);
                                 }}
                                 // maxFiles={10}
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
                           <FormDescription>
                              Upload a event images (max 5MB)
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="start_date"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel htmlFor={field.name}>Start Date</FormLabel>
                           <FormControl>
                              <DatePicker
                                 ref={field.ref}
                                 id={field.name}
                                 name={field.name}
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
                     name="end_date"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel htmlFor={field.name}>End Date</FormLabel>
                           <FormControl>
                              <DatePicker
                                 ref={field.ref}
                                 id={field.name}
                                 name={field.name}
                                 value={field.value}
                                 onChange={field.onChange}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Popup */}
                  <FormField
                     control={form.control}
                     name="show_popup"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className="flex items-center gap-3">
                                 <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    onCheckedChange={field.onChange}
                                    checked={field.value}
                                 />
                                 <FormLabel htmlFor={field.name}>
                                    Show Popup?
                                 </FormLabel>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Popup Dates */}
                  {form.getValues("show_popup") && (
                     <div className="space-y-5">
                        <FormField
                           control={form.control}
                           name="popup_start"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel htmlFor={field.name}>Popup Start Date</FormLabel>
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
                                 <FormLabel htmlFor={field.name}>Popup End Date</FormLabel>
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

                  {/* Published */}
                  <FormField
                     control={form.control}
                     name="is_published"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className="flex items-center gap-3">
                                 <Checkbox
                                    id={field.name}
                                    name={field.name}
                                    onCheckedChange={field.onChange}
                                    checked={field.value}
                                 />
                                 <FormLabel htmlFor={field.name}>
                                    Published?
                                 </FormLabel>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </CardContent>

               <CardFooter className="flex justify-end gap-3">
                  <Button type="submit" disabled={updateMutation.isPending}>
                     {updateMutation.isPending ? "Updating..." : "Update Event"}
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </Form>
   );
};
