# Tokamak App Hub 마켓플레이스 구현 계획

## TL;DR

> **Quick Summary**: Tokamak Network 내부 개발자를 위한 블록체인 앱/패키지 마켓플레이스. JSON 파일 기반 데이터 저장, GitHub URL 입력으로 자동 정보 수집, 카드 그리드 UI로 앱 탐색.
> 
> **Deliverables**:
> - Next.js 15 기반 마켓플레이스 웹 애플리케이션
> - 앱 목록/상세 페이지, 검색/필터 기능
> - GitHub Issue 기반 앱 등록 시스템
> - 반응형 카드 그리드 UI (Tokamak 브랜딩)
> 
> **Estimated Effort**: Medium (3-4주)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: 프로젝트 설정 → 데이터 모델/스키마 → UI 컴포넌트 → 페이지 통합

---

## Context

### Original Request
블록체인 관련 앱, GitHub 저장소 등을 올리는 마켓플레이스 기획. AI를 통해 월 수십 개의 앱/패키지가 생성되며, 사내 개발자들이 한 눈에 모아 볼 수 있는 마켓플레이스 형태 페이지.

### Interview Summary
**Key Discussions**:
- **인증 방식**: Public 접근 (인증 없음) - 누구나 열람/등록 가능
- **등록 방식**: GitHub URL 입력 → 자동 정보 수집
- **데이터 저장소**: JSON 파일 기반 (Git 저장소에서 관리)
- **카테고리**: 고정 카테고리 + 자유 태그 혼합

**Research Findings**:
- Tokamak Network 기술 스택: Next.js 14-16, shadcn/ui, Tailwind, wagmi+viem
- 브랜드 컬러: #0078FF (Tokamak Blue)
- 참조: Cal.com App Store, Runtipi AppStore 패턴

### Metis Review
**Identified Gaps** (addressed):

| Gap | Resolution |
|-----|------------|
| JSON 파일 쓰기 메커니즘 불명확 | GitHub Issue 기반 등록 워크플로우로 변경 |
| GitHub API Rate Limit | 빌드 타임 데이터 페칭 + ISR 1시간 revalidate |
| 스팸/악성 등록 방지 | GitHub Issue 승인 후 수동 머지 (MVP), 추후 자동화 |
| 삭제된/변경된 Repo 처리 | 에러 UI 상태 + 빌드 시 검증 |
| 중복 등록 방지 | GitHub URL 기준 중복 체크 |

---

## Work Objectives

### Core Objective
Tokamak Network 생태계의 앱/패키지를 한 곳에서 탐색하고 등록할 수 있는 마켓플레이스 웹 애플리케이션 구축.

### Concrete Deliverables
- `/` - 앱 목록 페이지 (카드 그리드, 검색, 필터)
- `/apps/[slug]` - 앱 상세 페이지
- `/submit` - 앱 등록 페이지 (GitHub Issue 생성)
- `/data/apps.json` - 앱 데이터 파일
- 재사용 가능한 UI 컴포넌트 라이브러리

### Definition of Done
- [ ] `bun run build` 성공 (에러 없음)
- [ ] `bun run lint` 통과
- [ ] 모든 페이지 반응형 동작 확인 (모바일/태블릿/데스크톱)
- [ ] Lighthouse Performance 점수 80 이상
- [ ] GitHub API 연동 정상 동작

### Must Have
- 앱 목록 카드 그리드 뷰
- 카테고리 필터 + 태그 필터
- 실시간 검색 (Fuse.js)
- 앱 상세 페이지 (GitHub 정보 표시)
- 앱 등록 폼 (GitHub Issue 생성)
- Tokamak 브랜딩 적용
- 반응형 디자인

### Must NOT Have (Guardrails)
- **런타임 파일 쓰기 없음**: JSON 파일은 Git 커밋으로만 수정
- **클라이언트 측 GitHub 토큰 노출 없음**: 모든 API 호출은 서버 사이드
- **앱 실행/배포 기능 없음**: 링크 제공만 (MVP)
- **사용자 인증 시스템 없음**: OAuth 등 복잡한 인증 제외 (MVP)
- **DB/백엔드 서버 없음**: 순수 정적 사이트 + API Routes
- **과도한 추상화 없음**: 단순한 구조 유지

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (Greenfield)
- **User wants tests**: Manual verification (MVP)
- **QA approach**: Playwright 기반 E2E + 수동 검증

