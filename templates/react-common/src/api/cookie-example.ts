/**
 * 세션 쿠키 인증 방식 API 클라이언트 예시
 *
 * 특징:
 * - 서버가 Set-Cookie로 세션 쿠키(httpOnly)를 설정, 브라우저가 자동 전송
 * - credentials: 'include' 필수 (cross-origin 쿠키 전송)
 * - accessToken 만료 시 refresh 엔드포인트 호출 (쿠키 기반이므로 body 불필요)
 * - 동시 다발적 401 발생 시 refresh 요청을 1번만 수행 (큐 패턴)
 *
 * 서버 요구사항:
 * - Access-Control-Allow-Origin: 구체적 origin (와일드카드 * 불가)
 * - Access-Control-Allow-Credentials: true
 * - Set-Cookie: httpOnly, Secure, SameSite=Lax (또는 None + Secure)
 *
 * 흐름:
 * 1. 로그인 시 서버가 쿠키에 세션/토큰 설정
 * 2. 이후 모든 요청에 credentials: 'include'로 쿠키 자동 전송
 * 3. 401 응답 시 /auth/refresh 호출 → 서버가 쿠키 갱신
 * 4. refresh도 실패하면 로그인 페이지로 이동
 */

import ky from 'ky';

// ─── 토큰 갱신 큐 (동시 401 방지) ──────────────────────────
//
// 쿠키 방식도 동시 401 문제는 동일하다.
// 여러 요청이 동시에 401을 받으면 /auth/refresh를 중복 호출하게 되는데,
// 서버에 따라 refresh 토큰이 1회용(rotation)일 수 있어 두 번째 호출이 실패할 수 있다.

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null): void {
  for (const { resolve, reject } of refreshQueue) {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  }
  refreshQueue = [];
}

async function refreshSession(): Promise<void> {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    // 쿠키 기반이므로 body 없이 요청, 서버가 쿠키를 갱신해줌
    await ky.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      credentials: 'include',
    });

    processQueue(null);
  } catch (error) {
    processQueue(error as Error);
    window.location.href = '/login';
    throw error;
  } finally {
    isRefreshing = false;
  }
}

// ─── API 클라이언트 ──────────────────────────────────────

export const api = ky.create({
  prefix: import.meta.env.VITE_API_URL,
  timeout: 10000,
  retry: 0,

  // 핵심: cross-origin 쿠키 전송을 위해 반드시 필요
  credentials: 'include',

  hooks: {
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== 401) return;

        // refresh 요청 자체가 실패한 경우 무한루프 방지
        if (request.url.includes('/auth/refresh')) {
          window.location.href = '/login';
          return;
        }

        try {
          await refreshSession();

          // 쿠키가 갱신되었으므로 원래 요청 재시도 (헤더 수정 불필요)
          return ky(request, { credentials: 'include' }) as unknown as Response;
        } catch {
          // refreshSession 내부에서 로그인 페이지 이동 처리됨
        }
      },
    ],
  },
});

// ─── 로그인/로그아웃 헬퍼 ────────────────────────────────

export async function login(email: string, password: string) {
  // 서버가 응답 시 Set-Cookie로 세션 쿠키 설정
  const response = await ky
    .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      json: { email, password },
      credentials: 'include',
    })
    .json<{ user: { id: number; name: string; email: string } }>();

  return response;
}

export async function logout() {
  // 서버가 쿠키를 삭제(만료)하도록 요청
  await ky.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    credentials: 'include',
  });

  window.location.href = '/login';
}

// ─── 사용 예시 ───────────────────────────────────────────
//
// import { api } from '@/api/cookie-example';
//
// // 일반 API 호출 (쿠키 자동 전송, 별도 헤더 설정 불필요)
// const users = await api.get('users').json<User[]>();
//
// // 동시 호출 (401 발생 시 refresh 1번만 실행됨)
// const [users, posts] = await Promise.all([
//   api.get('users').json<User[]>(),
//   api.get('posts').json<Post[]>(),
// ]);

// ─── 로컬 개발 시 CORS 해결 방법 ──────────────────────────
//
// 로컬에서 프론트(localhost:3000)와 백엔드(localhost:8080)가 포트가 다르면
// cross-origin이라 쿠키가 전송되지 않고 CORS 에러가 발생한다.
//
// 해결: vite.config.ts에서 proxy 설정으로 same-origin 처리
//
// ```ts
// // vite.config.ts
// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//       },
//     },
//   },
// });
// ```
//
// 원리:
//   브라우저 → localhost:3000/api/users (same-origin, 쿠키 정상 전송)
//   Vite    → localhost:8080/api/users (서버로 프록시)
//
// proxy 사용 시:
// - credentials: 'include' 없어도 쿠키가 전송됨 (same-origin이므로)
// - VITE_API_URL을 빈 문자열 또는 '/api'로 설정
// - 배포 환경에서는 nginx 리버스 프록시 또는 같은 도메인으로 처리
//
// proxy 미사용 시 (cross-origin 직접 요청):
// - credentials: 'include' 필수
// - 서버에 아래 CORS 헤더 필수:
//   Access-Control-Allow-Origin: http://localhost:3000 (와일드카드 * 불가)
//   Access-Control-Allow-Credentials: true
//   Set-Cookie: SameSite=None; Secure (cross-origin 쿠키 전송 시)

// ─── JWT 방식과의 차이점 정리 ─────────────────────────────
//
// | 항목              | JWT (jwt-example.ts)        | 쿠키 (cookie-example.ts)        |
// |-------------------|-----------------------------|---------------------------------|
// | 토큰 저장         | localStorage                | httpOnly 쿠키 (서버 관리)        |
// | 요청 시 전송       | Authorization 헤더 수동 설정  | credentials: 'include' 자동 전송 |
// | XSS 취약점        | localStorage 접근 가능       | httpOnly로 JS 접근 불가          |
// | CSRF 취약점        | 헤더 전송이라 안전           | SameSite + CSRF 토큰 필요 가능   |
// | refresh 시         | refreshToken body로 전송     | 쿠키 자동 전송, body 불필요      |
// | 서버 CORS 설정     | 기본                        | Allow-Credentials: true 필수    |
// | 재시도 시          | 새 토큰으로 헤더 교체         | 그대로 재요청 (쿠키 자동)        |
