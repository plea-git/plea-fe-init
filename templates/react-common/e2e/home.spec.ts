import { expect, test } from '@playwright/test';

test.describe('홈페이지', () => {
  test('메인 페이지가 정상 로딩된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('헤더가 노출된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('React Common')).toBeVisible();
  });

  test('통계 카드가 3개 노출된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('총 사용자')).toBeVisible();
    await expect(page.getByText('오늘 방문')).toBeVisible();
    await expect(page.getByText('활성 프로젝트')).toBeVisible();
  });
});
