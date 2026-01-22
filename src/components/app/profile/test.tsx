"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollTest() {
   const containerRef = useRef<HTMLDivElement>(null);
   const [items, setItems] = useState(
      Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)
   );

   // Function to load more items
     const loadMore = () => {
      const newItems = Array.from(
         { length: 10 },
         (_, i) => `Item ${items.length + i + 1}`
      );
      setItems((prev) => [...prev, ...newItems]);
   };

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
         if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 5
         ) {
            console.log("Reached end of container!");
            loadMore();
         }
      };

      container.addEventListener("scroll", handleScroll);

      return () => container.removeEventListener("scroll", handleScroll);
   }, [items]);

   return (
      <div
         ref={containerRef}
         style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid #000",
            padding: "10px",
         }}
      >
         {items.map((item, idx) => (
            <div
               key={idx}
               style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
            >
               {item}
            </div>
         ))}
      </div>
   );
}