### Automated Verification (Agent-Executable)

각 TODO는 다음 방식으로 검증:

**For Frontend/UI changes** (using playwright skill):
```
1. Navigate to target URL
2. Assert elements visible
3. Interact and verify state changes
4. Screenshot to .sisyphus/evidence/
```

**For Build/Lint**:
```bash
bun run build  # Exit code 0
bun run lint   # Exit code 0
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately) - 인프라 & 데이터:
├── Task 1: 프로젝트 초기 설정
├── Task 2: 데이터 모델 및 스키마 정의
└── Task 3: UI 디자인 시스템 구축

Wave 2 (After Wave 1) - 핵심 기능:
├── Task 4: 앱 목록 페이지 구현 [depends: 1, 2, 3]
├── Task 5: 앱 상세 페이지 구현 [depends: 1, 2, 3]
└── Task 6: 검색 및 필터 기능 [depends: 2, 3]

Wave 3 (After Wave 2) - 등록 & 마무리:
├── Task 7: 앱 등록 페이지 구현 [depends: 2, 4]
├── Task 8: GitHub API 연동 [depends: 1, 2]
└── Task 9: 최종 통합 및 배포 설정 [depends: 4, 5, 6, 7, 8]

Critical Path: Task 1 → Task 4 → Task 9
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4, 5, 6, 7, 8, 9 | 2, 3 |
| 2 | None | 4, 5, 6, 7, 8 | 1, 3 |
| 3 | None | 4, 5, 6 | 1, 2 |
| 4 | 1, 2, 3 | 7, 9 | 5, 6 |
| 5 | 1, 2, 3 | 9 | 4, 6 |
| 6 | 2, 3 | 9 | 4, 5 |
| 7 | 2, 4 | 9 | 8 |
| 8 | 1, 2 | 9 | 7 |
| 9 | 4, 5, 6, 7, 8 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 2, 3 | 3 parallel agents: infra, data, ui |
| 2 | 4, 5, 6 | 3 parallel agents after Wave 1 |
| 3 | 7, 8, 9 | Sequential (dependencies) |

---

## TODOs

---

### Task 1: 프로젝트 초기 설정

- [ ] 1. Next.js 15 프로젝트 초기화 및 기본 설정

  **What to do**:
  - `bunx create-next-app@latest` 실행 (App Router, TypeScript, Tailwind, ESLint)
  - shadcn/ui 초기화 (`bunx shadcn@latest init`)
  - 필수 패키지 설치: `@tanstack/react-query`, `fuse.js`, `@octokit/rest`, `zod`
  - 프로젝트 구조 생성
  - Tokamak 브랜드 컬러 Tailwind 설정
  - ESLint/Prettier 설정

  **Must NOT do**:
  - DB 연결 설정 (불필요)
  - 인증 라이브러리 설치 (MVP 범위 외)
  - 불필요한 보일러플레이트 추가

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 표준적인 프로젝트 초기화 작업, 명확한 단계별 절차
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Tailwind/shadcn 설정 최적화

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5, 6, 7, 8, 9
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - Tokamak trh-platform-ui 프로젝트 구조: shadcn/ui 설정 패턴
  - Tokamak Landing Page tailwind.config.ts: 브랜드 컬러 설정

  **External References**:
  - Next.js 15 공식 문서: https://nextjs.org/docs/getting-started
  - shadcn/ui 설치 가이드: https://ui.shadcn.com/docs/installation/next

  **Acceptance Criteria**:

  ```bash
  # Agent runs:
  cd /Users/son-yeongseong/Desktop/dev/tokamak-app-hub
  bun run dev &
  sleep 5
  curl -s http://localhost:3000 | grep -q "html"
  echo "Dev server running: $?"
  # Assert: Output is "Dev server running: 0"
  
  bun run build
  # Assert: Exit code 0
  
  bun run lint
  # Assert: Exit code 0
  ```

  **Evidence to Capture**:
  - [ ] `bun run build` 출력 (성공 메시지)
  - [ ] package.json 의존성 목록
  - [ ] tailwind.config.ts 브랜드 컬러 설정

  **Commit**: YES
  - Message: `chore: initialize Next.js 15 project with shadcn/ui and Tailwind`
  - Files: `package.json`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, `src/app/*`, `components.json`
  - Pre-commit: `bun run lint && bun run build`

---

### Task 2: 데이터 모델 및 스키마 정의

- [ ] 2. 앱 데이터 모델 및 JSON 스키마 정의

  **What to do**:
  - TypeScript 인터페이스 정의 (`src/types/app.ts`)
  - Zod 스키마 정의 (`src/schemas/app.ts`)
  - 카테고리 상수 정의 (`src/constants/categories.ts`)
  - 샘플 앱 데이터 JSON 파일 생성 (`data/apps.json`)
  - 데이터 로딩 유틸리티 함수 (`src/lib/apps.ts`)

  **Must NOT do**:
  - DB 마이그레이션 파일 생성 (JSON 기반)
  - 과도한 필드 추가 (MVP 필수 필드만)
  - 복잡한 관계형 모델링

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 타입/스키마 정의는 명확하고 단순한 작업
  - **Skills**: []
    - 특별한 스킬 불필요, 기본 TypeScript 지식으로 충분

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5, 6, 7, 8
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - Cal.com App 타입 정의 패턴 (연구 결과 참조)
  - Runtipi config.json 구조 (연구 결과 참조)

  **Data Model Specification**:
  ```typescript
  // src/types/app.ts
  export interface App {
    id: string;                    // UUID
    slug: string;                  // URL-friendly identifier
    name: string;                  // Display name
    description: string;           // Full description
    shortDescription: string;      // Card description (max 100 chars)
    
    // Categorization
    category: AppCategory;         // Primary category
    tags: string[];                // Free-form tags
    
    // GitHub Integration
    githubUrl: string;             // Repository URL
    githubOwner?: string;          // Auto-extracted
    githubRepo?: string;           // Auto-extracted
    stars?: number;                // Fetched from GitHub
    forks?: number;                // Fetched from GitHub
    lastCommit?: string;           // ISO date string
    language?: string;             // Primary language
    
    // Display
    author: string;                // Creator name
    authorAvatar?: string;         // Avatar URL
    logo?: string;                 // Custom logo URL (optional)
    
    // Status
    status: 'active' | 'beta' | 'deprecated';
    featured: boolean;
    
    // Timestamps
    createdAt: string;             // ISO date
    updatedAt: string;             // ISO date
  }

  export type AppCategory = 
    | 'dapp'           // Web3 Frontend Apps
    | 'smart-contract' // Solidity Packages
    | 'sdk'            // Libraries & SDKs
    | 'tool'           // CLI & Dev Tools
    | 'backend'        // Backend Services
    | 'ai'             // AI-Generated Apps
    | 'other';         // Miscellaneous
  ```

  **Acceptance Criteria**:

  ```bash
  # Agent runs:
  # 1. Type check
  cd /Users/son-yeongseong/Desktop/dev/tokamak-app-hub
  bunx tsc --noEmit
  # Assert: Exit code 0
  
  # 2. Validate sample data against schema
  bun -e "
    import { appSchema } from './src/schemas/app';
    import apps from './data/apps.json';
    apps.forEach(app => appSchema.parse(app));
    console.log('All ' + apps.length + ' apps validated');
  "
  # Assert: Output contains "validated"
  ```

  **Evidence to Capture**:
  - [ ] TypeScript 컴파일 성공 출력
  - [ ] Zod 스키마 검증 통과 메시지
  - [ ] data/apps.json 샘플 데이터 (최소 3개 앱)

  **Commit**: YES
  - Message: `feat: define app data model, Zod schema, and sample data`
  - Files: `src/types/app.ts`, `src/schemas/app.ts`, `src/constants/categories.ts`, `data/apps.json`, `src/lib/apps.ts`
  - Pre-commit: `bunx tsc --noEmit`

---

### Task 3: UI 디자인 시스템 구축

- [ ] 3. shadcn/ui 컴포넌트 및 Tokamak 테마 설정

  **What to do**:
  - shadcn/ui 컴포넌트 설치: Button, Card, Input, Badge, Select, Dialog, Skeleton
  - Tokamak 브랜드 CSS 변수 설정 (`src/app/globals.css`)
  - 레이아웃 컴포넌트: Header, Footer, Container
  - 공통 컴포넌트: Logo, CategoryBadge, TagChip

  **Must NOT do**:
  - 복잡한 애니메이션 추가 (MVP)
  - 다크모드 구현 (MVP 범위 외)
  - 커스텀 아이콘 제작 (Lucide 사용)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 컴포넌트 구축, 디자인 시스템 설정
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 반응형 디자인, 접근성, 시각적 품질

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 4, 5, 6
  - **Blocked By**: None (can start immediately, but Task 1 provides project setup)

  **References**:

  **Pattern References**:
  - trh-platform-ui/src/components/ui/* - shadcn/ui 컴포넌트 패턴
  - tokamak-landing-page globals.css - Tokamak 브랜드 컬러

  **Brand Specification**:
  ```css
  :root {
    /* Tokamak Brand Colors */
    --tokamak-blue: #0078FF;
    --tokamak-blue-dark: #0045C4;
    --tokamak-black: #1C1C1C;
    --background: #FAFBFC;
    --foreground: #171717;
    --muted: #666666;
  }
  ```

  **Acceptance Criteria**:

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000
  2. Assert: Header with Tokamak logo visible
  3. Assert: Primary button has background color #0078FF
  4. Resize viewport to 375px width (mobile)
  5. Assert: Layout adapts responsively
  6. Screenshot: .sisyphus/evidence/task-3-design-system.png
  ```

  **Evidence to Capture**:
  - [ ] Desktop 레이아웃 스크린샷
  - [ ] Mobile 레이아웃 스크린샷
  - [ ] Button 컴포넌트 Tokamak Blue 적용 확인

  **Commit**: YES
  - Message: `feat: setup UI design system with Tokamak branding`
  - Files: `src/app/globals.css`, `src/components/ui/*`, `src/components/layout/*`, `src/components/common/*`
  - Pre-commit: `bun run lint`

