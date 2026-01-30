# 기술 아키텍처 문서
## Tokamak App Hub - Technical Architecture

---

## 1. 기술 스택

| 계층 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| **런타임** | Bun | latest | 빠른 패키지 설치, Next.js 호환 |
| **프레임워크** | Next.js | 15.x | App Router, RSC, ISR 지원 |
| **UI 라이브러리** | React | 19.x | 최신 기능, Server Components |
| **언어** | TypeScript | 5.x | 타입 안정성 |
| **스타일링** | Tailwind CSS | 4.x | 유틸리티 기반, 빠른 개발 |
| **UI 컴포넌트** | shadcn/ui | latest | 접근성, 커스터마이징 용이 |
| **검색** | Fuse.js | 7.x | 클라이언트 사이드 퍼지 검색 |
| **HTTP 클라이언트** | @octokit/rest | 21.x | GitHub API 공식 라이브러리 |
| **검증** | Zod | 3.x | 런타임 스키마 검증 |
| **URL 상태** | nuqs | 2.x | URL 쿼리 파라미터 동기화 |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              사용자 브라우저                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 Application (App Router)                              │  │
│  │                                                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │
│  │  │  / (홈)      │  │ /apps/[slug]│  │ /submit (등록)           │  │  │
│  │  │  App Grid   │  │ App Detail  │  │ Submit Form             │  │  │
│  │  │  + Search   │  │ + GitHub    │  │ + Repo Preview          │  │  │
│  │  │  + Filter   │  │   Stats     │  │ + Validation            │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │  │
│  │         │                 │                    │                  │  │
│  │         ▼                 ▼                    ▼                  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │               Client-Side State (Fuse.js + nuqs)            │ │  │
│  │  │           URL Params: ?q=search&category=sdk&tags=web3      │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Vercel Edge Network                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Server (ISR)                           │  │
│  │                                                                    │  │
│  │  ┌─────────────────┐       ┌─────────────────┐                   │  │
│  │  │ Server          │       │ API Routes      │                   │  │
│  │  │ Components      │       │ (GitHub Proxy)  │                   │  │
│  │  │ (Build Time)    │       │                 │                   │  │
│  │  └────────┬────────┘       └────────┬────────┘                   │  │
│  │           │                          │                            │  │
│  │           ▼                          ▼                            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │                    데이터 소스                                │ │  │
│  │  │                                                               │ │  │
│  │  │  ┌─────────────────┐         ┌─────────────────────────┐    │ │  │
│  │  │  │  data/apps.json │         │    GitHub API           │    │ │  │
│  │  │  │  (Git 저장소)    │         │    (Octokit REST)       │    │ │  │
│  │  │  │                 │         │    - Stars, Forks       │    │ │  │
│  │  │  │  - App metadata │         │    - Last Commit        │    │ │  │
│  │  │  │  - Categories   │         │    - Language           │    │ │  │
│  │  │  │  - Tags         │         │    - Description        │    │ │  │
│  │  │  └─────────────────┘         └─────────────────────────┘    │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 앱 등록 워크플로우

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GitHub Issue 기반 등록                            │
│                                                                         │
│  1. 사용자가 /submit에서 GitHub URL 입력                                 │
│  2. "Submit App" 클릭 → GitHub Issue 페이지로 리다이렉트                  │
│  3. 사용자가 Issue 생성 (pre-filled body)                               │
│  4. 관리자가 Issue 검토                                                  │
│  5. 승인 시 data/apps.json에 수동 추가 + 커밋                            │
│  6. Vercel 자동 재배포 (ISR)                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 데이터 모델

### App Interface

```typescript
// src/types/app.ts
export interface App {
  // 식별자
  id: string;                    // UUID (예: "550e8400-e29b-41d4-a716-446655440000")
  slug: string;                  // URL용 식별자 (예: "titan-sdk")
  
  // 기본 정보
  name: string;                  // 표시 이름 (예: "Titan SDK")
  description: string;           // 전체 설명
  shortDescription: string;      // 카드용 짧은 설명 (max 100자)
  
  // 분류
  category: AppCategory;         // 주 카테고리
  tags: string[];                // 자유 태그 배열
  
  // GitHub 연동
  githubUrl: string;             // 저장소 URL
  githubOwner?: string;          // 자동 추출 (예: "tokamak-network")
  githubRepo?: string;           // 자동 추출 (예: "titan-sdk")
  stars?: number;                // GitHub API에서 가져옴
  forks?: number;                // GitHub API에서 가져옴
  lastCommit?: string;           // ISO 날짜 문자열
  language?: string;             // 주 언어 (예: "TypeScript")
  
  // 표시
  author: string;                // 작성자 이름
  authorAvatar?: string;         // 아바타 URL
  logo?: string;                 // 커스텀 로고 URL (선택)
  
  // 상태
  status: 'active' | 'beta' | 'deprecated';
  featured: boolean;             // 추천 앱 여부
  
  // 타임스탬프
  createdAt: string;             // ISO 날짜
  updatedAt: string;             // ISO 날짜
}

// 카테고리 타입
export type AppCategory = 
  | 'dapp'           // Web3 프론트엔드 앱
  | 'smart-contract' // Solidity 패키지
  | 'sdk'            // 라이브러리 & SDK
  | 'tool'           // CLI & 개발 도구
  | 'backend'        // 백엔드 서비스
  | 'ai'             // AI 생성 앱
  | 'other';         // 기타
```

