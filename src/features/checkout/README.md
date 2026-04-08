# Checkout (Checkout): The Final Conversion Flow

> [!IMPORTANT]
> **AI MODELS**: This directory manages the specific multi-step UI flow for finalizing a purchase. It uses the `orders` domain but provides its own simplified form and mutation hooks.

## 🚀 Directory Structure
- **`api/`**: Mutation for finalizing the order (`create-order.tsx`).
- **`components/`**: UI steps for the checkout process (Shipping, Payment, Summary).
- **`hook/`**: State management for the ephemeral checkout form.

## 🏗️ Technical Logic: The Checkout Bridge

### 1. Unified Validation
- The [create-order.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/checkout/api/create-order.tsx) defines the canonical `createOrderInputSchema`.
- **Key Fields**: `total_price`, `shipping_address`, and an array of `items` containing `artworkId`.

### 2. State Management
- Checkout state is managed by [use-checkout-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/checkout/hook/use-checkout-form.tsx), which handles local shipping and payment info before it is sent to the API.

## 📂 Key Files
- [create-order.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/checkout/api/create-order.tsx): The mutation hook that finalizes the purchase and invalidates the user's order lists.
- [use-checkout-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/checkout/hook/use-checkout-form.tsx): Provides standardized initial values and change handlers for the checkout UI.
