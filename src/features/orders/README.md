# Orders (Orders): Transaction & Tracking Engine

> [!IMPORTANT]
> **AI MODELS**: This directory handles the lifecycle of an Artwork purchase. It connects the user's intent to the Artspace backend and the external Payment Gateway.

## 🚀 Directory Structure
- **`api/`**: Logic for creating orders and fetching delivery charges.
- **`components/`**: The standard Order Form and User Order List (Data Table).
- **`context/`**: (If present) Shared state for the order process.

## 🏗️ Technical Logic: The Order Path

### 1. Order Creation
- Orders are typically created via the [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx).
- **Validation**: Requires `shipping_address`, `phone_number`, and `city`.

### 2. Payment Integration
- Payments use a dedicated Server Action in [payment.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/payment.ts).
- **External API**: It calls `env.PAYMENT_API_URL` to receive a `payment_url`.
- **AI NOTE**: Payment processing is decoupled from the main Artspace API logic for security and scalability.

- [user-order-list.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/user-order-list.tsx) implements a premium TanStack Table with pagination support.
- It uses the shared [pagination.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/pagination.tsx) component for navigating through order history.

### 4. Communication
- **Contact Seller**: Orders provide a direct entry point to the Chat feature via a "Contact Seller" button.
- **Dynamic Routing**: It targets the `current_owner_display` of the artwork, mapping their user type to the appropriate chat route using the `getUserRouteType` utility.
- **Feature Flag**: This functionality is conditionally rendered based on `env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE`.

## 📈 Analytics Tracking
- **Checkout Funnel**:
    - **`add_shipping_info`**: Fired on successful order creation in [artwork-order-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/artwork-order-form.tsx).
    - **`add_payment_info`**: Fired when the user proceeds to the payment gateway in [payment-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/pages/payment-page.tsx).
- **Metadata**: Both events capture `currency`, `total_price`, and specific item data.
- **Source Context**: Dynamically provided by the `useSource()` hook based on the page hierarchy (`order_form`, `payment_page`).

## 📂 Key Files
- [create-artwork-order.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/create-artwork-order.ts): The primary mutation hook for placing orders.
- [get-orders.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/get-orders.ts): Handles paginated retrieval of user orders (supports `page` parameter).
