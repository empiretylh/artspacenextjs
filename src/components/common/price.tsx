import React from "react";
import { getPriceParts } from "@/lib/utils";
import type { Currency } from "@/types";
import { cn } from "@/lib/utils"; // your cn helper

type PriceSize = "xs" | "sm" | "md" | "lg";

const styles = {
  wrap: "inline-flex items-baseline",
  currency: "text-muted-foreground",
  fraction: "text-muted-foreground",
  value: "",
  sizes: {
    xs: { currency: "text-xs", value: "text-xs font-medium", fraction: "text-xs" },
    sm: { currency: "text-xs", value: "text-sm font-medium", fraction: "text-xs" },
    md: { currency: "text-sm", value: "text-xl font-semibold", fraction: "text-sm" },
    lg: { currency: "text-base", value: "text-3xl font-semibold", fraction: "text-base" },
  },
};

type PriceProps = {
  currency: Currency;
  price: string | number;
  size?: PriceSize;

  // optional overrides (only when you need)
  className?: string;
  currencyClassName?: string;
  valueClassName?: string;
  fractionClassName?: string;

  // if you sometimes want everything same style
  uniform?: boolean;
};

export default function Price({
  currency,
  price,
  size = "md",
  className,
  currencyClassName,
  valueClassName,
  fractionClassName,
  uniform = false,
}: PriceProps) {
  const parts = getPriceParts({ currency, price });
  if (!parts) return null;

  const s = styles.sizes[size];

  return (
    <span className={cn(styles.wrap, className)}>
      {parts.map((part, index) => {
        const key = `${part.type}-${index}`;

        if (part.type === "currency") {
          return (
            <span
              key={key}
              className={cn(
                uniform ? s.value : cn(styles.currency, s.currency),
                "mr-0.5",
                currencyClassName
              )}
            >
              {part.value}
            </span>
          );
        }

        if (part.type === "fraction") {
          return (
            <span
              key={key}
              className={cn(
                uniform ? s.value : cn(styles.fraction, s.fraction),
                fractionClassName
              )}
            >
              {part.value}
            </span>
          );
        }

        return (
          <span
            key={key}
            className={cn(s.value, valueClassName)}
          >
            {part.value}
          </span>
        );
      })}
    </span>
  );
}
