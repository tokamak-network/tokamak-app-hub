# 실행 TODO 리스트
## Tokamak App Hub - Detailed Task List

---

## 전체 작업 요약

| # | 작업 | Category | Skills | 우선순위 | 의존성 |
|---|------|----------|--------|----------|--------|
| 1 | Next.js 15 프로젝트 초기화 | `quick` | `frontend-ui-ux` | P0 | 없음 |
| 2 | 데이터 모델 및 스키마 정의 | `quick` | - | P0 | 없음 |
| 3 | UI 디자인 시스템 구축 | `visual-engineering` | `frontend-ui-ux` | P0 | 없음 |
| 4 | 앱 목록 페이지 구현 | `visual-engineering` | `frontend-ui-ux` | P0 | 1, 2, 3 |
| 5 | 앱 상세 페이지 구현 | `visual-engineering` | `frontend-ui-ux` | P0 | 1, 2, 3 |
| 6 | 검색 및 필터 기능 구현 | `visual-engineering` | `frontend-ui-ux` | P0 | 2, 3 |
| 7 | 앱 등록 페이지 구현 | `visual-engineering` | `frontend-ui-ux` | P1 | 2, 4 |
| 8 | GitHub API 연동 최적화 | `quick` | - | P1 | 1, 2 |
| 9 | 최종 통합 및 배포 설정 | `quick` | `playwright` | P1 | 4-8 |

---

## 상세 작업 항목

---

### Task 1: Next.js 15 프로젝트 초기화 및 기본 설정

**What to do**:
- `bunx create-next-app@latest` 실행 (App Router, TypeScript, Tailwind, ESLint)
- shadcn/ui 초기화 (`bunx shadcn@latest init`)
- 필수 패키지 설치: `@tanstack/react-query`, `fuse.js`, `@octokit/rest`, `zod`, `nuqs`
- Tokamak 브랜드 컬러 Tailwind 설정

