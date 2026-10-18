"use client";

import { CategoriesList } from "./categories-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StylesList } from "./style-list";
import { useTranslations } from "next-intl";

const CategoryAndStyleTab = () => {
  const t = useTranslations("Home");

  return (
    <Tabs defaultValue="category" className="space-y-4">
      <TabsList className="h-10 p-1 bg-muted/60 rounded-full border border-border/60 gap-1">
        <TabsTrigger
          value="category"
          className="rounded-full px-5 py-1.5 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
        >
          {t("category")}
        </TabsTrigger>
        <TabsTrigger
          value="style"
          className="rounded-full px-5 py-1.5 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
        >
          {t("style")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="category" className="mt-0 focus-visible:outline-none">
        <CategoriesList />
      </TabsContent>
      <TabsContent value="style" className="mt-0 focus-visible:outline-none">
        <StylesList />
      </TabsContent>
    </Tabs>
  );
};

export default CategoryAndStyleTab;
