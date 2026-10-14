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
- **Validation**: Strict Zod schemas in `api/update-profile.tsx` govern the input for names, bios, and social links (`last_name` is optional).
- **Partial Submission**: Uses `getDirtyValues` so only modified/dirty fields are included in the `PATCH` payload.
- **Handshake**: Successful updates are immediately synchronized with the `useAuth` store to reflect changes across the UI (e.g., in headers and cards).

### 2. Privacy Controls
- **Email Visibility (`show_email`)**: 
    - A boolean flag within the `Profile` model.
    - Managed via a `Switch` toggle in the `ProfileEditForm`.
    - **UI Impact**: When set to `false`, components like `ProfileCard` and `ArtistProfile` will hide the user's email address while maintaining layout alignment.
- **Collector Name Privacy (`hide_collector_name`)**:
    - A boolean flag within the `Profile` model accepted specifically for collector accounts (`user_type === 'COLLECTOR'`).
    - Managed via a dedicated `Switch` toggle in `ProfileEditForm` (rendered exclusively for collector users).
    - Sent to `PATCH /api/v1/users/profile/me/`.
    - **UI Impact**: When enabled, the collector's name is rendered as `Anonymous` across public profile mirrors, collector list/cards (`ProfileCard`, `UserSearchCard`), and nested ownership representations (`ProductInfoCard`, `ArtworkCharacteristicsCard`), while persisted first and last names remain intact for account owners. In `ProfileEditForm`, changing first and last name is disabled while `hide_collector_name` is toggled on.

## 📂 Key Files
- [index.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/index.tsx): The settings page view orchestrating the hero studio banner, categorized profile details, and account safety cards.
- [profile-media.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/components/profile-media.tsx): Integrated hero preview card featuring live cover photo and overlapping avatar uploads.
- [profile-edit-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/components/profile-edit-form.tsx): Segmented form with categorized sections (Public Info, Bio & Story with character counter, Website with URL adornment, and Privacy Toggles) submitting only dirty values.
- [update-profile.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/settings/api/update-profile.tsx): The API mutation handler involving Zod validation and payload normalization.

## ⚠️ Known Gotchas for AI
- **Nested Models**: Profile data (`bio`, `show_email`, etc.) is nested within the `profile` object of the `User` entity. Always use optional chaining when accessing these fields.
- **Image Uploads**: Avatar and cover photos involve a multi-step process: client-side preview -> backend upload -> profile update. Check the `api/update-profile.tsx` for specific payload requirements for images.
- **Real-time Sync**: Updates to settings often require manual store updates or query invalidation to ensure the user sees changes without a page refresh.
