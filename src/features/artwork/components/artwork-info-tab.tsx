import { Card } from "@/components/ui/card";
import type { Artwork } from "@/types";
import { useState } from "react";

export const ArtworkInfoTabs = ({ artwork }: { artwork: Artwork }) => {
   const [activeTab, setActiveTab] = useState("details");

   const renderContent = () => {
      switch (activeTab) {
         case "details":
            return (
               <div className="grid grid-cols-2 gap-4">
                  {artwork?.details?.map((detail, index) => (
                     <div key={index} className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                           {detail.label}
                        </p>
                        <p className="text-base font-semibold text-foreground">
                           {detail.value}
                        </p>
                     </div>
                  ))}
               </div>
            );
         case "provenance":
            return (
               <p className="text-base text-foreground/80">
                  {artwork.provenance}
               </p>
            );
         case "shipping":
            return (
               <p className="text-base text-foreground/80">
                  {artwork.shipping}
               </p>
            );
         default:
            return null;
      }
   };

   const tabClasses = (tab: string) =>
      `px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
         activeTab === tab
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
      }`;

   return (
      <Card className="p-6 space-y-4">
         {/* Tabs Navigation */}
         <div className="flex border-b border-border -mt-2">
            <button
               onClick={() => setActiveTab("details")}
               className={tabClasses("details")}
            >
               Details
            </button>
            <button
               onClick={() => setActiveTab("provenance")}
               className={tabClasses("provenance")}
            >
               Provenance
            </button>
            <button
               onClick={() => setActiveTab("shipping")}
               className={tabClasses("shipping")}
            >
               Shipping
            </button>
         </div>

         {/* Tab Content */}
         <div className="pt-4">{renderContent()}</div>
      </Card>
   );
};
