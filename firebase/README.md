# Firebase Infrastructure & Operations

This directory contains the source of truth for Firebase Security Rules and Firestore Indexes.

## 🚀 Deployment

Whenever you modify `.rules` or `.json` files in this directory, you MUST deploy them to the Firebase Console:

```bash
npm run deploy:firebase
```

## 📂 File Map

### [firestore.rules](file:///d:/data/learning/work/real-work/art-space-next/firebase/firestore.rules)
Production-grade security rules. 
- **Conversations**: Restricted to participants only.
- **Messages**: Restricted to conversation participants.
- **Validation**: Ensures only legitimate participants can be added.

### [firestore.indexes.json](file:///d:/data/learning/work/real-work/art-space-next/firebase/firestore.indexes.json)
Composite indexes required for advanced querying (e.g., sorting chats by `updatedAt` while filtering by `participants`).

---

## 🛠️ Local Development

### Environment Variables
Ensure your `.env` contains the following keys (prefixed with `NEXT_PUBLIC_FIREBASE_`):
- `API_KEY`
- `PROJECT_ID`
- `AUTH_DOMAIN`
- `STORAGE_BUCKET`
- `MESSAGING_SENDER_ID`
- `APP_ID`

### Emulator (Optional)
Currently, development is done against the live Firebase development project. If you switch to Emulators, update the initialization logic in `src/lib/firebase.ts`.