---

### Task 4: 앱 목록 페이지 구현

- [ ] 4. 메인 페이지 앱 카드 그리드 구현

  **What to do**:
  - AppCard 컴포넌트 (이름, 설명, 카테고리, 별점, 태그)
  - AppGrid 컴포넌트 (반응형 그리드 레이아웃)
  - 메인 페이지 (`src/app/page.tsx`) - Server Component
  - 로딩 스켈레톤 UI
  - Empty State UI (앱이 없을 때)

  **Must NOT do**:
  - 무한 스크롤 (MVP - 페이지네이션도 제외, 전체 로드)
  - 복잡한 정렬 옵션
  - 앱 비교 기능

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 카드 UI, 그리드 레이아웃, 반응형 디자인
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 카드 디자인, hover 효과, 시각적 계층

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 7, 9
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **Pattern References**:
  - 연구 결과의 AppCard 패턴 (Cal.com, Runtipi)
  - shadcn/ui Card 컴포넌트 사용

  **UI Specification**:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │  [Logo] Tokamak App Hub          [Search] [Submit App]      │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  [Category Tabs: All | dApps | SDKs | Tools | AI | ...]    │
  │                                                             │
  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
  │  │  Logo   │  │  Logo   │  │  Logo   │  │  Logo   │        │
  │  │ AppName │  │ AppName │  │ AppName │  │ AppName │        │
  │  │ Short.. │  │ Short.. │  │ Short.. │  │ Short.. │        │
  │  │ ⭐ 123  │  │ ⭐ 456  │  │ ⭐ 789  │  │ ⭐ 101  │        │
  │  │ [dapp] │  │ [sdk]   │  │ [tool]  │  │ [ai]    │        │
  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
  │                                                             │
  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
  │  │  ...    │  │  ...    │  │  ...    │  │  ...    │        │
  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
  
  반응형: Desktop 4열 | Tablet 3열 | Mobile 1열
  ```

  **Acceptance Criteria**:

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000
  2. Wait for: selector "[data-testid='app-grid']" to be visible
  3. Assert: At least 3 app cards are displayed
  4. Assert: Each card shows name, description, stars count
  5. Click: First app card
  6. Assert: Navigates to /apps/[slug]
  7. Screenshot: .sisyphus/evidence/task-4-app-grid.png
  
  # Mobile test:
  8. Set viewport to 375x667
  9. Assert: Cards display in single column
  10. Screenshot: .sisyphus/evidence/task-4-app-grid-mobile.png
  ```

  **Evidence to Capture**:
  - [ ] 앱 그리드 Desktop 스크린샷
  - [ ] 앱 그리드 Mobile 스크린샷
  - [ ] 앱 카드 클릭 → 상세 페이지 이동 확인

  **Commit**: YES
  - Message: `feat: implement app listing page with card grid`
  - Files: `src/app/page.tsx`, `src/components/app/AppCard.tsx`, `src/components/app/AppGrid.tsx`, `src/components/app/AppCardSkeleton.tsx`
  - Pre-commit: `bun run lint && bun run build`

