# Tokamak App Hub

Internal app/package marketplace for Tokamak Network team. Register and discover AI-generated apps and packages.

## Features

### App Browsing
- Browse apps by category (dApp, SDK, Tool, Smart Contract, AI)
- Real-time fuzzy search
- GitHub statistics display (stars, forks)

### App Submission
- Submit apps via GitHub Issues
- Auto-registration when `approved` label is added (GitHub Actions)

### Repository Creation
- Create repositories in `tokamak-network` organization with GitHub OAuth
- Auto-invite creator as collaborator (write permission)
- Restricted to allowed users only

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/tokamak-network/tokamak-app-hub.git
cd tokamak-app-hub
pnpm install
```

### Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with required values:

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_SECRET` | NextAuth.js secret (`openssl rand -base64 32`) | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Yes |
| `GITHUB_ADMIN_TOKEN` | Org admin PAT (`repo`, `admin:org` scopes) | Yes |
| `ALLOWED_USERS` | Comma-separated GitHub usernames allowed to create repos | Yes |
| `GITHUB_TOKEN` | GitHub API rate limit (optional) | No |

### GitHub OAuth App Setup

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Configure:
   - Application name: `Tokamak App Hub`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add Client ID and Client Secret to `.env.local`

### Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000

## Usage

### Search Apps

1. Enter search query on the main page
2. Filter by category
3. Click app card for details

### Submit App

1. Click "Submit App" in header
2. Enter GitHub repository URL
3. Select category and add description
4. Submit creates a GitHub Issue
5. Admin adds `approved` label → auto-registered

### Create Repository

1. Click "Create Repo" in header
2. Sign in with GitHub
3. Enter repository name and description
4. Click "Create Repository"
5. Repository created in `tokamak-network` org, you're invited as collaborator

**Limitations:**
- Allowed users only
- 5 repositories per hour rate limit
- Reserved names blocked (`.github`, `api`, `admin`, etc.)

## Project Structure

```
tokamak-app-hub/
├── data/
│   └── apps.json              # App data
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main page
│   │   ├── submit/            # App submission page
│   │   ├── create-repo/       # Repository creation page
│   │   ├── apps/[slug]/       # App detail page
│   │   └── api/
│   │       ├── auth/          # NextAuth.js API
│   │       └── repos/         # Repository creation API
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Header, Footer
│   │   ├── auth/              # SessionProvider
│   │   ├── create-repo/       # CreateRepoForm
│   │   └── submit/            # SubmitForm
│   ├── auth.ts                # NextAuth.js config
│   └── lib/                   # Utility functions
└── .github/
    └── workflows/
        └── auto-add-app.yml   # Auto-register workflow
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Auth**: NextAuth.js v5 (GitHub OAuth)
- **Search**: Fuse.js
- **Validation**: Zod
- **GitHub API**: Octokit

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## License

MIT

---

## 한국어 (Korean)

<details>
<summary>한국어 문서 보기</summary>

### 주요 기능

- **앱 브라우징**: 카테고리별 검색, 실시간 퍼지 검색, GitHub 통계
- **앱 제출**: GitHub Issue로 제출, `approved` 라벨 시 자동 등록
- **저장소 생성**: OAuth 인증 후 조직에 저장소 생성, collaborator 자동 초대

### 사용 방법

**저장소 생성:**
1. 헤더의 "Create Repo" 클릭
2. GitHub로 로그인
3. 저장소 이름/설명 입력
4. "Create Repository" 클릭
5. `tokamak-network` 조직에 생성되고 collaborator로 초대됨

**제한 사항:**
- 허용된 사용자만 생성 가능
- 시간당 5개 저장소 제한
- 예약된 이름 사용 불가

</details>
