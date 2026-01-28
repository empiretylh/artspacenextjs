'use client'
import Link from "@/components/common/link";
import { ShareButton } from "@/components/common/share-button";
import { ProfileUserProvider } from "@/components/providers/profile-user-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import { usePathname } from "next/navigation";
import FollowButton from "../follow-button";
import { ProfileActions } from "./profile-actions";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { ClipboardPenLineIcon } from "lucide-react";

const getIcon = (key: string) => {
   if (key === "artworks") {
      return <ArtworksIcon />
   }
   if (key === "collections") {
      return <CollectionIcon />
   }
   if (key === "likes") {
      return <HeartIcon />
   }
   if (key === "save") {
      return <BookmarkIcon />
   }
   if (key === "events") {
      return <ClipboardPenLineIcon />
   }
   return <OverviewIcon />
}

const ProfileLayoutView = ({
   user,
   variant,
   navLinks,
   children,
}: {
   user: User;
   variant?: "profile";
   navLinks: Array<{
      title: string;
      href: string;
      icon: string;
      disabled?: boolean;
   }>;
   children?: React.ReactNode;
}) => {
   const pathname = usePathname()
   const isActive = (href: string) => pathname === href;
   const { user: authUser } = useAuth();

   return (
      <div>
         <ScrollToTop />
         <div className="">
            {/* <div
               className="relative max-w-full overflow-hidden h-[376px] aspect-[1/3] rounded w-full bg-cover bg-center"
               style={{
                  backgroundImage: `url(${BannerImage})`,
               }}
            ></div> */}
            <div
               className="relative w-full aspect-[8/3] rounded-lg bg-cover bg-center mb-2"
               style={{
                  backgroundImage: `url(${user?.profile.cover_photo
                     ? getImage(user.profile.cover_photo)
                     : "/assets/profile-cover-default.png"
                     })`,
                  // backgroundImage: `url(${banner})`,
               }}
            >
               <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[70%] text-center w-full px-4">
                  <img
                     src={
                        user?.profile.profile_picture
                           ? getImage(user.profile.profile_picture)
                           : '/assets/profile-default.png'
                     }
                     alt=""
                     className="mx-auto aspect-square w-[120px] sm:w-[150px] rounded-full border border-white object-cover"
                  />

                  <div className="mt-3 space-y-1">
                     <div className="flex items-center justify-center gap-2">
                        <h1 className="font-display text-lg sm:text-xl">
                           {user?.first_name + " " + user?.last_name}
                        </h1>
                        {user?.user_type && getUserIcon(user.user_type)}
                     </div>

                     <p className="text-sm text-muted-foreground">{user?.email}</p>

                     <p className="text-sm max-w-md mx-auto">
                        {user?.profile.bio || "No bio"}
                     </p>

                     <div className="mt-3 flex justify-center items-center gap-2">
                        {/* <Button variant="ghost" aria-label="Share profile">
                        <ShareIcon className="!w-6 !h-6" />
                        </Button> */}
                        <ShareButton />

                        {variant !== "profile" && (
                           <>
                              {user && (
                                 <FollowButton
                                    size="default"
                                    userId={String(user.id)}
                                    userType={user.user_type}
                                    following={user.profile.is_following}
                                 />
                              )}
                              <Button disabled variant="outline">
                                 Send Message
                              </Button>
                           </>
                        )}
                        {user && String(user.id) !== String(authUser?.id) && (
                           <ProfileActions user={user} />
                        )}
                        {/* <div className="flex items-center gap-2"></div> */}
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
                                 isActive(link.href)
                                    ? "text-primary border-b border-black"
                                    : "",
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

            <div className="container my-6">
               {/* <Outlet context={{ user }} /> */}
               <ProfileUserProvider initialValue={user}>
                  {children}
               </ProfileUserProvider>
            </div>
         </div>
      </div>
   );
};

export default ProfileLayoutView;
