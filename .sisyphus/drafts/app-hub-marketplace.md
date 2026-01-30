# Draft: Tokamak App Hub 마켓플레이스

## 연구 결과 요약

### Tokamak Network 기술 스택 패턴
- **프레임워크**: Next.js 14-16 (App Router), React 18-19, TypeScript
- **UI**: shadcn/ui + Radix UI (최신) 또는 Chakra UI (기존)
- **스타일링**: Tailwind CSS 3-4
- **Web3**: wagmi v2 + viem + RainbowKit
- **상태관리**: TanStack Query
- **브랜드 컬러**: #0078FF (Tokamak Blue)
- **폰트**: Proxima Nova (브랜딩), Open Sans/Geist (본문)

### 마켓플레이스 모범 사례 (Cal.com, Runtipi 참고)
- Server Components + ISR 패턴으로 카탈로그 구현
- GitHub API는 ISR로 1시간 캐싱 (rate limit 대응)
- Faceted Search (카테고리 필터 + 검색 + 활성 필터 표시)
- Zod 스키마로 앱 메타데이터 검증

---

## 요구사항 (수집 중)

### 확정된 사항
- **대상 사용자**: Tokamak Network 내부 개발자
- **콘텐츠**: AI 생성 앱/패키지 (월 수십 개)
- **핵심 기능**: 앱 목록 조회, 검색/필터, 등록

### 미확정 (사용자 답변 필요)

#### 1. 인증 방식
- [ ] GitHub OAuth (조직 멤버 전용)
- [ ] 별도 SSO/LDAP
- [ ] 초기에는 Public (인증 없음)
- **결정됨**: 

#### 2. 앱 등록 방식
- [ ] GitHub URL 입력 → 자동 정보 가져오기
- [ ] 수동 메타데이터 입력
- [ ] 특정 태그/토픽 있는 저장소 자동 수집
- [ ] 위 방식 조합
- **결정됨**: 

#### 3. 콘텐츠 유형
- [ ] Web3 dApps (프론트엔드)
- [ ] 스마트 컨트랙트 패키지
- [ ] SDK/라이브러리
- [ ] CLI 도구
- [ ] 백엔드 서비스
- [ ] 전부 해당
- **결정됨**: 

#### 4. 데이터 저장소
- [ ] 풀스택 (DB 포함 - Supabase, PlanetScale 등)
- [ ] JSON 파일 기반 (GitHub 저장소 자체가 DB)
- [ ] 기존 백엔드 인프라 사용
- **결정됨**: 

#### 5. 디자인 방향
- [ ] Tokamak 브랜딩 따르기 (shadcn/ui + Tokamak Blue)
- [ ] 모던/미니멀 (Apple App Store)
- [ ] 개발자 친화적 (npm/GitHub Marketplace)
- [ ] 대시보드 스타일 (Vercel/Linear)
- **결정됨**: 

#### 6. MVP 기능 범위
- [ ] 앱 목록 조회 (카드 그리드)
- [ ] 검색 및 필터링
- [ ] 앱 상세 페이지
- [ ] 앱 등록/수정
- [ ] 카테고리/태그 시스템
- [ ] 인기도/평점 (나중에?)
- **결정됨**: 

---

## 기술적 제안 (연구 기반)

### 권장 기술 스택
```
프레임워크: Next.js 15 + React 19 + TypeScript
UI: shadcn/ui + Radix UI + Tailwind CSS
Web3: wagmi v2 + viem (필요시)
상태관리: TanStack Query
검증: Zod
인증: (사용자 결정 필요)
데이터: (사용자 결정 필요)
```

### 데이터 모델 초안
```typescript
interface App {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  
  // 카테고리/태그
  category: AppCategory;
  tags: string[];
  
  // GitHub 연동
  githubUrl: string;
  stars?: number;
  forks?: number;
  lastUpdated?: string;
  
  // 메타데이터
  author: string;
  version?: string;
  logo?: string;
  screenshots?: string[];
  
  // 상태
  status: 'active' | 'deprecated' | 'beta';
  featured?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

type AppCategory = 
  | 'dapp'
  | 'smart-contract'
  | 'sdk'
  | 'cli-tool'
  | 'backend'
  | 'utility'
  | 'ai-generated';
```

---

## Open Questions
- 기존 Tokamak 서비스와의 연동 필요?
- 앱 "설치" 개념이 필요한가? (단순 조회 vs 실제 배포)
- 다국어 지원 필요? (한국어/영어)
- 모바일 대응 수준? (반응형 vs 모바일 앱)

---

## 타임라인 예상
- MVP: 2-3주
- 풀 기능: 4-6주

---

*마지막 업데이트: 인터뷰 진행 중*