---

### Task 5: 앱 상세 페이지 구현

- [ ] 5. 앱 상세 페이지 동적 라우팅 구현

  **What to do**:
  - 동적 라우트 페이지 (`src/app/apps/[slug]/page.tsx`)
  - 앱 상세 정보 표시: 이름, 설명, README (있으면)
  - GitHub 정보 섹션: Stars, Forks, Last Commit, Language
  - 태그 및 카테고리 표시
  - "GitHub에서 보기" CTA 버튼
  - 404 처리 (존재하지 않는 앱)
  - generateStaticParams로 빌드 타임 생성

  **Must NOT do**:
  - README 마크다운 렌더링 (MVP - 링크로 대체)
  - 댓글/리뷰 기능
  - 관련 앱 추천

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 상세 페이지 레이아웃, 정보 표시 UI
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 정보 계층 구조, 레이아웃 디자인

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **UI Specification**:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │  ← Back to Apps                                             │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  [Logo/Avatar]                                              │
  │                                                             │
  │  App Name                                    [View on GitHub]│
  │  by Author Name                                             │
  │                                                             │
  │  Short description of the app goes here...                  │
  │                                                             │
  │  ┌──────────┬──────────┬──────────┬──────────┐             │
  │  │ ⭐ Stars │ 🍴 Forks │ 📅 Updated│ 💻 Lang  │             │
  │  │   1,234  │    56    │  2 days  │TypeScript│             │
  │  └──────────┴──────────┴──────────┴──────────┘             │
  │                                                             │
  │  Category: [dapp]    Tags: [web3] [defi] [token]           │
  │                                                             │
  │  ─────────────────────────────────────────────             │
  │                                                             │
  │  ## Description                                             │
  │                                                             │
  │  Full description of the application. This can be          │
  │  multiple paragraphs explaining what the app does...       │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
  ```

  **Acceptance Criteria**:

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000/apps/sample-app (use actual slug from data)
  2. Wait for: page to load completely
  3. Assert: App name is visible
  4. Assert: GitHub stats (stars, forks) are displayed
  5. Assert: "View on GitHub" button is visible
  6. Click: "View on GitHub" button
  7. Assert: New tab opens with GitHub URL
  8. Screenshot: .sisyphus/evidence/task-5-app-detail.png
  
  # 404 test:
  9. Navigate to: http://localhost:3000/apps/non-existent-app
  10. Assert: 404 or "Not Found" message is displayed
  ```

  **Evidence to Capture**:
  - [ ] 앱 상세 페이지 스크린샷
  - [ ] GitHub 통계 표시 확인
  - [ ] 404 페이지 동작 확인

  **Commit**: YES
  - Message: `feat: implement app detail page with GitHub stats`
  - Files: `src/app/apps/[slug]/page.tsx`, `src/app/apps/[slug]/not-found.tsx`, `src/components/app/AppDetail.tsx`, `src/components/app/GitHubStats.tsx`
  - Pre-commit: `bun run build`

