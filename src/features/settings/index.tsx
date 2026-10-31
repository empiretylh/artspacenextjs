'use client'
import ProfileEditForm from "./components/profile-edit-form";
import { ProfileMedia } from "./components/profile-media";
import { SavedAddressesCard } from "./components/saved-addresses-card";
import { paths } from "@/config/paths";
import Link from "@/components/common/link";
import { useTranslations } from "next-intl";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Languages, Palette, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";

const SettingsPage = () => {
   const t = useTranslations("Settings");

   return (
      <div className="max-w-4xl mx-auto space-y-8 mb-12">
         {/* Page Header */}
         <div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
               {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
               {t("managePrivacySafety")}
            </p>
         </div>

         {/* 1. Profile Hero Preview Card (Cover + Avatar + Identity) */}
         <ProfileMedia />

         {/* 2. Preferences (mobile only; desktop has these in the header) */}
         <Card className="md:hidden border border-border/70 shadow-xs gap-0 py-0 overflow-hidden">
            <CardHeader className="p-5 border-b border-border/60">
               <CardTitle className="text-lg font-semibold font-display">
                  {t("preferences")}
               </CardTitle>
               <CardDescription>
                  {t("preferencesDesc")}
               </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/60">
               <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-start gap-3.5 min-w-0">
                     <div className="p-2.5 rounded-xl bg-muted text-foreground mt-0.5 shrink-0">
                        <Languages className="w-5 h-5 text-muted-foreground" />
                     </div>
                     <div className="min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                           {t("language")}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                           {t("languageDesc")}
                        </p>
                     </div>
                  </div>
                  <LanguageSwitcher />
               </div>

               <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-start gap-3.5 min-w-0">
                     <div className="p-2.5 rounded-xl bg-muted text-foreground mt-0.5 shrink-0">
                        <Palette className="w-5 h-5 text-muted-foreground" />
                     </div>
                     <div className="min-w-0">
                        <h4 className="text-sm font-medium text-foreground">
                           {t("theme")}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                           {t("themeDesc")}
                        </p>
                     </div>
                  </div>
                  <ThemeSwitcher />
               </div>
            </CardContent>
         </Card>

         {/* 2. Profile Details & Preferences Card */}
         <Card className="border border-border/70 shadow-xs gap-0 py-0 overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-border/60">
               <CardTitle className="text-lg font-semibold font-display">
                  {t("profile")}
               </CardTitle>
               <CardDescription>
                  {t("updateProfile")}
               </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
               <ProfileEditForm onUpdateSuccess={() => { }} />
            </CardContent>
         </Card>

         {/* 3. Saved Delivery Addresses Card */}
         <SavedAddressesCard />

         {/* 4. Account & Security Card */}
         <Card className="border border-border/70 shadow-xs gap-0 py-0 overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-border/60">
               <CardTitle className="text-lg font-semibold font-display">
                  {t("privacySafety")}
               </CardTitle>
               <CardDescription>
                  {t("managePrivacySafety")}
               </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/60">
               {/* Blocked Users */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 gap-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3.5">
                     <div className="p-2.5 rounded-xl bg-muted text-foreground mt-0.5 shrink-0">
                        <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-foreground">
                           {t("blockedUsersTitle")}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                           {t("blockedUsersDesc")}
                        </p>
                     </div>
                  </div>
                  <Link
                     to={paths.settings.privacyAndSafety.blockedUsers.path}
                     className="sm:self-center shrink-0"
                  >
                     <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                        <span>{t("blockedUserList")}</span>
                        <ChevronRight className="w-4 h-4" />
                     </Button>
                  </Link>
               </div>

               {/* Delete Account (Danger Zone) */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 gap-4 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                  <div className="flex items-start gap-3.5">
                     <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive mt-0.5 shrink-0">
                        <Trash2 className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-destructive">
                           {t("deleteAccount")}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                           Permanently delete your account, artworks, and all associated personal profile data.
                        </p>
                     </div>
                  </div>
                  <a
                     href="https://api.myanmarartspace.net/api/v1/users/delete-account/"
                     target="_blank"
                     rel="noreferrer"
                     className="sm:self-center shrink-0"
                  >
                     <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                        {t("deleteAccount")}
                     </Button>
                  </a>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default SettingsPage;
