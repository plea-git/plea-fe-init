# 라우터별 훅 예시

프로젝트에서 사용하는 라우터에 맞는 파일을 `shared/hooks/`로 복사하여 사용하세요.

## 파일 목록

### react-router (v7) 사용 시
- `use-custom-navigation.react-router.ts` — 페이지 이동, 뒤로가기, referrer, 새탭 열기
- `use-custom-search-params.react-router.ts` — 쿼리스트링 상태 관리 (필터, 페이지네이션, 정렬)

### @tanstack/react-router 사용 시
- 상위 디렉토리의 `use-search-params-state.ts` — 쿼리스트링 상태 관리
- 상위 디렉토리의 `use-list-page.ts` — 목록 페이지 통합 훅

## use-custom-search-params 주요 기능

```tsx
const {
  page,           // 현재 페이지
  limit,          // 페이지당 개수
  sort,           // 정렬 기준
  filter,         // URL에서 읽은 필터값
  params,         // { page, limit, sort, ...filter } 통합
  localFilter,    // 로컬 필터 상태 (적용 전)
  setLocalFilter, // 로컬 필터 변경
  applyFilter,    // 로컬 필터 → URL 적용 (page=1 초기화)
  resetFilter,    // 필터 초기화
  onPageChange,   // 페이지 변경
  onPageSizeChange, // 페이지 크기 변경
  onSortChange,   // 정렬 변경
  reset,          // 전체 초기화
} = useCustomSearchParams({
  initialFilter: { keyword: '', status: '' },
  defaultLimit: 20,
  defaultSort: 'LATEST',
});
```

## use-custom-navigation 주요 기능

```tsx
const {
  goToPrevious,      // 뒤로가기 (referrer 우선, 없으면 fallback)
  goToPath,          // 경로 이동 (previousUrl state 포함)
  goToPathReplace,   // replace 모드 이동
  goToPathWithQuery, // 쿼리스트링 포함 이동 (stateKeys로 state 분리)
  openInNewTab,      // 새 탭으로 열기
} = useCustomNavigation();

// 상세 → 목록 뒤로가기 (목록 URL 복원)
goToPrevious('/users');

// 쿼리스트링 + referrer 포함 이동
goToPathWithQuery('/users/1', { tab: 'info' }, { withReferrer: true });
```
