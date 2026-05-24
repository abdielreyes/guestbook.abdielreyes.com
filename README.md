# guestbook.abdielreyes.com

A retro-styled, real-time guestbook. Visitors can leave a message and reply to others. Built with SvelteKit and PocketBase, styled with a Matrix-rain canvas background and 90s terminal typography.

Live at → **[guestbook.abdielreyes.com](https://guestbook.abdielreyes.com)**

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev) (Svelte 5) |
| Database / backend | [PocketBase](https://pocketbase.io) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI primitives | [bits-ui](https://bits-ui.com) |
| Icons | [Lucide Svelte](https://lucide.dev) |
| Date formatting | [dayjs](https://day.js.org) |

---

## Features

- **Leave a message** — anonymous posts, up to 280 characters
- **Replies** — threaded comments on each message, also 280 chars max
- **Real-time** — new messages and replies appear live via PocketBase WebSocket subscriptions (no refresh needed)
- **Timestamps** — relative time ("2 hours ago") for recent posts, absolute date+time for older ones; auto-updates every minute
- **Matrix background** — canvas-based white character rain with a CRT scanline overlay
- **Character counter** — appears in the last 40 characters, turns amber at 20 remaining, red at limit
- **Optimistic UI** — your own messages appear instantly without waiting for a round-trip

---

## Environment variables

Create a `.env` file at the project root with:

```env
PUBLIC_POCKETBASE_URL=https://your-pocketbase-instance.com
```

> This is the only required variable. The `PUBLIC_` prefix makes it available in the browser via SvelteKit's `$env/dynamic/public`.

---

## PocketBase setup

You need two collections in your PocketBase instance:

### `messages`
| Field | Type | Notes |
|---|---|---|
| `body` | Text | Max length: **280** |
| `author` | Text | Stores the user-agent string |
| `active` | Bool | Default `true` |
| `comments` | Relation (multiple) | Points to the `comments` collection |

### `comments`
| Field | Type | Notes |
|---|---|---|
| `body` | Text | Max length: **280** |
| `author` | Text | Stores the user-agent string |
| `active` | Bool | Default `true` |
| `message_id` | Text | ID of the parent message |

> **Tip:** Set the `body` max length to 280 in the PocketBase admin panel for each collection — this enforces the limit at the database layer, in addition to the frontend validation.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in your environment variable
cp .env.example .env   # then set PUBLIC_POCKETBASE_URL

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

Other useful commands:

```bash
npm run build       # production build
npm run preview     # preview the production build locally
npm run check       # type-check with svelte-check
npm run lint        # prettier + eslint
npm run format      # auto-format all files
```

---

## Deployment

The project uses `@sveltejs/adapter-node` and includes a `Dockerfile` for containerised deployments (e.g. CapRover). A `CaptainDefinition` file is included for CapRover.

```bash
npm run build
node build   # starts the Node server
```

Make sure `PUBLIC_POCKETBASE_URL` is set in your production environment.

---

## Project structure

```
src/
├── app.css                          # Tailwind, global styles, dark mode vars
├── app.d.ts                         # App.Message and App.Comment types
├── app.html                         # HTML shell (Google Fonts loaded here)
├── lib/
│   ├── constants.ts                 # Shared constants (MAX_MESSAGE_LENGTH)
│   ├── pocketbase.ts                # PocketBase client singleton
│   └── components/
│       ├── matrix-background/       # Canvas Matrix rain animation
│       ├── theme-mode-button/       # Light/dark toggle
│       └── messages/
│           ├── message-list/        # Message feed with collapsible replies
│           ├── new-message-form/    # Post a new message
│           └── comment-message-form/# Reply form (toggled inline)
└── routes/
    ├── +layout.svelte               # Mounts MatrixBackground + scanline overlay
    └── +page.svelte                 # Main page: data loading, real-time sub, state
```
