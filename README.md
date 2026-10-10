<div align="center">

# Planora

### Plan your work. Make progress together.

A project-management workspace for keeping teams, projects, and tasks in sync.

[Open Planora](https://planora-frontend-swart.vercel.app) · [Explore the product](https://planora-frontend-swart.vercel.app/home) · [Contact](https://planora-frontend-swart.vercel.app/contact)

</div>

---

## About

Planora brings everyday project work into one organized workspace. Create
organizations and teams, coordinate projects, break plans into tasks, and keep
work moving with a shared view of what comes next.

This repository contains the Planora web frontend. The production app connects
to a separately deployed backend API.

## Product highlights

- **Workspace management** — organize work with organizations, teams, projects,
  and tasks.
- **Task collaboration** — manage task details, comments, and image attachments.
- **Payments** — start the configured bKash checkout and view payment history.
- **Account access** — register, sign in, refresh sessions, and log out using
  HttpOnly authentication cookies.
- **Public product pages** — explore the landing page, About, Contact, and
  Pricing pages without signing in.
- **Responsive interface** — use the workspace across desktop and mobile
  layouts.

> The Pricing page is currently informational. It does not sell subscriptions
> or process payments.

## Explore the app

| Page | What it does | Access |
| --- | --- | --- |
| [`/home`](https://planora-frontend-swart.vercel.app/home) | Product overview and landing page | Public |
| [`/`](https://planora-frontend-swart.vercel.app/) | Workspace dashboard | Sign in required |
| [`/about`](https://planora-frontend-swart.vercel.app/about) | About Planora | Public |
| [`/pricing`](https://planora-frontend-swart.vercel.app/pricing) | Informational plan overview | Public |
| [`/contact`](https://planora-frontend-swart.vercel.app/contact) | Contact information | Public |
| `/login`, `/register` | Account access | Public |
| `/organizations`, `/teams` | Workspace and team management | Sign in required |
| `/projects`, `/tasks` | Project and task management | Sign in required |
| `/payments` | bKash checkout and payment history | Sign in required |
| `/payments/result` | Payment return status | Public |
| `/not-found` | Not Found |
| `/error` | Error Page |

Unauthenticated visitors to `/` are redirected to `/home`; signed-in visitors
to `/home` are redirected to the dashboard. Unknown routes display a custom
404 page. Runtime failures show an error recovery page.

## Technology

- Next.js 16 (App Router and Proxy)
- React 19 and TypeScript
- Tailwind CSS 4
- Biome for formatting and lint checks
- Bun for package management and scripts

## Run locally

### Requirements

- Bun 1.4.2 or later
- The Planora backend API (local default: `http://localhost:5000/api/v1`)

### Setup

```bash
bun install
cp .env.example .env
```

Set the values in `.env`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api/v1`. Blank uses `http://localhost:5000/api/v1`. |
| `ACCESS_TOKEN_SECRET` | Must match the backend's access-token signing secret. |
| `DEMO_LOGIN_EMAIL` | Optional email for a dedicated demo account. |
| `DEMO_LOGIN_PASSWORD` | Optional password for that demo account. Set both demo variables to enable the demo-login button. |

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production configuration

Configure the backend API URL and access-token secret in the frontend hosting
environment. Add demo credentials only if you want the demo-login option
enabled; use a dedicated account with non-sensitive data, and never expose its
credentials with a `NEXT_PUBLIC_` variable.

For bKash, configure the **backend** environment variable
`BKASH_FRONTEND_REDIRECT_URL` to point to the deployed frontend's payment
result page:

```text
https://planora-frontend-swart.vercel.app/payments/result
```

After the backend processes the provider callback, it redirects to this route
with one of `?status=success`, `?status=failure`, or `?status=cancelled`. The
frontend page displays the result; payment verification and execution happen
on the backend. See [API.md](./API.md) for the documented API contract.

## Development commands

```bash
bun run dev       # Start the development server
bun run build     # Create a production build
bun run start     # Serve the production build
bun run lint      # Check the codebase with Biome
bun run format    # Format the codebase with Biome
```

## Project structure

```text
app/          App Router pages, layouts, and API routes
components/   Shared UI and feature components
lib/api/      Typed API clients and backend response helpers
public/       Static assets
```

## Security notes

- The frontend proxies browser API calls through `/api/backend/*` so auth
  cookies can be scoped to the frontend host and forwarded to the backend.
- Access and refresh tokens are HttpOnly cookies; client-side code does not
  read or persist token values.
- Keep `.env` out of source control. Use `.env.example` as the variable
  reference.
- Never put signing secrets or demo passwords in source code or public
  environment variables.
