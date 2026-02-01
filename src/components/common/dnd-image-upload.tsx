import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { cn, getImage } from "@/lib/utils";
import Image from "./image";
import { RefCallBack } from "react-hook-form";

interface ImageDndProps {
   id?: string;
   name?: string;
   ref: RefCallBack;
   value?: string[];
   onChange?: (files: File[]) => void;
   onRemoveImage?: (nextValue: string[]) => void;
   loading?: boolean;
   maxFiles?: number;
   multiple?: boolean;
}

export default function ImageDnd({
   id,
   name,
   ref,
   value = [],
   onChange,
   onRemoveImage,
   loading = false,
   maxFiles = 10,
   multiple = true,
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
      multiple,
      maxSize,
      maxFiles: multiple ? maxFiles : 1,
   });

   /**
    * Emit newly selected files only
    */
   useEffect(() => {
      if (!files.length) return;

      const selected = multiple ? files : [files[0]];

      onChange?.(selected.map((f) => f.file));

      // clear internal queue immediately
      selected.forEach((f) => removeFile(f.id));
   }, [files, multiple, onChange, removeFile]);

   const isAtLimit = multiple ? value.length >= maxFiles : value.length >= 1;

   const handleRemoveUploaded = (url: string) => {
      if (!onRemoveImage) return;

      const next = value.filter((v) => v !== url);
      onRemoveImage(next);
   };

   return (
      <div className="flex flex-col gap-2">
         {!isAtLimit && (
            <div
               ref={ref}
               role="button"
               tabIndex={loading ? -1 : 0}
               onClick={openFileDialog}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               data-dragging={isDragging || undefined}
               className={cn(
                  "relative flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50",
                  loading && "cursor-not-allowed opacity-70"
               )}
            >
               <input {...getInputProps()} id={id} name={name} className="sr-only" />

               {loading ? (
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                     <span className="animate-pulse">Uploading…</span>
                  </div>
               ) : (
                  <div className="flex flex-col items-center text-center">
                     <div className="mb-2 flex size-11 items-center justify-center rounded-full border bg-background">
                        <ImageUpIcon className="size-4 opacity-60" />
                     </div>
                     <p className="text-sm font-medium">
                        Drop images here or click to browse
                     </p>
                     <p className="text-xs text-muted-foreground">
                        {multiple
                           ? `Up to ${maxFiles} images · Max ${maxSizeMB}MB each`
                           : `Upload one image · Max ${maxSizeMB}MB`}
                     </p>
                  </div>
               )}
            </div>
         )}

         {/* Uploaded images */}
         {value.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
               {value.map((url) => (
                  <div
                     key={url}
                     className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                     <Image
                        src={getImage(url)}
                        alt=""
                        className="size-full object-cover"
                     />

                     {onRemoveImage && (
                        <button
                           type="button"
                           onClick={() => handleRemoveUploaded(url)}
                           className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                           aria-label="Remove image"
                        >
                           <XIcon className="size-4" />
                        </button>
                     )}
                  </div>
               ))}
            </div>
         )}

         {errors.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-destructive">
               <AlertCircleIcon className="size-3" />
               <span>{errors[0]}</span>
            </div>
         )}
      </div>
   );
}