---

### Task 6: 검색 및 필터 기능 구현

- [ ] 6. 클라이언트 사이드 검색 및 카테고리/태그 필터

  **What to do**:
  - SearchBar 컴포넌트 (디바운스 300ms)
  - CategoryFilter 컴포넌트 (탭 또는 셀렉트)
  - TagFilter 컴포넌트 (멀티셀렉트 또는 클릭 토글)
  - Fuse.js 설정 (name, description, tags 검색)
  - URL 쿼리 파라미터 동기화 (`?q=search&category=dapp&tags=web3`)
  - 활성 필터 표시 및 초기화 버튼

  **Must NOT do**:
  - 서버 사이드 검색 (클라이언트 Fuse.js 사용)
  - 고급 검색 문법 (AND, OR 등)
  - 검색 히스토리/자동완성

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 검색 UX, 필터 인터랙션
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 인터랙션 디자인, 상태 관리

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 2, 3

  **References**:

  **External References**:
  - Fuse.js 문서: https://fusejs.io/
  - nuqs (URL state): https://nuqs.47ng.com/

  **Acceptance Criteria**:

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000
  2. Type in search box: "token"
  3. Wait 500ms for debounce
  4. Assert: Only apps containing "token" in name/description are shown
  5. Assert: URL contains ?q=token
  6. Click: Category filter "sdk"
  7. Assert: Only SDK category apps are shown
  8. Assert: URL contains ?category=sdk
  9. Click: "Clear filters" button
  10. Assert: All apps are shown again
  11. Screenshot: .sisyphus/evidence/task-6-search-filter.png
  ```

  **Evidence to Capture**:
  - [ ] 검색 결과 필터링 스크린샷
  - [ ] 카테고리 필터 적용 스크린샷
  - [ ] URL 쿼리 파라미터 동기화 확인

  **Commit**: YES
  - Message: `feat: implement search and filter functionality with URL sync`
  - Files: `src/components/search/SearchBar.tsx`, `src/components/filter/CategoryFilter.tsx`, `src/components/filter/TagFilter.tsx`, `src/hooks/useAppFilter.ts`, `src/lib/search.ts`
  - Pre-commit: `bun run lint`

---

### Task 7: 앱 등록 페이지 구현

- [ ] 7. GitHub Issue 기반 앱 등록 폼

  **What to do**:
  - 등록 폼 페이지 (`src/app/submit/page.tsx`)
  - 폼 필드: GitHub URL (필수), 카테고리 (선택), 태그 (선택), 추가 설명 (선택)
  - GitHub URL 입력 시 미리보기 (저장소 정보 표시)
  - 폼 제출 → GitHub Issue 생성 (pre-filled URL로 리다이렉트)
  - Zod 기반 폼 검증
  - 성공/에러 상태 UI

  **Must NOT do**:
  - 직접 JSON 파일 수정 (불가능)
  - GitHub OAuth 구현 (MVP)
  - 자동 PR 생성 (복잡도 높음)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 폼 디자인, 사용자 피드백 UI
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 폼 UX, 검증 피드백

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 8)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 2, 4

  **References**:

  **Workflow Specification**:
  ```
  사용자 흐름:
  1. /submit 페이지 방문
  2. GitHub URL 입력
  3. (선택) 카테고리/태그 선택
  4. "Submit App" 클릭
  5. GitHub Issue 생성 페이지로 리다이렉트 (pre-filled body)
  6. 사용자가 Issue 생성
  7. 관리자가 Issue 검토 후 JSON에 추가 (수동)
  
  GitHub Issue URL 형식:
  https://github.com/tokamak-network/tokamak-app-hub/issues/new?
    title=App+Submission:+{app-name}&
    body={encoded-form-data}&
    labels=app-submission
  ```

  **Acceptance Criteria**:

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000/submit
  2. Assert: Form with GitHub URL input is visible
  3. Type: "https://github.com/tokamak-network/titan-sdk" in URL field
  4. Wait: For repository preview to load
  5. Assert: Repository name and description are displayed
  6. Select: Category "sdk"
  7. Click: "Submit App" button
  8. Assert: Redirects to GitHub new issue page OR shows success message
  9. Screenshot: .sisyphus/evidence/task-7-submit-form.png
  
  # Validation test:
  10. Navigate to: http://localhost:3000/submit
  11. Type: "not-a-valid-url" in URL field
  12. Click: Submit
  13. Assert: Validation error message is displayed
  ```

  **Evidence to Capture**:
  - [ ] 등록 폼 스크린샷
  - [ ] GitHub URL 입력 후 미리보기 스크린샷
  - [ ] 검증 에러 메시지 스크린샷

  **Commit**: YES
  - Message: `feat: implement app submission form with GitHub Issue integration`
  - Files: `src/app/submit/page.tsx`, `src/components/submit/SubmitForm.tsx`, `src/components/submit/RepoPreview.tsx`, `src/lib/github-issue.ts`
  - Pre-commit: `bun run lint && bun run build`

