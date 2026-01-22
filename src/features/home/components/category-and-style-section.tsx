import { SectionTitle } from "@/components/common";
import { CategoriesList } from "./categories-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StylesList } from "./style-list";

export const CategoryAndStyleSection = () => {
   return (
      <section>
         <div className="mb-4">
            <SectionTitle>Shop Paintings by Category And Style</SectionTitle>
         </div>
         <Tabs defaultValue="category">
            <TabsList>
               <TabsTrigger value="category">Category</TabsTrigger>
               <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            <TabsContent value="category">
               <CategoriesList />
            </TabsContent>
            <TabsContent value="style">
               <StylesList />
            </TabsContent>
         </Tabs>
      </section>
   );
};
