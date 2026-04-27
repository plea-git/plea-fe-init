# react-common

dev3-thor 프론트엔드 팀 공통 React 베이스 프로젝트입니다.
새 프로젝트 시작 시 이 레포를 템플릿으로 사용하세요.

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | React |
| Language | TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS |
| Server State | TanStack Query |
| Client State | Zustand |
| Routing | TanStack Router |
| HTTP Client | ky |
| Linter/Formatter | Biome |
| Unit Testing | Vitest + Testing Library |
| E2E Testing | Playwright |
| API Mocking | MSW |
| Component Docs | Storybook |
| Bundle Monitor | size-limit |
| Performance | Lighthouse CI |
| Release | Changesets |
| Error Tracking | Sentry (선택) |
| Package Manager | pnpm |

## 프로젝트 구조

```
src/
├── app/              # 앱 초기화, 프로바이더, 라우터, 글로벌 스타일
├── pages/            # 라우트별 페이지 (components, _types 등 코로케이션)
├── api/              # API 클라이언트 및 도메인별 API 모듈
├── shared/
│   ├── components/   # 공통 레이아웃, 컴포넌트
│   ├── ui/           # 기본 UI 컴포넌트 (shadcn/ui 등)
│   ├── hooks/        # 공통 커스텀 훅
│   ├── lib/          # 유틸리티, QueryClient 등
│   ├── stores/       # Zustand 스토어
│   ├── types/        # 공통 타입 정의
│   └── constants/    # 상수
├── assets/           # 이미지, 폰트 등 정적 리소스
├── mocks/            # MSW 목 서버 핸들러
└── test/             # 테스트 설정
```

## 시작하기

```bash
# Node.js 24 필요 (.nvmrc 참고)
nvm use

# 의존성 설치 (pnpm만 허용)
pnpm install

# 개발 서버 (http://localhost:3000)
pnpm dev
```

## Scripts

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (http://localhost:3000) |
| `pnpm build` | 타입체크 + 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과물 미리보기 |
| `pnpm lint` | Biome 린트 + 포맷 체크 |
| `pnpm lint:fix` | Biome 린트 + 포맷 자동 수정 |
| `pnpm typecheck` | TypeScript 타입 체크 |
| `pnpm test` | Vitest 테스트 실행 |
| `pnpm test:watch` | Vitest 워치 모드 |
| `pnpm test:coverage` | 커버리지 포함 테스트 |
| `pnpm knip` | 안 쓰는 의존성, export, 파일 탐지 |
| `pnpm deps:check` | 업데이트 가능한 패키지 확인 |
| `pnpm deps:update` | 패키지 버전 업데이트 (package.json 반영) |
| `pnpm audit` | 보안 취약점 체크 |
| `pnpm size` | 번들 사이즈 체크 (250KB 제한) |
| `pnpm size:check` | 번들 사이즈 상세 분석 |
| `pnpm e2e` | Playwright E2E 테스트 |
| `pnpm e2e:ui` | Playwright UI 모드 |
| `pnpm storybook` | Storybook 개발 서버 (http://localhost:6006) |
| `pnpm storybook:build` | Storybook 정적 빌드 |
| `pnpm changeset` | 변경사항 기록 (PR 작성 시) |
| `pnpm version-packages` | 버전 범프 + CHANGELOG 생성 |

## 환경 변수

`.env.example`을 복사하여 `.env.local`을 생성하세요.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|------|------|
| `VITE_API_URL` | API 서버 주소 |

## MSW (API Mocking)

개발 모드(`pnpm dev`)에서는 MSW가 자동으로 활성화됩니다.
`src/mocks/handlers.ts`에서 API 핸들러를 추가/수정하세요.

## Git Hooks (Husky)

| Hook | 시점 | 실행 내용 |
|------|------|-----------|
| `pre-push` | `git push` 전 | `pnpm typecheck && pnpm lint` |

푸시 전에 타입체크와 린트를 자동으로 검증합니다.

## CI

PR 생성 및 main/dev 푸시 시 GitHub Actions가 자동 실행됩니다.

| 단계 | 설명 |
|------|------|
| Lint & Format | Biome 린트 + 포맷 체크 |
| Type check | TypeScript 타입 체크 |
| Unused code check | knip으로 안 쓰는 코드/의존성 탐지 |
| Security audit | `pnpm audit`로 보안 취약점 체크 (경고만, 실패 안 함) |
| Test | Vitest 테스트 |
| Build | 프로덕션 빌드 |

PR에서는 추가로 **Lighthouse CI** (성능/접근성 측정)가 실행됩니다.

배포 워크플로우가 필요하면 org의 **Actions > New workflow > "By dev3-thor"** 에서 deploy 템플릿을 추가하세요.

## Storybook

공통 컴포넌트를 시각적으로 문서화합니다. `*.stories.tsx` 파일을 작성하면 자동으로 인식됩니다.

```bash
pnpm storybook
```

## Playwright (E2E)

```bash
# 브라우저 설치 (최초 1회)
npx playwright install chromium

# E2E 테스트 실행
pnpm e2e

# UI 모드 (디버깅)
pnpm e2e:ui
```

## Changesets (릴리즈)

PR 작성 시 `pnpm changeset`으로 변경사항을 기록하면, main 머지 시 자동으로 버전 범프 PR이 생성됩니다.

```bash
# 1. 변경사항 기록
pnpm changeset

# 2. PR 생성 → 리뷰 → main 머지
# 3. GitHub Action이 자동으로 버전 범프 PR 생성
```

## 인증 설정

`src/api/` 디렉토리에 인증 방식별 예시가 준비되어 있습니다.

| 파일 | 인증 방식 | 특징 |
|------|-----------|------|
| `client.ts` | 없음 (기본) | 프로젝트에 맞게 교체 |
| `jwt-example.ts` | JWT Bearer | localStorage 토큰, 자동 갱신, 동시 401 큐 |
| `cookie-example.ts` | 세션 쿠키 | httpOnly 쿠키, credentials: include, CORS 가이드 |

## Sentry (선택)

`src/app/providers/sentry-example.ts`에 설정 예시가 있습니다. 사용 시 `@sentry/react` 설치 후 활성화하세요.
