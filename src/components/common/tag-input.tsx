import React, { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TagInputProps = {
   value?: string[];
   onChange?: (v: string[]) => void;
   placeholder?: string;
   maxTags?: number;
};

export function TagInput({
   value = [],
   onChange,
   placeholder = "Add keyword and press Enter",
   maxTags,
}: TagInputProps) {
   const [input, setInput] = useState("");
   const [tags, setTags] = useState<string[]>(value);
   const inputRef = useRef<HTMLInputElement | null>(null);

   // prevent infinite loop by tracking internal updates
   const internalUpdateRef = useRef(false);

   // external → internal sync
   useEffect(() => {
      if (!internalUpdateRef.current) {
         setTags(value ?? []);
      }
   }, [value]);

   // internal → external sync
   useEffect(() => {
      if (internalUpdateRef.current) {
         onChange?.(tags);
         internalUpdateRef.current = false;
      }
   }, [tags, onChange]);

   const addTag = (raw: string) => {
      if (!raw.trim()) return;

      const parts = raw
         .split(",")
         .map((p) => p.trim())
         .filter(Boolean);

      if (!parts.length) return;

      internalUpdateRef.current = true;

      setTags((prev) => {
         const next = [...prev];
         for (const p of parts) {
            if (!next.includes(p)) next.push(p);
            if (maxTags && next.length >= maxTags) break;
         }
         return next;
      });

      setInput("");
   };

   const removeTag = (index: number) => {
      internalUpdateRef.current = true;
      setTags((prev) => prev.filter((_, i) => i !== index));
      inputRef.current?.focus();
   };

   const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addTag(input);
      }
      if (e.key === "," && input !== "") {
         e.preventDefault();
         addTag(input);
      }
      if (e.key === "Backspace" && input === "" && tags.length > 0) {
         internalUpdateRef.current = true;
         setTags((prev) => prev.slice(0, prev.length - 1));
      }
   };

   const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
      const text = e.clipboardData.getData("text");
      if (text.includes(",")) {
         e.preventDefault();
         addTag(text);
      }
   };

   return (
      <div className="space-y-1">
         <div className="flex flex-wrap gap-2 items-center border rounded-md bg-transparent dark:bg-input/30 py-1">
            {tags.map((t, i) => (
               <span
                  key={t + i}
                  className={cn(
                     "inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted border text-sm",
                     i === 0 && "ml-2"
                  )}
               >
                  <span className="truncate max-w-[150px]">{t}</span>

                  <button
                     type="button"
                     onClick={() => removeTag(i)}
                     className="p-1 hover:bg-muted/60 rounded-full"
                  >
                     <XIcon className="h-3 w-3" />
                  </button>
               </span>
            ))}

            {/* Shadcn Input */}
            <Input
               ref={inputRef}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               onPaste={handlePaste}
               placeholder={placeholder}
               className="!border-none shadow-none !bg-transparent focus-visible:ring-0 w-auto flex-1 min-w-[160px]"
            />
         </div>

         <p className="text-xs text-muted-foreground">
            Press Enter or comma to add. {maxTags ? `Max ${maxTags} tags.` : ""}
         </p>
      </div>
   );
}
