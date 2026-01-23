import { test, expect } from '@playwright/test';

test('loads login screen when logged out', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Login');
});
