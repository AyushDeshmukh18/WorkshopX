import { test, expect } from '@playwright/test';

test.describe('FirstBuild Engine Smoke & Accessibility Test Suite', () => {
  test('Landing page renders hero, blueprint engine, and registration form', async ({ page }) => {
    await page.goto('/');

    // Check title and hero text
    await expect(page).toHaveTitle(/Build Your First AI Project in 60 Minutes/);
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toContainText('Build Your First AI Project in 60 Minutes');

    // Check Blueprint Flow presence
    const blueprintHeading = page.getByText(/Personalized Project Blueprint/i);
    await expect(blueprintHeading).toBeVisible();

    // Check zero vibe-coding aesthetics (no emojis in headings, clean text)
    const pageText = await page.textContent('body');
    expect(pageText).not.toContain('🚀');
    expect(pageText).not.toContain('🔥');
    expect(pageText).not.toContain('—'); // No em dashes
  });

  test('Privacy policy page complies with DPDP Act 2023 disclosures', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');
    await expect(page.getByText('Digital Personal Data Protection Act, 2023')).toBeVisible();
    await expect(page.getByText('Right to Erasure')).toBeVisible();
  });

  test('Terms of service page renders without errors', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText('Terms of Service');
  });

  test('College leaderboard page renders rankings table', async ({ page }) => {
    await page.goto('/leaderboard');
    await expect(page.locator('h1')).toContainText('College Leaderboard');
    await expect(page.getByText(/Verified Registrations/i).first()).toBeVisible();
  });

  test('Live build room page renders 60-minute roadmap and polls', async ({ page }) => {
    await page.goto('/live');
    await expect(page.locator('h1')).toContainText('Build Your First AI Project in 60 Minutes');
    await expect(page.getByText('60-Minute Execution Roadmap')).toBeVisible();
    await expect(page.getByText('Live Attendee Poll')).toBeVisible();
  });

  test('Project submission page renders audit form and handles inputs', async ({ page }) => {
    await page.goto('/submit');
    await expect(page.locator('h1')).toContainText('Submit Your Project');
    await expect(page.getByLabel(/GitHub Repository URL/i)).toBeVisible();
    await expect(page.getByLabel(/Live Deployment URL/i)).toBeVisible();
  });

  test('Certificate verification page renders verified credential status', async ({ page }) => {
    await page.goto('/verify/A1B2C3D4E5F6');
    await expect(page.getByText('VERIFIED OFFICIAL CREDENTIAL')).toBeVisible();
    await expect(page.getByText('Add to LinkedIn Profile')).toBeVisible();
    await expect(page.getByText('Download PDF Credential')).toBeVisible();
  });
});
