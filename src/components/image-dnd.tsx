import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useFileUpload } from "@/hooks/use-file-upload";

interface ImageDndProps {
   value?: File | null;
   onChange?: (file: File | null) => void;
   existingImageUrl?: string | null; // NEW: for update mode
}

export default function ImageDnd({
   value,
   onChange,
   existingImageUrl,
}: Readonly<ImageDndProps>) {
   const maxSizeMB = 5;
   const maxSize = maxSizeMB * 1024 * 1024;

   const [
      { files, isDragging, errors },
      {
         handleDragEnter,
         handleDragLeave,
         handleDragOver,
         handleDrop,
         openFileDialog,
         removeFile,
         getInputProps,
      },
   ] = useFileUpload({
      accept: "image/*",
      maxSize,
   });

   // NEW: holds preview of existing image from server
   const [serverPreview, setServerPreview] = useState<string | null>(
      existingImageUrl ?? null
   );

   // When an existing image URL is passed (update mode)
   useEffect(() => {
      if (existingImageUrl) {
         setServerPreview(existingImageUrl);
      }
   }, [existingImageUrl]);

   // Sync changes from file upload system
   useEffect(() => {
      const currentFile = files[0]?.file;

      // if a new file is selected
      if (currentFile && currentFile !== value) {
         setServerPreview(null); // hide existing image once user uploads a new one
         onChange?.(currentFile);
      }

      // when form clears value externally
      if (!value && files.length > 0) {
         removeFile(files[0].id);
      }
   }, [files, value, onChange, removeFile]);

   // Determine final preview priority:
   // 1) user-uploaded local preview
   // 2) server image (from update mode)
   const previewUrl =
      files[0]?.preview ||
      (value ? URL.createObjectURL(value) : null) ||
      serverPreview ||
      null;

   const handleRemove = () => {
      // remove local file
      if (files.length > 0) {
         removeFile(files[0].id);
      }

      // remove file from react-hook-form
      onChange?.(null);

      // remove existing server image preview
      setServerPreview(null);
   };

   return (
      <div className="flex flex-col gap-2">
         <div className="relative">
            <div
               role="button"
               onClick={openFileDialog}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               data-dragging={isDragging || undefined}
               className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50"
            >
               <input {...getInputProps()} className="sr-only" />

               {previewUrl ? (
                  <div className="absolute inset-0">
                     <img
                        src={previewUrl}
                        alt="Preview"
                        className="size-full object-cover aspect-square"
                     />
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                     <div
                        className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background"
                        aria-hidden="true"
                     >
                        <ImageUpIcon className="size-4 opacity-60" />
                     </div>
                     <p className="mb-1.5 text-sm font-medium">
                        Drop your image here or click to browse
                     </p>
                     <p className="text-xs text-muted-foreground">
                        Max size: {maxSizeMB}MB
                     </p>
                  </div>
               )}
            </div>

            {/* Remove button */}
            {previewUrl && (
               <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Remove image"
                  className="absolute top-4 right-4 z-50 flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
               >
                  <XIcon className="size-4" />
               </button>
            )}
         </div>

         {/* Errors */}
         {errors.length > 0 && (
            <div
               className="flex items-center gap-1 text-xs text-destructive"
               role="alert"
            >
               <AlertCircleIcon className="size-3" />
               <span>{errors[0]}</span>
            </div>
         )}
      </div>
   );
}
