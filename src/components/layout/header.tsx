import React, { useState } from "react";
import { Moon, Palette, ShoppingCart, Sun, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";
import Link from "../common/link";
import { useAuth } from "@/features/auth/store";
import { LoginDialog } from "@/features/auth/components/login-dialog";
import { RegisterDialog } from "@/features/auth/components/register-dialog";
import { ProfileDropdown } from "../app/profile-dropdown";
import { paths } from "@/config/paths";
import { useCartStore } from "@/features/cart/store/cart-store";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface HeaderProps {
   isDarkMode: boolean;
   toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
   const location = useLocation();
   const { items } = useCartStore();
   const router = useRouter();
   const { user, setLoginDialogOpen, setRegisterDialogOpen } = useAuth();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   const navLinks = [
      { name: "Home", href: "/" },
      { name: "Artworks", href: "/artworks" },
      { name: "Artists", href: "/artists" },
   ];

   const handleLinkClick = (href: string) => {
      router.push(href);
      setMobileMenuOpen(false); // close menu on navigation
   };

   return (
      <header className="sticky select-none top-0 z-20 bg-card/80 backdrop-blur-md border-border shadow-sm transition-colors duration-300">
         <div className="container mx-auto h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="text-xl flex-1 font-bold flex items-center space-x-2">
               <Palette className="h-6 w-6 text-primary" />
               <span>
                  ART<span className="text-primary">GALLERY</span>
               </span>
            </div>

            <div className="flex items-center gap-2">
               {/* Dropdown */}
               <Select defaultValue="option1">
                  <SelectTrigger className="w-32">
                     <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="option1">Option 1</SelectItem>
                     <SelectItem value="option2">Option 2</SelectItem>
                     <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
               </Select>

               {/* Input */}
               <Input
                  type="text"
                  placeholder="Enter text..."
                  className="flex-1"
               />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
               {navLinks.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                     <Link
                        key={link.name}
                        to={link.href}
                        className={`relative transition-colors duration-200 ${isActive
                           ? "text-primary after:w-full"
                           : "text-muted-foreground hover:text-primary"
                           } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${isActive
                              ? "after:w-full"
                              : "after:w-0 hover:after:w-full"
                           }`}
                     >
                        {link.name}
                     </Link>
                  );
               })}
            </nav>

            {/* Actions */}
            <div className="flex flex-1 justify-end items-center space-x-2">
               {/* Cart */}
               <Button
                  onClick={() => router.push(paths.cart.path)}
                  variant="ghost"
                  className="h-8 w-8 p-0 relative"
               >
                  <span className="absolute text-xs text-primary-foreground p-1 w-5 h-5 flex items-center justify-center -top-2 -right-2 bg-primary rounded-full">
                     {items.length}
                  </span>
                  <ShoppingCart className="h-4 w-4" />
               </Button>

               {/* Auth Buttons (Desktop only) */}
               {!user && (
                  <>
                     <Button
                        onClick={() => setLoginDialogOpen(true)}
                        className="hidden sm:inline-flex h-8"
                     >
                        Sign In
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => setRegisterDialogOpen(true)}
                        className="hidden sm:inline-flex h-8"
                     >
                        Join Now
                     </Button>
                  </>
               )}

               {user && <ProfileDropdown />}

               {/* Theme Toggle */}
               <Button
                  onClick={toggleDarkMode}
                  size="sm"
                  variant="outline"
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
               >
                  {!isDarkMode ? <Sun /> : <Moon />}
               </Button>

               {/* Mobile Menu Toggle */}
               <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
               >
                  {mobileMenuOpen ? (
                     <X className="h-5 w-5" />
                  ) : (
                     <Menu className="h-5 w-5" />
                  )}
               </Button>
            </div>
         </div>

         {/* Mobile Menu Dropdown */}
         {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md shadow-sm">
               <div className="flex flex-col space-y-2 p-4 text-sm font-medium">
                  {navLinks.map((link) => {
                     const isActive = location.pathname === link.href;
                     return (
                        <button
                           key={link.name}
                           onClick={() => handleLinkClick(link.href)}
                           className={`text-left transition-colors duration-200 ${isActive
                              ? "text-primary font-semibold"
                              : "text-muted-foreground hover:text-primary"
                              }`}
                        >
                           {link.name}
                        </button>
                     );
                  })}

                  <div className="border-t border-border my-2" />

                  {!user ? (
                     <>
                        <Button
                           onClick={() => {
                              setLoginDialogOpen(true);
                              setMobileMenuOpen(false);
                           }}
                           className="w-full"
                        >
                           Sign In
                        </Button>
                        <Button
                           variant="outline"
                           onClick={() => {
                              setRegisterDialogOpen(true);
                              setMobileMenuOpen(false);
                           }}
                           className="w-full"
                        >
                           Join Now
                        </Button>
                     </>
                  ) : (
                     <ProfileDropdown />
                  )}
               </div>
            </div>
         )}

         <LoginDialog />
         <RegisterDialog />
      </header>
   );
};

export default Header;
