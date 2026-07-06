'use client'
import ArtistsIcon from "@/components/icons/artists-icon";
import AwardIcon from "@/components/icons/award-icon";
import CheckMarkIcon from "@/components/icons/check-mark-icon";
import Layers2Icon from "@/components/icons/layers-2-icon";
import SquareStackIcon from "@/components/icons/square-stack-icon";
import { useGetProfile } from "../api/get-profile";
import { useUploadFeaturedPhoto } from "../api/upload-featured-photo";
import { useGetFeaturedPhotos } from "../api/get-featured-photos";
import { useEditFeaturedPhoto } from "../api/edit-featured-photo";

import { getImage } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRef } from "react";
import { useNotifications } from "@/components/ui/notifications";
import { useSoftDeleteFeaturedPhoto } from "../api/delete-featured-photo";

const ProfileOverviewPage = () => {
   const { data } = useGetProfile();
   const featuredPhotosQuery = useGetFeaturedPhotos();
   const deleteFeaturedPhotoMutation = useSoftDeleteFeaturedPhoto({
      mutationConfig: {
         onSuccess: () => {
            notification.addNotification({
               type: "success",
               title: "Success",
               message: "Image deleted successfully",
            });
         },
      },
   });

   const uploadFeaturePhotoMutation = useUploadFeaturedPhoto({
      mutationConfig: {
         onSuccess: () => {
            notification.addNotification({
               type: "success",
               title: "Success",
               message: "Image uploaded successfully",
            });
         },
      },
   });

   const editFeaturedPhotoMutation = useEditFeaturedPhoto({
      mutationConfig: {
         onSuccess: () => {
            notification.addNotification({
               type: "success",
               title: "Success",
               message: "Image updated successfully",
            });
         },
      },
   });

   const onDeleteFeaturedPhoto = (id: string) => {
      deleteFeaturedPhotoMutation.mutate({ featuredPhotoId: id });
   };

   const userProfile = data?.data;
   const featuredPhotos = featuredPhotosQuery?.data?.data;

   const notification = useNotifications();

   const uploadInputRef = useRef<HTMLInputElement>(null);
   const editInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

   if (!userProfile) return <div>Profile not found</div>;

   const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      uploadFeaturePhotoMutation.mutate({ data: { image: file } });
      e.target.value = "";
   };

   const handleEditChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      id: string
   ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      editFeaturedPhotoMutation.mutate({
         id,
         data: { image: file },
      });

      e.target.value = "";
   };

   return (
      <section className="w-full" aria-labelledby="profile-overview-title">
         <div className="space-y-8 col-span-3 md:col-span-2">
            <div>
               <h2 id="profile-overview-title" className="text-2xl font-bold font-display mb-4">
                  About the profile
               </h2>
               <p className="text-base">
                  {userProfile.profile.about || "No about available."}
               </p>
            </div>

            <div>
               <h3 className="text-2xl font-bold font-display mb-4">Summary</h3>

               <div className="grid grid-cols-1 gap-4 text-sm font-normal" role="list">
                  <div className="flex gap-2 items-center" role="listitem">
                     <ArtistsIcon />
                     <span>Kind of Fine Art</span>
                     <span className="text-muted-foreground">
                        Digital Impressionism
                     </span>
                  </div>

                  <div className="flex gap-2 items-center" role="listitem">
                     <AwardIcon />
                     <span>Kind of Fine Art</span>
                     <div className="flex items-center bg-success/10 p-1.5 text-xs gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </div>

                  <div className="flex gap-2 items-center" role="listitem">
                     <Layers2Icon />
                     <span>Kind of Fine Art</span>
                     <div className="flex items-center bg-success/10 p-1.5 text-xs gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </div>

                  <div className="flex gap-2 items-center" role="listitem">
                     <SquareStackIcon />
                     <span>Kind of Fine Art</span>
                     <div className="flex items-center bg-success/10 p-1.5 text-xs gap-1 rounded-xl text-success">
                        <CheckMarkIcon size={18} className="w-4 h-4" /> Verified
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center sm:justify-end">
               <input
                  ref={uploadInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleUploadChange}
               />

               <Button
                  type="button"
                  variant="default"
                  disabled={uploadFeaturePhotoMutation.isPending}
                  onClick={() => uploadInputRef.current?.click()}
               >
                  Upload Featured Photo
               </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {featuredPhotos?.map((image) => (
                  <figure key={image.id} className="relative">
                     <img
                        src={getImage(image.image)}
                        alt={image.description || "Featured photo"}
                        className="w-full aspect-[4/5] object-cover rounded-sm border"
                     />

                     <input
                        ref={(instance) => {
                           if (instance) {
                              editInputRefs.current[image.id] = instance;
                           }
                        }}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleEditChange(e, String(image.id))}
                     />

                     <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                           type="button"
                           size="icon"
                           disabled={editFeaturedPhotoMutation.isPending}
                           className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border border-white"
                           onClick={() =>
                              editInputRefs.current[image.id]?.click()
                           }
                        >
                           <Pencil className="w-4 h-4 text-white" />
                        </Button>

                        <Button
                           type="button"
                           size="icon"
                           loading={deleteFeaturedPhotoMutation.isPending}
                           disabled={deleteFeaturedPhotoMutation.isPending}
                           className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-destructive hover:bg-destructive/80 border border-white"
                           onClick={() =>
                              onDeleteFeaturedPhoto(String(image.id))
                           }
                        >
                           {!deleteFeaturedPhotoMutation.isPending && (
                              <Trash className="w-4 h-4 text-white" />
                           )}
                        </Button>
                     </div>
                  </figure>
               ))}
            </div>
         </div>
      </section>
   );
};

export default ProfileOverviewPage;
