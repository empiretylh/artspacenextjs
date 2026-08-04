'use client'

import Link from "@/components/common/link";
import { ShareButton } from "@/components/common/share-button";
import { ProfileUserProvider } from "@/components/providers/profile-user-provider";
import { env } from "@/config/env";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import { redirect } from "next/navigation";
import { usePathname } from "@/i18n/routing";
import FollowButton from "../follow-button";
import { ProfileActions } from "./profile-actions";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { ClipboardPenLineIcon, Settings, X } from "lucide-react";
import { useGetUserFollowStatus } from "@/features/service/artspace/get-user-follow-status";
import { useGetUserBlockStatus } from "@/features/service/artspace/user-block-status";
import { UserRouteType } from "@/features/service/artspace/get-users";
import { paths } from "@/config/paths";
import AppImage from "@/components/common/app-image";
import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/common/dialogs/base-dialog";
import { userAnalytics } from "@/lib/analytics";

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

   const [isAvatarOpen, setIsAvatarOpen] = useState(false);
   const [isCoverOpen, setIsCoverOpen] = useState(false); // ✅ NEW
   const avatarButtonRef = useRef<HTMLButtonElement>(null);
   const coverButtonRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      if (user.id) {
         userAnalytics.view(String(user.id), {
            isOwnProfile: String(user.id) === String(authUser?.id),
            source: 'profile_page',
         })
      }
   }, [])

   const shouldRedirect =
      user.id === authUser?.id && variant !== "profile";
   const enableStatusQueries = !shouldRedirect && variant !== "profile";

   const followStatusQuery = useGetUserFollowStatus({
      userId: String(user?.id),
      userType,
      queryConfig: { enabled: enableStatusQueries },
   });

   const blockStatusQuery = useGetUserBlockStatus({
      userId: String(user?.id),
      userType,
      queryConfig: { enabled: enableStatusQueries },
   });

   if (shouldRedirect) {
      return redirect(paths.profile.path);
   }

   const coverSrc = user?.profile.cover_photo
      ? getImage(user.profile.cover_photo)
      : "/assets/profile-cover-default.jpg";

   const avatarSrc = user?.profile.profile_picture
      ? getImage(user.profile.profile_picture)
      : "/assets/profile-default.png";

   const fullName =
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User";

   return (
      <div>
         <ScrollToTop />

         <div className="relative w-full aspect-8/3 mb-2">
            {/* ✅ Cover click-to-open */}
            <button
               ref={coverButtonRef}
               tabIndex={0}
               aria-label="Open cover photo"
               onClick={() => setIsCoverOpen(true)}
               className="relative w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-md hover:brightness-95 transition-all"
            >
               <AppImage
                  src={coverSrc}
                  alt={`${fullName} cover photo`}
                  width={800}
                  height={300}
                  preload
                  sizes="100vw"
                  className="object-cover rounded-md"
               />
            </button>
         </div>

         {/* Profile details container in normal flow */}
         <div className="text-center w-full px-4 -mt-16 sm:-mt-20 relative z-10">
            {/* ✅ Avatar click-to-open */}
            <button
               ref={avatarButtonRef}
               tabIndex={0}
               aria-label="Open profile picture"
               onClick={() => setIsAvatarOpen(true)}
               className="mx-auto relative aspect-square w-[120px] sm:w-[150px] rounded-full border-4 border-background overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-sm hover:brightness-95 transition-all"
            >
               <AppImage
                  src={avatarSrc}
                  alt={`${fullName} profile picture`}
                  width={150}
                  height={150}
                  sizes="150px"
                  className="object-cover"
               />
            </button>

            <div className="mt-3 space-y-1">
               <div className="flex items-center justify-center gap-2">
                  <h1 className="font-bold font-display text-2xl sm:text-3xl tracking-tight">{fullName}</h1>
                  {user?.user_type && getUserIcon(user.user_type)}
               </div>

               <p className="text-sm text-muted-foreground">{user?.email}</p>
               {user?.profile.bio ? (
                  <p className="text-sm max-w-md mx-auto whitespace-pre-wrap text-foreground/80">{user.profile.bio}</p>
               ) : variant === "profile" ? (
                  <p className="text-sm max-w-md mx-auto whitespace-pre-wrap text-muted-foreground/60 italic">No bio yet. Add one in settings!</p>
               ) : null}

               <div className="mt-3 flex justify-center items-center gap-2">
                  <ShareButton
                     content_type={"user"}
                     user_type={user.user_type}
                     item_id={String(user?.id)}
                     item_name={String(fullName)}
                     url={
                        typeof window !== "undefined"
                           ? `${window.location.origin}${paths[userType].detail.getHref(
                              String(user?.id)
                           )}`
                           : undefined
                     }
                     variant="outline"
                     className="rounded-full h-8 w-8 text-muted-foreground"
                  />

                  {variant === "profile" && (
                     <Link to={paths.settings.path}>
                        <Button variant="outline" className="rounded-full gap-1.5 h-8 px-3 text-xs font-semibold">
                           <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                           <span>Edit Profile</span>
                        </Button>
                     </Link>
                  )}

                  {variant !== "profile" && (
                     <>
                        {user && (
                           <FollowButton
                              size="profile"
                              loading={followStatusQuery.isLoading}
                              userId={String(user.id)}
                              userType={user.user_type}
                              following={followStatusQuery.data || false}
                              className="rounded-full h-8 px-4 text-xs font-semibold"
                           />
                        )}
                        {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && (
                           <Link to={`${paths.chats.path}?userId=${user.id}&userType=${userType}`}>
                              <Button variant="outline" className="rounded-full h-8 px-4 text-xs font-semibold">
                                 Send Message
                              </Button>
                           </Link>
                        )}
                     </>
                  )}

                  {user && String(user.id) !== String(authUser?.id) && (
                     <ProfileActions user={user} blocked={blockStatusQuery.data} />
                  )}
               </div>
            </div>
         </div>

         <div className="container mt-1 sm:mt-2">
            <ScrollArea className="w-full">
               <div className="flex justify-center my-2">
                  <div className="inline-flex gap-4 text-sm md:text-base border-b whitespace-nowrap">
                     {navLinks.map((link) => (
                        <Link
                           key={link.href}
                           to={link.href}
                           className={cn(
                              "py-2 px-2 flex flex-col items-center gap-2",
                              isActive(link.href) ? "text-primary border-b-2 border-primary -mb-px font-bold" : "border-b-2 border-transparent font-medium",
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

         {/* ✅ Avatar Dialog */}
         <BaseDialog
            isOpen={isAvatarOpen}
            onClose={() => {
               setIsAvatarOpen(false)
               requestAnimationFrame(() => {
                  avatarButtonRef.current?.focus();
               })
            }}
            headerOff
            title={fullName + " profile picture"}
            description={fullName + " profile picture"}
            showCloseButton={false}
            className="bg-transparent border-none shadow-none max-w-none md:max-w-xl"
         >
            <div className="relative flex items-center justify-center bg-black">
               <AppImage
                  src={avatarSrc}
                  alt={`${fullName} profile picture large`}
                  width={1200}
                  height={1200}
                  sizes="100vw"
                  className="object-contain"
                  preload
               />

               <Button
                  variant="clean"
                  size={"icon"}
                  onClick={(e) => {
                     e.preventDefault();
                     setIsAvatarOpen(false)
                     requestAnimationFrame(() => {
                        avatarButtonRef.current?.focus();
                     })
                  }}
                  className="absolute text-white top-2 right-2"
                  aria-label="Close"
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>
         </BaseDialog >

         {/* ✅ Cover Dialog */}
         <BaseDialog
            isOpen={isCoverOpen}
            onClose={() => {
               setIsCoverOpen(false)
               requestAnimationFrame(() => {
                  coverButtonRef.current?.focus();
               })
            }}
            headerOff
            title={fullName + " cover photo"}
            description={fullName + " cover photo"}
            showCloseButton={false}
            className="bg-transparent border-none shadow-none max-w-none md:max-w-5xl"
         >
            <div className="relative flex items-center justify-center bg-black">
               {/* Give it a nice viewport height like FB */}
               <div className="relative w-full h-[70vh]">
                  <AppImage
                     src={coverSrc}
                     alt={`${fullName} cover photo large`}
                     width={2000}
                     height={750}
                     sizes="100vw"
                     className="object-contain"
                     preload
                  />
               </div>

               <Button
                  variant="clean"
                  size={"icon"}
                  onClick={(e) => {
                     setIsCoverOpen(false)
                     requestAnimationFrame(() => {
                        coverButtonRef.current?.focus();
                     })
                  }}
                  className="absolute text-white top-2 right-2"
                  aria-label="Close"
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>
         </BaseDialog>
      </div>
   );
};

export default ProfileLayoutView;