---

### Task 8: GitHub API 연동 최적화

- [ ] 8. 서버 사이드 GitHub API 연동 및 캐싱

  **What to do**:
  - Octokit 설정 (`src/lib/github.ts`)
  - 저장소 정보 가져오기 함수
  - 빌드 타임 데이터 페칭 (generateStaticParams)
  - ISR revalidate 설정 (1시간)
  - Rate limit 처리 및 에러 핸들링
  - 환경 변수 설정 (GITHUB_TOKEN)

  **Must NOT do**:
  - 클라이언트 사이드 GitHub API 호출 (rate limit 문제)
  - GitHub GraphQL API (복잡도 증가)
  - Webhook 설정 (MVP 범위 외)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: API 연동은 명확한 패턴 따름
  - **Skills**: []
    - Octokit 사용법은 표준적

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 2

  **References**:

  **External References**:
  - Octokit REST API: https://octokit.github.io/rest.js/
  - Next.js ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration

  **API Specification**:
  ```typescript
  // src/lib/github.ts
  import { Octokit } from "@octokit/rest";

  const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN 
  });

  export async function getRepoInfo(owner: string, repo: string) {
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
  }
  ```

  **Acceptance Criteria**:

  ```bash
  # Agent runs:
  cd /Users/son-yeongseong/Desktop/dev/tokamak-app-hub
  
  # 1. Verify env setup
  grep -q "GITHUB_TOKEN" .env.local.example || echo "GITHUB_TOKEN not in example"
  # Assert: GITHUB_TOKEN is documented
  
  # 2. Test API function
  GITHUB_TOKEN=$GITHUB_TOKEN bun -e "
    import { getRepoInfo } from './src/lib/github';
    const info = await getRepoInfo('tokamak-network', 'tokamak-app-hub');
    console.log('Stars:', info.stars);
    console.log('Success: true');
  "
  # Assert: Output contains "Success: true"
  
  # 3. Build with ISR
  bun run build
  # Assert: Exit code 0, no GitHub API errors
  ```

  **Evidence to Capture**:
  - [ ] GitHub API 응답 샘플 (stars, forks 포함)
  - [ ] 빌드 로그 (ISR 페이지 생성 확인)
  - [ ] Rate limit 에러 핸들링 코드

  **Commit**: YES
  - Message: `feat: integrate GitHub API with server-side caching`
  - Files: `src/lib/github.ts`, `.env.local.example`, `src/app/apps/[slug]/page.tsx` (수정)
  - Pre-commit: `bun run build`

