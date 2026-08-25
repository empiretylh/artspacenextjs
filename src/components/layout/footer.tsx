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
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FooterProps {
   className?: string;
   contentClassName?: string;
   columnClassName?: string;
   listClassName?: string;
}

const Footer = ({ className, contentClassName, columnClassName, listClassName }: FooterProps) => {
   const t = useTranslations("Footer");
   const [isHelpOpen, setIsHelpOpen] = useState(false);
   const [email, setEmail] = useState("");
   const { addNotification } = useNotifications();

   const navlinks: Record<
      string,
      Array<{ title: string; href?: string; link?: string }>
   > = {
      [t("explore")]: [
         { title: t("aboutUs"), href: paths.aboutUs.path },
         { title: t("arcade"), href: paths.collections.path },
         { title: t("press"), href: paths.press.path },
      ],
      [t("help")]: [
         { title: t("helpCenter"), href: "#" },
         { title: t("termsOfService"), href: paths.termsOfService.path },
         { title: t("privacyPolicy"), href: paths.privacyPolicy.path },
      ],
   };

   const contactList = [
      {
         name: t("supportTeam"),
         email: "support@example.com",
         phone: "123-456-7890",
      },
      {
         name: t("salesTeam"),
         email: "sales@example.com",
         phone: "234-567-8901"
      },
      {
         name: t("marketingTeam"),
         email: "marketing@example.com",
         phone: "345-678-9012",
      },
   ];

   const subscribeEmailMutation = useSubscribeEmail({
      mutationConfig: {
         onSuccess: () => {
            setEmail("");
            addNotification({
               type: "success",
               title: t("success"),
               message: t("subscribedSuccess"),
            });
         },
      },
   });

   const onSubscribeClick = () => {
      if (email === "") return;
      if (email.includes("@") === false) return;
      subscribeEmailMutation.mutate({ email });
   };

   return (
      <footer className={cn("border-t border-border bg-background", className)}>
         <div className={cn("mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10", contentClassName)}>
            {/* Navigation sections */}
            {Object.keys(navlinks).map((section) => (
               <div key={section} className={cn("space-y-3", columnClassName)}>
                  <h3 className="text-base font-bold font-display text-foreground">
                     {section}
                  </h3>
                  <ul className={cn("space-y-2 text-sm text-muted-foreground", listClassName)}>
                     {navlinks[section].map((item) => {
                        if (item.href) {
                           return (
                              <li key={"footer" + item.title}>
                                 {item.title === t("helpCenter") ? (
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
               <div className={cn("space-y-3", columnClassName)}>
                  <h3 className="text-base font-bold font-display capitalize">
                     {t("subscribe")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                     {t("stayUpdated")}
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
                        placeholder={t("emailPlaceholder")}
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
                        {t("subscribe")}
                     </Button>
                  </div>
               </form>
            </div>
         </div>
         <p className="text-center text-sm w-full mb-4">
            &copy; {new Date().getFullYear()} {t("copyright")}.
         </p>

         {/* Help Center Modal */}
         <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <DialogContent className="max-w-xs sm:max-w-md rounded-lg">
               <DialogHeader>
                  <DialogTitle>{t("helpCenter")}</DialogTitle>
                  <DialogDescription>
                     {t("reachOut")}
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
                     <Button variant="outline">{t("close")}</Button>
                  </DialogClose>
               </div>
            </DialogContent>
         </Dialog>
      </footer>
   );
};

export default Footer;
