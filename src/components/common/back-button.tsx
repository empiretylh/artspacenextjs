"use client";

import { ArrowLeft } from "lucide-react";
import { useSafeBack } from "@/hooks/use-safe-back";
import { paths } from "@/config/paths";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({
  fallbackPath = paths.home.path,
  label,
  className,
}: BackButtonProps) => {
  const t = useTranslations("Common");
  const { goBack } = useSafeBack(fallbackPath);

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-card text-foreground font-medium text-sm shadow-xs hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-pointer w-fit select-none",
        className
      )}
    >
      <span className="size-6 rounded-full bg-muted/70 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
      </span>
      <span className="text-sm font-medium tracking-tight">
        {label ?? t("back")}
      </span>
    </button>
  );
};

export default BackButton;