---

### Task 9: 최종 통합 및 배포 설정

- [ ] 9. 전체 통합, 최적화, 배포 준비

  **What to do**:
  - 모든 컴포넌트/페이지 통합 테스트
  - SEO 메타데이터 설정 (title, description, og:image)
  - Vercel 배포 설정 (vercel.json 또는 자동)
  - 환경 변수 문서화 (README 업데이트)
  - Lighthouse 성능 최적화 (80점 이상 목표)
  - 최종 빌드 검증

  **Must NOT do**:
  - CI/CD 파이프라인 구축 (MVP)
  - 자동 테스트 스크립트 (수동 검증)
  - 커스텀 도메인 설정 (추후)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 표준적인 배포 설정 작업
  - **Skills**: [`playwright`]
    - `playwright`: 최종 E2E 검증

  **Parallelization**:
  - **Can Run In Parallel**: NO (final integration)
  - **Parallel Group**: Sequential (Wave 3 마지막)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 4, 5, 6, 7, 8

  **References**:

  **External References**:
  - Vercel 배포 가이드: https://vercel.com/docs/deployments/overview
  - Next.js Metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

  **Acceptance Criteria**:

  ```bash
  # Agent runs:
  cd /Users/son-yeongseong/Desktop/dev/tokamak-app-hub
  
  # 1. Final build
  bun run build
  # Assert: Exit code 0
  
  # 2. Lint
  bun run lint
  # Assert: Exit code 0
  
  # 3. Start production server
  bun run start &
  sleep 5
  
  # 4. Check all routes
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
  # Assert: 200
  
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/submit
  # Assert: 200
  ```

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:3000
  2. Run Lighthouse audit
  3. Assert: Performance score >= 80
  4. Assert: Accessibility score >= 90
  5. Navigate through all pages
  6. Assert: No console errors
  7. Screenshot: .sisyphus/evidence/task-9-final-test.png
  ```

  **Evidence to Capture**:
  - [ ] 최종 빌드 성공 로그
  - [ ] Lighthouse 점수 스크린샷
  - [ ] 모든 페이지 동작 확인 스크린샷

  **Commit**: YES
  - Message: `chore: finalize integration and prepare for deployment`
  - Files: `README.md`, `src/app/layout.tsx` (metadata), `.env.local.example`
  - Pre-commit: `bun run lint && bun run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `chore: initialize Next.js 15 project with shadcn/ui and Tailwind` | package.json, tailwind.config.ts, etc. | `bun run build` |
