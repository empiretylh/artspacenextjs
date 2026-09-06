import React from "react";
import type { OrderCardData } from "../types";
import { getImage } from "@/lib/utils";
import { paths } from "@/config/paths";
import { Package, ExternalLink, ArrowRight } from "lucide-react";
import Link from "@/components/common/link";
import Price from "@/components/common/price";
import { cn } from "@/lib/utils";

type Props = {
  orderCard: OrderCardData;
  isMine: boolean;
};

export const OrderCardBubble = ({ orderCard, isMine }: Props) => {
  const detailUrl = orderCard.orderId ? paths.order.detail.getHref(orderCard.orderId) : "#";

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden border my-1 max-w-sm transition-all",
        isMine
          ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
          : "bg-background border-border/80 text-foreground shadow-2xs"
      )}
    >
      {/* Header Tag */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 border-b text-[11px] font-semibold tracking-wide uppercase",
          isMine
            ? "border-primary-foreground/15 text-primary-foreground/90 bg-primary-foreground/5"
            : "border-border/60 text-muted-foreground bg-muted/40"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 shrink-0" />
          <span>Order Inquiry</span>
        </div>
        <span className={cn("font-mono font-medium", isMine ? "text-primary-foreground/80" : "text-primary")}>
          #{orderCard.orderCode}
        </span>
      </div>

      {/* Main Item Content */}
      <div className="flex items-center gap-3 p-3">
        {orderCard.artworkImage ? (
          <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted/30 border border-border/40">
            <img
              src={getImage(orderCard.artworkImage)}
              alt={orderCard.artworkTitle}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              "h-14 w-14 shrink-0 rounded-lg flex items-center justify-center border",
              isMine ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-muted border-border"
            )}
          >
            <Package className="h-6 w-6 opacity-60" />
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <h4
            className={cn(
              "font-semibold text-xs sm:text-sm line-clamp-1 leading-snug font-sans",
              isMine ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {orderCard.artworkTitle}
          </h4>
          
          <div className="mt-1 flex items-baseline gap-1 text-xs">
            <span
              className={cn(
                "font-semibold font-sans",
                isMine ? "text-primary-foreground" : "text-primary"
              )}
            >
              <Price
                price={orderCard.price}
                currency={{
                  code: orderCard.currency || "MMK",
                  name: orderCard.currency || "MMK",
                  symbol: "",
                  numeric_code: "",
                }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={cn(
          "px-3 py-2 border-t flex items-center justify-between",
          isMine
            ? "border-primary-foreground/15 bg-primary-foreground/5"
            : "border-border/60 bg-muted/20"
        )}
      >
        <Link
          to={detailUrl}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors",
            isMine
              ? "text-primary-foreground hover:text-primary-foreground/90"
              : "text-primary hover:text-primary/80"
          )}
        >
          <span>View Order Details</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
