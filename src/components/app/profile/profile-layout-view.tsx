import banner from "@/assets/profile-cover-default.png";
import profileDefault from "@/assets/profile-default.png";
import Link from "@/components/common/link";
import ArtistMarkIcon from "@/components/icons/artist-mark-icon";
import ShareIcon from "@/components/icons/share-icon";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import { Outlet, useLocation, useNavigate } from "react-router";
import FollowButton from "../follow-button";
import { ShareButton } from "@/components/common/share-button";
import { BlockButton } from "../block-button";
import { ProfileActions } from "./profile-actions";
import { useAuth } from "@/features/auth/store";
import { paths } from "@/config/paths";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileLayoutView = ({
   user,
   variant,
   navLinks,
}: {
   user?: User;
   variant?: string;
   navLinks: Array<{
      title: string;
      href: string;
      icon: any;
      disabled?: boolean;
   }>;
   children?: React.ReactNode;
}) => {
   const location = useLocation();
   const isActive = (href: string) => location.pathname === href;
   const { user: authUser } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!user) {
         router.push(paths.root.path);
      }
   }, []);

   return (
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
                  : banner
                  })`,
               // backgroundImage: `url(${banner})`,
            }}
         >
            <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[70%] text-center w-full px-4">
               <img
                  src={
                     user?.profile.profile_picture
                        ? getImage(user.profile.profile_picture)
                        : profileDefault
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
                           <link.icon />
                           <span>{link.title}</span>
                        </Link>
                     ))}
                  </div>
               </div>
               <ScrollBar orientation="horizontal" />
            </ScrollArea>
         </div>

         <div className="container my-6">
            <Outlet context={{ user }} />
         </div>
      </div>
   );
};

export default ProfileLayoutView;
