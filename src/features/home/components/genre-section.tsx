import { SectionTitle } from "@/components/common";
import { GenresList } from "./genres-list";

export const GenreSection = () => {
   return (
      <section>
         <div className="mb-4">
            <SectionTitle>Shop Paintings by Genre</SectionTitle>
         </div>
         <GenresList />
      </section>
   );
};
