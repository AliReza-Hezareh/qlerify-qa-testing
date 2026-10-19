import { expect, test } from '@playwright/test';

test('QW-001: qlerify.com/login visar appens inloggning', async ({ page }) => {
  test.fail(
    true,
    'Känd bugg QW-001: adressen visade Page Not Found 2026-10-19. Ta bort markeringen när felet är rättat.',
  );

  await page.goto('/login');

  await expect(
    page.getByRole('heading', { name: 'Login to your account' }),
  ).toBeVisible();
});
