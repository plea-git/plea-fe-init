/**
 * Sentry 에러 추적 설정 예시
 *
 * 사용법:
 * 1. pnpm add @sentry/react
 * 2. .env.local에 VITE_SENTRY_DSN 추가
 * 3. 이 파일을 sentry.ts로 복사
 * 4. main.tsx에서 import '@/app/providers/sentry' 추가 (App 렌더링 전에)
 *
 * free 티어: 월 5,000 에러 이벤트, 10,000 성능 트랜잭션, 50 세션 리플레이
 */

// import * as Sentry from '@sentry/react';
//
// Sentry.init({
//   dsn: import.meta.env.VITE_SENTRY_DSN,
//   environment: import.meta.env.MODE,
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // 성능 모니터링 샘플링 비율
//   tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
//   // 세션 리플레이 샘플링
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   // 개발 환경에서는 비활성화
//   enabled: import.meta.env.MODE !== 'development',
// });

// ─── main.tsx 적용 예시 ──────────────────────────────────
//
// import '@/app/providers/sentry'; // 최상단에서 import
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { App } from './App';
//
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// ─── ErrorBoundary 적용 예시 ─────────────────────────────
//
// import * as Sentry from '@sentry/react';
//
// // App.tsx 또는 RootLayout에서 감싸기
// export function App() {
//   return (
//     <Sentry.ErrorBoundary
//       fallback={<p>오류가 발생했습니다. 페이지를 새로고침 해주세요.</p>}
//     >
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </Sentry.ErrorBoundary>
//   );
// }

// ─── CI에서 Source Map 업로드 (deploy 워크플로우에 추가) ────
//
// - name: Upload Sentry source maps
//   run: |
//     npx @sentry/cli sourcemaps upload \
//       --auth-token ${{ secrets.SENTRY_AUTH_TOKEN }} \
//       --org your-org \
//       --project your-project \
//       --release ${{ github.sha }} \
//       ./dist

// ─── .env.example에 추가할 변수 ──────────────────────────
//
// VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
