# ACC3018 - Applied Analytics Capstone Seminars

Interactive seminar platform for SIT ACC3018. Built with React, Vite, Firebase Auth, and Firestore.

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- A Firebase project
- Firestore Database enabled
- Firebase Authentication enabled with Anonymous sign-in for students

### 2. Install
```bash
cd acc3018
npm install
```

### 3. Firebase Setup
1. Go to the Firebase Console.
2. Enable Firestore Database.
3. Enable Authentication > Sign-in method > Anonymous.
4. Optional for the instructor dashboard: create an email/password instructor account and add a custom claim named `instructor` with value `true`.
5. Copy your web app config into `src/shared/firebase.js`.
6. Deploy or paste `firestore.rules` into Firestore Rules.

### 4. Run Locally
```bash
npm run dev
```
Open http://localhost:5173.

### 5. Deploy

SPA rewrite configs are included for Vercel, Netlify, and Firebase Hosting so direct seminar URLs work.

```bash
npm run build
```

- Vercel: `vercel.json` rewrites all routes to `/`.
- Netlify: `netlify.toml` rewrites all routes to `/index.html`.
- Firebase Hosting: `firebase.json` publishes `dist` and rewrites all routes to `/index.html`.

## Project Structure

```
src/
  main.jsx
  App.jsx
  shared/
    theme.js
    firebase.js
    storage.js
    GameProvider.jsx
    components.jsx
  pages/
    Landing.jsx
    Seminar1.jsx
    Seminar2.jsx
```

## Adding a New Seminar

1. Create `src/pages/Seminar3.jsx` following the Seminar 1 or 2 pattern.
2. Add the route in `App.jsx`.
3. Update the `SEMINARS` array in `Landing.jsx` and set `ready: true`.
4. Namespace progress keys with the seminar prefix, e.g. `s3:overview`, `s3:activity`.
5. Define any new badges in `theme.js`.

## Data Architecture

| Collection | Key | Contents | Access |
|------------|-----|----------|--------|
| `students` | hashed student ID | Full progress blob | Owner device or instructor claim |
| `roster` | hashed student ID | Slim leaderboard record | Signed-in students can read summaries |
| `detail` | hashed student ID | Instructor detail | Instructor custom claim only |

Student IDs are SHA-256 hashed before use in Firestore document keys. Plain student ID and name remain in localStorage. Firestore records also store the Firebase Auth `ownerUid`, so students can update only their own records under the supplied rules.

## Instructor Dashboard

Access via the floating XP pill > Instructor Access. There is no frontend passphrase. Use a Firebase Auth account with the custom claim `instructor: true`.

## Progress Model

Progress keys are namespaced by seminar (`s1:overview`, `s2:overview`) to avoid collisions. XP payouts are tracked in `xpAwards`, so retries support learning without repeatedly inflating leaderboard rank.
