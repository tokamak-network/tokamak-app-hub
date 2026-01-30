# Tokamak App Hub

Tokamak Network 팀을 위한 내부 앱/패키지 마켓플레이스입니다. AI가 생성한 앱과 패키지를 등록하고 검색할 수 있습니다.

## 주요 기능

### 앱 브라우징
- 카테고리별 앱 검색 (dApp, SDK, Tool, Smart Contract, AI)
- 실시간 퍼지 검색
- GitHub 통계 표시 (stars, forks)

### 앱 제출
- GitHub Issue를 통한 앱 제출
- `approved` 라벨 추가 시 자동 등록 (GitHub Actions)

### 저장소 생성
- GitHub OAuth 인증 후 `tokamak-network` 조직에 저장소 자동 생성
- 생성자를 collaborator로 자동 초대 (write 권한)
- 허용된 사용자만 생성 가능

## 시작하기

### 사전 요구사항

- Node.js 18+
- pnpm

### 설치

```bash
git clone https://github.com/tokamak-network/tokamak-app-hub.git
cd tokamak-app-hub
pnpm install
```

### 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 편집하여 필요한 값들을 설정합니다:

| 변수 | 설명 | 필수 |
|------|------|------|
| `AUTH_SECRET` | NextAuth.js 시크릿 (`openssl rand -base64 32`) | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | Yes |
| `GITHUB_ADMIN_TOKEN` | 조직 관리자 PAT (`repo`, `admin:org` 스코프) | Yes |
| `ALLOWED_USERS` | 저장소 생성 허용 GitHub username 목록 (콤마 구분) | Yes |
| `GITHUB_TOKEN` | GitHub API rate limit 용 (선택) | No |

### GitHub OAuth App 생성

1. https://github.com/settings/developers 접속
2. "OAuth Apps" → "New OAuth App" 클릭
3. 설정:
   - Application name: `Tokamak App Hub`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Client ID와 Client Secret을 `.env.local`에 추가

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 확인

## 사용 방법

### 앱 검색

1. 메인 페이지에서 검색어 입력
2. 카테고리 필터로 원하는 유형 선택
3. 앱 카드 클릭하여 상세 정보 확인

### 앱 제출

1. 헤더의 "Submit App" 클릭
2. GitHub 저장소 URL 입력
3. 카테고리 선택 및 설명 작성
4. 제출하면 GitHub Issue가 생성됨
5. 관리자가 `approved` 라벨 추가 시 자동 등록

### 저장소 생성

1. 헤더의 "Create Repo" 클릭
2. "Sign in with GitHub" 버튼으로 인증
3. 저장소 이름 및 설명 입력
4. "Create Repository" 클릭
5. `tokamak-network` 조직에 저장소가 생성되고 collaborator로 초대됨

**제한 사항:**
- 허용된 사용자만 생성 가능
- 시간당 5개 저장소 생성 제한
- 예약된 이름 사용 불가 (`.github`, `api`, `admin` 등)

## 프로젝트 구조

```
tokamak-app-hub/
├── data/
│   └── apps.json              # 앱 데이터
├── src/
│   ├── app/
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── submit/            # 앱 제출 페이지
│   │   ├── create-repo/       # 저장소 생성 페이지
│   │   ├── apps/[slug]/       # 앱 상세 페이지
│   │   └── api/
│   │       ├── auth/          # NextAuth.js API
│   │       └── repos/         # 저장소 생성 API
│   ├── components/
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   ├── layout/            # Header, Footer
│   │   ├── auth/              # SessionProvider
│   │   ├── create-repo/       # CreateRepoForm
│   │   └── submit/            # SubmitForm
│   ├── auth.ts                # NextAuth.js 설정
│   └── lib/                   # 유틸리티 함수
└── .github/
    └── workflows/
        └── auto-add-app.yml   # 앱 자동 등록 워크플로우
```

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Auth**: NextAuth.js v5 (GitHub OAuth)
- **Search**: Fuse.js
- **Validation**: Zod
- **GitHub API**: Octokit

## 스크립트

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint 실행
```

## 라이선스

MIT
