"use client";

import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useSafeBack } from "@/hooks/use-safe-back";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import LoginForm from "../components/login-form";

const LoginPage = () => {
   const t = useTranslations("Common");
   const { goBack } = useSafeBack(paths.root.path);

   return (
      <div className="bg-[#faf7ef] dark:bg-[#1a1915] flex min-h-svh w-full flex-col gap-3 items-center justify-center p-6 md:p-10 relative">
         {/* Top-left smart back button */}
         <div className="fixed top-4 left-4 md:top-6 md:left-8 z-20">
            <button
               type="button"
               onClick={goBack}
               className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground bg-background/80 hover:bg-accent border border-border/50 backdrop-blur-md transition-all shadow-xs group cursor-pointer"
               aria-label={t("back")}
            >
               <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
               <span>{t("back")}</span>
            </button>
         </div>

         <div className="max-w-sm flex gap-3 flex-col items-center w-full">
            <Link to={paths.root.path} aria-label={t("back")}>
               <AppImage
                  title="logo"
                  loading="eager"
                  width={160}
                  height={160}
                  src={"/assets/logo.png"}
                  alt="Logo"
                  preload
                  className="mx-auto w-40 h-40 mb-4"
               />
            </Link>
            <div className="w-full max-w-sm">
               <Card className="py-6 md:py-8">
                  <CardContent className="px-6 md:px-8">
                     <LoginForm />
                  </CardContent>
               </Card>
            </div>
            <AppImage
               src={'/assets/banner-desktop.png'}
               alt="Logo"
               preload
               fill
               title="showcase-banner"
               loading="eager"
               containerClassName="h-[144px] w-full"
               className="mx-auto rounded-lg overflow-hidden max-w-sm"
            />
         </div>
      </div>
   );
};

export default LoginPage;
