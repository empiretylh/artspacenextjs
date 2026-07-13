'use client'
import ArtistsIcon from "@/components/icons/artists-icon";
import AwardIcon from "@/components/icons/award-icon";
import CheckMarkIcon from "@/components/icons/check-mark-icon";
import Layers2Icon from "@/components/icons/layers-2-icon";
import SquareStackIcon from "@/components/icons/square-stack-icon";
import { useGetProfile } from "../api/get-profile";
import { useUploadFeaturedPhoto } from "../api/upload-featured-photo";
import { useEditFeaturedPhoto } from "../api/edit-featured-photo";

import { getImage } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Pencil, Trash, Image as ImageIcon, Plus } from "lucide-react";
import { useRef } from "react";
import { useNotifications } from "@/components/ui/notifications";
import { useSoftDeleteFeaturedPhoto } from "../api/delete-featured-photo";

const ProfileOverviewPage = () => {
   const { data } = useGetProfile();
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
   const featuredPhotos = userProfile?.profile?.features_photos;

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

             <input
                ref={uploadInputRef}
                type="file"
                className="hidden"
                onChange={handleUploadChange}
             />

             {featuredPhotos && featuredPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                   {featuredPhotos.map((image) => (
                      <figure key={image.id} className="relative group overflow-hidden rounded-xl border border-border/40 bg-muted/10">
                         <img
                            src={getImage(image.image)}
                            alt={image.description || "Featured photo"}
                            className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
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

                          {/* Subtle dark overlay on hover (desktop only) */}
                          <div className="absolute inset-0 bg-black/25 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          {/* Action buttons (always visible on mobile, fades in on hover for desktop) */}
                          <div className="absolute top-2 right-2 flex gap-2 z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                             <Button
                                type="button"
                                size="icon"
                                variant="clean"
                                disabled={editFeaturedPhotoMutation.isPending}
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/60 hover:bg-white text-white hover:text-neutral-900 border border-white/20 backdrop-blur-sm transition-all duration-200"
                                onClick={() =>
                                   editInputRefs.current[image.id]?.click()
                                }
                             >
                                <Pencil className="w-3.5 h-3.5" />
                             </Button>

                             <Button
                                type="button"
                                size="icon"
                                variant="clean"
                                loading={deleteFeaturedPhotoMutation.isPending}
                                disabled={deleteFeaturedPhotoMutation.isPending}
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-destructive hover:bg-destructive text-white border border-destructive/20 backdrop-blur-sm transition-all duration-200"
                                onClick={() =>
                                   onDeleteFeaturedPhoto(String(image.id))
                                }
                             >
                                {!deleteFeaturedPhotoMutation.isPending && (
                                   <Trash className="w-3.5 h-3.5" />
                                )}
                             </Button>
                          </div>
                      </figure>
                   ))}

                   {/* Add Photo card inside the grid */}
                   <button
                      type="button"
                      disabled={uploadFeaturePhotoMutation.isPending}
                      onClick={() => uploadInputRef.current?.click()}
                      className="flex flex-col items-center justify-center aspect-[4/5] border border-dashed border-muted-foreground/30 bg-card/20 hover:bg-card/40 rounded-xl hover:border-primary/40 transition-all duration-300 group cursor-pointer"
                   >
                      <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform duration-200">
                         <Plus className="w-5 h-5" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                         {uploadFeaturePhotoMutation.isPending ? "Uploading..." : "Add Photo"}
                      </span>
                   </button>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-muted-foreground/30 bg-card/50 rounded-2xl p-12 text-center space-y-4 hover:border-primary/40 hover:bg-card/85 transition-all duration-300">
                   <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <ImageIcon className="w-8 h-8" />
                   </div>
                   <div className="space-y-1.5 max-w-sm">
                      <h4 className="text-lg font-bold font-display tracking-tight text-foreground">
                         Showcase your masterworks
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                         Add high-quality photos of your art, studio, or creative process. They will appear as featured highlights on your profile.
                      </p>
                   </div>
                   <Button
                      type="button"
                      variant="outline"
                      className="mt-2 border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
                      disabled={uploadFeaturePhotoMutation.isPending}
                      onClick={() => uploadInputRef.current?.click()}
                   >
                      {uploadFeaturePhotoMutation.isPending ? "Uploading..." : "Upload Your First Photo"}
                   </Button>
                </div>
             )}
         </div>
      </section>
   );
};

export default ProfileOverviewPage;
