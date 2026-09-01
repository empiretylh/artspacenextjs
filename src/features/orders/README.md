# Orders (Orders): Transaction, Checkout & Tracking Engine

> [!IMPORTANT]
> **AI MODELS**: This directory handles the lifecycle of an Artwork purchase. It connects the user's intent to the Artspace backend and the external Payment Gateway, maintaining an editorial, high-trust checkout experience matching the platform's design standards.

## 🚀 Directory Structure
- **`api/`**: Logic for creating orders, fetching delivery charges, and payment orchestration.
- **`components/`**: 
  - [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx): The unified Artwork Checkout / Order Form with live summary and authenticity guarantees.
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

### 2. Payment Integration
- Payments use a dedicated Server Action in [payment.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/payment.ts).
- **External API**: It calls `env.PAYMENT_API_URL` to receive a `payment_url`.
- **Payment Lifecycle**: `PENDING` → `PROCESSING` → `COMPLETED` / `FAILED`.

### 3. Order History & Pagination
- [user-order-list.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/user-order-list.tsx) renders order cards with responsive action blocks.
- It uses the shared [pagination.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/pagination.tsx) component for navigating through order history.

### 4. Communication
- **Contact Seller**: Orders provide a direct entry point to the Chat feature via a "Contact Seller" button.
- **Dynamic Routing**: Targets `current_owner_display` of the artwork using the `getUserRouteType` utility.
- **Feature Flag**: Conditionally rendered based on `env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE`.

### 5. UI/UX & Typography Standards
- **Page Titles**: Use `font-display font-semibold text-2xl sm:text-3xl tracking-tight text-foreground` across all order screens for platform-wide consistency.
- **Script-Safe Typography**: Artwork titles in order cards use `leading-normal sm:leading-relaxed` and responsive clamping (`line-clamp-1 sm:line-clamp-2`) to guarantee Myanmar and multi-line titles render without vertical clipping.
- **Mobile Ergonomics**: Order cards use a 2-row footer on mobile (`Total Amount` on top row, action buttons in single horizontal row below) with the seller chat trigger anchored directly to the item metadata.

## 📈 Analytics Tracking
- **Checkout Funnel**:
  - **`add_shipping_info`**: Fired on successful order creation in [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx).
  - **`add_payment_info`**: Fired when the user proceeds to the payment gateway in [payment-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/payment-page.tsx).
- **Metadata**: Both events capture `currency`, `total_price`, and specific item data.
- **Source Context**: Dynamically provided by `useSource()` based on page hierarchy (`order_form`, `payment_page`).

## 📂 Key Files
- [create-artwork-order.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/create-artwork-order.ts): The primary mutation hook for placing orders.
- [get-orders.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/get-orders.ts): Handles paginated retrieval of user orders.
