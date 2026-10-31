# Events Feature: Exhibitions, Showcases, and Event Management

> [!IMPORTANT]
> **AI MODELS**: This directory manages art exhibitions, gallery events, solo/group showcases, artist tagging, artwork curation, and homepage announcement popups.

## 🚀 Directory Structure
- **`components/`**: Presentation & interaction components:
  - `event-create-modal.tsx`: Modal wrapper for `EventCreateForm`.
  - `event-create-form.tsx`: Comprehensive multi-section form dialog with image upload, date pickers, artist/artwork tagging, and popup scheduling.
  - `event-update-modal.tsx` / `event-update-form.tsx`: Edit form dialog for existing events.
  - `event-small-card.tsx` / `event-wide-card.tsx`: Event showcase card representations.
  - `events-container.tsx`: Client controller integrating query hooks, filter/sort state, and creation triggers.
  - `events-page-view.tsx`: Responsive grid presentation of events with infinite loading sentinel.
  - `event-pop-up-slider.tsx`: Promotional homepage popup slider.
  - `event-invite-email-confirm-dialog.tsx`: Confirmation dialog to send invitation emails to tagged artists.
- **`hooks/`**:
  - `use-events-list-infinite-hook.tsx`: Infinite pagination and query state controller for public events.
  - `use-uploaded-events-list-infinite-hook.tsx`: Infinite query hook for user-uploaded events in profile.
- **`pages/`**:
  - `events-page.tsx`: Public events feed page.
  - `event-detail-page.tsx`: Event detail view.
  - `event-detail-skeleton.tsx`: Event detail loading skeleton.

## 🏗️ Technical Logic & Architecture

### 1. Routes & Entry Points
- **Public Events**: `/events` (`src/app/[locale]/(dashboard)/(public)/events/page.tsx`)
- **Profile Events**: `/profile/events` (`src/app/[locale]/(dashboard)/(protected)/profile/events/page.tsx`)
- **Event Detail**: `/events/[slug]`

### 2. Form & Validation Standards
- **Create Schema**: `eventCreateInputSchema` defined in `src/features/service/artspace/event-create.ts`.
- **Update Schema**: `eventUpdateInputSchema` defined in `src/features/service/artspace/event-update.ts`.
- **Validation**:
  - `title`: Min 2 chars (automatically slugified).
  - `slug`: Min 2 chars (supports manual override).
  - `about`: Min 10 chars.
  - `cover_photo`: Required on create (uploaded via `ImageDnd` to `/artworks/upload-image/`).
  - `event_logo`: Required on create (uploaded via `ImageDnd` to `/artworks/upload-image/`).
  - `start_date` / `end_date`: Required `Date` instances.
  - `show_popup`: Boolean; when enabled, `popup_start` and `popup_end` are required.
- **Submission**:
  - Create mutates via `useEventCreate` sending payload to `POST /artworks/events/`.
  - Update mutates via `useEventUpdate` extracting dirty fields and sending payload to `PATCH /artworks/events/{id}/`.
  - Delete mutates via `useEventSoftDelete` sending request to `DELETE /artworks/events/{id}/`.

### 3. Testing
- Create E2E tests: `e2e/event-create-form.spec.ts`.
- Update E2E tests: `e2e/event-update-form.spec.ts`.
- Delete E2E tests: `e2e/event-delete.spec.ts`.


