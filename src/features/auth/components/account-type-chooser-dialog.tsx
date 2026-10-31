import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Palette,
   Building2,
   Sparkles,
   Check,
   ShoppingBag,
   Loader2,
   X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { SwitchableAccountType } from "@/features/settings/api/switch-account-type";

export type ChoosableRole = "BUYER" | SwitchableAccountType;

interface AccountTypeChooserDialogProps {
   open: boolean;
   onOpenChange?: (open: boolean) => void;
   onSelectRole: (role: SwitchableAccountType) => Promise<void> | void;
   onSkip: () => void;
   loading?: boolean;
   isRedirecting?: boolean;
}

interface RoleOption {
   type: ChoosableRole;
   icon: React.ComponentType<{ className?: string }>;
   badgeClass: string;
   colorClass: string;
}

const ROLE_OPTIONS: RoleOption[] = [
   {
      type: "BUYER",
      icon: ShoppingBag,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      colorClass: "text-blue-500",
   },
   {
      type: "COLLECTOR",
      icon: Sparkles,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      colorClass: "text-amber-500",
   },
   {
      type: "ARTIST",
      icon: Palette,
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      colorClass: "text-purple-500",
   },
   {
      type: "GALLERY",
      icon: Building2,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      colorClass: "text-emerald-500",
   },
];

export const AccountTypeChooserDialog: React.FC<AccountTypeChooserDialogProps> = ({
   open,
   onOpenChange,
   onSelectRole,
   onSkip,
   loading = false,
   isRedirecting = false,
}) => {
   const t = useTranslations("AccountType");
   const [selectedRole, setSelectedRole] = useState<ChoosableRole>("BUYER");
   const [internalRedirecting, setInternalRedirecting] = useState(false);

   const showRedirecting = isRedirecting || internalRedirecting;
   const isBusy = loading || showRedirecting;

   const handleConfirm = async () => {
      if (!selectedRole || isBusy) return;

      if (selectedRole === "BUYER") {
         // User explicitly stays as standard Buyer: complete onboarding without role mutation
         handleSkip();
         return;
      }

      try {
         const res = onSelectRole(selectedRole);
         if (res instanceof Promise) {
            await res;
            setInternalRedirecting(true);
         }
      } catch {
         setInternalRedirecting(false);
      }
   };

   const handleSkip = () => {
      if (isBusy) return;
      setInternalRedirecting(true);
      onSkip();
   };

   const selectedOption = ROLE_OPTIONS.find((opt) => opt.type === selectedRole);
   const SelectedIcon = selectedOption?.icon || Sparkles;

   return (
      <Dialog open={open} onOpenChange={isBusy ? undefined : onOpenChange}>
         <DialogContent
            showCloseButton={false}
            className="p-0 gap-0 border border-border shadow-2xl overflow-hidden flex flex-col max-sm:fixed max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-full max-sm:max-w-none max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:border-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:ring-0 sm:fixed sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:h-auto sm:max-h-[90vh] sm:rounded-2xl bg-background"
         >
            {showRedirecting ? (
               /* Loading & Redirecting State with Official MAS Branding */
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative flex items-center justify-center">
                     {/* Ambient soft glow */}
                     <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                     {/* Elegant spinning accent ring */}
                     <div className="w-20 h-20 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                     {/* Official MAS Logo in center */}
                     <div className="absolute inset-2.5 rounded-full overflow-hidden flex items-center justify-center bg-background shadow-xs">
                        <img
                           src="/assets/logo.png"
                           alt="Myanmar Art Space"
                           className="w-11 h-11 object-contain"
                        />
                     </div>
                  </div>

                  <div className="space-y-2 max-w-sm px-4">
                     <h3 className="text-xl font-bold font-display text-foreground tracking-tight">
                        {t("settingUpAccount")}
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedRole
                           ? `${t(`roles.${selectedRole}.title`)} — ${t("redirectingNotice")}`
                           : t("redirectingNotice")}
                     </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                     <Loader2 className="w-4 h-4 animate-spin" />
                     <span>Connecting to Myanmar Art Space...</span>
                  </div>
               </div>
            ) : (
               /* Interactive Choice Dialog */
               <>
                  {/* Header */}
                  <div className="shrink-0 px-6 pt-5 pb-3.5 border-b border-border/60 max-sm:px-5 max-sm:pt-[max(1.25rem,calc(var(--safe-top,env(safe-area-inset-top,0px))+0.75rem))] max-sm:pb-3">
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                           <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                              <Sparkles className="w-5 h-5" />
                           </div>
                           <DialogTitle className="text-lg sm:text-xl font-bold font-display text-foreground">
                              {t("onboardingTitle")}
                           </DialogTitle>
                        </div>

                        {!isBusy && (
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleSkip}
                              className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 -mr-1"
                              aria-label="Close"
                           >
                              <X className="w-4 h-4" />
                           </Button>
                        )}
                     </div>

                     <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5 sm:mt-1">
                        {t("onboardingSubtitle")}
                     </DialogDescription>
                  </div>

                  {/* Scrollable Role Options Body */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 max-sm:px-5 max-sm:py-3.5 space-y-2 min-h-0">
                     {ROLE_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedRole === option.type;
                        return (
                           <button
                              key={option.type}
                              type="button"
                              onClick={() => setSelectedRole(option.type)}
                              disabled={isBusy}
                              className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                                 isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-xs"
                                    : "border-border/70 hover:border-border hover:bg-muted/40"
                              }`}
                           >
                              <div
                                 className={`p-2 rounded-lg bg-background border border-border/60 shrink-0 mt-0.5 ${option.colorClass}`}
                              >
                                 <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="flex-1 space-y-0.5 min-w-0">
                                 <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm text-foreground">
                                       {t(`roles.${option.type}.title`)}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0">
                                       <Badge
                                          variant="outline"
                                          className={`text-[10px] font-medium border px-2 py-0 ${option.badgeClass}`}
                                       >
                                          {t(`roles.${option.type}.badge`)}
                                       </Badge>
                                       <div
                                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                             isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-muted-foreground/30"
                                          }`}
                                       >
                                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                       </div>
                                    </div>
                                 </div>
                                 <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                                    {t(`roles.${option.type}.description`)}
                                 </p>
                              </div>
                           </button>
                        );
                     })}
                  </div>

                  {/* Footer */}
                  <div className="w-full shrink-0 border-t border-border/70 bg-muted/30 px-6 py-3.5 max-sm:px-5 max-sm:py-3.5 max-sm:pb-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] sm:rounded-b-2xl">
                     <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 w-full">
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           disabled={isBusy}
                           onClick={handleSkip}
                           className="w-full sm:w-auto h-9 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent font-medium"
                        >
                           {t("skipForNow")}
                        </Button>

                        <Button
                           type="button"
                           disabled={!selectedRole || isBusy}
                           onClick={handleConfirm}
                           className="w-full sm:w-auto h-11 sm:h-10 px-6 font-semibold text-sm rounded-xl sm:rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2"
                        >
                           {loading ? (
                              <>
                                 <Loader2 className="w-4 h-4 animate-spin" />
                                 <span>{t("confirmAndContinue")}</span>
                              </>
                           ) : (
                              t("confirmAndContinue")
                           )}
                        </Button>
                     </div>
                  </div>
               </>
            )}
         </DialogContent>
      </Dialog>
   );
};
