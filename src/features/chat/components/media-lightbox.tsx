import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
   urls: string[];
   initialIndex: number;
   isOpen: boolean;
   onClose: () => void;
};

export const MediaLightbox = ({ urls, initialIndex, isOpen, onClose }: Props) => {
   const [currentIndex, setCurrentIndex] = useState(initialIndex);
   const [showControls, setShowControls] = useState(true);
   const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
   const activeThumbRef = useRef<HTMLButtonElement>(null);
   const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

   // Sync currentIndex with initialIndex when lightbox opens
   useEffect(() => {
      if (isOpen) {
         setCurrentIndex(initialIndex);
         setShowControls(true);
         resetControlsTimeout();
      }
   }, [isOpen, initialIndex]);

   // Auto-hide controls logic
   const resetControlsTimeout = useCallback(() => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
         setShowControls(false);
      }, 3000);
   }, []);

   useEffect(() => {
      const handleMouseMove = () => resetControlsTimeout();
      if (isOpen) {
         window.addEventListener("mousemove", handleMouseMove);
         window.addEventListener("touchstart", handleMouseMove);
      }
      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         window.removeEventListener("touchstart", handleMouseMove);
         if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
   }, [isOpen, resetControlsTimeout]);

   // Scroll active thumbnail into view
   useEffect(() => {
      if (isOpen && activeThumbRef.current) {
         activeThumbRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
         });
      }
   }, [currentIndex, isOpen]);

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
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % urls.length);
      resetControlsTimeout();
   };

   const handlePrev = () => {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
      resetControlsTimeout();
   };

   if (!isOpen) return null;

   const variants = {
      enter: {
         opacity: 0,
         scale: 0.95,
      },
      center: {
         zIndex: 1,
         opacity: 1,
         scale: 1,
      },
      exit: {
         zIndex: 0,
         opacity: 0,
         scale: 1.05,
      },
   };

   return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
         <DialogContent
            showCloseButton={false}
            className="!w-[100vw] !max-w-[100vw] h-[100vh] p-0 gap-0 bg-black/60 backdrop-blur-xl border-none flex flex-col items-center justify-center rounded-none overflow-hidden"
         >
            {/* Header / Controls */}
            <AnimatePresence>
               {showControls && (
                  <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
                  >
                     <div className="flex items-center gap-3 pointer-events-auto">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
                           <span className="text-white font-display text-sm font-semibold tracking-wider">
                              {currentIndex + 1} <span className="opacity-40 mx-1">/</span> {urls.length}
                           </span>
                        </div>
                     </div>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 bg-white/5 backdrop-blur-md rounded-full h-11 w-11 border border-white/10 shadow-xl transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                     >
                        <X className="h-6 w-6" />
                     </Button>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Main Image Area */}
            <div className="relative w-full h-full flex items-center justify-center group">
               {/* Navigation Arrows (Desktop) */}
               <AnimatePresence>
                  {showControls && urls.length > 1 && (
                     <>
                        <motion.div
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                           transition={{ duration: 0.2 }}
                           className="absolute left-4 sm:left-6 z-50"
                        >
                           <Button
                              variant="ghost"
                              size="icon"
                              onClick={handlePrev}
                              className="text-white hover:bg-white/20 bg-white/5 backdrop-blur-md rounded-full h-10 w-10 sm:h-14 sm:w-14 border border-white/10 shadow-2xl transition-all hover:scale-110 active:scale-95"
                           >
                              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                           </Button>
                        </motion.div>
                        <motion.div
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           transition={{ duration: 0.2 }}
                           className="absolute right-4 sm:right-6 z-50"
                        >
                           <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleNext}
                              className="text-white hover:bg-white/20 bg-white/5 backdrop-blur-md rounded-full h-10 w-10 sm:h-14 sm:w-14 border border-white/10 shadow-2xl transition-all hover:scale-110 active:scale-95"
                           >
                              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                           </Button>
                        </motion.div>
                     </>
                  )}
               </AnimatePresence>

               <div className="relative aspect-square w-[60%] h-[60%] mb-2 flex items-center justify-center overflow-hidden">
                  <AnimatePresence initial={false} mode="wait">
                     <motion.img
                        key={currentIndex}
                        src={getImage(urls[currentIndex])}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                           opacity: { duration: 0.2 },
                           scale: { duration: 0.3, ease: "easeOut" },
                        }}
                        className="max-w-full max-h-full object-contain select-none shadow-2xl rounded-sm will-change-transform"
                        alt={`Art piece ${currentIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                     />
                  </AnimatePresence>
               </div>
            </div>

            {/* Mobile Navigation Area (Tap Zones) */}
            {urls.length > 1 && (
               <div className="absolute inset-y-0 inset-x-0 flex sm:hidden pointer-events-none">
                  <div className="flex-1 h-full pointer-events-auto" onClick={handlePrev} />
                  <div className="flex-1 h-full pointer-events-auto" onClick={handleNext} />
               </div>
            )}

            {/* Thumbnails Container */}
            <AnimatePresence>
               {showControls && urls.length > 1 && (
                  <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     transition={{ duration: 0.2 }}
                     className="absolute bottom-10 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none"
                  >
                     <div className="w-fit max-w-full p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto">
                        <ScrollArea className="max-w-[80vw] sm:max-w-[60vw]">
                           <div className="flex w-max min-w-full justify-center gap-3 px-4 pt-2 pb-4">
                              {urls.map((url, i) => (
                                 <button
                                    key={url + i}
                                    ref={i === currentIndex ? (activeThumbRef as any) : null}
                                    onClick={() => {
                                       setDirection(i > currentIndex ? 1 : -1);
                                       setCurrentIndex(i);
                                       resetControlsTimeout();
                                    }}
                                    className={cn(
                                       "relative w-14 h-14 rounded-lg overflow-hidden transition-all shrink-0 border-2",
                                       i === currentIndex
                                          ? "border-primary scale-110 shadow-[0_0_15px_rgba(0,63,29,0.5)] z-10"
                                          : "border-white/10 opacity-40 hover:opacity-100 hover:scale-105"
                                    )}
                                 >
                                    <img src={getImage(url)} className="w-full h-full object-cover pointer-events-none" alt="" />
                                    {i === currentIndex && (
                                       <motion.div
                                          layoutId="active-thumb-overlay"
                                          className="absolute inset-0 bg-primary/20 pointer-events-none"
                                       />
                                    )}
                                 </button>
                              ))}
                           </div>
                           <ScrollBar orientation="horizontal" className="bg-white/10" />
                        </ScrollArea>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </DialogContent>
      </Dialog>
   );
};
