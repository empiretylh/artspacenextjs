// components/collection-row.tsx

import ArtspaceCollectionsContainer from "./artspace-collections-container";

interface Props {
   title: string;
   description?: string;
}

export function CollectionRow({ title, description }: Props) {
   return (
      <section className="space-y-3">
         <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
               <p className="text-sm text-muted-foreground">{description}</p>
            )}
         </div>

         <ArtspaceCollectionsContainer />
      </section>
   );
}
