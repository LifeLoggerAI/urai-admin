
import { test, expect } from '@playwright/test';


test('non-admin redirected to login', async ({ page }) => {
  await page.goto('https://admin.urai.app');
  await expect(page).toHaveURL(/login/);
});


test('admin can see dashboard after login', async ({ page }) => {
  // Use a test admin account or stub auth in preview channel
  await page.goto('https://admin.urai.app');
  // TODO: implement login helper
  await expect(page.getByText('URAI Admin')).toBeVisible();
});