### 샘플 데이터 구조

```json
// data/apps.json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "slug": "titan-sdk",
    "name": "Titan SDK",
    "description": "Tokamak Network의 Titan L2 네트워크와 상호작용하기 위한 JavaScript/TypeScript SDK입니다.",
    "shortDescription": "Titan L2 네트워크 JavaScript/TypeScript SDK",
    "category": "sdk",
    "tags": ["typescript", "l2", "ethereum", "web3"],
    "githubUrl": "https://github.com/tokamak-network/titan-sdk",
    "githubOwner": "tokamak-network",
    "githubRepo": "titan-sdk",
    "author": "Tokamak Network",
    "status": "active",
    "featured": true,
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-20T00:00:00Z"
  }
]
```

---

## 5. GitHub API 연동

### API 클라이언트

```typescript
// src/lib/github.ts
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

export async function getRepoInfo(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
      defaultBranch: data.default_branch,
      owner: {
        login: data.owner.login,
        avatar: data.owner.avatar_url,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch repo: ${owner}/${repo}`, error);
    return null;
  }
}

// URL 파싱 유틸리티
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}
```

### 캐싱 전략

- **빌드 타임**: `generateStaticParams`로 모든 앱 페이지 사전 생성
- **ISR**: `revalidate = 3600` (1시간마다 재검증)
- **Rate Limit 대응**: 서버 사이드에서만 API 호출, 토큰 사용

---

## 6. 폴더 구조

```
tokamak-app-hub/
├── docs/                         # 기획 문서
│   ├── 01-PRD.md
│   ├── 02-ARCHITECTURE.md
│   ├── 03-UI-UX.md
│   └── 04-ROADMAP.md
├── data/
│   └── apps.json                 # 앱 데이터 (JSON DB)
├── public/
│   └── assets/                   # 정적 자산
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 루트 레이아웃 (메타데이터)
│   │   ├── page.tsx              # 메인 페이지 (앱 목록)
│   │   ├── globals.css           # 글로벌 스타일 + Tokamak 테마
│   │   ├── apps/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # 앱 상세 페이지
│   │   │       └── not-found.tsx # 404 페이지
│   │   └── submit/
│   │       └── page.tsx          # 앱 등록 페이지
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   ├── layout/               # Header, Footer, Container
│   │   ├── common/               # Logo, CategoryBadge, TagChip
│   │   ├── app/                  # AppCard, AppGrid, AppDetail, GitHubStats
│   │   ├── search/               # SearchBar
│   │   ├── filter/               # CategoryFilter, TagFilter
│   │   └── submit/               # SubmitForm, RepoPreview
│   ├── hooks/
│   │   └── useAppFilter.ts       # 필터 상태 관리 훅
│   ├── lib/
│   │   ├── apps.ts               # 앱 데이터 로딩 유틸리티
│   │   ├── github.ts             # GitHub API 연동
│   │   ├── github-issue.ts       # Issue URL 생성
│   │   └── search.ts             # Fuse.js 검색 설정
│   ├── types/
│   │   └── app.ts                # App 타입 정의
│   ├── schemas/
│   │   └── app.ts                # Zod 검증 스키마
│   └── constants/
│       └── categories.ts         # 카테고리 상수
├── .env.local.example            # 환경 변수 예시
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 7. 환경 변수

```bash
# .env.local.example
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx  # GitHub Personal Access Token (optional, for higher rate limits)
```

---

## 8. 배포 설정

### Vercel 설정

```json
// vercel.json (optional)
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

### ISR 설정

```typescript
// src/app/page.tsx
export const revalidate = 3600; // 1시간마다 재검증

// src/app/apps/[slug]/page.tsx
export const revalidate = 3600;

export async function generateStaticParams() {
  const apps = await getApps();
  return apps.map((app) => ({ slug: app.slug }));
}
```