| 2 | `feat: define app data model, Zod schema, and sample data` | src/types/*, src/schemas/*, data/apps.json | `bunx tsc --noEmit` |
| 3 | `feat: setup UI design system with Tokamak branding` | src/components/ui/*, globals.css | `bun run lint` |
| 4 | `feat: implement app listing page with card grid` | src/app/page.tsx, src/components/app/* | `bun run build` |
| 5 | `feat: implement app detail page with GitHub stats` | src/app/apps/[slug]/* | `bun run build` |
| 6 | `feat: implement search and filter functionality with URL sync` | src/components/search/*, src/hooks/* | `bun run lint` |
| 7 | `feat: implement app submission form with GitHub Issue integration` | src/app/submit/*, src/lib/github-issue.ts | `bun run build` |
| 8 | `feat: integrate GitHub API with server-side caching` | src/lib/github.ts, .env.local.example | `bun run build` |
| 9 | `chore: finalize integration and prepare for deployment` | README.md, metadata | `bun run build` |

---

## Success Criteria

### Verification Commands
```bash
# 빌드 성공
bun run build  # Expected: Exit code 0

# 린트 통과
bun run lint   # Expected: Exit code 0

# 개발 서버 실행
bun run dev    # Expected: http://localhost:3000 접근 가능

# 프로덕션 서버 실행
bun run start  # Expected: 모든 페이지 200 응답
```

### Final Checklist
- [ ] 모든 "Must Have" 기능 구현 완료
- [ ] 모든 "Must NOT Have" 항목 준수
- [ ] 9개 커밋 모두 완료
- [ ] README 문서 업데이트
- [ ] Vercel 배포 가능 상태

---

## Appendix: 프로젝트 폴더 구조

```
tokamak-app-hub/
├── .sisyphus/                    # 계획 및 증거 파일
│   ├── plans/
│   │   └── app-hub-marketplace.md
│   └── evidence/
├── data/
│   └── apps.json                 # 앱 데이터 (JSON DB)
├── public/
│   └── assets/                   # 정적 자산
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 메인 페이지 (앱 목록)
│   │   ├── globals.css           # 글로벌 스타일
│   │   ├── apps/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # 앱 상세 페이지
│   │   │       └── not-found.tsx # 404 페이지
│   │   └── submit/
│   │       └── page.tsx          # 앱 등록 페이지
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   ├── layout/               # Header, Footer, Container
│   │   ├── common/               # Logo, Badge, etc.
│   │   ├── app/                  # AppCard, AppGrid, AppDetail
│   │   ├── search/               # SearchBar
│   │   ├── filter/               # CategoryFilter, TagFilter
│   │   └── submit/               # SubmitForm, RepoPreview
│   ├── hooks/
│   │   └── useAppFilter.ts       # 필터 상태 관리
│   ├── lib/
│   │   ├── apps.ts               # 앱 데이터 로딩
│   │   ├── github.ts             # GitHub API 연동
│   │   ├── github-issue.ts       # Issue URL 생성
│   │   └── search.ts             # Fuse.js 설정
│   ├── types/
│   │   └── app.ts                # App 타입 정의
│   ├── schemas/
│   │   └── app.ts                # Zod 스키마
│   └── constants/
│       └── categories.ts         # 카테고리 상수
├── .env.local.example            # 환경 변수 예시
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Appendix: 기술 스택 요약

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Bun | latest |
| Framework | Next.js | 15.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Search | Fuse.js | 7.x |
| HTTP Client | @octokit/rest | 21.x |
| Validation | Zod | 3.x |
| State (URL) | nuqs | 2.x |

---

## Appendix: 예상 일정

| Phase | Tasks | Duration | Cumulative |
|-------|-------|----------|------------|
| Wave 1 | 1, 2, 3 (parallel) | 2-3 days | 2-3 days |
| Wave 2 | 4, 5, 6 (parallel) | 3-4 days | 5-7 days |
| Wave 3 | 7, 8, 9 (semi-parallel) | 2-3 days | 7-10 days |
| **Total** | **9 tasks** | **~2 weeks** | |

*참고: AI 에이전트 실행 시 병렬화로 인해 실제 소요 시간은 더 짧을 수 있음.*
