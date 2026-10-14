import React, { useRef, useState } from "react";
import ReactCrop, {
   centerCrop,
   makeAspectCrop,
   type Crop,
   type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import AppImage from "@/components/common/app-image";
import LoadingPage from "@/components/page/loading-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/utils";
import { Camera, Check, User, UserCircle2, X } from "lucide-react";
import { useChangeProfileCover } from "../api/change-profile-cover";
import { useChangeProfilePicture } from "../api/change-profile-picture";
import { useGetProfile } from "../api/get-profile";

type CropType = "avatar" | "banner";

export const ProfileMedia: React.FC = () => {
   const getProfile = useGetProfile();
   const changeProfilePictureMutation = useChangeProfilePicture();
   const changeProfileCoverMutation = useChangeProfileCover();
   const [isSaving, setIsSaving] = useState(false);

   const profileInput = useRef<HTMLInputElement>(null);
   const bannerInput = useRef<HTMLInputElement>(null);
   const imgRef = useRef<HTMLImageElement>(null);

   const [imageSrc, setImageSrc] = useState<string | null>(null);
   const [cropType, setCropType] = useState<CropType | null>(null);
   const [crop, setCrop] = useState<Crop>();
   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

   if (getProfile.isLoading) return <LoadingPage />;
   if (!getProfile.data?.data) return <div>Profile not found</div>;

   const user = getProfile.data.data;
   const { email, first_name, last_name, user_type, profile } = user;
   const { profile_picture, cover_photo } = profile;

   const fullName =
      `${first_name || ""} ${last_name || ""}`.trim() || "Unnamed User";

   const onSelectFile = (
      e: React.ChangeEvent<HTMLInputElement>,
      type: CropType
   ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
         setImageSrc(reader.result as string);
         setCropType(type);
      };
      reader.readAsDataURL(file);
   };

   const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      const aspect = cropType === "avatar" ? 1 : 3 / 1;

      const crop = centerCrop(
         makeAspectCrop(
            {
               unit: "%",
               width: 90,
            },
            aspect,
            width,
            height
         ),
         width,
         height
      );

      setCrop(crop);
   };

   function getHighQualityCroppedBlob(
      image: HTMLImageElement,
      crop: PixelCrop,
      type: string = "image/jpeg",
      quality = 0.80
   ): Promise<Blob> {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("No 2D context");

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "medium";

      ctx.drawImage(
         image,
         crop.x * scaleX,
         crop.y * scaleY,
         crop.width * scaleX,
         crop.height * scaleY,
         0,
         0,
         crop.width * scaleX,
         crop.height * scaleY
      );

      return new Promise((resolve) => {
         canvas.toBlob(
            (blob) => resolve(blob!),
            type,
            quality
         );
      });
   }

   async function cropToBlobMaxKB(
      image: HTMLImageElement,
      crop: PixelCrop,
      {
         maxKB = 500,
         type = "image/jpeg",
         startQuality = 0.95,
         minQuality = 0.4,
         maxOutputPx = 1600, // IMPORTANT: set 512 for avatar
      } = {}
   ) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const srcW = Math.round(crop.width * scaleX);
      const srcH = Math.round(crop.height * scaleY);

      // downscale output based on longest side
      let outW = srcW;
      let outH = srcH;
      const longest = Math.max(outW, outH);
      if (longest > maxOutputPx) {
         const r = maxOutputPx / longest;
         outW = Math.round(outW * r);
         outH = Math.round(outH * r);
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");

      const draw = (w: number, h: number) => {
         canvas.width = w;
         canvas.height = h;
         ctx.clearRect(0, 0, w, h);
         ctx.imageSmoothingEnabled = true;
         ctx.imageSmoothingQuality = "high";
         ctx.drawImage(
            image,
            Math.round(crop.x * scaleX),
            Math.round(crop.y * scaleY),
            srcW,
            srcH,
            0,
            0,
            w,
            h
         );
      };

      const toBlob = (q: number) =>
         new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
               (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
               type,
               q
            );
         });

      const targetBytes = maxKB * 1024;

      // loop: try quality first, then shrink dimensions if needed
      let w = outW;
      let h = outH;

      while (true) {
         draw(w, h);

         let q = startQuality;
         let best: Blob | null = null;

         while (q >= minQuality) {
            const b = await toBlob(q);
            best = b;
            if (b.size <= targetBytes) return b;
            q -= 0.07;
         }

         // still too big at minQuality => shrink dimensions
         if (Math.max(w, h) <= 256) return best!; // can't shrink forever
         w = Math.round(w * 0.85);
         h = Math.round(h * 0.85);
      }
   }

   const handleSave = async () => {
      if (!completedCrop || !imgRef.current || !cropType) return;

      try {
         setIsSaving(true);

         const blob = await cropToBlobMaxKB(imgRef.current, completedCrop, {
            maxKB: 500,
            type: "image/jpeg",
            maxOutputPx: cropType === "avatar" ? 512 : 1600,
         });

         const file = new File([blob], "image.jpg", { type: "image/jpeg" });

         if (cropType === "avatar") {
            changeProfilePictureMutation.mutate({
               data: { profile_picture: file },
            });
         } else {
            changeProfileCoverMutation.mutate({
               data: { cover_photo: file },
            });
         }

         cleanup();
      } finally {
         setIsSaving(false);
      }
   };

   const getCroppedImage = async () => {
      if (!completedCrop || !imgRef.current) return;

      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
         imgRef.current,
         completedCrop.x * scaleX,
         completedCrop.y * scaleY,
         completedCrop.width * scaleX,
         completedCrop.height * scaleY,
         0,
         0,
         completedCrop.width,
         completedCrop.height
      );

      canvas.toBlob((blob) => {
         if (!blob || !cropType) return;

         const file = new File([blob], "image.jpg", { type: "image/jpeg" });

         if (cropType === "avatar") {
            changeProfilePictureMutation.mutate({
               data: { profile_picture: file },
            });
         } else {
            changeProfileCoverMutation.mutate({
               data: { cover_photo: file },
            });
         }

         cleanup();
      }, "image/jpeg");
   };

   const cleanup = () => {
      setImageSrc(null);
      setCrop(undefined);
      setCompletedCrop(null);
      setCropType(null);
      if (profileInput.current) profileInput.current.value = "";
      if (bannerInput.current) bannerInput.current.value = "";
   };

   return (
      <div className="space-y-6">
         {/* Crop Modal */}
         {imageSrc && cropType && (
            <div className="fixed inset-0 z-[100] h-screen bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-background max-w-3xl w-full rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b">
                     <h3 className="font-semibold text-lg">
                        Crop {cropType === "avatar" ? "Profile Picture" : "Cover Photo"}
                     </h3>
                     <Button variant="ghost" size="icon" onClick={cleanup}>
                        <X className="w-5 h-5" />
                     </Button>
                  </div>

                  <div className="p-6 relative bg-muted/30 h-[450px] flex justify-between overflow-auto">
                     <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={cropType === "avatar" ? 1 : 8 / 3}
                        className="mx-auto"
                        // locked
                        circularCrop={cropType === "avatar"}
                     >
                        <img
                           ref={imgRef}
                           src={imageSrc}
                           onLoad={onImageLoad}
                           alt="Crop"
                           className="h-auto max-h-100! mx-auto"
                        />
                     </ReactCrop>
                  </div>

                  <div className="flex justify-end gap-3 p-4 border-t">
                     <Button variant="outline" onClick={cleanup}>
                        Cancel
                     </Button>
                     <Button
                        onClick={handleSave}
                        disabled={
                           !completedCrop ||
                           isSaving ||
                           changeProfilePictureMutation.isPending ||
                           changeProfileCoverMutation.isPending
                        }
                        loading={
                           isSaving ||
                           changeProfilePictureMutation.isPending ||
                           changeProfileCoverMutation.isPending
                        }
                     >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {/* Hero Card Container */}
         <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
            {/* Banner */}
            <div className="relative w-full aspect-21/9 sm:aspect-3/1 bg-muted/40 overflow-hidden group">
               <AppImage
                  src={cover_photo ? getImage(cover_photo) : "/assets/profile-cover-default.jpg"}
                  alt="Cover"
                  fill
                  preload
                  containerClassName="w-full h-full"
                  className="object-cover transition-transform duration-700 group-hover:scale-102"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

               <input
                  ref={bannerInput}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => onSelectFile(e, "banner")}
               />

               <Button
                  type="button"
                  size="sm"
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium shadow-md backdrop-blur-md border border-white/20 gap-1.5 transition-all"
                  loading={changeProfileCoverMutation.isPending}
                  onClick={() => bannerInput.current?.click()}
               >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Change Cover</span>
               </Button>
            </div>

            {/* Profile Info & Avatar */}
            <div className="px-5 sm:px-8 pb-6 pt-0">
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Left: Avatar overlapping banner */}
                  <div className="relative group shrink-0 -mt-12 sm:-mt-14">
                     <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-card rounded-full shadow-lg bg-background">
                        {profile_picture ? (
                           <AppImage
                              src={getImage(profile_picture)}
                              alt={fullName}
                              width={112}
                              height={112}
                              className="rounded-full object-cover"
                           />
                        ) : (
                           <AvatarFallback className="text-3xl font-semibold bg-muted">
                              {first_name?.[0]?.toUpperCase() || <User className="w-10 h-10 text-muted-foreground" />}
                           </AvatarFallback>
                        )}
                     </Avatar>

                     <input
                        ref={profileInput}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => onSelectFile(e, "avatar")}
                     />

                     <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-1 right-1 h-8 w-8 rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-card"
                        loading={changeProfilePictureMutation.isPending}
                        onClick={() => profileInput.current?.click()}
                        title="Change profile picture"
                     >
                        <Camera className="w-3.5 h-3.5" />
                     </Button>
                  </div>

                  {/* Name, role badge, email positioned below banner */}
                  <div className="space-y-1 pt-1 sm:pt-3">
                     <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground">
                           {fullName}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                           <UserCircle2 className="w-3 h-3" />
                           {user_type}
                        </span>
                     </div>
                     <p className="text-xs sm:text-sm text-muted-foreground">{email}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