**Agent Profile**:
```
category: quick
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
```bash
bun run dev    # 개발 서버 실행
bun run build  # 빌드 성공
bun run lint   # 린트 통과
```

**Commit**: `chore: initialize Next.js 15 project with shadcn/ui and Tailwind`

---

### Task 2: 앱 데이터 모델 및 JSON 스키마 정의

**What to do**:
- TypeScript 인터페이스 정의 (`src/types/app.ts`)
- Zod 스키마 정의 (`src/schemas/app.ts`)
- 카테고리 상수 정의 (`src/constants/categories.ts`)
- 샘플 앱 데이터 JSON 파일 생성 (`data/apps.json`)
- 데이터 로딩 유틸리티 함수 (`src/lib/apps.ts`)

**Agent Profile**:
```
category: quick
skills: []
```

**Acceptance Criteria**:
```bash
bunx tsc --noEmit  # 타입 체크 통과
# Zod 스키마로 샘플 데이터 검증 통과
```

**Commit**: `feat: define app data model, Zod schema, and sample data`

---

### Task 3: shadcn/ui 컴포넌트 및 Tokamak 테마 설정

**What to do**:
- shadcn/ui 컴포넌트 설치: Button, Card, Input, Badge, Select, Dialog, Skeleton, Tabs
- Tokamak 브랜드 CSS 변수 설정 (`src/app/globals.css`)
- 레이아웃 컴포넌트: Header, Footer, Container
- 공통 컴포넌트: Logo, CategoryBadge, TagChip

**Agent Profile**:
```
category: visual-engineering
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
- 브랜드 컬러 (#0078FF) 적용 확인
- 반응형 레이아웃 동작 확인

**Commit**: `feat: setup UI design system with Tokamak branding`

---

### Task 4: 메인 페이지 앱 카드 그리드 구현

**What to do**:
- AppCard 컴포넌트 (이름, 설명, 카테고리, 별점, 태그)
- AppGrid 컴포넌트 (반응형 그리드: 1/2/3/4열)
- 메인 페이지 (`src/app/page.tsx`) - Server Component
- 로딩 스켈레톤 UI
- Empty State UI

**Agent Profile**:
```
category: visual-engineering
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
- 앱 카드 3개 이상 표시 확인
- 모바일에서 1열 그리드 확인
- 카드 클릭 시 상세 페이지 이동

**Commit**: `feat: implement app listing page with card grid`

---

### Task 5: 앱 상세 페이지 동적 라우팅 구현

**What to do**:
- 동적 라우트 페이지 (`src/app/apps/[slug]/page.tsx`)
- GitHub 정보 섹션: Stars, Forks, Last Commit, Language
- "GitHub에서 보기" CTA 버튼
- 404 처리 (`not-found.tsx`)
- `generateStaticParams`로 빌드 타임 생성

**Agent Profile**:
```
category: visual-engineering
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
- 상세 페이지 GitHub 통계 표시 확인
- 404 페이지 동작 확인

**Commit**: `feat: implement app detail page with GitHub stats`

---

### Task 6: 클라이언트 사이드 검색 및 필터

**What to do**:
- SearchBar 컴포넌트 (디바운스 300ms)
- CategoryFilter 컴포넌트 (탭 스타일)
- TagFilter 컴포넌트 (클릭 토글)
- Fuse.js 설정 (name, description, tags 검색)
- URL 쿼리 파라미터 동기화 (nuqs)
- 활성 필터 표시 및 "Clear All" 버튼

**Agent Profile**:
```
category: visual-engineering
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
- 검색 → 필터링 동작 확인
- URL 파라미터 동기화 확인 (`?q=test&category=sdk`)

**Commit**: `feat: implement search and filter functionality with URL sync`

---

### Task 7: GitHub Issue 기반 앱 등록 폼

**What to do**:
- 등록 폼 페이지 (`src/app/submit/page.tsx`)
- 폼 필드: GitHub URL, 카테고리, 태그, 추가 설명
- GitHub URL 입력 시 저장소 정보 미리보기 (API Route)
- "Submit App" 버튼 클릭 시 GitHub Issue 생성 페이지로 리다이렉트
- Issue 템플릿 URL 생성 유틸리티 (`src/lib/github-issue.ts`)

**Agent Profile**:
```
category: visual-engineering
skills: [frontend-ui-ux]
```

**Acceptance Criteria**:
- GitHub URL 입력 → 미리보기 표시
- Submit 클릭 → GitHub Issue 페이지 열림 (pre-filled body)

**Commit**: `feat: implement app submission form with GitHub Issue integration`

---

### Task 8: GitHub API 연동 최적화

**What to do**:
- Octokit REST 클라이언트 설정 (`src/lib/github.ts`)
- 서버 사이드 데이터 페칭 (Server Components)
- ISR 캐싱 설정 (`revalidate = 3600`)
- Rate Limit 에러 핸들링 (fallback 표시)
- 환경 변수 설정 (.env.local.example)

**Agent Profile**:
```
category: quick
skills: []
```

**Acceptance Criteria**:
- GitHub 통계 데이터 정상 표시
- Rate Limit 도달 시 graceful degradation

**Commit**: `feat: optimize GitHub API integration with ISR caching`

---

### Task 9: 최종 통합 및 배포 설정

**What to do**:
- 전체 페이지 통합 테스트
- Vercel 배포 설정 확인
- Lighthouse 점수 검증 (80점 이상)
- README.md 업데이트
- 프로덕션 빌드 테스트

**Agent Profile**:
```
category: quick
skills: [playwright]
```

**Acceptance Criteria**:
- `bun run build` 성공
- Lighthouse 점수 80점 이상
- 모든 페이지 정상 동작

**Commit**: `chore: finalize integration and deployment configuration`

---

## 실행 명령어 예시

### Wave 1 (병렬 실행)

```bash
# Task 1, 2, 3을 병렬로 실행
delegate_task(category="quick", skills=["frontend-ui-ux"], prompt="Task 1...")
delegate_task(category="quick", skills=[], prompt="Task 2...")
delegate_task(category="visual-engineering", skills=["frontend-ui-ux"], prompt="Task 3...")
```

### Wave 2 (Wave 1 완료 후 병렬 실행)

```bash
# Task 4, 5, 6을 병렬로 실행
delegate_task(category="visual-engineering", skills=["frontend-ui-ux"], prompt="Task 4...")
delegate_task(category="visual-engineering", skills=["frontend-ui-ux"], prompt="Task 5...")
delegate_task(category="visual-engineering", skills=["frontend-ui-ux"], prompt="Task 6...")
```

### Wave 3 (Wave 2 완료 후)

```bash
# Task 7, 8을 병렬로 실행
delegate_task(category="visual-engineering", skills=["frontend-ui-ux"], prompt="Task 7...")
delegate_task(category="quick", skills=[], prompt="Task 8...")

# Task 9는 7, 8 완료 후 실행
delegate_task(category="quick", skills=["playwright"], prompt="Task 9...")
```

---

## 체크리스트

### MVP 릴리즈 체크리스트

- [ ] Task 1: 프로젝트 초기화 완료
- [ ] Task 2: 데이터 모델 정의 완료
- [ ] Task 3: UI 디자인 시스템 완료
- [ ] Task 4: 앱 목록 페이지 완료
- [ ] Task 5: 앱 상세 페이지 완료
- [ ] Task 6: 검색/필터 기능 완료
- [ ] Task 7: 앱 등록 페이지 완료
- [ ] Task 8: GitHub API 최적화 완료
- [ ] Task 9: 배포 및 통합 테스트 완료

### 품질 체크리스트

- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 경고 없음
- [ ] Lighthouse Performance 80+
- [ ] Lighthouse Accessibility 90+
- [ ] 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)
- [ ] 크로스 브라우저 테스트 (Chrome, Firefox, Safari)
