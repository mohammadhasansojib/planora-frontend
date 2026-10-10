# Planora

Planora is a project-management workspace for organizing teams, projects, and
tasks. This repository contains the Planora web frontend, built with Next.js,
React, TypeScript, and Tailwind CSS.

## Features

- Public product landing page at `/home`.
- Authenticated dashboard at `/`, with organizations, teams, projects, tasks,
  and payment management.
- Account registration, login, logout, and optional demo login.
- Same-origin API proxy that forwards requests and HttpOnly authentication
  cookies to the backend.
- Custom not-found and runtime error pages.

## Requirements

- [Bun](https://bun.sh/) 1.4.2 or later.
- A running Planora backend API. By default, local development expects
  `http://localhost:5000/api/v1`.

## Getting started

Install dependencies:

```bash
bun install
```

Create a local environment file from the template:

```bash
cp .env.example .env
```

Configure the variables in `.env`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api/v1`. Leave blank to use `http://localhost:5000/api/v1`. |
| `ACCESS_TOKEN_SECRET` | Secret used by the backend to sign access tokens. Must match the backend configuration. |
| `DEMO_LOGIN_EMAIL` | Optional email for a dedicated demo account. |
| `DEMO_LOGIN_PASSWORD` | Optional password for that demo account. Set together with `DEMO_LOGIN_EMAIL` to enable demo login. |

Start the development server:

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/home` | Public landing page | Public |
| `/` | Main dashboard | Authenticated |
| `/login` | Sign in | Public |
| `/register` | Create an account | Public |
| `/organizations` | Manage organizations | Authenticated |
| `/teams` | Manage teams | Authenticated |
| `/projects` | Manage projects | Authenticated |
| `/tasks` | Manage tasks | Authenticated |
| `/payments` | Manage payments | Authenticated |
| `/payments/result` | Payment provider return page | Public |
| `/not-found` | Custom not-found page | Public |

Unauthenticated visits to `/` go to `/home`. Authenticated visits to `/home`
go to `/`. Unknown URLs display the custom 404 page.

## Authentication and API requests

Browser API calls use the frontend's `/api/backend/*` route. The server
forwards requests to `NEXT_PUBLIC_API_URL` and relays backend cookies as
HttpOnly cookies scoped to the frontend host. Keep token values out of browser
storage and client-side code.

The demo-login button is available only when both demo credentials are set on
the server. Use a dedicated account with non-sensitive data. Never use a
personal or privileged account, and do not expose these credentials through
`NEXT_PUBLIC_*` variables.

See [API.md](./API.md) for the backend API contract.

## Scripts

```bash
bun run dev       # Start the development server
bun run build     # Create a production build
bun run start     # Serve the production build
bun run lint      # Check the codebase with Biome
bun run format    # Format the codebase with Biome
```

## Deployment

Deploy the app to Vercel or another Node.js-compatible hosting platform. Set
`NEXT_PUBLIC_API_URL` and `ACCESS_TOKEN_SECRET` in the server environment.
Configure `DEMO_LOGIN_EMAIL` and `DEMO_LOGIN_PASSWORD` only when demo login is
intended to be available. Redeploy after changing environment variables.
