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
import { getImage, handleFormError, slugify } from "@/lib/utils";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
// import ImageDnd from "@/components/image-dnd";
import {
   useGetArtistsInfinite,
} from "@/features/service/artspace/get-artists";
import {
   useGetArtworksInfinite,
} from "@/features/service/artspace/get-artworks";
import {
   eventCreateInputSchema,
   useEventCreate,
} from "@/features/service/artspace/event-create";
import DatePicker from "@/components/ui/date-picker";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import ImageDnd from "@/components/common/dnd-image-upload";
import { useEffect, useState } from "react";
import type { Artwork, ListApiResponse, User } from "@/types";
import { keepPreviousData } from "@tanstack/react-query";
import AsyncMultipleSelector from "@/components/common/async-multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { eventAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

type FormData = z.infer<typeof eventCreateInputSchema>;

interface EventCreateFormProps {
   onCreateSuccess?: () => void;
}

export const EventCreateForm = ({ onCreateSuccess }: EventCreateFormProps) => {
   const { addNotification } = useNotifications();

   const [artworksOldData, setArtworksOldData] = useState<ListApiResponse<Artwork>[]
   >([]);
   const [artistsOldData, setArtistsOldData] = useState<ListApiResponse<User>[]
   >([]);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [artworkSearch, setArtworkSearch] = useState("");
   const [artistSearch, setArtistSearch] = useState("");
   const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

   const artworksInfiniteQuery = useGetArtworksInfinite({
      page,
      search: artworkSearch,
      limit,
      queryConfig: { placeholderData: keepPreviousData },
   });

   useEffect(() => {
      if (!artworksInfiniteQuery.isLoading && artworksInfiniteQuery.data)
         setArtworksOldData(artworksInfiniteQuery.data.pages);
   }, [artworksInfiniteQuery.data, artworksInfiniteQuery.isLoading]);

   const artworksPagesToRender = artworksInfiniteQuery.isLoading
      ? artworksOldData
      : artworksInfiniteQuery.data?.pages || [];

   const artworks =
      artworksPagesToRender.flatMap((page) => page.results) ?? [];

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

   const imageUploadMutation = useImageUpload();
   const { source } = useSource();

   const eventCreateMutation = useEventCreate({
      mutationConfig: {
         onError: (error) => handleFormError(error, form),
         onSuccess: () => {
            addNotification({
               type: "success",
               title: "Success",
               message: "Event created successfully",
            });
            eventAnalytics.create(source);
            onCreateSuccess?.();
            form.reset();
         },
      },
   });

   const form = useForm<FormData>({
      resolver: zodResolver(eventCreateInputSchema),
      defaultValues: {
         title: "",
         slug: "",
         event_type: "SOLO",
         about: "",
         event_logo: undefined,
         cover_photo: undefined,
         artists_ids: [],
         artworks_ids: [],
         images: [],
         start_date: undefined,
         end_date: undefined,
         show_popup: false,
         popup_start: undefined,
         popup_end: undefined,
         is_published: false,
      },
   });

   const onSubmit: SubmitHandler<FormData> = (values) => {
      eventCreateMutation.mutate({ data: values });
   };

   const titleValue = form.watch("title");

   useEffect(() => {
      if (!titleValue || isSlugManuallyEdited) return;

      form.setValue("slug", slugify(titleValue), {
         shouldDirty: true,
         shouldValidate: true,
      });
   }, [titleValue, isSlugManuallyEdited, form]);

   return (
      <div className="mx-auto">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <Card className="border border-border shadow-sm">
                  <CardHeader>
                     <CardTitle>Create New Event</CardTitle>
                     <CardDescription>
                        Fill in the details below to create an event.
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8">
                     {/* Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input placeholder="Event title" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Slug */}
                     <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Unique slug"
                                    onChange={(e) => {
                                       setIsSlugManuallyEdited(true);
                                       field.onChange(e);
                                    }}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Slug will be used in URL
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
                                       <SelectItem value="SOLO">
                                          Solo
                                       </SelectItem>
                                       <SelectItem value="GROUP">
                                          Group
                                       </SelectItem>
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

                     {/* About */}
                     <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>About</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder="Describe the event"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Cover Photo */}
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
                              <FormDescription>
                                 Upload a cover photo (max 5MB)
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

                     {/* Artworks */}
                     <FormField
                        control={form.control}
                        name="artworks_ids"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Artworks</FormLabel>
                              <FormControl>
                                 <AsyncMultipleSelector
                                    onUserScrollToEnd={() => {
                                       if (
                                          artworksInfiniteQuery.hasNextPage &&
                                          !artworksInfiniteQuery.isFetchingNextPage
                                       ) {
                                          artworksInfiniteQuery.fetchNextPage();
                                       }
                                       // load next page / fetch more
                                    }}
                                    options={artworks.map((a) => ({
                                       label: a.title,
                                       value: a.id,
                                    }))}
                                    onSearchChange={(value) => {
                                       setArtworkSearch(value);
                                    }}
                                    loading={artworksInfiniteQuery.isFetching}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select artworks"
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
                                       field?.value?.map((url: string) =>
                                          getImage(url)
                                       ) || []
                                    }
                                    onRemoveImage={(newValue) => {
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
                                 Upload a cover photo (max 5MB)
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Start Date */}
                     <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel htmlFor={field.name}>Start Date</FormLabel>
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
                              <FormLabel htmlFor={field.name}>End Date</FormLabel>
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
                        disabled={eventCreateMutation.isPending}
                        className="w-full sm:w-auto"
                     >
                        {eventCreateMutation.isPending
                           ? "Creating..."
                           : "Create Event"}
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </Form>
      </div>
   );
};
