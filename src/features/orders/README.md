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

### 3. Data Table (User Views)
- [user-order-list.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/components/user-order-list.tsx) implements a premium TanStack Table with pagination support.
- It uses the shared [pagination.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/pagination.tsx) component for navigating through order history.

## 📂 Key Files
- [create-artwork-order.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/create-artwork-order.ts): The primary mutation hook for placing orders.
- [get-orders.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/orders/api/get-orders.ts): Handles paginated retrieval of user orders (supports `page` parameter).
