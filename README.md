# plea-fe-init

프론트엔드 팀 공통 React 프로젝트 초기 세팅 CLI입니다.

`react-common`을 기본 템플릿으로 사용하고, 프로젝트 생성 시 선택한 옵션에 따라 테스트, Storybook, 세션 관리 방식, 배포 CI 예시를 조합해서 새 프로젝트를 생성합니다.

## 사용법

```bash
pnpm dlx @plea-fe/plea-fe-init my-project
```

또는 npm 기준으로 실행할 수 있습니다.

```bash
npx @plea-fe/plea-fe-init my-project
```

명령어를 실행하면 아래 항목을 선택합니다.

- 테스트 환경: 사용 안 함 / 단위 테스트 / E2E 테스트 / 둘 다
- Storybook 사용 여부
- 세션 관리 방식: JWT 토큰 / 세션 쿠키
- 배포 CI 예시: 사용 안 함 / S3 + CloudFront / EC2

## 기본으로 강제되는 항목

- pnpm
- Vite + React + TypeScript
- TanStack Router
- TanStack Query
- Tailwind/shadcn 기반 UI 구조
- React Hook Form + Zod
- nice-react-modal
- `.env.local`, `.env.example`
- Husky
- commitlint 기반 commit convention
- Changeset

## 옵션을 명령어로 지정하기

프롬프트 없이 바로 생성하려면 `--yes`와 옵션을 함께 사용할 수 있습니다.

```bash
pnpm dlx @plea-fe/plea-fe-init my-project \
  --yes \
  --tests both \
  --auth jwt \
  --storybook true \
  --deploy none
```

사용 가능한 옵션입니다.

```bash
--tests <none|unit|e2e|both>
--auth <jwt|cookie>
--storybook <true|false>
--deploy <none|s3-cloudfront|ec2>
--no-install
--skip-git
```

## 배포

이 패키지는 npm public registry에 `@plea-fe/plea-fe-init` 이름으로 배포하는 것을 기준으로 합니다.

로컬에서 직접 배포할 때:

```bash
pnpm install
pnpm lint
pnpm build
pnpm publish --access public
```

GitHub Actions로 배포할 때:

1. npm에서 publish 권한이 있는 access token을 생성합니다.
2. GitHub repository secret에 `NPM_TOKEN` 이름으로 등록합니다.
3. GitHub Actions의 `Publish` workflow를 실행합니다.

## 개발

```bash
pnpm install
pnpm lint
pnpm build
```

로컬에서 CLI를 테스트할 때:

```bash
pnpm dev test-project --yes --no-install --skip-git
```
