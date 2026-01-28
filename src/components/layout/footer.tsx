"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "../common/link";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogClose,
   DialogDescription,
} from "../ui/dialog"; // ShadCN dialog
import { paths } from "@/config/paths";
import { useSubscribeEmail } from "@/features/service/artspace/subscribe-email";
import { useNotifications } from "../ui/notifications";

const navlinks: Record<
   string,
   Array<{ title: string; href?: string; link?: string }>
> = {
   Explore: [
      { title: "About Us", link: "/about-us.html" },
      { title: "Arcade", href: paths.collections.path },
      { title: "Press", href: "#" },
   ],
   Help: [
      { title: "Help Center", href: "#" },
      { title: "Terms of Service", link: "/terms-of-service.html" },
      { title: "Privacy Policy", link: "/privacy-and-policy.html" },
   ],
};

// Dummy contacts for modal
const contactList = [
   {
      name: "Support Team",
      email: "support@example.com",
      phone: "123-456-7890",
   },
   { name: "Sales Team", email: "sales@example.com", phone: "234-567-8901" },
   {
      name: "Marketing Team",
      email: "marketing@example.com",
      phone: "345-678-9012",
   },
];

const Footer = () => {
   const [isHelpOpen, setIsHelpOpen] = useState(false);
   const [email, setEmail] = useState("");
   const { addNotification } = useNotifications();

   const subscribeEmailMutation = useSubscribeEmail({
      mutationConfig: {
         onSuccess: () => {
            setEmail("");
            addNotification({
               type: "success",
               title: "Success",
               message: "Subscribed to newsletter successfully",
            });
         },
      },
   });

   const onSubscribeClick = () => {
      if (email === "") return;
      if (email.includes("@") === false) return;
      // alert(email);
      subscribeEmailMutation.mutate({ email });
   };

   return (
      <footer className="border-t border-border bg-background">
         <div className="mx-auto py-12 px-4 max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Navigation sections */}
            {Object.keys(navlinks).map((section) => (
               <div key={section} className="space-y-3">
                  <h4 className="text-base font-semibold text-foreground">
                     {section}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                     {navlinks[section].map((item) => {
                        if (item.href) {
                           return (
                              <li key={"footer" + item.title}>
                                 {item.title === "Help Center" ? (
                                    <button
                                       type="button"
                                       onClick={() => setIsHelpOpen(true)}
                                       className="hover:text-primary cursor-pointer transition-colors"
                                    >
                                       {item.title}
                                    </button>
                                 ) : (
                                    <Link
                                       to={item.href}
                                       // hrefLang={item.href}
                                       className="hover:text-primary transition-colors"
                                    >
                                       {item.title}
                                    </Link>
                                 )}
                              </li>
                           );
                        } else {
                           return (
                              <a
                                 key={item.title}
                                 href={item.link}
                                 className="hover:text-primary transition-colors block"
                              >
                                 {item.title}
                              </a>
                           );
                        }
                     })}
                  </ul>
               </div>
            ))}
            {/* Subscribe */}
            <div className="flex flex-col gap-6">
               <div className="space-y-3">
                  <h3 className="text-base font-semibold capitalize">
                     Subscribe
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                     Stay updated with our latest collections.
                  </p>
               </div>

               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     onSubscribeClick();
                  }}
                  className="w-full"
               >
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                     <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Your email"
                        aria-label="Email address"
                        className="rounded-3xl bg-muted w-full"
                     />
                     <Button
                        type="submit"
                        variant="outline"
                        disabled={subscribeEmailMutation.isPending}
                        loading={subscribeEmailMutation.isPending}
                        className="rounded-3xl whitespace-nowrap w-full sm:w-auto"
                     >
                        Subscribe
                     </Button>
                  </div>
               </form>
            </div>
         </div>
         <p className="text-center text-sm w-full mb-4">
            &copy; {new Date().getFullYear()} Myanmar Art Space.
         </p>

         {/* Help Center Modal */}
         <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogContent className="max-w-xs sm:max-w-md rounded-lg">
               <DialogHeader>
                  <DialogTitle>Help Center</DialogTitle>
                  <DialogDescription>
                     Reach out to the right team. Here is our contact list:
                  </DialogDescription>
               </DialogHeader>

               <ul className="mt-4 space-y-3">
                  {contactList.map((contact) => (
                     <li
                        key={contact.name}
                        className="border rounded-lg p-4 hover:bg-primary/5 transition"
                     >
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                           {contact.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           {contact.phone}
                        </p>
                     </li>
                  ))}
               </ul>

               <div className="mt-6 flex justify-center">
                  <DialogClose asChild>
                     <Button variant="outline">Close</Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>
      </footer>
   );
};

export default Footer;
