/**
 * JWT 인증 방식 API 클라이언트 예시
 *
 * 특징:
 * - accessToken을 localStorage에 저장, Authorization 헤더에 Bearer 토큰으로 전송
 * - refreshToken을 localStorage에 저장, accessToken 만료 시 자동 갱신
 * - 동시 다발적 401 발생 시 refreshToken 요청을 1번만 수행 (큐 패턴)
 *
 * 흐름:
 * 1. 모든 요청에 accessToken을 Authorization 헤더에 포함
 * 2. 401 응답 수신 시 refreshToken으로 새 accessToken 발급
 * 3. 갱신 중 들어온 다른 요청들은 큐에 대기 → 갱신 완료 후 재시도
 * 4. refreshToken도 만료되면 로그인 페이지로 이동
 */

import ky from 'ky';

// ─── 토큰 관리 ───────────────────────────────────────────

const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;

function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.ACCESS);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.REFRESH);
}

function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
}

// ─── 토큰 갱신 큐 (동시 401 방지) ──────────────────────────
//
// 여러 API가 동시에 401을 받으면 refreshToken 요청이 중복 발생한다.
// isRefreshing 플래그와 큐를 사용하여 첫 번째 요청만 갱신하고,
// 나머지는 갱신 완료를 기다린 후 새 토큰으로 재시도한다.

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null): void {
  for (const { resolve, reject } of refreshQueue) {
    if (error || token === null) {
      reject(error ?? new Error('토큰 갱신 실패'));
    } else {
      resolve(token);
    }
  }
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  // 이미 갱신 중이면 큐에 등록하고 대기
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    // refreshToken으로 새 토큰 발급 (이 요청은 인터셉터 없는 별도 인스턴스 사용)
    const response = await ky
      .post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        json: { refreshToken },
      })
      .json<{ accessToken: string; refreshToken: string }>();

    setTokens(response.accessToken, response.refreshToken);
    processQueue(null, response.accessToken);

    return response.accessToken;
  } catch (error) {
    processQueue(error as Error, null);
    clearTokens();
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
  retry: 0, // ky 자체 retry 비활성화 (직접 제어)
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getAccessToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== 401) return;

        // 이미 refresh 요청 자체가 실패한 경우 무한루프 방지
        if (request.url.includes('/auth/refresh')) {
          clearTokens();
          window.location.href = '/login';
          return;
        }

        try {
          const newToken = await refreshAccessToken();

          // 새 토큰으로 원래 요청 재시도
          const headers = new Headers(request.headers);
          headers.set('Authorization', `Bearer ${newToken}`);
          return ky(new Request(request, { headers })) as unknown as Response;
        } catch {
          // refreshAccessToken 내부에서 로그인 페이지 이동 처리됨
        }
      },
    ],
  },
});

// ─── 로그인/로그아웃 헬퍼 ────────────────────────────────

export async function login(email: string, password: string) {
  const response = await ky
    .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      json: { email, password },
    })
    .json<{ accessToken: string; refreshToken: string }>();

  setTokens(response.accessToken, response.refreshToken);
  return response;
}

export function logout(): void {
  clearTokens();
  window.location.href = '/login';
}

// ─── 사용 예시 ───────────────────────────────────────────
//
// import { api } from '@/api/jwt-example';
//
// // 일반 API 호출
// const users = await api.get('users').json<User[]>();
//
// // 동시 호출 (401 발생 시 refresh 1번만 실행됨)
// const [users, posts] = await Promise.all([
//   api.get('users').json<User[]>(),
//   api.get('posts').json<Post[]>(),
// ]);
