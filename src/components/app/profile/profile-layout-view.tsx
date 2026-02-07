'use client'

import Image from "next/image";
import Link from "@/components/common/link";
import { ShareButton } from "@/components/common/share-button";
import { ProfileUserProvider } from "@/components/providers/profile-user-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import { redirect, usePathname } from "next/navigation";
import FollowButton from "../follow-button";
import { ProfileActions } from "./profile-actions";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { ClipboardPenLineIcon } from "lucide-react";
import { useGetUserFollowStatus } from "@/features/service/artspace/get-user-follow-status";
import { useGetUserBlockStatus } from "@/features/service/artspace/user-block-status";
import { UserRouteType } from "@/features/service/artspace/get-users";
import { paths } from "@/config/paths";
import AppImage from "@/components/common/app-image";

const getIcon = (key: string) => {
   if (key === "artworks") return <ArtworksIcon />;
   if (key === "collections") return <CollectionIcon />;
   if (key === "likes") return <HeartIcon />;
   if (key === "save") return <BookmarkIcon />;
   if (key === "events") return <ClipboardPenLineIcon />;
   return <OverviewIcon />;
};

const ProfileLayoutView = ({
   user,
   variant,
   navLinks,
   children,
   userType,
}: {
   user: User;
   userType: UserRouteType;
   variant?: "profile";
   navLinks: Array<{
      title: string;
      href: string;
      icon: string;
      disabled?: boolean;
   }>;
   children?: React.ReactNode;
}) => {
   const pathname = usePathname();
   const isActive = (href: string) => pathname === href;
   const { user: authUser } = useAuth();

   if (user.id === authUser?.id && variant !== "profile") {
      return redirect(paths.profile.path);
   }

   const followStatusQuery = useGetUserFollowStatus({
      userId: String(user?.id),
      userType,
      queryConfig: { enabled: variant !== "profile" },
   });

   const blockStatusQuery = useGetUserBlockStatus({
      userId: String(user?.id),
      userType,
      queryConfig: { enabled: variant !== "profile" },
   });

   const coverSrc = user?.profile.cover_photo
      ? getImage(user.profile.cover_photo)
      : "/assets/profile-cover-default.png";

   const avatarSrc = user?.profile.profile_picture
      ? getImage(user.profile.profile_picture)
      : "/assets/profile-default.png";

   const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User";

   return (
      <div>
         <ScrollToTop />

         <div className="relative w-full aspect-8/3 mb-2">
            {/* Cover Image (replaces backgroundImage) */}
            <AppImage
               src={coverSrc}
               alt={`${fullName} cover photo`}
               width={800}
               height={300}
               preload
               sizes="100vw"
               className="object-cover rounded-md"
            />

            {/* Overlay content */}
            <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[70%] text-center w-full px-4">
               {/* Avatar */}
               <div className="mx-auto relative aspect-square w-[120px] sm:w-[150px] rounded-full border border-white overflow-hidden">
                  <AppImage
                     src={avatarSrc}
                     alt={`${fullName} profile picture`}
                     width={150}
                     height={150}
                     sizes="150px"
                     className="object-cover"
                  // If you use remote images and want fallback behavior:
                  // onError={() => ...}
                  />
               </div>

               <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                     <h1 className="font-display text-lg sm:text-xl">{fullName}</h1>
                     {user?.user_type && getUserIcon(user.user_type)}
                  </div>

                  <p className="text-sm text-muted-foreground">{user?.email}</p>

                  <p className="text-sm max-w-md mx-auto">{user?.profile.bio || "No bio"}</p>

                  <div className="mt-3 flex justify-center items-center gap-2">
                     {/* Avoid window access during render if possible */}
                     <ShareButton
                        url={
                           typeof window !== "undefined"
                              ? `${window.location.origin}${paths[userType].detail.getHref(String(user?.id))}`
                              : undefined
                        }
                     />

                     {variant !== "profile" && (
                        <>
                           {user && (
                              <FollowButton
                                 size="default"
                                 loading={followStatusQuery.isLoading}
                                 userId={String(user.id)}
                                 userType={user.user_type}
                                 following={followStatusQuery.data || false}
                              />
                           )}
                           <Button disabled variant="outline">
                              Send Message
                           </Button>
                        </>
                     )}

                     {user && String(user.id) !== String(authUser?.id) && (
                        <ProfileActions user={user} blocked={blockStatusQuery.data} />
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div className="container pt-[180px] sm:pt-[200px]">
            <ScrollArea className="w-full">
               <div className="flex justify-center">
                  <div className="inline-flex gap-4 text-sm md:text-base border-b whitespace-nowrap">
                     {navLinks.map((link) => (
                        <Link
                           key={link.href}
                           to={link.href}
                           className={cn(
                              "py-2 px-2 flex flex-col items-center gap-2",
                              isActive(link.href) ? "text-primary border-b border-black" : "",
                              link.disabled && "pointer-events-none opacity-50"
                           )}
                        >
                           {getIcon(link.icon)}
                           <span>{link.title}</span>
                        </Link>
                     ))}
                  </div>
               </div>
               <ScrollBar orientation="horizontal" />
            </ScrollArea>
         </div>

         <div className="my-6">
            <ProfileUserProvider initialValue={user}>{children}</ProfileUserProvider>
         </div>
      </div>
   );
};

export default ProfileLayoutView;
