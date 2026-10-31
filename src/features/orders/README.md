# Orders (Orders): Transaction, Checkout & Tracking Engine

> [!IMPORTANT]
> **AI MODELS**: This directory handles the lifecycle of an Artwork purchase. It connects the user's intent to the Artspace backend and the external Payment Gateway, maintaining an editorial, high-trust checkout experience matching the platform's design standards.

## 🚀 Directory Structure
- **`api/`**: Logic for creating orders, fetching delivery charges, managing customer checkout details, and payment orchestration.
  - [customer-checkout-details.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/customer-checkout-details.ts): CRUD hooks (`useGetCustomerDetailsList`, `useCreateCustomerDetails`, `useUpdateCustomerDetails`, `useDeleteCustomerDetails`) for authenticated customer saved shipping addresses (`/api/v1/orders/customer-details/`).
- **`components/`**: 
  - [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx): The unified Artwork Checkout / Order Form with live summary, saved address selection, address creation on checkout, and authenticity guarantees.
  - [saved-details-selector.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/saved-details-selector.tsx): Saved addresses picker and switcher for checkout.
  - [customer-details-dialog.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/customer-details-dialog.tsx): Reusable modal dialog for creating/updating customer delivery details.
  - [order-status-badge.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/order-status-badge.tsx): Standardized status badge for order and payment states with dark mode tokens.
  - [order-stepper.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/order-stepper.tsx): Visual order timeline and progress tracker (`Order Placed → Payment Confirmed → Delivery → Completed`).
  - [user-order-list.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/user-order-list.tsx): Mobile-responsive card list for user order history with status filters.
- **`pages/`**:
  - [order-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/order-page.tsx): Single Order Details view with live stepper and fulfillment summary.
  - [orders-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/orders-page.tsx): User order history page wrapper with filter controls.
  - [payment-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/payment-page.tsx): Payment gateway transition screen with step indicator and security badge.

## 🏗️ Technical Logic: The Order Path

### 1. Order Creation
- Orders are created via [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx).
- **Validation**: Requires `shipping_address`, `phone_number`, and `city`.
- **Live Summary**: Dynamically calculates delivery charges based on selected city and updates the total price in real time.
- **Route Streaming & Prefetching**: Route `/artworks/:id/order` features an instant Next.js streaming skeleton (`loading.tsx`), server-side parallel prefetching for both artwork details and delivery charges (`getDeliveryCharges`), and localized request session validation to ensure sub-second page transitions.

### 2. Payment Integration
- Payments use a dedicated Server Action in [payment.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/payment.ts).
- **External API**: It calls `env.PAYMENT_API_URL` to receive a `payment_url` and `txn_id`.
- **Order Update**: Order status is patched to `PROCESSING` with `mgpay_txn_id` (`updateOrder`) before redirecting to the payment gateway.
- **Payment Lifecycle**: `PENDING` → `PROCESSING` → `COMPLETED` / `FAILED`.

### 3. Order History & Pagination
- [user-order-list.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/user-order-list.tsx) renders order cards using a responsive 2-column grid on wide screens (`grid-cols-1 xl:grid-cols-2 gap-4`), eliminating empty horizontal voids and presenting compact, high-density order cards with status badges and action blocks.
- It uses the shared [pagination.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/pagination.tsx) component for navigating through order history.
- **Response Normalization**: Safely handles both DRF paginated payloads (`{ count, results: [] }`) and unpaginated arrays (`[]`) via `extractListItems` and `normalizeListResponse`, preventing empty-state and pagination crashes.
- **Outage Circuit Breaker**: When `/orders/...` answers `503 Service Unavailable`, `getOrders`/`getUserOrders` mark the orders endpoint unavailable in `src/lib/api-unavailable.ts` (session-scoped) and immediately return an empty normalized list instead of retrying the down service. The shared axios interceptor also suppresses the generic error toast for that 503.

