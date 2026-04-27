---
"@plea-fe/plea-fe-init": minor
---

private react-common repository를 실행 시점에 fetch해서 프로젝트를 생성하도록 변경합니다.

CLI 패키지에는 더 이상 템플릿 코드를 포함하지 않고, `--template-repo`, `--template-ref`, `PLEA_TEMPLATE_REPO`, `PLEA_TEMPLATE_REF`로 템플릿 원본을 바꿀 수 있게 했습니다.
