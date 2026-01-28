import { CategoriesList } from "./categories-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StylesList } from "./style-list";

const CategoryAndStyleTab = () => {
  return (
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
  )
}

export default CategoryAndStyleTab