### 4. Communication
- **Contact Seller / Support**: Orders provide a direct entry point to the Chat feature via a "Contact Seller" button.
- **Dynamic Support Routing**: Routes to the centralized Support/Admin account defined in `SUPPORT_ACCOUNT` (`src/config/support.ts`, configurable via `NEXT_PUBLIC_SUPPORT_USER_ID`).
- **Rich Embedded Order Cards**: Seamlessly deep-links to `/chats` with order snapshot parameters (`orderId`, `orderCode`, `artworkTitle`, `artworkImage`, `price`, `currency`), attaching an order card draft that renders permanently in the chat stream via `OrderCardBubble` with direct navigation back to `/orders/[id]`.
- **Feature Flag**: Conditionally rendered based on `env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE`.

### 5. UI/UX & Typography Standards
- **Distraction-Free Split-Screen Checkout Funnel**: Routes `/artworks/:id/order` (Step 1: Delivery Details) and `/orders/:id/payment` (Step 2: Secure Payment) implement a unified, industry-standard checkout frame (Shopify, Stripe Checkout, Artsy inspired). Both stages remove platform sidebar and search clutter, featuring:
  - Minimal header with Art Space logo, contextual back button (`Back to artwork` / `Back to orders`), and simple "Secure Checkout" badge.
  - Left rail: Ergonomic stage-specific content constrained to optimal readable width (~560px) with visual stepper progress (`1. Delivery Details → 2. Secure Payment`).
  - Right rail: Subtle tinted sticky summary rail (`bg-muted/30`) with artwork preview, live price breakdown, and authentic art trust points.
  - Mobile ergonomics: Expandable top order summary accordion with instant toggle, ensuring zero clutter on smaller viewports.
- **Order Details Dashboard Split**: Route `/orders/:id` uses a balanced 7/5 two-column layout (`max-w-7xl`):
  - Left column (7 cols): Order status stepper and full purchased artwork item cards.
  - Right column (5 cols, sticky): Itemized payment summary with live price breakdown, payment status, quick action buttons, and complete delivery information.
- **Page Titles**: Use `font-display font-semibold text-2xl sm:text-3xl tracking-tight text-foreground` across all order screens for platform-wide consistency.
- **Script-Safe Typography**: Artwork titles in order cards use `leading-normal sm:leading-relaxed` and responsive clamping (`line-clamp-1 sm:line-clamp-2`) to guarantee Myanmar and multi-line titles render without vertical clipping.
- **Mobile Ergonomics**: Order cards use a 2-row footer on mobile (`Total Amount` on top row, action buttons in single horizontal row below) with the seller chat trigger anchored directly to the item metadata.

### 6. Customer Checkout Details (Saved Addresses)
- Authenticated customers can save contact and shipping addresses (`POST /orders/customer-details/`) and reuse them on future orders (`GET /orders/customer-details/`).
- **Independent Order Snapshot**: Saved records act strictly as pre-fillable form templates. When creating an order (`POST /orders/orders/`), the form sends direct snapshot fields (`name`, `phone_number`, `shipping_address`, `city`, `description`), ensuring modifications or deletions to saved entries never alter existing order records.
- **Auto-Selection**: Checkout automatically selects the default entry on load, allows 1-click address switching, offers a *"Save this address for future checkouts"* toggle on new entries, and an *"Update saved address"* prompt when modifying existing entries.

## 📈 Analytics Tracking
- **Checkout Funnel**:
  - **`add_shipping_info`**: Fired on successful order creation in [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx).
  - **`add_payment_info`**: Fired when the user proceeds to the payment gateway in [payment-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/payment-page.tsx).
- **Metadata**: Both events capture `currency`, `total_price`, and specific item data.
- **Source Context**: Dynamically provided by `useSource()` based on page hierarchy (`order_form`, `payment_page`).

## 📂 Key Files
- [create-artwork-order.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/create-artwork-order.ts): The primary mutation hook for placing orders.
- [customer-checkout-details.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/customer-checkout-details.ts): CRUD hooks for authenticated customer checkout details.
- [get-orders.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/get-orders.ts): Handles paginated retrieval of user orders.
- [customer-checkout-details.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/customer-checkout-details.spec.ts): E2E Playwright test suite verifying address book in settings and auto-fill checkout flow.
