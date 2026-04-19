# Settings Feature: User Preferences & Profile Management

> [!IMPORTANT]
> **AI MODELS**: This directory manages user-specific settings and profile updates. It is responsible for bridging the gap between the UI forms and the backend profile state.

## 🚀 Directory Structure
- **`api/`**: Mutation logic for updating user profiles and account settings.
- **`components/`**: Form components for profile editing, including avatar and cover photo uploads.
- **`hooks/`**: Specialized hooks for form handling and settings state.

## 🏗️ Profile Customization & Privacy
This feature allows users to maintain their public presence and control their privacy.

### 1. The Profile Update Flow
- **Data Source**: Fetched via the central `auth` store or `useGetProfile` service.
- **Validation**: Strict Zod schemas in `api/update-profile.tsx` govern the input for names, bios, and social links.
- **Handshake**: Successful updates are immediately synchronized with the `useAuth` store to reflect changes across the UI (e.g., in headers and cards).

### 2. Privacy Controls
- **Email Visibility (`show_email`)**: 
    - A boolean flag within the `Profile` model.
    - Managed via a `Switch` toggle in the `ProfileEditForm`.
    - **UI Impact**: When set to `false`, components like `ProfileCard` and `ArtistProfile` will hide the user's email address while maintaining layout alignment.

## 📂 Key Files
- [profile-edit-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/components/profile-edit-form.tsx): The primary form for managing user identity and privacy settings.
- [update-profile.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/api/update-profile.tsx): The API mutation handler involving Zod validation and payload normalization.

## ⚠️ Known Gotchas for AI
- **Nested Models**: Profile data (`bio`, `show_email`, etc.) is nested within the `profile` object of the `User` entity. Always use optional chaining when accessing these fields.
- **Image Uploads**: Avatar and cover photos involve a multi-step process: client-side preview -> backend upload -> profile update. Check the `api/update-profile.tsx` for specific payload requirements for images.
- **Real-time Sync**: Updates to settings often require manual store updates or query invalidation to ensure the user sees changes without a page refresh.
