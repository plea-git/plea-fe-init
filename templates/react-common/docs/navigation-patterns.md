# 페이지 이동 패턴 가이드

## 1. 단계별 플로우 (회원가입, 주문, 신청서 등)

### 문제

회원가입처럼 Step 1 → Step 2 → Step 3 → 완료 플로우에서
일반 이동(`push`)을 하면 뒤로가기 시 이전 단계가 전부 보입니다.

```
히스토리: [메인] → [Step1] → [Step2] → [Step3] → [완료]
뒤로가기: [완료] → [Step3] → [Step2] → [Step1] → [메인]  ← 문제!
```

### 해결: replace 이동

`goToPathReplace`로 이동하면 히스토리를 쌓지 않고 교체합니다.

```tsx
import useCustomNavigation from '@/shared/hooks/examples/use-custom-navigation.react-router';

function SignupStep1() {
  const { goToPathReplace } = useCustomNavigation();

  const handleNext = () => {
    // Step1 → Step2: 히스토리 교체 (Step1이 히스토리에서 사라짐)
    goToPathReplace('/signup/step2');
  };
}

function SignupStep2() {
  const { goToPathReplace } = useCustomNavigation();

  const handleNext = () => {
    goToPathReplace('/signup/step3');
  };
}

function SignupComplete() {
  const { goToPathReplace } = useCustomNavigation();

  const handleGoHome = () => {
    // 완료 → 메인: replace로 이동하면 뒤로가기해도 완료 페이지 안 보임
    goToPathReplace('/');
  };
}
```

```
히스토리: [메인] → [완료(replace됨)]
뒤로가기: [완료] → [메인]  ← 깔끔!
```

### 패턴별 비교

| 패턴 | 방법 | 뒤로가기 시 | 사용 시점 |
|------|------|------------|-----------|
| 모든 단계 replace | 매 단계 `goToPathReplace` | 메인으로 직행 | 회원가입, 결제 |
| 마지막만 replace | 중간은 `goToPath`, 완료 시 `goToPathReplace` | 이전 단계는 보임, 완료 후 안 보임 | 설문조사, 다단계 입력 |
| 전부 push (기본) | `goToPath` | 모든 단계 다 보임 | 일반 페이지 이동 |

---

## 2. 목록 → 상세 → 뒤로가기 (검색 상태 복원)

### 문제

목록에서 검색/필터 후 상세 페이지로 이동했다가 뒤로가기하면
검색 조건이 초기화되는 문제.

### 해결: 쿼리스트링 + referrer

```tsx
function UserList() {
  const { goToPathWithQuery } = useCustomNavigation();

  const handleDetail = (userId: string) => {
    // 현재 URL(검색 조건 포함)을 referrer로 저장하고 이동
    goToPathWithQuery(`/users/${userId}`, {}, { withReferrer: true });
  };
}

function UserDetail() {
  const { goToPrevious } = useCustomNavigation();

  return (
    <button onClick={() => goToPrevious('/users')}>
      {/* referrer가 있으면 해당 URL로 (검색 조건 복원) */}
      {/* referrer가 없으면 /users로 이동 */}
      목록으로
    </button>
  );
}
```

```
1. 목록(/users?keyword=홍길동&page=2)에서 상세 클릭
2. 상세(/users/123)로 이동 (referrer에 이전 URL 저장)
3. "목록으로" 클릭 → /users?keyword=홍길동&page=2 복원!
```

---

## 3. 새 탭으로 열기

외부 링크나 상세 페이지를 새 탭에서 열 때:

```tsx
const { openInNewTab } = useCustomNavigation();

// 쿼리스트링 포함 새 탭
openInNewTab('/reports/detail', { id: '123', tab: 'summary' });
// → 새 탭에서 /reports/detail?id=123&tab=summary 열림
```

---

## 4. 작성 중 이탈 방지

폼 작성 중 뒤로가기/메뉴 이동 시 컨펌 얼럿:

```tsx
import { useBlockNavigation } from '@/shared/hooks/use-block-navigation';

function CreateForm() {
  const form = useForm({ ... });

  // isDirty가 true일 때 페이지 이탈 시 컨펌
  useBlockNavigation({
    when: form.formState.isDirty,
    message: '작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?',
  });
}
```

---

## 5. 조합 패턴: 단계별 폼 + 이탈 방지 + replace

```tsx
function MultiStepForm() {
  const { goToPathReplace } = useCustomNavigation();
  const form = useForm({ ... });

  // 작성 중 이탈 방지
  useBlockNavigation({
    when: form.formState.isDirty,
    message: '작성 중인 내용이 있습니다.',
  });

  const handleNext = async () => {
    const isValid = await form.trigger(); // 현재 단계 유효성 체크
    if (!isValid) return;

    // 유효하면 다음 단계로 (replace로 히스토리 교체)
    goToPathReplace('/form/step2');
  };

  const handleSave = async () => {
    await form.handleSubmit(onSubmit)();
    // 저장 성공 후 완료 페이지로 (replace)
    goToPathReplace('/form/complete');
  };
}
```
