# Artspace Global Map (src/): Project Architecture

> [!IMPORTANT]
> **AI MODELS**: Start here! This file is the "Universal Map" of the Artspace Next.js project. It explains how high-level screens relate to shared logic and features.

## 🗺️ The Three Pillars
The project follows a "Feature-Sliced" inspired architecture:

1.  **`app/` (The Shell)**: 
    - Next.js App Router (Client & Server Components).
    - Responsible for routing, layouts, and composing feature-level components.
    - Includes global layout enhancements (e.g., `NextTopLoader` for navigation progress).
    - **Note**: The numbering (1, 2, 3) below represents the architectural hierarchy, not a sequence.

2.  **`features/` (The Muscles)**:
    - Vertical slices of the application (e.g., `auth`, `artist`, `artwork`, `chat`).
    - Contains feature-specific UI, logic, and API mutations.
    - [src/features/chat/README.md](file:///d:/data/learning/work/real-work/art-space-next/src/features/chat/README.md): Real-time messaging engine with Push Notifications.

3.  **`components/` (The Skin)**:
    - Shared UI atoms and molecules (Shadcn UI).
    - Generic and reusable across features.

---

## 🛠️ The Support System
- **`service/`**: Part of `features/`. The centralized API implementation for the entire app.
- **`firebase/`**: [firebase/README.md](file:///d:/data/learning/work/real-work/art-space-next/firebase/README.md) Firestore Security Rules and Indices.
- **`notifications`**: Integrated FCM system using a Next.js API Bridge (`/api/chat/notify`) and dynamic Service Worker.
- **`lib/`**: Generic utilities, the axios `api` client, and analytics.
- **`config/`**: Global environment validation and React Query key management.
- **`types/`**: Global Typescript models (User, Artwork, etc.).

## 🔃 Standard Data Flow
Typical request lifecycle:
1.  User interacts with a component in `app/`.
2.  Component uses a hook from `features/`.
3.  Feature hook calls the `api` client from `lib/` using a `queryKey` from `config/`.
4.  Data is returned and typed via models in `types/`.

## 📜 Repository Rules
Check [AGENTS.md](file:///d:/data/learning/work/real-work/art-space-next/AGENTS.md) for mandatory project coding rules.
