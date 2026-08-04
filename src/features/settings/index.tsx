'use client'
import ProfileEditForm from "./components/profile-edit-form";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { ProfileMedia } from "./components/profile-media";
import { paths } from "@/config/paths";
import Link from "@/components/common/link";
import { useTranslations } from "next-intl";

const SettingsPage = () => {
   const t = useTranslations("Settings");

   return (
      <div className="space-y-4 mb-4">
         <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight capitalize">{t("title")}</h1>
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>{t("profileMedia")}</CardTitle>
                  <CardDescription>{t("profileMediaDesc")}</CardDescription>
               </CardHeader>
               <CardContent>
                  <ProfileMedia />
               </CardContent>
            </Card>
         </div>
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>{t("profile")}</CardTitle>
                  <CardDescription>{t("updateProfile")}</CardDescription>
               </CardHeader>
               <CardContent>
                  <ProfileEditForm onUpdateSuccess={() => { }} />
               </CardContent>
            </Card>
         </div>
         <div>
            <Card>
               <CardHeader>
                  <CardTitle>{t("privacySafety")}</CardTitle>
                  <CardDescription>
                     {t("managePrivacySafety")}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ul>
                     <li className="text-sm p-2">
                        <Link
                           to={
                              paths.settings.privacyAndSafety.blockedUsers.path
                           }
                           className="hover:text-primary"
                        >
                           {t("blockedUserList")}
                        </Link>
                     </li>
                     <li className="text-sm p-2">
                        <Link
                           to={"https://api.myanmarartspace.net/api/v1/users/delete-account/"}
                           className="underline hover:text-primary"
                        >
                           {t("deleteAccount")}
                        </Link>
                     </li>
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default SettingsPage;
