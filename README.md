# AMBRÉ — Perfume Catalogue

Real Next.js + Firebase build of the perfume catalogue. Storefront with cart →
WhatsApp checkout, plus an admin dashboard (Firebase Auth-gated) for adding,
editing, and deleting perfumes with real photo uploads.

## 1. Install

```
npm install
```

## 2. Environment variables

`.env.local` is already filled in with your Firebase project's config
(scents-799f5). If you ever rotate keys or start a fresh project, update
`.env.local` — the values map 1:1 to what's in Firebase Console →
Project settings → General → Your apps.

## 3. Apply security rules

In the Firebase console:

- **Firestore Database → Rules** — paste in the contents of `firestore.rules`
  from this project, then Publish.
- **Storage → Rules** — paste in the contents of `storage.rules`, then
  Publish. (You'll need to have upgraded to the Blaze plan first for
  Storage to be available at all — Firestore and Auth work fine on
  the free Spark plan.)

These rules mean: anyone can browse the catalogue (read), but only someone
signed in with the admin account (you set this up under Authentication →
Users) can add, edit, or delete (write).

## 4. Run it locally

```
npm run dev
```

Visit `http://localhost:3000` for the storefront, `/admin` for the
dashboard (sign in with the email/password you created in Firebase
Authentication).

## 5. Deploy to Vercel

- Push this project to a GitHub repo
- Go to vercel.com → New Project → import the repo
- Under **Environment Variables**, add the same six `NEXT_PUBLIC_FIREBASE_*`
  keys from `.env.local` (Vercel doesn't read `.env.local` — it's
  gitignored on purpose, so you have to paste them into Vercel's dashboard)
- Deploy — you'll land on something like `2401scents.vercel.app`, and can
  attach a custom domain later whenever your sister has one

## Notes

- Photos are compressed client-side (resized + JPEG quality reduced) before
  upload, so they stay small without needing a separate image CDN.
- The catalogue updates live — if your sister adds a perfume on her phone,
  anyone with the storefront open sees it appear without refreshing
  (Firestore real-time listeners).
- To add more admin users later, just add them under Firebase
  Authentication → Users. No code changes needed.
