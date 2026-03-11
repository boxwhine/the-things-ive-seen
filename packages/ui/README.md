# @ttis/ui

Next.js 14 frontend for The Things I've Seen. Built with React 18, Apollo Client, Tailwind CSS, and Radix UI.

## Prerequisites

- Node.js 20+
- pnpm
- Running instance of `@ttis/api` (GraphQL backend)

## Setup

1. **Install dependencies** (from repo root):

   ```bash
   pnpm install
   ```

2. **Ensure the API is running** — the UI connects to the GraphQL API at `http://localhost:4000` via Apollo Client.

## Running

### Local dev server

```bash
# From repo root
pnpm dev:ui

# Or from this directory
pnpm dev
```

The app will be available at http://localhost:3000.

### Via Docker Compose

```bash
# From repo root — starts DB, API, UI, and Adminer
docker-compose up
```

### Production build

```bash
pnpm build    # Create optimized build
pnpm start    # Serve production build
```

## Linting & Formatting

```bash
pnpm lint          # ESLint
pnpm format        # Prettier
```

## Project Structure

```
src/
├── app/            # Next.js App Router pages (home, about, events, venues)
├── components/     # React components (Nav, addEvent, addVenue, venueSearch)
│   └── ui/         # Shared UI primitives (Radix/shadcn)
├── graphql/        # Apollo Client queries and mutations
└── lib/            # Utility functions
```

## Key Details

- **Data fetching**: Apollo Client queries/mutations defined in `src/graphql/`
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Fonts**: Geist font family via `next/font`

## Useful URLs

| Service | URL                   |
| ------- | --------------------- |
| UI      | http://localhost:3000 |
| API     | http://localhost:4000 |
