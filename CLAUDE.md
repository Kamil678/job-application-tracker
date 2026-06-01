# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16** app (see AGENTS.md — read `node_modules/next/dist/docs/` before writing Next.js code).

### Route layout

```
app/
  layout.tsx              # Root layout — adds Toaster, Geist fonts
  (public)/               # Landing page, no auth
  (auth)/                 # Login / register pages
  app/                    # Protected app shell — redirects to /login if no session
    layout.tsx            # Server component: calls getSession(), wraps children in AppShell
    board/                # Kanban board page
    dashboard/
    applications/
    settings/
  api/
    auth/[...all]/        # better-auth catch-all route handler
    upload-avatar/        # POST: Cloudinary upload, updates user.image in MongoDB
    delete-avatar/        # DELETE: removes avatar from Cloudinary
  actions/
    update-profile.ts     # Server action: validates and writes profile fields to MongoDB
```

The `proxy.ts` file at the root acts as Next.js middleware (redirects authenticated users away from `/login` and `/register`).

### Auth (`lib/auth/`)

- **Server**: `auth.ts` — `betterAuth` instance backed by `mongodbAdapter`. Exposes `getSession()` helper for Server Components.
- **Client**: `auth-client.ts` — exports `signIn`, `signUp`, `signOut`, `useSession`, `changePassword`, `deleteUser` from `better-auth/react`.
- On user creation, a `databaseHooks.user.create.after` callback calls `initUserBoard()` to seed the user's default Kanban board with five columns.
- Extended user fields (jobTitle, location, phone, websiteUrl, githubUrl, linkedinUrl, bio) are declared in `betterAuth`'s `user.additionalFields` and stored directly on the `user` collection.

### Database (`lib/`)

- `db.ts` — singleton Mongoose connection with module-level caching via `global.mongoose`.
- `models/board.ts` — `Board { name, userId }` — one board per user by convention.
- `models/column.ts` — `Column { boardId, name, order, color? }`.
- `models/job-application.ts` — `JobApplication { userId, boardId, columnId, company, position, status, workType, order, … }`. Status enum: `wish_list | applied | interview | offer | rejected | ghost`.
- `lib/init-user-borad.ts` — creates the default "Job Board" + five columns on first sign-up.

### UI stack

- **shadcn/ui** (style: `base-nova`) — pre-built components live in `components/ui/`. Add new components with `npx shadcn add <component>`.
- **Tailwind CSS v4** — config is CSS-only (`app/globals.css`), no `tailwind.config.js`.
- **lucide-react** for icons.
- **react-hook-form** + **zod** for forms. Schemas are co-located with the form (e.g. `components/app/profile/profile.schema.ts`).
- **sonner** for toasts — `<Toaster />` is mounted in the root layout.

### Component organisation

```
components/
  ui/           # shadcn primitives — do not edit manually
  app/
    nav/        # AppShell (client), AppSidebar, AppTopbar, nav-config.ts (NAV array + helpers)
    board/      # BoardClient — fully client-side Kanban (currently using mock data)
    profile/    # ProfilePage, ProfileForm, AvatarUpload, SecurityForm, profile.schema.ts
  auth/         # Auth page building blocks (cards, inputs, social buttons)
  landing/      # Marketing page sections
```

`AppShell` is a client component that owns the mobile-sidebar Sheet state and renders `AppSidebar` + `AppTopbar`. Navigation items are driven by the `NAV` array in `nav-config.ts`.

### Environment variables

Required in `.env.local`:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | Secret for better-auth session signing |
| `BETTER_AUTH_URL` | Server-side base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Client-side base URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
