import { Separator } from "@/components/ui/separator";
import BlockedUsersListContainer from "../components/blocked-users-list-container";
import { useTranslations } from "next-intl";

export function BlockedUsersPage() {
   const t = useTranslations("Settings");

   return (
      <div className="mx-auto space-y-6">
         <div>
            <h1 className="text-2xl font-semibold">{t("blockedUsersTitle")}</h1>
            <p className="text-sm text-muted-foreground">
               {t("blockedUsersDesc")}
            </p>
         </div>

         <Separator />

         <BlockedUsersListContainer />
      </div>
   );
}
