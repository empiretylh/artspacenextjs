import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import ArtworkCreateModal from "@/features/artwork/components/artwork-create-modal";
import { useAuth } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store/cart-store";
import {
   ArrowLeft,
   Bell,
   Moon,
   MoreVerticalIcon,
   Search,
   Sun,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputWithLeftSelect } from "../app/input-with-left-seletct";
import { ProfileDropdown } from "../app/profile-dropdown";
import Link from "../common/link";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export function SiteHeader({
   isDarkMode,
   toggleDarkMode,
}: {
   isDarkMode: boolean;
   toggleDarkMode: () => void;
}) {
   const [isArtworkCreateModalOpen, setIsArtworkCreateModalOpen] =
      useState(false);
   const { items } = useCartStore();
   const { user } = useAuth();
   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

   const handleMobileSearchOpen = () => setMobileSearchOpen(true);
   const handleMobileSearchClose = () => setMobileSearchOpen(false);

   return (
      <>
         <header className="bg-background overflow-hidden sticky top-0 py-1 z-20 flex h-[var(--header-height)] items-center px-2 lg:px-4">
            {/* Mobile Search Mode */}
            {mobileSearchOpen ? (
               <div className="flex w-full items-center gap-2">
                  <Button
                     onClick={handleMobileSearchClose}
                     variant="ghost"
                     className="h-8 w-8 p-0"
                  >
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <InputWithLeftSelect className="flex-1" />
               </div>
            ) : (
               <div className="flex w-full items-center justify-between gap-2">
                  {/* Left Section (Logo + Sidebar Trigger) */}
                  <div className="flex gap-2 items-center md:hidden">
                     <SidebarTrigger className="-ml-1" />
                     <Link to={"/"}>
                        <h1 className="uppercase font-display font-bold text-sm">
                           Myanmar Art Space
                        </h1>
                     </Link>
                  </div>

                  {/* Search Input on Desktop */}
                  <div className="hidden md:flex ml-[50vw-calc(var(--sidebar-width)+8px)] flex-1 justify-center">
                     <InputWithLeftSelect />
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center justify-between gap-2">
                     {/* Mobile Search Icon */}
                     <Button
                        onClick={handleMobileSearchOpen}
                        variant="ghost"
                        size="icon"
                        className="p-0 md:hidden"
                     >
                        <Search />
                     </Button>

                     <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 relative hidden lg:flex"
                     >
                        <span className="absolute text-xs text-primary-foreground p-1 w-5 h-5 flex items-center justify-center -top-2 right-0 bg-primary rounded-full">
                           {items.length}
                        </span>
                        <Bell className="h-4 w-4" />
                     </Button>

                     {user && (
                        <Button
                           onClick={() => setIsArtworkCreateModalOpen(true)}
                           className="hidden lg:inline-flex h-8"
                        >
                           Create
                        </Button>
                     )}

                     {/* 
                  <Button
                     onClick={() => router.push(paths.cart.path)}
                     variant="ghost"
                     className="h-8 w-8 p-0 relative"
                  >
                     <span className="absolute text-xs text-primary-foreground p-1 w-5 h-5 flex items-center justify-center -top-2 -right-2 bg-primary rounded-full">
                        {items.length}
                     </span>
                     <ShoppingCart className="h-4 w-4" />
                  </Button> */}

                     {/* Auth Buttons / Profile */}
                     {!user ? (
                        <>
                           <Link
                              to={paths.auth.login.path}
                              className="hidden xl:inline-flex"
                           >
                              <Button className=" h-8">Sign In</Button>
                           </Link>
                           <Link
                              to={paths.auth.register.path}
                              className="hidden xl:inline-flex"
                           >
                              <Button variant="outline" className=" h-8">
                                 Join Now
                              </Button>
                           </Link>
                        </>
                     ) : (
                        <ProfileDropdown />
                     )}

                     <div
                        className={cn(
                           "flex items-center",
                           user && "lg:hidden",
                           !user && "xl:hidden"
                        )}
                     >
                        <DropdownMenu>
                           <DropdownMenuTrigger>
                              <MoreVerticalIcon />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                              {user && (
                                 <Button
                                    onClick={() =>
                                       setIsArtworkCreateModalOpen(true)
                                    }
                                    className="w-full lg:hidden h-8"
                                 >
                                    Create
                                 </Button>
                              )}
                              {!user && (
                                 <>
                                    <DropdownMenuItem>
                                       <Link
                                          className="w-full"
                                          to={paths.auth.login.path}
                                       >
                                          Sign In
                                       </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                       <Link
                                          className="w-full"
                                          to={paths.auth.register.path}
                                       >
                                          Join Now
                                       </Link>
                                    </DropdownMenuItem>
                                 </>
                              )}
                              <DropdownMenuItem className="lg:hidden">
                                 <div className="flex justify-between w-full items-center">
                                    <Bell className="h-4 w-4" />
                                    <span className="text-xs text-primary-foreground p-1 w-5 h-5 flex items-center justify-center bg-primary rounded-full">
                                       {items.length}
                                    </span>
                                 </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="lg:hidden">
                                 <Button
                                    onClick={toggleDarkMode}
                                    size="icon"
                                    variant="outline"
                                    className="dark:bg-gray-800 w-full dark:text-white dark:border-gray-700"
                                 >
                                    {!isDarkMode ? <Sun /> : <Moon />}
                                 </Button>
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>

                     {/* Theme Toggle */}
                     <Button
                        onClick={toggleDarkMode}
                        size="icon"
                        variant="outline"
                        className="dark:bg-gray-800 hidden lg:flex dark:text-white dark:border-gray-700"
                     >
                        {!isDarkMode ? <Sun /> : <Moon />}
                     </Button>
                  </div>
               </div>
            )}
         </header>
         <ArtworkCreateModal
            isArtworkCreateModalOpen={isArtworkCreateModalOpen}
            setIsArtworkCreateModalOpen={setIsArtworkCreateModalOpen}
         />
      </>
   );
}
