import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useTypingIndicator } from "../hooks/use-typing-indicator";
import { useImageUpload } from "@/features/service/artspace/image-upload";
import { useTranslations } from "next-intl";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";

type Props = {
   conversationId: string | null;
   onSend: (message: string, type?: 'text' | 'image', mediaUrls?: string[]) => Promise<void>;
};

export const ChatInput = ({ conversationId, onSend }: Props) => {
   const [value, setValue] = useState("");
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const [previewUrls, setPreviewUrls] = useState<string[]>([]);
   const [caption, setCaption] = useState("");
   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
   const t = useTranslations("Chat");
   
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { setTyping } = useTypingIndicator(conversationId);
   const { mutateAsync: uploadImage, isPending: isUploading } = useImageUpload();

   // Clean up preview URLs to avoid memory leaks
   useEffect(() => {
      return () => {
         previewUrls.forEach(url => URL.revokeObjectURL(url));
      };
   }, [previewUrls]);

   const handleSend = async () => {
      if (!value.trim() || isUploading) return;
      const message = value;
      setValue("");
      setTyping(false); 
      await onSend(message, 'text');
   };

   const MAX_IMAGES = 10;
   const [error, setError] = useState<string | null>(null);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const incomingFiles = Array.from(files);
      const totalPotential = selectedFiles.length + incomingFiles.length;
      
      if (totalPotential > MAX_IMAGES) {
         setError(t("maxImagesError", { max: MAX_IMAGES }));
      } else {
         setError(null);
      }

      const availableSlots = MAX_IMAGES - selectedFiles.length;
      const filesToAdd = incomingFiles.slice(0, availableSlots);
      
      if (filesToAdd.length === 0) return;

      const newFiles = [...selectedFiles, ...filesToAdd];
      const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
      
      setSelectedFiles(newFiles);
      setPreviewUrls(prev => [...prev, ...newUrls]);
      setIsPreviewOpen(true);
      
      // Reset input value so same file can be selected again if removed
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const removeFile = (index: number) => {
      const fileToRemove = selectedFiles[index];
      const urlToRemove = previewUrls[index];
      
      if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const newUrls = previewUrls.filter((_, i) => i !== index);
      
      setSelectedFiles(newFiles);
      setPreviewUrls(newUrls);
      
      if (newFiles.length < MAX_IMAGES) {
         setError(null);
      }
      
      if (newFiles.length === 0) {
         handleCancelPreview();
      }
   };

   const handleCancelPreview = () => {
      setIsPreviewOpen(false);
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setCaption("");
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const handleConfirmSend = async () => {
      if (selectedFiles.length === 0 || isUploading) return;

      try {
         const response = await uploadImage({ data: { image: selectedFiles } });
         const urls = response.data.map(item => item.url);
         
         // Send as a single gallery message
         await onSend(caption || "Sent images", 'image', urls as any);
         
         handleCancelPreview(); // Reset state
      } catch (error) {
         console.error("Failed to upload image:", error);
      }
   };

   return (
      <div className="border-t border-border bg-background p-2">
         <div className="flex items-end gap-2">
            <input
               type="file"
               ref={fileInputRef}
               className="hidden"
               accept="image/*"
               multiple
               onChange={handleFileChange}
            />
            
            <Button 
               size="icon" 
               variant="ghost" 
               className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
               onClick={() => fileInputRef.current?.click()}
               disabled={isUploading}
            >
               <ImageIcon className="h-4 w-4" />
            </Button>

            <Textarea
               value={value}
               onChange={(e) => {
                  setValue(e.target.value);
                  setTyping(true);
               }}
               placeholder={t("typeMessagePlaceholder")}
               rows={1}
               className="resize-none rounded-xl border-border bg-background focus-visible:ring-1 focus-visible:ring-primary text-sm min-h-[36px] py-1.5 px-3 font-sans"
               onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                  }
               }}
            />

            <Button 
               size="icon" 
               disabled={!value.trim() || isUploading} 
               onClick={handleSend}
               className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
               <Send className="h-4 w-4" />
            </Button>
         </div>

         {/* Image Preview Dialog */}
         <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && handleCancelPreview()}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-xl border border-border">
               <DialogHeader className="p-4 border-b border-border shrink-0">
                  <DialogTitle className="font-display text-lg font-bold">{t("previewImages", { count: selectedFiles.length, plural: selectedFiles.length > 1 ? 's' : '' })}</DialogTitle>
               </DialogHeader>

               <div className="flex-1 overflow-y-auto bg-muted/20 min-h-[200px]">
                  <div className="p-4 flex flex-wrap gap-3 justify-center">
                     {previewUrls.map((url, i) => (
                        <div 
                           key={url} 
                           className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-background border border-border shadow-sm group"
                        >
                           <img src={url} alt="Preview" className="w-full h-full object-cover" />
                           <Button
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(i)}
                           >
                              <X className="h-3 w-3" />
                           </Button>
                        </div>
                     ))}
                     
                     {selectedFiles.length < MAX_IMAGES && (
                        <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="w-32 h-32 shrink-0 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
                        >
                           <ImageIcon className="h-6 w-6" />
                           <span className="text-xs font-medium font-sans">{t("addMore")}</span>
                        </button>
                      )}
                  </div>
               </div>

               {error && (
                  <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                     <X className="h-3 w-3" />
                     {error}
                  </div>
               )}

               <div className="p-4 space-y-4 border-t border-border bg-background shrink-0">
                  <Textarea
                     value={caption}
                     onChange={(e) => setCaption(e.target.value)}
                     placeholder={t("addMessagePlaceholder")}
                     className="resize-none min-h-[80px] rounded-xl border-border bg-background focus-visible:ring-1 focus-visible:ring-primary text-sm font-sans"
                     rows={3}
                     autoFocus
                  />
                  
                  <DialogFooter className="flex flex-row justify-end gap-2">
                     <Button variant="ghost" className="rounded-full" onClick={handleCancelPreview} disabled={isUploading}>
                        {t("cancel")}
                     </Button>
                     <Button onClick={handleConfirmSend} disabled={isUploading} className="min-w-[100px] rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {isUploading ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t("sending")}
                           </>
                        ) : (
                           t("send")
                        )}
                     </Button>
                  </DialogFooter>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};
