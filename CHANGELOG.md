# @plea-fe/plea-fe-init

## 0.2.0

### Minor Changes

- 4bfdc1b: private react-common repository를 실행 시점에 fetch해서 프로젝트를 생성하도록 변경합니다.

  CLI 패키지에는 더 이상 템플릿 코드를 포함하지 않고, `--template-repo`, `--template-ref`, `PLEA_TEMPLATE_REPO`, `PLEA_TEMPLATE_REF`로 템플릿 원본을 바꿀 수 있게 했습니다.

### Patch Changes

- 524c3be: 프론트엔드 공통 React 프로젝트 초기 세팅 CLI를 배포합니다.

  한글 CLI 프롬프트, npm 배포 자동화, GitHub Release note 생성, Dependabot 기반 의존성 관리를 함께 설정했습니다.
