/**
 * 기본 API 클라이언트 (인증 없음)
 *
 * 프로젝트에 맞는 인증 방식을 선택하여 교체하세요:
 * - JWT 방식: jwt-example.ts 참고
 * - 세션 쿠키 방식: cookie-example.ts 참고
 */

import ky from 'ky';

export const api = ky.create({
  prefix: import.meta.env.VITE_API_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      },
    ],
  },
});
