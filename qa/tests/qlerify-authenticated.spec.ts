import { expect, test } from '@playwright/test';

test.describe('Qlerify app – skrivskyddat arbetsflöde', () => {
  test.skip(
    !process.env.QA_STORAGE_STATE,
    'Ange QA_STORAGE_STATE med en lokal session som testaren själv har skapat.',
  );

  test('dashboard → arbetsflöde → Read Models → uppdatera sidan', async ({ page }) => {
    await page.goto('/dashboard/');

    const firstWorkflow = page.locator('a[href*="/workflow/"]').first();
    await expect(firstWorkflow).toBeVisible();
    await firstWorkflow.click();

    await expect(page.getByText('View only mode', { exact: true })).toBeVisible();

    const readModelsTab = page.getByRole('tab', { name: 'Read Models' });
    await readModelsTab.click();
    await expect(page).toHaveURL(/selectedTab=2/);
    await expect(page.getByText('Get Cart', { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('tab', { name: 'Read Models' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByText('Get Cart', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Single Item' }).first()).toBeDisabled();
  });
});
