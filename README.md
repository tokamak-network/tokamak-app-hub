# Tokamak App Hub

Discover and explore blockchain apps, SDKs, and tools built on Tokamak Network.

## Features

- Browse apps by category (dApps, SDKs, Tools, Smart Contracts, AI, etc.)
- Real-time search with fuzzy matching
- Filter by category
- App detail pages with GitHub statistics
- Submit new apps via GitHub Issues

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Search**: Fuse.js
- **Validation**: Zod
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/tokamak-network/tokamak-app-hub.git
cd tokamak-app-hub

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token for higher API rate limits | No |

## Project Structure

```
tokamak-app-hub/
├── data/
│   └── apps.json           # App data (JSON database)
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Header, Footer
│   │   ├── app/           # AppCard, AppGrid
│   │   ├── search/        # SearchBar
│   │   ├── filter/        # CategoryFilter
│   │   └── submit/        # SubmitForm
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript types
│   ├── schemas/           # Zod schemas
│   └── constants/         # Constants
└── docs/                  # Documentation
```

## Adding a New App

1. Go to the [Submit page](/submit)
2. Enter the GitHub repository URL
3. Select a category and add tags
4. Click "Submit App" to create a GitHub Issue
5. A maintainer will review and add your app

Alternatively, you can directly edit `data/apps.json` and submit a Pull Request.

## Scripts

```bash
bun dev      # Start development server
bun build    # Build for production
bun start    # Start production server
bun lint     # Run ESLint
```

## License

MIT
