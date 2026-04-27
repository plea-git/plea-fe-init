import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: '홍길동', email: 'hong@example.com' },
      { id: 2, name: '김철수', email: 'kim@example.com' },
    ]);
  }),

  http.post('/api/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email === 'test@example.com') {
      return HttpResponse.json({ token: 'mock-jwt-token' });
    }
    return HttpResponse.json({ message: '인증 실패' }, { status: 401 });
  }),
];
