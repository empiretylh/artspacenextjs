import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImage } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
   urls: string[];
   initialIndex: number;
   isOpen: boolean;
   onClose: () => void;
};

export const MediaLightbox = ({ urls, initialIndex, isOpen, onClose }: Props) => {
   const [currentIndex, setCurrentIndex] = useState(initialIndex);

   // Sync currentIndex with initialIndex when lightbox opens
   useEffect(() => {
      if (isOpen) {
         setCurrentIndex(initialIndex);
      }
   }, [isOpen, initialIndex]);

   // Handle keyboard navigation
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isOpen) return;
         if (e.key === "ArrowLeft") handlePrev();
         if (e.key === "ArrowRight") handleNext();
         if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isOpen, currentIndex]);

   const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % urls.length);
   };

   const handlePrev = () => {
      setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
   };

   if (!isOpen) return null;

   return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
         <DialogContent className="max-w-[100vw] h-[100vh] p-0 gap-0 bg-black/95 border-none flex flex-col items-center justify-center sm:rounded-none">
            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
               <div className="text-white text-sm font-medium">
                  {currentIndex + 1} / {urls.length}
               </div>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full h-10 w-10"
               >
                  <X className="h-6 w-6" />
               </Button>
            </div>

            {/* Main Image Area */}
            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden">
               {urls.length > 1 && (
                  <>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden sm:flex"
                     >
                        <ChevronLeft className="h-8 w-8" />
                     </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12 hidden sm:flex"
                     >
                        <ChevronRight className="h-8 w-8" />
                     </Button>
                  </>
               )}

               <img
                  src={getImage(urls[currentIndex])}
                  alt={`View ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none animate-in fade-in zoom-in-95 duration-200"
               />
            </div>

            {/* Mobile Navigation Area (Tap Zones) */}
            {urls.length > 1 && (
               <div className="absolute inset-y-0 inset-x-0 flex sm:hidden">
                  <div className="flex-1 h-full" onClick={handlePrev} />
                  <div className="flex-1 h-full" onClick={handleNext} />
               </div>
            )}
            
            {/* Thumbnails (Optional, but nice) */}
            {urls.length > 1 && (
               <div className="absolute bottom-6 flex gap-2 px-4 overflow-x-auto overflow-y-hidden max-w-full no-scrollbar scroll-smooth">
                  {urls.map((url, i) => (
                     <button
                        key={url}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                           "w-12 h-12 rounded-md overflow-hidden border-2 transition-all shrink-0",
                           i === currentIndex ? "border-primary scale-110" : "border-transparent opacity-50"
                        )}
                     >
                        <img src={getImage(url)} className="w-full h-full object-cover" />
                     </button>
                  ))}
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
};
