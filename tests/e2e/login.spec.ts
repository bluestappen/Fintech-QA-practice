import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('TC-LOGIN-001: valid user can log in successfully', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('user-id-input').fill('user_standard');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('current-user')).toHaveText('user_standard');
    await expect(page.getByTestId('account-id')).toHaveText('ACC-001');
    await expect(page.getByTestId('account-status')).toHaveText('ACTIVE');
    await expect(page.getByTestId('account-balance')).toHaveText('100,000 KRW');

    await expect(page.getByTestId('receiver-account-input')).toBeVisible();
    await expect(page.getByTestId('transfer-amount-input')).toBeVisible();
    await expect(page.getByTestId('transfer-button')).toBeVisible();
  });

  test('TC-LOGIN-002: invalid password shows error message', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('user-id-input').fill('user_standard');
    await page.getByTestId('password-input').fill('wrong_password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('login-message')).toHaveText(
      'Invalid user ID or password.'
    );

    await expect(page.getByTestId('login-section')).toBeVisible();
  });

  test('TC-LOGIN-003: empty user ID and password show required message', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('login-message')).toHaveText(
      'User ID and password are required.'
    );
  });

  test('TC-LOGIN-004: suspended user can log in but account status is shown as suspended', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('user-id-input').fill('user_suspended');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('current-user')).toHaveText('user_suspended');
    await expect(page.getByTestId('account-id')).toHaveText('ACC-003');
    await expect(page.getByTestId('account-status')).toHaveText('SUSPENDED');
    await expect(page.getByTestId('account-balance')).toHaveText('100,000 KRW');
  });
});
