import React, { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Palette,
   Building2,
   Sparkles,
   ShoppingBag,
   Shield,
   ArrowRight,
   CheckCircle2,
   AlertCircle,
} from "lucide-react";
import { useAuth } from "@/features/auth/store";
import { useNotifications } from "@/components/ui/notifications";
import {
   ALLOWED_ACCOUNT_SWITCHES,
   useSwitchAccountType,
   type SwitchableAccountType,
} from "../api/switch-account-type";
import { useTranslations } from "next-intl";

interface RoleMeta {
   key: string;
   icon: React.ComponentType<{ className?: string }>;
   badgeClass: string;
   colorClass: string;
}

const ROLE_METAS: Record<string, RoleMeta> = {
   BUYER: {
      key: "BUYER",
      icon: ShoppingBag,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      colorClass: "text-blue-500",
   },
   ARTIST: {
      key: "ARTIST",
      icon: Palette,
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      colorClass: "text-purple-500",
   },
   GALLERY: {
      key: "GALLERY",
      icon: Building2,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      colorClass: "text-emerald-500",
   },
   COLLECTOR: {
      key: "COLLECTOR",
      icon: Sparkles,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      colorClass: "text-amber-500",
   },
   ADMIN: {
      key: "ADMIN",
      icon: Shield,
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      colorClass: "text-rose-500",
   },
};

export const AccountTypeCard: React.FC = () => {
   const t = useTranslations("AccountType");
   const { user } = useAuth();
   const { addNotification } = useNotifications();
   const [pendingRole, setPendingRole] = useState<SwitchableAccountType | null>(null);

   const switchMutation = useSwitchAccountType({
      mutationConfig: {
         onSuccess: (response) => {
            addNotification({
               type: "success",
               title: "Success",
               message: response.data.message || t("switchSuccess", { role: pendingRole || "" }),
            });
            setPendingRole(null);
         },
         onError: (error: any) => {
            const errorMsg =
               error.response?.data?.user_type?.[0] ||
               error.response?.data?.detail ||
               error.message ||
               "Failed to switch account type.";
            addNotification({
               type: "error",
               title: "Switch Failed",
               message: errorMsg,
            });
         },
      },
   });

   if (!user) return null;

   const currentType = (user.user_type || "BUYER").toUpperCase();
   const isStaffOrAdmin = currentType === "ADMIN";
   const allowedTargets = ALLOWED_ACCOUNT_SWITCHES[currentType] || [];
   const currentMeta = ROLE_METAS[currentType] || ROLE_METAS.BUYER;
   const CurrentIcon = currentMeta.icon;

   const handleConfirmSwitch = () => {
      if (!pendingRole) return;
      switchMutation.mutate({ data: { user_type: pendingRole } });
   };

   return (
      <>
         <Card className="border border-border/70 shadow-xs gap-0 py-0 overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-border/60">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                     <CardTitle className="text-lg font-semibold font-display">
                        {t("title")}
                     </CardTitle>
                     <CardDescription className="mt-1">
                        {t("description")}
                     </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-muted-foreground">{t("currentRole")}:</span>
                     <Badge
                        variant="outline"
                        className={`gap-1.5 px-3 py-1 font-semibold text-xs border ${currentMeta.badgeClass}`}
                     >
                        <CurrentIcon className="w-3.5 h-3.5" />
                        <span>{t(`roles.${currentType}.title`)}</span>
                     </Badge>
                  </div>
               </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-6">
               {/* Current Role Overview Card */}
               <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
                  <div className={`p-3 rounded-xl bg-background border border-border/60 shadow-2xs shrink-0 ${currentMeta.colorClass}`}>
                     <CurrentIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">
                           {t(`roles.${currentType}.title`)}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                           {t(`roles.${currentType}.badge`)}
                        </span>
                     </div>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`roles.${currentType}.description`)}
                     </p>
                  </div>
               </div>

               {/* Switch Role Section */}
               {isStaffOrAdmin ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted text-muted-foreground border border-border/50 text-xs">
                     <AlertCircle className="w-4 h-4 shrink-0 text-muted-foreground" />
                     <span>{t("adminNotice")}</span>
                  </div>
               ) : allowedTargets.length > 0 ? (
                  <div className="space-y-3">
                     <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-foreground">
                           {t("switchRole")}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                           {t("switchRoleDesc")}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {allowedTargets.map((target) => {
                           const meta = ROLE_METAS[target];
                           const Icon = meta.icon;
                           return (
                              <div
                                 key={target}
                                 className="group relative flex flex-col justify-between p-4 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-muted/30 transition-all shadow-2xs"
                              >
                                 <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                       <div className={`p-2 rounded-lg bg-muted ${meta.colorClass}`}>
                                          <Icon className="w-4 h-4" />
                                       </div>
                                       <Badge
                                          variant="outline"
                                          className={`text-[10px] font-medium border ${meta.badgeClass}`}
                                       >
                                          {t(`roles.${target}.badge`)}
                                       </Badge>
                                    </div>
                                    <div>
                                       <h5 className="text-sm font-medium text-foreground">
                                          {t(`roles.${target}.title`)}
                                       </h5>
                                       <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                          {t(`roles.${target}.description`)}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="pt-4">
                                    <Button
                                       type="button"
                                       variant="outline"
                                       size="sm"
                                       className="w-full text-xs gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                                       onClick={() => setPendingRole(target)}
                                    >
                                       <span>{t("switchRole")}</span>
                                       <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               ) : null}
            </CardContent>
         </Card>

         {/* Confirmation Modal */}
         <Dialog open={!!pendingRole} onOpenChange={(open) => !open && setPendingRole(null)}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <div className="flex items-center gap-2 text-primary mb-1">
                     <CheckCircle2 className="w-5 h-5 text-primary" />
                     <DialogTitle className="font-display">
                        {pendingRole ? t("confirmDialogTitle", { role: t(`roles.${pendingRole}.title`) }) : ""}
                     </DialogTitle>
                  </div>
                  <DialogDescription className="text-xs leading-relaxed pt-1 text-muted-foreground">
                     {pendingRole
                        ? t("confirmDialogDesc", {
                             role: t(`roles.${pendingRole}.title`),
                          })
                        : ""}
                  </DialogDescription>
               </DialogHeader>

               {pendingRole && (
                  <div className="p-3.5 rounded-lg bg-muted/60 border border-border/60 text-xs space-y-1 my-2">
                     <div className="font-medium text-foreground">
                        {t(`roles.${pendingRole}.title`)} ({t(`roles.${pendingRole}.badge`)})
                     </div>
                     <p className="text-muted-foreground leading-relaxed">
                        {t(`roles.${pendingRole}.description`)}
                     </p>
                  </div>
               )}

               <DialogFooter className="gap-2 mt-4">
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={() => setPendingRole(null)}
                     disabled={switchMutation.isPending}
                  >
                     {t("cancelButton")}
                  </Button>
                  <Button
                     type="button"
                     size="sm"
                     onClick={handleConfirmSwitch}
                     loading={switchMutation.isPending}
                     className="gap-1.5"
                  >
                     <span>{t("confirmButton")}</span>
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
