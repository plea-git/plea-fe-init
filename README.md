# plea-fe-init

프론트엔드 팀 공통 React 프로젝트 초기 세팅 CLI입니다.

private `react-common` 레포지토리를 기본 템플릿으로 사용하고, 프로젝트 생성 시 선택한 옵션에 따라 테스트, Storybook, 세션 관리 방식, 배포 CI 예시를 조합해서 새 프로젝트를 생성합니다.

CLI 패키지는 public npm registry에 배포하지만, 실제 템플릿 코드는 npm 패키지에 포함하지 않습니다. 명령어 실행 시 사용자의 GitHub 권한으로 private `react-common` repository를 가져옵니다.

## 사전 준비

기본 템플릿 repository는 아래 경로입니다.

```txt
git@github.com:dev3-thor/react-common.git
```

사용하려면 아래 조건이 필요합니다.

- `dev3-thor/react-common` repository 접근 권한
- GitHub에 등록된 SSH key
- 로컬에서 `git clone git@github.com:dev3-thor/react-common.git`이 가능한 상태

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
--template-repo <repo>
--template-ref <ref>
--no-install
--skip-git
```

템플릿 원본을 바꿔서 테스트할 수도 있습니다.

```bash
pnpm dlx @plea-fe/plea-fe-init my-project \
  --template-repo git@github.com:dev3-thor/react-common.git \
  --template-ref main
```

로컬의 `react-common` 작업본을 사용해 테스트할 때:

```bash
pnpm dev test-project --yes --no-install --skip-git \
  --template-repo /Users/hama/Desktop/workspace/react-common
```

환경변수도 지원합니다.

```bash
PLEA_TEMPLATE_REPO=git@github.com:dev3-thor/react-common.git \
PLEA_TEMPLATE_REF=main \
pnpm dlx @plea-fe/plea-fe-init my-project
```

## 배포

이 패키지는 npm public registry에 `@plea-fe/plea-fe-init` 이름으로 배포하는 것을 기준으로 합니다.

배포는 Changesets와 GitHub Actions로 관리합니다.

일반적인 배포 흐름:

1. 코드를 수정합니다.
2. 변경사항에 대한 changeset을 추가합니다.

```bash
pnpm changeset
```

3. 변경사항과 changeset 파일을 커밋하고 `main`에 push합니다.
4. GitHub Actions가 `chore: release` PR을 생성합니다.
5. release PR을 merge하면 npm publish와 GitHub Release note 생성이 자동으로 진행됩니다.

GitHub Actions 배포를 위해 repository secret에 `NPM_TOKEN`이 필요합니다.

```txt
Name: NPM_TOKEN
Value: npm에서 발급한 read/write token
```

최초 설정 후에는 로컬에서 직접 publish하지 않는 것을 권장합니다.

긴급하게 로컬에서 직접 배포해야 할 때:

```bash
pnpm install
pnpm lint
pnpm build
pnpm changeset
pnpm version-packages
pnpm release
```

## 의존성 / 취약점 관리

이 저장소는 아래 방식으로 의존성과 취약점을 관리합니다.

- Dependabot이 매주 월요일 오전 9시에 npm 패키지와 GitHub Actions 업데이트 PR을 생성합니다.
- CI에서 `pnpm audit --audit-level=high`를 실행합니다.
- GitHub repository의 Dependabot alerts/security updates도 켜두는 것을 권장합니다.

## 개발

```bash
pnpm install
pnpm lint
pnpm build
pnpm audit
```

로컬에서 CLI를 테스트할 때:

```bash
pnpm dev test-project --yes --no-install --skip-git \
  --template-repo /Users/hama/Desktop/workspace/react-common
```
